// ===== LANGUAGE MANAGER WITH ACTIVE LANGUAGE HIGHLIGHTING =====
const LanguageManager = {
    currentLang: localStorage.getItem('glorifytc_lang') || 'en',
    
    init() {
        this.loadLanguage(this.currentLang);
        this.setupLanguageSelector();
        this.updateCurrentLangDisplay();
        this.highlightActiveLanguage();
    },
    
    loadLanguage(lang) {
        const t = translations[lang];
        if (!t) return;
        
        // Update navigation
        document.querySelectorAll('[data-nav]').forEach(el => {
            const key = el.dataset.nav;
            if (t.nav && t.nav[key]) {
                el.textContent = t.nav[key];
            }
        });
        
        // Update footer
        document.querySelectorAll('[data-footer]').forEach(el => {
            const key = el.dataset.footer;
            if (t.footer && t.footer[key]) {
                if (el.tagName === 'H3') {
                    el.textContent = t.footer[key];
                } else {
                    el.textContent = t.footer[key];
                }
            }
        });
        
        // Update chat
        document.querySelectorAll('[data-chat]').forEach(el => {
            const key = el.dataset.chat;
            if (t.chat && t.chat[key]) {
                if (el.tagName === 'INPUT') {
                    el.placeholder = t.chat[key];
                } else {
                    el.textContent = t.chat[key];
                }
            }
        });
        
        // Update home page
        document.querySelectorAll('[data-home]').forEach(el => {
            const key = el.dataset.home;
            if (t.home && t.home[key]) {
                el.textContent = t.home[key];
            }
        });
        
        // Update services page (if exists)
        document.querySelectorAll('[data-services]').forEach(el => {
            const key = el.dataset.services;
            if (t.services && t.services[key]) {
                el.textContent = t.services[key];
            }
        });
        
        // Update about page (if exists)
        document.querySelectorAll('[data-about]').forEach(el => {
            const key = el.dataset.about;
            if (t.about && t.about[key]) {
                el.textContent = t.about[key];
            }
        });
        
        // Update team page (if exists)
        document.querySelectorAll('[data-team]').forEach(el => {
            const key = el.dataset.team;
            if (t.team && t.team[key]) {
                el.textContent = t.team[key];
            }
        });
        
        // Update blog page (if exists)
        document.querySelectorAll('[data-blog]').forEach(el => {
            const key = el.dataset.blog;
            if (t.blog && t.blog[key]) {
                if (el.tagName === 'INPUT') {
                    el.placeholder = t.blog[key];
                } else {
                    el.textContent = t.blog[key];
                }
            }
        });
        
        // Update contact page (if exists)
        document.querySelectorAll('[data-contact]').forEach(el => {
            const key = el.dataset.contact;
            if (t.contact && t.contact[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t.contact[key];
                } else if (el.tagName === 'LABEL') {
                    el.textContent = t.contact[key];
                } else {
                    el.textContent = t.contact[key];
                }
            }
        });
    },
    
    setupLanguageSelector() {
        const btn = document.getElementById('languageBtn');
        const dropdown = document.getElementById('languageDropdown');
        
        if (!btn || !dropdown) return;
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
        
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.dataset.lang;
                if (lang === this.currentLang) {
                    dropdown.classList.remove('show');
                    return;
                }
                
                this.currentLang = lang;
                localStorage.setItem('glorifytc_lang', lang);
                
                this.loadLanguage(lang);
                this.updateCurrentLangDisplay();
                this.highlightActiveLanguage();
                dropdown.classList.remove('show');
            });
        });
    },
    
    updateCurrentLangDisplay() {
        const span = document.getElementById('currentLang');
        if (span) {
            span.textContent = this.currentLang.toUpperCase();
        }
    },
    
    highlightActiveLanguage() {
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.remove('active-lang');
            if (option.dataset.lang === this.currentLang) {
                option.classList.add('active-lang');
            }
        });
    }
};

// ===== YOUR EXISTING FUNCTIONS (KEEP ALL OF THESE) =====

// Create particles for robot background
function createRobotParticles() {
    const container = document.getElementById('robotParticles');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(particle);
    }
}

// Chat functionality
function initChat() {
    const chatModal = document.getElementById('chatModal');
    const chatButton = document.getElementById('chatButton');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatModal) return;
    
    // Toggle chat modal
    function toggleChat() {
        chatModal.classList.toggle('open');
        if (chatModal.classList.contains('open')) {
            chatInput.focus();
        }
    }
    
    // Open chat when clicking on robot
    const robotContainer = document.querySelector('.robot-container');
    if (robotContainer) {
        robotContainer.addEventListener('click', toggleChat);
    }
    
    chatButton.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    
    // Close chat when clicking outside
    chatModal.addEventListener('click', function(e) {
        if (e.target === chatModal) {
            toggleChat();
        }
    });
    
    // Handle sending messages
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Disable send button while processing
        sendButton.disabled = true;
        
        // Simulate AI response after delay
        setTimeout(() => {
            const responses = [
                "Thanks for reaching out! I'd be happy to help you learn about our AI solutions. What specific area are you interested in?",
                "We specialize in building custom AI models and data solutions that solve real business problems. How can I assist you today?",
                "Our team has extensive experience in AI development, data analysis, and creating modern digital products. What would you like to know?",
                "We'd love to discuss how AI can transform your business. Could you tell me more about your specific needs or challenges?",
                "I'm here to answer any questions about our services. What would you like to know about GlorifyTC's AI solutions?"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'assistant');
            sendButton.disabled = false;
            chatInput.focus();
        }, 1000);
    }
    
    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Event listeners
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    sendButton.addEventListener('click', sendMessage);
    
    // Enable send button when input has text
    chatInput.addEventListener('input', () => {
        sendButton.disabled = !chatInput.value.trim();
    });
}

