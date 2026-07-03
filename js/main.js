/**
 * DIZIN Restaurant - JavaScript
 * Mobile First - All Devices
 */

const LANG_KEY = 'dizin-language';
let currentLanguage = localStorage.getItem(LANG_KEY) || 'sv';

const translations = {
    sv: {
        navHome: 'HEM', navMenu: 'MENY', navGallery: 'BILDER',
        navAbout: 'OM OSS', navContact: 'KONTAKT', bookTable: 'BOKA BORD',
        heroTitle: 'Persisk<br>Industrifusion',
        heroSubtitle: 'Rå industriell estetik möter persisk husmanskost. En smakupplevelse utöver det vanliga i Stockholm.',
        heroHours: 'Öppet till 00:00',
        discoverTitle: 'Upptäck DIZIN',
        ourMenu: 'Vår Meny', menuDesc: 'Grytor, grill & smårätter från Persien',
        theBar: 'Baren', barDesc: 'Cocktails, vin & persisk Doogh',
        events: 'Event', eventsDesc: 'Boka för fest, middag eller mingel',
        interior: 'Interiör', interiorDesc: 'Industriell elegans',
        bar: 'Matsalen', barDesc2: 'Varm atmosfär',
        diningRoom: 'Mat & Dryck', diningDesc: 'Persisk husmanskost',
        footerDesc: 'Industriell Persisk Fusion',
        links: 'LÄNKAR', contactTitle: 'KONTAKT',
        home: 'Hem', menu: 'Meny', gallery: 'Bilder', contact: 'Kontakt',
        copyright: '© 2025 DIZIN INDUSTRIAL PERSIAN FUSION',
        popularTitle: 'Populärt · Mest beställt',
        koobidehDesc: '2 stycken grillade köttfärsspett, serveras med grillad tomat och yoghurt med mynta, gurka och vitlök.',
        joojeDesc: 'Grillat kycklingspett, serveras med grillad tomat och yoghurt med mynta, gurka och vitlök.',
        popular: 'POPULÄRT', discount: '20% RABATT', reviews: 'OMDÖMEN',
        menuHeading: 'Vår Meny',
        menuSubtitle: 'Persisk husmanskost • Grillrätter • Sallader • Pasta • Tillbehör',
        categoryPopular: 'Populärt', categoryGrill: 'Grillrätter',
        categoryStews: 'Husmanskost', categoryOther: 'Övrigt',
        categorySalads: 'Sallader', categoryPasta: 'Pasta',
        categorySides: 'Tillbehör', categorySauces: 'Såser', categoryDrinks: 'Drycker',
        persianGrills: 'Persiska Grillrätter', persianStews: 'Persisk Husmanskost',
        deliveryInfo: 'Fri leverans över 200 kr • 7% serviceavgift (min 7 kr) • 20% rabatt',
        allergyInfo: 'Frågor om innehåll? Kontakta oss på 08-37 00 19',
        aboutTitle: 'Om DIZIN', aboutSubtitle: 'Persisk fusion i industriell miljö sedan 2019.',
        ourStory: 'Vår Story',
        storyText: 'DIZIN föddes ur kärleken till persisk matlagning och Stockholms industriella arv.',
        openingHours: 'Öppettider',
        mondayThursday: 'Måndag–Torsdag', fridaySaturday: 'Fredag–Lördag', sunday: 'Söndag',
        contactHeading: 'Kontakta Oss',
        contactSubtitle: 'Boka bord, frågor eller feedback – vi hörs!',
        phone: 'Telefon', email: 'E-post', address: 'Adress',
        bookHeading: 'Boka Bord',
        namePlaceholder: 'Namn', emailPlaceholder: 'E-post',
        phonePlaceholder: 'Telefon', messagePlaceholder: 'Meddelande', send: 'SKICKA',
        galleryTitle: 'Bilder från Restaurangen',
        gallerySubtitle: 'En titt in i vår värld av industriell elegans och persisk matkultur.',
        from: 'från'
    },
    en: {
        navHome: 'HOME', navMenu: 'MENU', navGallery: 'GALLERY',
        navAbout: 'ABOUT', navContact: 'CONTACT', bookTable: 'BOOK TABLE',
        heroTitle: 'Persian<br>Industrial Fusion',
        heroSubtitle: 'Raw industrial aesthetics meet Persian home cooking. A culinary experience beyond the ordinary in Stockholm.',
        heroHours: 'Open until 12 AM',
        discoverTitle: 'Discover DIZIN',
        ourMenu: 'Our Menu', menuDesc: 'Stews, grills & starters from Persia',
        theBar: 'The Bar', barDesc: 'Cocktails, wine & Persian Doogh',
        events: 'Events', eventsDesc: 'Book for parties, dinners or mingles',
        interior: 'Interior', interiorDesc: 'Industrial elegance',
        bar: 'Dining Room', barDesc2: 'Warm atmosphere',
        diningRoom: 'Food & Drinks', diningDesc: 'Persian home cooking',
        footerDesc: 'Industrial Persian Fusion',
        links: 'LINKS', contactTitle: 'CONTACT',
        home: 'Home', menu: 'Menu', gallery: 'Gallery', contact: 'Contact',
        copyright: '© 2025 DIZIN INDUSTRIAL PERSIAN FUSION',
        popularTitle: 'Popular · Most Ordered',
        koobidehDesc: '2 grilled minced meat skewers, served with grilled tomato and yogurt with mint, cucumber and garlic.',
        joojeDesc: 'Grilled chicken skewer, served with grilled tomato and yogurt with mint, cucumber and garlic.',
        popular: 'POPULAR', discount: '20% OFF', reviews: 'REVIEWS',
        menuHeading: 'Our Menu',
        menuSubtitle: 'Persian home cooking • Grills • Salads • Pasta • Sides',
        categoryPopular: 'Popular', categoryGrill: 'Grills',
        categoryStews: 'Stews', categoryOther: 'Other',
        categorySalads: 'Salads', categoryPasta: 'Pasta',
        categorySides: 'Sides', categorySauces: 'Sauces', categoryDrinks: 'Drinks',
        persianGrills: 'Persian Grills', persianStews: 'Persian Home Cooking',
        deliveryInfo: 'Free delivery over 200 SEK • 7% service fee (min 7 SEK) • 20% off',
        allergyInfo: 'Questions about ingredients? Contact us at 08-37 00 19',
        aboutTitle: 'About DIZIN', aboutSubtitle: 'Persian fusion in industrial setting since 2019.',
        ourStory: 'Our Story',
        storyText: 'DIZIN was born from the love of Persian cooking and Stockholm\'s industrial heritage.',
        openingHours: 'Opening Hours',
        mondayThursday: 'Monday–Thursday', fridaySaturday: 'Friday–Saturday', sunday: 'Sunday',
        contactHeading: 'Contact Us',
        contactSubtitle: 'Book a table, questions or feedback – get in touch!',
        phone: 'Phone', email: 'Email', address: 'Address',
        bookHeading: 'Book a Table',
        namePlaceholder: 'Name', emailPlaceholder: 'Email',
        phonePlaceholder: 'Phone', messagePlaceholder: 'Message', send: 'SEND',
        galleryTitle: 'Restaurant Gallery',
        gallerySubtitle: 'A glimpse into our world of industrial elegance and Persian food culture.',
        from: 'from'
    }
};

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem(LANG_KEY, lang);
    
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });
    
    document.querySelectorAll('.lang-current').forEach(el => {
        el.textContent = lang === 'sv' ? 'SV' : 'EN';
    });
    
    document.querySelectorAll('.lang-sv').forEach(el => {
        el.style.display = lang === 'sv' ? '' : 'none';
    });
    document.querySelectorAll('.lang-en').forEach(el => {
        el.style.display = lang === 'en' ? '' : 'none';
    });
}

