// ==========================================
// 1. PAGE LOAD (Remember Me & Cursor Init)
// ==========================================
window.onload = () => {
    // සේව් කරපු විස්තර තියෙනවාද බලනවා
    const savedEmail = localStorage.getItem('userEmail');
    const savedPass = localStorage.getItem('userPass');
    const rememberCheckbox = document.getElementById('remember');

    if (savedEmail && savedPass) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('password').value = savedPass;
        if (rememberCheckbox) rememberCheckbox.checked = true;

        // --- DATABASE SYNC ADDED ---
        syncUserPurchases(savedEmail);
    }
};

// Custom Cursor Logic
const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');
window.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px'; 
    dot.style.top = e.clientY + 'px';
    outline.animate({
        left: e.clientX + 'px',
        top: e.clientY + 'px'
    }, { duration: 500, fill: "forwards" });
});

// ==========================================
// 2. AUTH & LOGIN SYSTEM
// ==========================================
function toggleAuthMode() {
    const title = document.querySelector('.auth-header h2');
    const nameField = document.getElementById('name-field');
    const isLogin = title.innerText.includes('LOGIN');
    title.innerHTML = isLogin ? "SYSTEM_<span>SIGNUP</span>" : "SYSTEM_<span>LOGIN</span>";
    nameField.style.display = isLogin ? "block" : "none";
}

document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Remember Me Logic
    if (remember) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPass', pass);
    } else {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPass');
    }

    // --- DISCORD LOGIN NOTIFICATION ---
    const loginWebhook = "https://discord.com/api/webhooks/1497461764353429604/VbzTTXDDZWEKa-lS9FE4HN4IdaGYl9S0R8zXi7JMFGH1tTd5_Y0soAGHoKoh2efqFNwr";
    const loginNotify = {
        content: "👤 **USER SESSION STARTED**",
        embeds: [{
            title: "Login Activity Detected",
            color: 65280, // Green
            fields: [
                { name: "User Email", value: email, inline: true },
                { name: "Device Info", value: navigator.userAgent.split(')')[0] + ')', inline: false },
                { name: "Login Time", value: new Date().toLocaleString(), inline: true }
            ],
            footer: { text: "24/7 Store Security System" }
        }]
    };

    fetch(loginWebhook, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginNotify)
    });

    // --- SHOW MODERN LOADER ---
    const loader = document.getElementById('loader');
    const authScreen = document.getElementById('auth-screen');
    const mainContent = document.getElementById('main-content');

    authScreen.style.display = 'none';
    loader.style.display = 'flex';
    loader.style.opacity = '1';

    setTimeout(() => {
        loader.style.transition = 'opacity 0.8s ease';
        loader.style.opacity = '0';

        setTimeout(() => {
            loader.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.style.animation = 'fadeInUp 1s ease forwards';

            // --- DATABASE SYNC ADDED ---
            syncUserPurchases(email);
        }, 800);
    }, 3000);
});

// ==========================================
// 3. PAYMENT SYSTEM
// ==========================================
let activeProductId = 'product_01'; // ID එක ට්‍රැක් කිරීමට එකතු කළා

function openPayment(productId) { 
    activeProductId = productId || 'product_01';
    document.getElementById('payment-modal').style.display = 'flex'; 
    showStep1(); 
}

function closePayment() { 
    document.getElementById('payment-modal').style.display = 'none'; 
}

function showStep1() { 
    document.getElementById('payment-step-1').style.display = 'block'; 
    document.getElementById('payment-step-2').style.display = 'none'; 
}

function showStep2() { 
    const s1 = document.getElementById('payment-step-1');
    const s2 = document.getElementById('payment-step-2');
    if (s1 && s2) {
        s1.style.display = 'none';
        s2.style.display = 'block';
    }
}

// Copy Bank Details
function copyAllDetails() {
    const bankDetails = "BANK: SAMPATH BANK\nNAME: 24/7 ADMIN\nACC NO: 1234 5678 9012";
    navigator.clipboard.writeText(bankDetails).then(() => {
        const toast = document.getElementById('copy-toast');
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }
    });
}

// Slip Preview
document.getElementById('slip-upload').addEventListener('change', function() {
    if(this.files[0]) {
        document.getElementById('upload-text').innerText = "READY TO SUBMIT";
        document.getElementById('file-preview').innerText = this.files[0].name;
    }
});

