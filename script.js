// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXZ8Tu6o-thj0QnhSwlPCEfXYlIMPP1rY",
    authDomain: "yilbasicekilis-cfd51.firebaseapp.com",
    projectId: "yilbasicekilis-cfd51",
    storageBucket: "yilbasicekilis-cfd51.firebasestorage.app",
    messagingSenderId: "747733053754",
    appId: "1:747733053754:web:c28d081f0dd90b1da5a003",
    measurementId: "G-LSP9NH9GGL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// HTML elemanları
const btn = document.getElementById("cekButton");
const card = document.getElementById("sonucCard");
const sonucText = document.getElementById("sonucText");
const downloadLink = document.getElementById("downloadLink");

btn.onclick = async () => {
    btn.disabled = true;
    btn.innerText = "Bekle...";

    const ref = collection(db, "kullanicilar");
    const snapshot = await getDocs(ref);

    if (snapshot.empty) {
        sonucText.innerText = "Tüm isimler çekildi!";
        card.classList.remove("hidden");
        return;
    }

    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    const random = data[Math.floor(Math.random() * data.length)];

    sonucText.innerText = `${random.isim}`;

    // TXT dosyası hazırlama
    const blob = new Blob([`Sana çıkan kişi: ${random.isim}`], { type: "text/plain" });
    downloadLink.href = URL.createObjectURL(blob);

    card.classList.remove("hidden");

    // Firestore'dan sil
    await deleteDoc(doc(db, "kullanicilar", random.id));

    btn.innerText = "Kime Çıktı?";
    btn.disabled = false;
};