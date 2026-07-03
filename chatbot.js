// GlorifyTC Smart Chatbot — shared across all pages
(function () {
  'use strict';

  // ---- Knowledge base (bilingual) ----
  var KB = [
    { test: function(m){ return /^(hej|tjena|hallo|halla|hello|hi|hey|yo|god (morgon|kvall|dag))\b/.test(m); },
      sv: "Hej! Vad roligt att du hör av dig. Jag kan berätta om våra tjänster, våra projekt (som TaskBridge), priser eller hur du når oss. Vad är du nyfiken på?",
      en: "Hi there! Happy to help. I can tell you about our services, our projects (like TaskBridge), pricing, or how to reach us. What are you curious about?" },
    { test: function(m){ return /\b(tack|tackar|thank|thanks|cheers)\b/.test(m); },
      sv: "Varsågod! Är det något mer jag kan hjälpa dig med?",
      en: "You're welcome! Anything else I can help you with?" },
    { test: function(m){ return /\b(hej da|hejda|vi hors|ha det|bye|goodbye|see you)\b/.test(m); },
      sv: "Tack för att du hörde av dig – ha en fin dag! Du når oss alltid på info@glorifytc.se.",
      en: "Thanks for stopping by — have a great day! You can always reach us at info@glorifytc.se." },
    { test: function(m){ return /(taskbridge|task bridge|projekt|project|vad bygger|what do you build)/.test(m); },
      sv: "Vårt första lanserade projekt är TaskBridge – en smart plattform för personal- och schemahantering för skolor, vårdhem och organisationer. Fler projekt är på väg! Se alla under \"Våra Projekt\", eller besök taskbridge.se.",
      en: "Our first launched project is TaskBridge — a smart staff & shift management platform for schools, care homes and organizations. More projects are on the way! See them all under \"Our Projects\", or visit taskbridge.se." },
    { test: function(m){ return /(pris|kostnad|kostar|kosta|offert|betala|price|cost|pricing|how much|quote|budget)/.test(m); },
      sv: "Priset beror på projektets omfattning – vi jobbar oftast med en fast offert per projekt. Berätta kort vad du vill bygga så återkommer vi med ett förslag. Maila info@glorifytc.se eller använd kontaktsidan.",
      en: "Pricing depends on the scope of the project — we usually work with a fixed quote per project. Tell us briefly what you'd like to build and we'll come back with a proposal. Email info@glorifytc.se or use the contact page." },
    { test: function(m){ return /(adress|address|var ligger|var finns|location|located|where are|how do i find|kontor|office|besoka|visit you)/.test(m); },
      sv: "Vi finns på Flygfältsvägen 13, 177 45 Järfälla. Hör gärna av dig innan besök på info@glorifytc.se.",
      en: "We're located at Flygfältsvägen 13, 177 45 Järfälla. Drop us a line at info@glorifytc.se before visiting." },
    { test: function(m){ return /(telefon|nummer|ring|phone|call you|call us|mail|mejl|mejla|e-post|epost|email|kontakt|contact|hor av|get in touch|reach you|na er)/.test(m); },
      sv: "Du når oss enklast på info@glorifytc.se eller via formuläret på kontaktsidan.",
      en: "The easiest way to reach us is info@glorifytc.se or via the form on the contact page." },
    { test: function(m){ return /(jobb|jobba|karriar|anstall|rekryter|praktik|job|career|hiring|vacancy|work with you|internship)/.test(m); },
      sv: "Kul att du är intresserad! Vi växer gärna – skicka en intresseanmälan till info@glorifytc.se så hör vi av oss.",
      en: "Great that you're interested! We're growing — send an intro to info@glorifytc.se and we'll be in touch." },
    { test: function(m){ return /(boka|mote|traffas|komma igang|kom igang|book|meeting|get started|schedule|demo|konsultation)/.test(m); },
      sv: "Gärna! Boka enklast genom att maila info@glorifytc.se eller fylla i formuläret på kontaktsidan, så hittar vi en tid.",
      en: "Love to! The easiest way is to email info@glorifytc.se or fill in the form on the contact page and we'll find a time." },
    { test: function(m){ return /\b(ai|a\.i|artificiell|machine learning|maskininlarning|ml|automation|automatisering)\b/.test(m); },
      sv: "Vi utvecklar skräddarsydda AI-lösningar – allt från modeller och automation till AI-integrationer i befintliga system. Vad har du för use case?",
      en: "We build custom AI solutions — from models and automation to AI integrations in your existing systems. What's your use case?" },
    { test: function(m){ return /\b(data|dataanalys|analys|analytics|data science|visualiser|dashboard|insikter|insights)\b/.test(m); },
      sv: "Vi hjälper er samla in, analysera och visualisera data så ni kan fatta bättre beslut. Vill du veta mer om hur vi jobbar med data?",
      en: "We help you collect, analyze and visualize data so you can make better decisions. Want to know more about how we work with data?" },
    { test: function(m){ return /\b(webb|web|hemsida|website|webbplats|app|appar|mobil|mobile|ios|android|frontend|backend)\b/.test(m); },
      sv: "Vi bygger moderna, responsiva webbplatser och appar – både webb och mobil. Vill du bygga något specifikt? Maila info@glorifytc.se.",
      en: "We build modern, responsive websites and apps — both web and mobile. Got something specific in mind? Email info@glorifytc.se." },
    { test: function(m){ return /(vem ar ni|vilka ar ni|om er|om oss|team|vem ligger bakom|who are you|about you|about us|your team|vem ar du)/.test(m); },
      sv: "GlorifyTC är ett svenskt teknikföretag som bygger AI- och datadrivna produkter och erbjuder teknisk konsulting. Läs mer under \"Om oss\" och \"Team\".",
      en: "GlorifyTC is a Swedish tech company building AI- and data-driven products and offering technical consulting. Read more under \"About\" and \"Team\"." },
    { test: function(m){ return /(tjanst|vad kan ni|vad gor ni|vad erbjuder|service|what do you|what can you|offer|hjalpa mig med|help me with)/.test(m); },
      sv: "Vi erbjuder AI-modellutveckling, dataanalys & data science, webbapplikationer och mobilappar – plus teknisk konsulting. Vill du veta mer om något särskilt? Detaljer finns under \"Tjänster\".",
      en: "We offer AI model development, data analysis & data science, web applications and mobile apps — plus technical consulting. Want details on something specific? See \"Services\"." }
  ];

  function detectLang() {
    var l = (window.LanguageManager && LanguageManager.currentLang) || localStorage.getItem('glorifytc_lang') || document.documentElement.lang || 'sv';
    return String(l).toLowerCase().startsWith('en') ? 'en' : 'sv';
  }

  function normalize(s) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function getReply(message) {
    var lang = detectLang();
    var m = normalize(message);
    for (var i = 0; i < KB.length; i++) {
      try { if (KB[i].test(m)) return KB[i][lang]; } catch (e) {}
    }
    return lang === 'en'
      ? "Good question! I can't fully answer that one here, but our team would be happy to. Email info@glorifytc.se and we'll get back to you quickly. You can also ask me about our services, pricing, projects or contact details."
      : "Bra fråga! Den kan jag inte svara fullt ut på här, men teamet hjälper dig gärna. Maila info@glorifytc.se så återkommer vi snabbt. Du kan också fråga mig om våra tjänster, priser, projekt eller kontaktuppgifter.";
  }

  // ---- Chat UI ----
  function initGlorifyChat() {
    var chatModal = document.getElementById('chatModal');
    var chatButton = document.getElementById('chatButton');
    var chatClose = document.getElementById('chatClose');
    var chatInput = document.getElementById('chatInput');
    var sendButton = document.getElementById('sendButton');
    var chatMessages = document.getElementById('chatMessages');

    if (!chatModal || !chatButton) return;

    function toggleChat() {
      chatModal.classList.toggle('open');
      if (chatModal.classList.contains('open')) chatInput.focus();
    }

    // Optional robot-container click (index page)
    var robot = document.querySelector('.robot-container');
    if (robot) robot.addEventListener('click', toggleChat);

    chatButton.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    chatModal.addEventListener('click', function (e) { if (e.target === chatModal) toggleChat(); });

    function appendMsg(role, text) {
      var div = document.createElement('div');
      div.classList.add('message', role);
      div.textContent = text;
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return div;
    }

    function botRespond(message) {
      var typing = appendMsg('assistant', '\u2022\u2022\u2022');
      typing.classList.add('typing');
      setTimeout(function () {
        typing.remove();
        appendMsg('assistant', getReply(message));
        sendButton.disabled = !chatInput.value.trim();
        chatInput.focus();
      }, 600);
    }

    function sendMessage() {
      var message = chatInput.value.trim();
      if (!message) return;
      appendMsg('user', message);
      chatInput.value = '';
      sendButton.disabled = true;
      botRespond(message);
    }

    function sendQuick(text) {
      appendMsg('user', text);
      sendButton.disabled = true;
      botRespond(text);
    }

    function renderChips() {
      if (chatMessages.querySelector('.chat-chips')) return;
      var lang = detectLang();
      var sets = {
        sv: [['Tjänster','vilka tjänster erbjuder ni'],['Priser','vad kostar ett projekt'],['TaskBridge','berätta om taskbridge'],['Kontakt','hur kontaktar jag er']],
        en: [['Services','what services do you offer'],['Pricing','how much does a project cost'],['TaskBridge','tell me about taskbridge'],['Contact','how do i contact you']]
      };
      var wrap = document.createElement('div');
      wrap.className = 'chat-chips';
      (sets[lang] || sets.sv).forEach(function (pair) {
        var b = document.createElement('button');
        b.className = 'chat-chip';
        b.type = 'button';
        b.textContent = pair[0];
        b.addEventListener('click', function () { sendQuick(pair[1]); });
        wrap.appendChild(b);
      });
      chatMessages.appendChild(wrap);
    }

    chatInput.addEventListener('keypress', function (e) { if (e.key === 'Enter') sendMessage(); });
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('input', function () { sendButton.disabled = !chatInput.value.trim(); });

    renderChips();
  }

  // ---- Inject chip CSS if not already present ----
  if (!document.getElementById('glorify-chat-css')) {
    var style = document.createElement('style');
    style.id = 'glorify-chat-css';
    style.textContent =
      '.chat-chips{display:flex;flex-wrap:wrap;gap:.5rem;margin:.5rem 0 .25rem;}' +
      '.chat-chip{background:rgba(0,209,255,.1);border:1px solid var(--cyan-400,#00f5ff);color:var(--cyan-400,#00f5ff);border-radius:50px;padding:.4rem .85rem;font-size:.8rem;line-height:1;cursor:pointer;font-family:inherit;transition:background .2s ease;}' +
      '.chat-chip:hover{background:rgba(0,209,255,.22);}' +
      '.message.typing{opacity:.6;letter-spacing:2px;}';
    document.head.appendChild(style);
  }

  // ---- Boot ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlorifyChat);
  } else {
    initGlorifyChat();
  }
})();