// Confirm Payment (Discord Upload)
async function confirmPayment() {
    const fileInput = document.getElementById('slip-upload');
    const email = document.getElementById('email').value;
    const webhookURL = "https://discord.com/api/webhooks/1497314357816721480/WmxsGrXsYy_W9hwajgZSyubEMGia3_JlYgM5nJn9rXRjj8aIaFJhXBFsK-W2xwMh5nEv"; 

    if (!fileInput.files[0]) {
        alert("PLEASE UPLOAD YOUR PAYMENT SLIP!");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();

    const message = {
        content: "🔔 **NEW PAYMENT RECEIVED!**",
        embeds: [{
            title: "Payment Details",
            color: 5814783, // Neon Blue
            fields: [
                { name: "User Email", value: email || "Not Provided", inline: true },
                { name: "Product ID", value: activeProductId, inline: true },
                { name: "Status", value: "Pending Verification", inline: true }
            ],
            timestamp: new Date()
        }]
    };

    formData.append("payload_json", JSON.stringify(message));
    formData.append("file", file);

    try {
        const btn = document.querySelector('#payment-step-2 .auth-btn');
        btn.innerText = "SENDING...";
        btn.disabled = true;

        const response = await fetch(webhookURL, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            // --- DATABASE SAVE ADDED ---
            const userKey = email.replace(/\./g, '_');
            firebase.database().ref('payments/' + userKey + '/' + activeProductId).set({
                status: 'pending',
                downloadUrl: '#' 
            });

            alert("TRANSACTION SUBMITTED SUCCESSFULLY!");
            closePayment();
        } else {
            throw new Error("Failed to send");
        }
    } catch (error) {
        alert("ERROR SUBMITTING PAYMENT. PLEASE TRY AGAIN.");
    } finally {
        const btn = document.querySelector('#payment-step-2 .auth-btn');
        btn.disabled = false;
        btn.innerText = "SUBMIT PAYMENT";
    }
}

// Global Click for Buy Buttons
document.addEventListener('click', (e) => {
    if(e.target.classList.contains('buy-trigger')) {
        const pId = e.target.getAttribute('data-id') || 'product_01';
        openPayment(pId);
    }
});const firebaseConfig = {
    apiKey: "AIzaSyB7_hT6pShv0EkyTeCASGEIqvZh1M_u5pA",
    databaseURL: "https://payment-cc677-default-rtdb.firebaseio.com/",
    projectId: "payment-cc677",
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// ==========================================
// 1. PAGE LOAD (Remember Me)
// ==========================================
window.onload = () => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedPass = localStorage.getItem('userPass');
    const rememberCheckbox = document.getElementById('remember');

    if (savedEmail && savedPass) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('password').value = savedPass;
        if (rememberCheckbox) rememberCheckbox.checked = true;
        
        // පේජ් එක ලෝඩ් වෙද්දීම කලින් ගෙවීම් චෙක් කරනවා
        syncUserPurchases(savedEmail);
    }
};

// --- NEW DATABASE SYNC FUNCTION ---
function syncUserPurchases(email) {
    if (!email) return;
    const userKey = email.replace(/\./g, '_');
    firebase.database().ref('payments/' + userKey).on('value', (snapshot) => {
        const purchases = snapshot.val();
        if (!purchases) return;
        for (let productId in purchases) {
            const data = purchases[productId];
            const buyBtn = document.querySelector(`.buy-trigger[data-id="${productId}"]`);
            if (buyBtn && data.status === 'approved') {
                buyBtn.innerText = "DOWNLOAD NOW";
                buyBtn.style.background = "#00ff88"; 
                buyBtn.style.boxShadow = "0 0 20px #00ff88";
                buyBtn.onclick = (e) => {
                    e.preventDefault();
                    window.open(data.downloadUrl, '_blank');
                };
            }
        }
    });
}function syncUserPurchases(email) {
    if (!email) return;
    const userKey = email.replace(/\./g, '_');
    
    database.ref('payments/' + userKey).on('value', (snapshot) => {
        const purchases = snapshot.val();
        if (!purchases) return;

        for (let productId in purchases) {
            const data = purchases[productId];
            const buyBtn = document.querySelector(`.buy-trigger[data-id="${productId}"]`);

            if (buyBtn && data.status === 'approved') {
                // 1. පරණ ඉවෙන්ට් ඔක්කොම අයින් කරන්න (Clone කරලා පරණ පවර් එක නැති කරනවා)
                const newBtn = buyBtn.cloneNode(true);
                buyBtn.parentNode.replaceChild(newBtn, buyBtn);

                // 2. අලුත් පෙනුම සහ ලින්ක් එක දෙනවා
                newBtn.innerText = "DOWNLOAD NOW";
                newBtn.classList.add('approved-btn'); // CSS වලින් පාට කරන්න පුළුවන්
                newBtn.style.background = "#00ff88"; 
                newBtn.style.boxShadow = "0 0 20px #00ff88";
                newBtn.style.color = "#000";

                // 3. වැදගත්ම දේ: පේජ් එක රිෆ්‍රෙෂ් නොවී ලින්ක් එකට යවන එක
                newBtn.addEventListener('click', (e) => {
                    e.preventDefault(); // Login එකට යන එක නතර කරනවා
                    e.stopPropagation(); 
                    if (data.downloadUrl && data.downloadUrl !== '#') {
                        window.open(data.downloadUrl, '_blank');
                    } else {
                        alert("LINK IS BEING PREPARED. PLEASE WAIT!");
                    }
                });
            }
        }
    });
}