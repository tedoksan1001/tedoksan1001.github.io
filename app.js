// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyABTomIDlkfHmW_YrL0a5vpbnxNxeed3jg",
    authDomain: "gida-dedektifi.firebaseapp.com",
    projectId: "gida-dedektifi",
    storageBucket: "gida-dedektifi.appspot.com",
    messagingSenderId: "1234567890", // Placeholder
    appId: "1:1234567890:web:abcdef123456" // Placeholder
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// UI Sections Management
function showSection(sectionId) {
    document.querySelectorAll('.app-section').forEach(section => {
        section.classList.add('d-none');
    });
    document.getElementById(`${sectionId}-section`).classList.remove('d-none');

    // Update Nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active', 'text-success');
        link.classList.add('text-secondary');
    });
    const activeLink = document.querySelector(`button[onclick="showSection('${sectionId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active', 'text-success');
        activeLink.classList.remove('text-secondary');
    }
}

let html5QrCode;

// Scanner Logic
function startScanner() {
    html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start({ facingMode: "environment" }, config, (decodedText) => {
        document.getElementById('product-barcode').value = decodedText;
        html5QrCode.stop();
        alert("Barkod okundu: " + decodedText);
    }).catch(err => console.error("Scanner error:", err));
}

// Stop scanner when modal closes
document.getElementById('scanModal').addEventListener('hidden.bs.modal', () => {
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop();
    }
});

document.getElementById('scanModal').addEventListener('shown.bs.modal', () => {
    startScanner();
});

// Product Logic
async function saveProduct() {
    const name = document.getElementById('product-name').value;
    const barcode = document.getElementById('product-barcode').value;
    const expiry = document.getElementById('product-expiry').value;

    if (!name || !expiry) {
        alert("Lütfen isim ve tarih alanlarını doldurun.");
        return;
    }

    try {
        await db.collection("products").add({
            name,
            barcode,
            expiry,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        bootstrap.Modal.getInstance(document.getElementById('scanModal')).hide();
        document.getElementById('product-form').reset();
        loadProducts();
    } catch (error) {
        console.error("Error adding product:", error);
        alert("Hata oluştu: " + error.message);
    }
}

async function loadProducts() {
    const productList = document.getElementById('product-list');
    const productCount = document.getElementById('product-count');

    try {
        const snapshot = await db.collection("products").orderBy("expiry", "asc").get();
        productList.innerHTML = '';
        productCount.innerText = `${snapshot.size} Ürün`;

        if (snapshot.empty) {
            productList.innerHTML = `
                <div class="col-12 text-center py-5 text-secondary">
                    <i class="fas fa-box-open fa-3x mb-3 opacity-25"></i>
                    <p>Henüz ürün eklemediniz.</p>
                </div>`;
            return;
        }

        snapshot.forEach(doc => {
            const product = doc.data();
            const daysLeft = calculateDaysLeft(product.expiry);
            let statusClass = 'bg-success';
            let statusText = `${daysLeft} gün kaldı`;

            if (daysLeft <= 0) {
                statusClass = 'bg-danger';
                statusText = 'Süresi Doldu';
            } else if (daysLeft <= 2) {
                statusClass = 'bg-danger';
                statusText = 'Son 2 Gün!';
            } else if (daysLeft <= 7) {
                statusClass = 'bg-warning text-dark';
                statusText = 'Az Kaldı';
            }

            productList.innerHTML += `
                <div class="col-12 col-md-6">
                    <div class="card product-card">
                        <div class="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-1 fw-bold">${product.name}</h6>
                                <p class="small text-secondary mb-0">SKT: ${product.expiry}</p>
                            </div>
                            <span class="badge status-badge ${statusClass}">${statusText}</span>
                        </div>
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

function calculateDaysLeft(expiryDate) {
    const diffTime = new Date(expiryDate) - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Recipes Logic
let selectedIngredients = [];

function toggleIngredient(element, ingredient) {
    if (selectedIngredients.includes(ingredient)) {
        selectedIngredients = selectedIngredients.filter(i => i !== ingredient);
        element.classList.remove('selected');
    } else {
        selectedIngredients.push(ingredient);
        element.classList.add('selected');
    }
    searchRecipesByIngredients();
}

async function searchRecipesByIngredients() {
    const recipeList = document.getElementById('recipe-list');
    if (selectedIngredients.length === 0) {
        recipeList.innerHTML = '<div class="col-12 text-center py-4 text-secondary"><p>Malzeme seçerek başlayın.</p></div>';
        return;
    }

    try {
        // Simple search: Find recipes that contain at least one of the selected ingredients
        // In a real app, we might use array-contains-any or client side filtering
        const snapshot = await db.collection("recipes").get();
        recipeList.innerHTML = '';

        const filteredRecipes = [];
        snapshot.forEach(doc => {
            const recipe = doc.data();
            const ingredients = recipe.ingredients.toLowerCase();
            const matches = selectedIngredients.some(i => ingredients.includes(i.toLowerCase()));
            if (matches) filteredRecipes.push({ id: doc.id, ...recipe });
        });

        if (filteredRecipes.length === 0) {
            recipeList.innerHTML = '<div class="col-12 text-center py-4 text-secondary"><p>Uygun tarif bulunamadı.</p></div>';
            return;
        }

        filteredRecipes.forEach(recipe => {
            recipeList.innerHTML += `
                <div class="col-12 col-md-6">
                    <div class="card h-100">
                        <div class="card-body">
                            <h6 class="fw-bold mb-2">${recipe.title}</h6>
                            <p class="small text-secondary mb-3">${recipe.ingredients}</p>
                            <button class="btn btn-outline-success btn-sm w-100 rounded-pill" onclick="alert('${recipe.title}: ${recipe.steps}')">Tarifi Gör</button>
                        </div>
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error("Error searching recipes:", error);
    }
}

// eTwinning Logic
async function saveRecipe() {
    const title = document.getElementById('recipe-title').value;
    const country = document.getElementById('recipe-country').value;
    const ingredients = document.getElementById('recipe-ingredients').value;
    const steps = document.getElementById('recipe-steps').value;

    if (!title || !ingredients || !steps) {
        alert("Lütfen tüm alanları doldurun.");
        return;
    }

    try {
        await db.collection("recipes").add({
            title,
            country,
            ingredients,
            steps,
            type: 'etwinning',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        bootstrap.Modal.getInstance(document.getElementById('addRecipeModal')).hide();
        document.getElementById('recipe-form').reset();
        loadETwinningRecipes();
        alert("Tarifiniz paylaşıldı!");
    } catch (error) {
        console.error("Error adding recipe:", error);
        alert("Hata oluştu: " + error.message);
    }
}

async function loadETwinningRecipes() {
    const etwinningList = document.getElementById('etwinning-list');

    try {
        const snapshot = await db.collection("recipes").where("type", "==", "etwinning").orderBy("createdAt", "desc").get();
        etwinningList.innerHTML = '';

        if (snapshot.empty) {
            etwinningList.innerHTML = '<div class="col-12 text-center py-4 text-secondary"><p>Henüz tarif paylaşılmamış.</p></div>';
            return;
        }

        const flags = {
            "Türkiye": "🇹🇷",
            "İtalya": "🇮🇹",
            "Fransa": "🇫🇷",
            "İspanya": "🇪🇸",
            "Almanya": "🇩🇪"
        };

        snapshot.forEach(doc => {
            const recipe = doc.data();
            const flag = flags[recipe.country] || "🌐";

            etwinningList.innerHTML += `
                <div class="col-12 col-md-6">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="fw-bold mb-0">${recipe.title}</h6>
                                <span class="fs-4">${flag}</span>
                            </div>
                            <p class="small text-secondary mb-3">${recipe.ingredients.substring(0, 50)}...</p>
                            <button class="btn btn-outline-success btn-sm w-100 rounded-pill" onclick="alert('${recipe.title} (${recipe.country})\\n\\nMalzemeler: ${recipe.ingredients}\\n\\nHazırlanışı: ${recipe.steps}')">Detayları Gör</button>
                        </div>
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error("Error loading etwinning recipes:", error);
    }
}

// Notifications Logic
async function requestNotificationPermission() {
    if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("Bildirim izni alındı.");
        }
    }
}

async function checkExpiryNotifications() {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    try {
        const snapshot = await db.collection("products").get();
        snapshot.forEach(doc => {
            const product = doc.data();
            const daysLeft = calculateDaysLeft(product.expiry);
            if (daysLeft === 2) {
                new Notification("Gıda Dedektifi", {
                    body: `${product.name} ürününün son kullanma tarihine 2 gün kaldı!`,
                    icon: "https://cdn-icons-png.flaticon.com/512/3081/3081918.png"
                });
            }
        });
    } catch (error) {
        console.error("Error checking notifications:", error);
    }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker Kaydedildi', reg))
      .catch(err => console.log('Service Worker Hatası', err));
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    console.log("Gıda Dedektifi Başlatıldı...");
    loadProducts();
    loadETwinningRecipes();
    requestNotificationPermission();
    setTimeout(checkExpiryNotifications, 2000); // Check after load
});