function toggleLanguage() {
    setLanguage(currentLanguage === 'sv' ? 'en' : 'sv');
}

// Mobile Menu
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    if (!toggleBtn || !mobileMenu) return;
    
    function openMenu() {
        mobileMenu.classList.add('open');
        toggleBtn.querySelector('.material-symbols-outlined').textContent = 'close';
        body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        mobileMenu.classList.remove('open');
        toggleBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
        body.style.overflow = '';
    }
    
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mobileMenu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('open') && 
            !mobileMenu.contains(e.target) && 
            !toggleBtn.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });
    
    // Close on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });
}

// Active nav link
function setActiveNavLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-menu a[data-lang]').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');
        if (href === path || (!path && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Scroll spy
function initScrollSpy() {
    const btns = document.querySelectorAll('.category-btn');
    if (!btns.length) return;
    
    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('section[id]').forEach(section => {
            if (window.scrollY >= section.offsetTop - 250) {
                current = section.getAttribute('id');
            }
        });
        btns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('href') === '#' + current) btn.classList.add('active');
        });
    });
    
    btns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 120,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact form
function initForm() {
    const form = document.querySelector('.booking-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        const orig = btn.textContent;
        btn.textContent = 'SKICKAR...';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'SKICKAT! ✓';
            btn.style.background = '#004d40';
            setTimeout(() => {
                btn.textContent = orig;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 2000);
        }, 1500);
    });
}

// Logo fallback
function initLogo() {
    const img = document.querySelector('.navbar-logo img');
    if (img) {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const fb = document.querySelector('.logo-fallback');
            if (fb) fb.style.display = 'block';
        });
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLanguage);
    initMobileMenu();
    setActiveNavLink();
    initScrollSpy();
    initForm();
    initLogo();
    window.toggleLanguage = toggleLanguage;
    
    // Hash links
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
            }
        }, 300);
    }
});