// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

    // IP alma
    let ip = '';
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip;
    } catch(e) {
        console.error("IP alınamadı:", e);
        sonucText.innerText = "IP alınamadı, internet bağlantınızı kontrol edin.";
        card.classList.remove("hidden");
        btn.disabled = false;
        btn.innerText = "Kime Çıktı?";
        return;
    }

    const ref = collection(db, "kullanicilar");
    const snapshot = await getDocs(ref);

    if (snapshot.empty) {
        sonucText.innerText = "Tüm isimler çekildi!";
        card.classList.remove("hidden");
        btn.disabled = false;
        btn.innerText = "Kime Çıktı?";
        return;
    }

    // IP kontrolü ve çekilecek kişiler
    const data = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(d => !d.cekildi || d.cekildi !== ip);

    if(data.length === 0){
        sonucText.innerText = "Bu IP ile daha önce çekiliş yaptınız!";
        card.classList.remove("hidden");
        btn.disabled = false;
        btn.innerText = "Kime Çıktı?";
        return;
    }

    // Rastgele seçim
    const random = data[Math.floor(Math.random() * data.length)];
    sonucText.innerText = `${random.isim}`;

    // Firestore'a IP kaydet
    const docRef = doc(db, "kullanicilar", random.id);
    await updateDoc(docRef, { cekildi: ip });

    // TXT dosyası hazırlama (hash)
    const hash = btoa(random.isim);
    const blob = new Blob([hash], { type: "text/plain" });
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${random.isim}_hash.txt`;
    downloadLink.click();

    card.classList.remove("hidden");
    btn.disabled = false;
    btn.innerText = "Kime Çıktı?";
};