// Navbar scroll effect
function initNavbar() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== TRANSLATIONS OBJECT (ADD THIS BEFORE LanguageManager) =====
const translations = {
    en: {
        nav: {
            home: "Home",
            services: "Services",
            about: "About",
            team: "Team",
            blog: "Blog",
            contact: "Contact",
            getStarted: "Get Started"
        },
        footer: {
            tagline: "Advanced AI, Data Science & Modern Digital Development. Building intelligent solutions that matter.",
            quickLinks: "Quick Links",
            services: "Services",
            contact: "Contact",
            rights: "All rights reserved.",
            privacy: "Privacy Policy",
            terms: "Terms of Service"
        },
        chat: {
            title: "GlorifyTC Assistant",
            subtitle: "AI-Powered Support",
            placeholder: "Ask anything...",
            welcome: "Hello! I'm GlorifyTC's AI assistant. I can help you learn about our services, answer questions about AI and data science, or assist with any inquiries. How can I help you today?"
        },
        home: {
            tag: "Advanced AI Solutions",
            title: "Glorifying",
            titleSpan: "Technology",
            description: "We build intelligent, modern digital products — from AI-powered systems to responsive websites and mobile applications.",
            explore: "Explore Services",
            servicesTitle: "What We",
            servicesSpan: "Build",
            servicesDesc: "Intelligent solutions that solve real problems and deliver measurable value.",
            aiModel: "AI Model Development",
            aiModelDesc: "Custom AI models for prediction, classification, and automation.",
            dataAnalysis: "Data Analysis",
            dataAnalysisDesc: "Advanced analytics and insightful visualizations.",
            webApps: "Web Applications",
            webAppsDesc: "Fast, modern, responsive websites and SaaS platforms.",
            viewAll: "View All Services",
            projects: "Projects Delivered",
            satisfaction: "Client Satisfaction",
            models: "AI Models Deployed",
            support: "Support Available",
            ctaTitle: "Ready to Build Something",
            ctaSpan: "Extraordinary",
            ctaDesc: "Let's discuss how AI and data science can transform your business.",
            ctaButton: "Start a Conversation"
        }
    },
    sv: {
        nav: {
            home: "Hem",
            services: "Tjänster",
            about: "Om oss",
            team: "Team",
            blog: "Blogg",
            contact: "Kontakt",
            getStarted: "Kom igång"
        },
        footer: {
            tagline: "Avancerad AI, Data Science & Modern Digital Utveckling. Bygger intelligenta lösningar som gör skillnad.",
            quickLinks: "Snabblänkar",
            services: "Tjänster",
            contact: "Kontakt",
            rights: "Alla rättigheter förbehållna.",
            privacy: "Integritetspolicy",
            terms: "Användarvillkor"
        },
        chat: {
            title: "GlorifyTC Assistent",
            subtitle: "AI-driven support",
            placeholder: "Fråga vad som helst...",
            welcome: "Hej! Jag är GlorifyTCs AI-assistent. Jag kan hjälpa dig med information om våra tjänster, svara på frågor om AI och datavetenskap, eller hjälpa till med andra frågor. Hur kan jag hjälpa dig idag?"
        },
        home: {
            tag: "Avancerade AI-lösningar",
            title: "Förhärligande",
            titleSpan: "Teknologi",
            description: "Vi bygger intelligenta, moderna digitala produkter — från AI-drivna system till responsiva webbplatser och mobilapplikationer.",
            explore: "Utforska tjänster",
            servicesTitle: "Vad vi",
            servicesSpan: "bygger",
            servicesDesc: "Intelligenta lösningar som löser verkliga problem och levererar mätbart värde.",
            aiModel: "AI-modellutveckling",
            aiModelDesc: "Anpassade AI-modeller för prediktion, klassificering och automatisering.",
            dataAnalysis: "Dataanalys",
            dataAnalysisDesc: "Avancerad analys och insiktsfulla visualiseringar.",
            webApps: "Webbapplikationer",
            webAppsDesc: "Snabba, moderna, responsiva webbplatser och SaaS-plattformar.",
            viewAll: "Visa alla tjänster",
            projects: "Levererade projekt",
            satisfaction: "Kundnöjdhet",
            models: "AI-modeller driftsatta",
            support: "Support tillgänglig",
            ctaTitle: "Redo att bygga något",
            ctaSpan: "extraordinärt",
            ctaDesc: "Låt oss diskutera hur AI och datavetenskap kan transformera ditt företag.",
            ctaButton: "Starta en konversation"
        }
    }
};

// Add more languages here (no, fi, da, de) following the same pattern

// ===== INITIALIZE EVERYTHING WHEN PAGE LOADS =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing all systems...');
    
    // Initialize all your existing functionality
    createRobotParticles();
    initChat();
    initNavbar();
    
    // Initialize the language manager (NEW)
    LanguageManager.init();
    
    // Add a small delay to simulate loading
    setTimeout(() => {
        const heroText = document.querySelector('.hero-text');
        if (heroText) {
            heroText.style.opacity = 1;
            heroText.style.transform = 'translateY(0)';
        }
    }, 300);
});