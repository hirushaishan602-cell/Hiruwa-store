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
});// --- Auto Fading Image Slider Logic ---
function startFadingSlider() {
    const slides = document.querySelectorAll('.fading-slider .slide');
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // පින්තූර 4ක් නැත්නම් වැඩ කරන්න එපා
    if (totalSlides < 2) return;
    
    // මුල්ම පින්තූරය පෙන්වන්න
    slides[currentSlide].classList.add('active');
    
    // සෑම තත්පර 5කට වරක් පින්තූරය මාරු කරන Interval එක
    setInterval(() => {
        // දැනට තියෙන පින්තූරය හංගන්න
        slides[currentSlide].classList.remove('active');
        
        // ඊළඟ පින්තූරය තෝරාගන්න
        currentSlide = (currentSlide + 1) % totalSlides;
        
        // අලුත් පින්තූරය පෙන්වන්න
        slides[currentSlide].classList.add('active');
    }, 5000); // 5000ms = තත්පර 5
}

// පිටුව load වුණාම Slider එක පටන් ගන්න
document.addEventListener('DOMContentLoaded', startFadingSlider);// දැනට පේන පින්තූරය ලොකුවට පෙන්වීම
function openLightbox() {
    const activeSlide = document.querySelector('.fading-slider .slide.active');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (activeSlide) {
        lightboxImg.src = activeSlide.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // පසුබිම scroll වීම වැළැක්වීමට
    }
}

// ලොකු වූ පින්තූරය වසා දැමීම
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // නැවත scroll කිරීමට ඉඩ දීම
}

// ESC key එක එබූ විට වැසීමට
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeLightbox();
});function startFadingSlider() {
    const slides = document.querySelectorAll('.fading-slider .slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    if (totalSlides < 2) return;

    setInterval(() => {
        // Dan tiyana image saha dot eka remove karanna
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        // Ilaga eka thoraganna
        currentSlide = (currentSlide + 1) % totalSlides;
        
        // Aluth image saha dot eka active karanna
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }, 5000); // Thathpara 5n 5ta mharu we
}

// Lightbox saha Slider eka start karanna
document.addEventListener('DOMContentLoaded', () => {
    startFadingSlider();
});

function openLightbox() {
    const activeSlide = document.querySelector('.fading-slider .slide.active');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (activeSlide) {
        lightboxImg.src = activeSlide.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}/* --- SLIDER LOGIC START --- */
let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.fading-slider .slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

function startFadingSlider() {
    stopFadingSlider();
    // 1 -> 2 -> 3 -> 4 -> 1 පිළිවෙළට ඉදිරියටම යන ලොජික් එක
    slideInterval = setInterval(() => {
        let nextIndex = (currentSlide + 1) % totalSlides;
        changeSlide(nextIndex);
    }, 5000);
}

function stopFadingSlider() {
    clearInterval(slideInterval);
}

function changeSlide(index) {
    if (!slides[currentSlide] || !dots[currentSlide]) return;
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
    stopFadingSlider();
    changeSlide(index);
    startFadingSlider();
}

// පිටුව load වුණාම Slider එක පණගන්වන කොටස
document.addEventListener('DOMContentLoaded', () => {
    if(slides.length > 0) {
        slides[0].classList.add('active');
        dots[0].classList.add('active');
        startFadingSlider();
    }
});
/* --- SLIDER LOGIC END --- */

/* --- LIGHTBOX LOGIC --- */
function openLightbox() {
    const activeSlide = document.querySelector('.fading-slider .slide.active');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (activeSlide && lightbox && lightboxImg) {
        lightboxImg.src = activeSlide.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}