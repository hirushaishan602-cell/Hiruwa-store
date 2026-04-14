// 1. AOS Animations පණ ගැන්වීම
AOS.init({ duration: 1000, once: true });

// 2. Mouse Glow Effect & Title Tilt Effect
const glow = document.getElementById('bg-glow');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('mousemove', (e) => {
    // Background Glow
    const xPct = (e.clientX / window.innerWidth) * 100;
    const yPct = (e.clientY / window.innerHeight) * 100;
    glow.style.background = `radial-gradient(circle at ${xPct}% ${yPct}%, rgba(0, 210, 255, 0.25) 0%, transparent 70%)`;

    // Hero Tilt
    let xTilt = (window.innerWidth / 2 - e.clientX) / 60;
    let yTilt = (window.innerHeight / 2 - e.clientY) / 60;
    if(heroContent) {
        heroContent.style.transform = `rotateY(${xTilt}deg) rotateX(${yTilt}deg)`;
    }
});

// 3. Discord ID සහ Product දත්ත (මෙහි ඔබගේ User ID එක ඇතුළත් කරන්න)
const discordDirectMessage = "https://discord.com/users/1438383567859093624"; 

const products = [
    { 
        name: "DS Optimizer v7.5", 
        price: "Passkey: Rs. 500.00", 
        img: "app-image.png", // මෙයට ඔබගේ image එක ලබා දෙන්න
        downloadUrl: "Files/DS Optimizer v7.5.rar",
        note: "Download the app for free. A paid passkey is required to activate premium features."
    }
];

// 4. කාඩ් එක Display කිරීම
const grid = document.getElementById('productGrid');
products.forEach((p, index) => {
    grid.innerHTML += `
        <div class="card" data-aos="fade-up">
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="price">${p.price}</p>
            <p style="font-size: 0.85rem; color: #aaa; margin-bottom: 20px; font-style: italic;">${p.note}</p>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <a href="${p.downloadUrl}" download class="download-btn" style="background: rgba(255,255,255,0.05); border: 1px solid var(--primary); flex: 1;">
                    Download App
                </a>
                <a href="${discordDirectMessage}" target="_blank" class="download-btn" style="background: linear-gradient(45deg, var(--primary), var(--secondary)); flex: 1;">
                    Buy Passkey
                </a>
            </div>
        </div>
    `;
});