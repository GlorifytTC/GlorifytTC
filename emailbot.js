// emailbot.js - Complete functionality with working register, login, and checkout

const API = 'http://localhost:8000';
let pendingPlan = null;
let authToken = localStorage.getItem('gt_token') || null;

// Complete translations for ALL 6 languages
const botTranslations = {
    sv: {
        heroTag: "AI E-postautomation",
        heroDesc: "Anslut din Gmail, ladda upp dina dokument och låt AI besvara, filtrera och arkivera dina e-postmeddelanden — automatiskt.",
        heroBtn1: "Starta gratis provperiod",
        heroBtn2: "Se hur det fungerar",
        featTitle: "Vad vi",
        featSpan: "bygger",
        featDesc: "Intelligenta lösningar som löser verkliga inkorgsproblem och levererar mätbart värde.",
        f1t: "Smart e-postläsning",
        f1d: "Ansluter till din Gmail och läser inkommande e-post i realtid. Bearbetar varje meddelande automatiskt.",
        f2t: "Skräppostfiltrering",
        f2d: "AI identifierar och arkiverar skräppost innan det når dig. Sluta slösa tid på onödiga mejl.",
        f3t: "Dokumentträning",
        f3d: "Ladda upp dina PDF-filer och Word-dokument. AI lär sig av dem för att besvara kundförfrågningar korrekt.",
        f4t: "Automatiska svar",
        f4d: "Prisfrågor, vanliga frågor och enkla förfrågningar besvaras omedelbart — utan mänsklig inblandning.",
        f5t: "Utkastgodkännande",
        f5d: "Känsliga e-postmeddelanden som mötesbokning skapas som utkast och skickas till dig för granskning.",
        f6t: "Automatisk arkivering",
        f6d: "E-post kategoriseras och arkiveras automatiskt. Hitta allt direkt.",
        viewPricing: "Se priser",
        s1t: "Sparar timmar", s1s: "Varje vecka per kund", s1b: "AUTOMATISERAT",
        s2t: "AI-driven", s2s: "Lokal Llama-modell", s2b: "PRIVAT & SÄKER",
        s3t: "Krypterat", s3s: "Dina data är skyddade", s3b: "GDPR-SÄKERT",
        s4t: "Redo att börja", s4s: "Kontakta oss idag", s4b: "READY TO START",
        priceTitle: "Enkel, transparent", priceSpan: "prissättning", priceDesc: "Inga dolda avgifter. Avsluta när som helst.",
        mostPopular: "MEST POPULÄR",
        planSmall: "Liten", planSmallDesc: "Perfekt för små företag",
        planMedium: "Medel", planMediumDesc: "För växande företag",
        planLarge: "Stor", planLargeDesc: "Obegränsad kapacitet",
        currencySmall: "kr/mån", currencyMedium: "kr/mån", currencyLarge: "kr/mån",
        p1f1: "500 e-postmeddelanden/mån", p1f2: "Upp till 10 dokument", p1f3: "Skräppostfiltrering", p1f4: "Automatiska svar", p1f5: "E-postsupport",
        p2f1: "2 000 e-postmeddelanden/mån", p2f2: "Upp till 50 dokument", p2f3: "Skräppostfiltrering", p2f4: "Auto-svar + utkast", p2f5: "Prioriterad support",
        p3f1: "Obegränsade e-postmeddelanden", p3f2: "Obegränsade dokument", p3f3: "Skräppostfiltrering", p3f4: "Auto-svar + utkast", p3f5: "Dedikerad support",
        btnGetStarted: "Kom igång",
        ctaTitle: "Redo att automatisera din", ctaSpan: "inkorg", ctaDesc: "Låt oss diskutera hur AI kan transformera ditt företags e-postkommunikation.", ctaBtn: "Starta en konversation",
        loginTitle: "Välkommen tillbaka", loginSub: "Logga in på din instrumentpanel",
        labelEmail: "E-post", labelPassword: "Lösenord", labelCompany: "Företagsnamn", labelConfirm: "Bekräfta lösenord",
        btnLogin: "Logga in", btnRegister: "Skapa konto",
        switchToRegister: "Inget konto?", createFree: "Skapa ett gratis",
        switchToLogin: "Har redan konto?", signIn: "Logga in",
        registerTitle: "Skapa konto", registerSub: "Börja automatisera din inkorg idag",
        selectedPlan: "Valt paket", paymentAfter: "Betalning sätts upp efter kontoregistrering",
        errEmail: "Ange en giltig e-postadress", errPassword: "Lösenord krävs", errCompany: "Företagsnamn krävs",
        errPassLen: "Minst 8 tecken", errPassMatch: "Lösenorden matchar inte", errInvalid: "Fel e-post eller lösenord",
        paySuccess: "Betalning lyckades! Din bot är nu aktiv.", payCancel: "Betalning avbröts. Välj ett paket för att komma igång."
    },
    en: {
        heroTag: "AI Email Automation",
        heroDesc: "Connect your Gmail, upload your documents and let AI answer, filter and archive your emails — automatically.",
        heroBtn1: "Start free trial", heroBtn2: "See how it works",
        featTitle: "What we", featSpan: "build", featDesc: "Intelligent solutions that solve real inbox problems and deliver measurable value.",
        f1t: "Smart Email Reading", f1d: "Connects to your Gmail and reads incoming emails in real-time.",
        f2t: "Spam Filtering", f2d: "AI detects and archives spam before it reaches you.",
        f3t: "Document Training", f3d: "Upload your PDFs and Word documents. AI learns from them.",
        f4t: "Auto Replies", f4d: "Price inquiries and simple questions answered instantly.",
        f5t: "Draft Approval", f5d: "Sensitive emails are sent to you for review first.",
        f6t: "Auto Archive", f6d: "Emails are categorized and archived automatically.",
        viewPricing: "View Pricing",
        s1t: "Saves Hours", s1s: "Every week per customer", s1b: "AUTOMATED",
        s2t: "AI-Powered", s2s: "Local Llama model", s2b: "PRIVATE & SECURE",
        s3t: "Encrypted", s3s: "Your data is protected", s3b: "GDPR COMPLIANT",
        s4t: "Ready to Start", s4s: "Contact us today", s4b: "READY TO START",
        priceTitle: "Simple, transparent", priceSpan: "pricing", priceDesc: "No hidden fees. Cancel anytime.",
        mostPopular: "MOST POPULAR",
        planSmall: "Small", planSmallDesc: "Perfect for small businesses",
        planMedium: "Medium", planMediumDesc: "For growing companies",
        planLarge: "Large", planLargeDesc: "Unlimited capacity",
        currencySmall: "kr/month", currencyMedium: "kr/month", currencyLarge: "kr/month",
        p1f1: "500 emails/month", p1f2: "Up to 10 documents", p1f3: "Spam filtering", p1f4: "Auto replies", p1f5: "Email support",
        p2f1: "2,000 emails/month", p2f2: "Up to 50 documents", p2f3: "Spam filtering", p2f4: "Auto replies + drafts", p2f5: "Priority support",
        p3f1: "Unlimited emails", p3f2: "Unlimited documents", p3f3: "Spam filtering", p3f4: "Auto replies + drafts", p3f5: "Dedicated support",
        btnGetStarted: "Get Started",
        ctaTitle: "Ready to automate your", ctaSpan: "inbox", ctaDesc: "Let's discuss how AI can transform your business email communication.", ctaBtn: "Start a conversation",
        loginTitle: "Welcome back", loginSub: "Sign in to your dashboard",
        labelEmail: "Email", labelPassword: "Password", labelCompany: "Company Name", labelConfirm: "Confirm password",
        btnLogin: "Sign In", btnRegister: "Create Account",
        switchToRegister: "No account?", createFree: "Create one free",
        switchToLogin: "Already have an account?", signIn: "Sign in",
        registerTitle: "Create account", registerSub: "Start automating your inbox today",
        selectedPlan: "Selected plan", paymentAfter: "Payment setup after account creation",
        errEmail: "Please enter a valid email", errPassword: "Password required", errCompany: "Company name required",
        errPassLen: "Min 8 characters", errPassMatch: "Passwords do not match", errInvalid: "Invalid email or password",
        paySuccess: "Payment successful! Your bot is now active.", payCancel: "Payment cancelled. Choose a plan to get started."
    },
    no: {
        heroTag: "AI E-postautomatisering",
        heroDesc: "Koble til Gmail, last opp dokumenter og la AI svare, filtrere og arkivere e-postene dine — automatisk.",
        heroBtn1: "Start gratis prøveperiode", heroBtn2: "Se hvordan det fungerer",
        featTitle: "Hva vi", featSpan: "bygger", featDesc: "Intelligente løsninger som løser virkelige innboksproblemer.",
        f1t: "Smart e-postlesing", f1d: "Kobler til Gmail og leser innkommende e-post i sanntid.",
        f2t: "Søppelpostfiltrering", f2d: "AI oppdager og arkiverer søppelpost før det når deg.",
        f3t: "Dokumenttrening", f3d: "Last opp PDF-er og Word-dokumenter. AI lærer av dem.",
        f4t: "Automatiske svar", f4d: "Prisspørsmål og enkle henvendelser besvares umiddelbart.",
        f5t: "Utkastgodkjenning", f5d: "Sensitive e-poster sendes til deg for gjennomgang.",
        f6t: "Automatisk arkivering", f6d: "E-poster kategoriseres og arkiveres automatisk.",
        viewPricing: "Se priser",
        s1t: "Sparer timer", s1s: "Hver uke per kunde", s1b: "AUTOMATISERT",
        s2t: "AI-drevet", s2s: "Lokal Llama-modell", s2b: "PRIVAT & SIKKER",
        s3t: "Kryptert", s3s: "Dataene dine er beskyttet", s3b: "GDPR-SIKKERT",
        s4t: "Klar til å starte", s4s: "Kontakt oss i dag", s4b: "READY TO START",
        priceTitle: "Enkel, transparent", priceSpan: "prissetting", priceDesc: "Ingen skjulte avgifter. Avslutt når som helst.",
        mostPopular: "MEST POPULÆR",
        planSmall: "Liten", planSmallDesc: "Perfekt for små bedrifter",
        planMedium: "Medium", planMediumDesc: "For voksende selskaper",
        planLarge: "Stor", planLargeDesc: "Ubegrenset kapasitet",
        currencySmall: "kr/mnd", currencyMedium: "kr/mnd", currencyLarge: "kr/mnd",
        p1f1: "500 e-poster/mnd", p1f2: "Opptil 10 dokumenter", p1f3: "Søppelpostfiltrering", p1f4: "Automatiske svar", p1f5: "E-poststøtte",
        p2f1: "2 000 e-poster/mnd", p2f2: "Opptil 50 dokumenter", p2f3: "Søppelpostfiltrering", p2f4: "Auto-svar + utkast", p2f5: "Prioritert støtte",
        p3f1: "Ubegrenset e-poster", p3f2: "Ubegrenset dokumenter", p3f3: "Søppelpostfiltrering", p3f4: "Auto-svar + utkast", p3f5: "Dedikert støtte",
        btnGetStarted: "Kom i gang",
        ctaTitle: "Klar til å automatisere din", ctaSpan: "innboks", ctaDesc: "La oss diskutere hvordan AI kan transformere bedriftens e-postkommunikasjon.", ctaBtn: "Start en samtale",
        loginTitle: "Velkommen tilbake", loginSub: "Logg inn på dashbordet ditt",
        labelEmail: "E-post", labelPassword: "Passord", labelCompany: "Firmanavn", labelConfirm: "Bekreft passord",
        btnLogin: "Logg inn", btnRegister: "Opprett konto",
        switchToRegister: "Ingen konto?", createFree: "Opprett en gratis",
        switchToLogin: "Har du allerede konto?", signIn: "Logg inn",
        registerTitle: "Opprett konto", registerSub: "Begynn å automatisere innboksen din i dag",
        selectedPlan: "Valgt plan", paymentAfter: "Betalingsoppsett etter kontoregistrering",
        errEmail: "Skriv inn en gyldig e-post", errPassword: "Passord kreves", errCompany: "Firmanavn kreves",
        errPassLen: "Minst 8 tegn", errPassMatch: "Passordene stemmer ikke overens", errInvalid: "Ugyldig e-post eller passord",
        paySuccess: "Betaling vellykket! Boten din er nå aktiv.", payCancel: "Betaling avbrutt. Velg en plan for å komme i gang."
    },
    fi: {
        heroTag: "AI-sähköpostiautomaatio",
        heroDesc: "Yhdistä Gmail, lataa dokumenttisi ja anna tekoälyn vastata, suodattaa ja arkistoida sähköpostisi — automaattisesti.",
        heroBtn1: "Aloita ilmainen kokeilu", heroBtn2: "Katso miten se toimii",
        featTitle: "Mitä me", featSpan: "rakennamme", featDesc: "Älykkäitä ratkaisuja, jotka ratkaisevat todellisia saapuneet-kansion ongelmia.",
        f1t: "Älykäs sähköpostien luku", f1d: "Yhdistää Gmailiin ja lukee saapuvat sähköpostit reaaliajassa.",
        f2t: "Roskapostisuodatus", f2d: "Tekoäly tunnistaa ja arkistoi roskapostin ennen kuin se tavoittaa sinut.",
        f3t: "Dokumenttikoulutus", f3d: "Lataa PDF- ja Word-dokumenttisi. Tekoäly oppii niistä.",
        f4t: "Automaattiset vastaukset", f4d: "Hintakyselyt ja yksinkertaiset tiedustelut vastataan välittömästi.",
        f5t: "Luonnoksen hyväksyntä", f5d: "Arkaluonteiset sähköpostit lähetetään sinulle tarkistettavaksi.",
        f6t: "Automaattinen arkistointi", f6d: "Sähköpostit kategorisoidaan ja arkistoidaan automaattisesti.",
        viewPricing: "Katso hinnat",
        s1t: "Säästää tunteja", s1s: "Joka viikko per asiakas", s1b: "AUTOMATISOITU",
        s2t: "Tekoälypohjainen", s2s: "Paikallinen Llama-malli", s2b: "YKSITYINEN & TURVALLINEN",
        s3t: "Salattu", s3s: "Tietosi ovat suojattuja", s3b: "GDPR-YHTEENSOPIVA",
        s4t: "Valmis aloittamaan", s4s: "Ota meihin yhteyttä", s4b: "READY TO START",
        priceTitle: "Yksinkertainen, läpinäkyvä", priceSpan: "hinnoittelu", priceDesc: "Ei piilomaksuja. Peruuta milloin tahansa.",
        mostPopular: "SUOSITUIN",
        planSmall: "Pieni", planSmallDesc: "Täydellinen pienyrityksille",
        planMedium: "Keskikokoinen", planMediumDesc: "Kasvaville yrityksille",
        planLarge: "Suuri", planLargeDesc: "Rajaton kapasiteetti",
        currencySmall: "€/kk", currencyMedium: "€/kk", currencyLarge: "€/kk",
        p1f1: "500 sähköpostia/kk", p1f2: "Enintään 10 dokumenttia", p1f3: "Roskapostisuodatus", p1f4: "Automaattiset vastaukset", p1f5: "Sähköpostituki",
        p2f1: "2 000 sähköpostia/kk", p2f2: "Enintään 50 dokumenttia", p2f3: "Roskapostisuodatus", p2f4: "Auto-vastaukset + luonnokset", p2f5: "Prioriteettituki",
        p3f1: "Rajattomat sähköpostit", p3f2: "Rajattomat dokumentit", p3f3: "Roskapostisuodatus", p3f4: "Auto-vastaukset + luonnokset", p3f5: "Dedikoitu tuki",
        btnGetStarted: "Aloita",
        ctaTitle: "Valmis automatisoimaan", ctaSpan: "saapuneet-kansion", ctaDesc: "Keskustellaan siitä, miten tekoäly voi muuttaa yrityksesi sähköpostiviestintää.", ctaBtn: "Aloita keskustelu",
        loginTitle: "Tervetuloa takaisin", loginSub: "Kirjaudu hallintapaneeliisi",
        labelEmail: "Sähköposti", labelPassword: "Salasana", labelCompany: "Yrityksen nimi", labelConfirm: "Vahvista salasana",
        btnLogin: "Kirjaudu", btnRegister: "Luo tili",
        switchToRegister: "Ei tiliä?", createFree: "Luo ilmainen tili",
        switchToLogin: "Onko sinulla jo tili?", signIn: "Kirjaudu",
        registerTitle: "Luo tili", registerSub: "Aloita saapuneet-kansion automatisointi tänään",
        selectedPlan: "Valittu paketti", paymentAfter: "Maksujärjestely tilin luomisen jälkeen",
        errEmail: "Anna kelvollinen sähköpostiosoite", errPassword: "Salasana vaaditaan", errCompany: "Yrityksen nimi vaaditaan",
        errPassLen: "Vähintään 8 merkkiä", errPassMatch: "Salasanat eivät täsmää", errInvalid: "Virheellinen sähköposti tai salasana",
        paySuccess: "Maksu onnistui! Bottisi on nyt aktiivinen.", payCancel: "Maksu peruutettu. Valitse paketti aloittaaksesi."
    },
    da: {
        heroTag: "AI E-mailautomatisering",
        heroDesc: "Forbind din Gmail, upload dokumenter og lad AI besvare, filtrere og arkivere dine e-mails — automatisk.",
        heroBtn1: "Start gratis prøveperiode", heroBtn2: "Se hvordan det virker",
        featTitle: "Hvad vi", featSpan: "bygger", featDesc: "Intelligente løsninger der løser virkelige indbakkeproblemer.",
        f1t: "Smart e-maillæsning", f1d: "Forbinder til Gmail og læser indkommende e-mails i realtid.",
        f2t: "Spamfiltrering", f2d: "AI opdager og arkiverer spam inden det når dig.",
        f3t: "Dokumenttræning", f3d: "Upload PDF-filer og Word-dokumenter. AI lærer af dem.",
        f4t: "Automatiske svar", f4d: "Prisforespørgsler og enkle henvendelser besvares øjeblikkeligt.",
        f5t: "Kladgodkendelse", f5d: "Følsomme e-mails sendes til dig til gennemgang.",
        f6t: "Automatisk arkivering", f6d: "E-mails kategoriseres og arkiveres automatisk.",
        viewPricing: "Se priser",
        s1t: "Sparer timer", s1s: "Hver uge per kunde", s1b: "AUTOMATISERET",
        s2t: "AI-drevet", s2s: "Lokal Llama-model", s2b: "PRIVAT & SIKKER",
        s3t: "Krypteret", s3s: "Dine data er beskyttet", s3b: "GDPR-SIKKERT",
        s4t: "Klar til at starte", s4s: "Kontakt os i dag", s4b: "READY TO START",
        priceTitle: "Enkel, transparent", priceSpan: "prissætning", priceDesc: "Ingen skjulte gebyrer. Opsig når som helst.",
        mostPopular: "MEST POPULÆR",
        planSmall: "Lille", planSmallDesc: "Perfekt til små virksomheder",
        planMedium: "Mellem", planMediumDesc: "Til voksende virksomheder",
        planLarge: "Stor", planLargeDesc: "Ubegrænset kapacitet",
        currencySmall: "kr/måned", currencyMedium: "kr/måned", currencyLarge: "kr/måned",
        p1f1: "500 e-mails/måned", p1f2: "Op til 10 dokumenter", p1f3: "Spamfiltrering", p1f4: "Automatiske svar", p1f5: "E-mailsupport",
        p2f1: "2.000 e-mails/måned", p2f2: "Op til 50 dokumenter", p2f3: "Spamfiltrering", p2f4: "Auto-svar + kladder", p2f5: "Prioriteret support",
        p3f1: "Ubegrænsede e-mails", p3f2: "Ubegrænsede dokumenter", p3f3: "Spamfiltrering", p3f4: "Auto-svar + kladder", p3f5: "Dedikeret support",
        btnGetStarted: "Kom i gang",
        ctaTitle: "Klar til at automatisere din", ctaSpan: "indbakke", ctaDesc: "Lad os diskutere hvordan AI kan transformere din virksomheds e-mailkommunikation.", ctaBtn: "Start en samtale",
        loginTitle: "Velkommen tilbage", loginSub: "Log ind på dit dashboard",
        labelEmail: "E-mail", labelPassword: "Adgangskode", labelCompany: "Firmanavn", labelConfirm: "Bekræft adgangskode",
        btnLogin: "Log ind", btnRegister: "Opret konto",
        switchToRegister: "Ingen konto?", createFree: "Opret en gratis",
        switchToLogin: "Har du allerede en konto?", signIn: "Log ind",
        registerTitle: "Opret konto", registerSub: "Begynd at automatisere din indbakke i dag",
        selectedPlan: "Valgt pakke", paymentAfter: "Betalingsopsætning efter kontooprettelse",
        errEmail: "Angiv en gyldig e-mailadresse", errPassword: "Adgangskode påkrævet", errCompany: "Firmanavn påkrævet",
        errPassLen: "Mindst 8 tegn", errPassMatch: "Adgangskoderne matcher ikke", errInvalid: "Ugyldig e-mail eller adgangskode",
        paySuccess: "Betaling gennemført! Din bot er nu aktiv.", payCancel: "Betaling annulleret. Vælg en pakke for at komme i gang."
    },
    de: {
        heroTag: "KI-E-Mail-Automatisierung",
        heroDesc: "Gmail verbinden, Dokumente hochladen und KI Ihre E-Mails beantworten, filtern und archivieren lassen — automatisch.",
        heroBtn1: "Kostenlose Testphase starten", heroBtn2: "Wie es funktioniert",
        featTitle: "Was wir", featSpan: "bauen", featDesc: "Intelligente Lösungen für reale Posteingang-Probleme.",
        f1t: "Intelligentes E-Mail-Lesen", f1d: "Verbindet mit Gmail und liest eingehende E-Mails in Echtzeit.",
        f2t: "Spam-Filterung", f2d: "KI erkennt und archiviert Spam bevor er Sie erreicht.",
        f3t: "Dokumententraining", f3d: "PDFs und Word-Dokumente hochladen. KI lernt davon.",
        f4t: "Automatische Antworten", f4d: "Preisanfragen und einfache Fragen werden sofort beantwortet.",
        f5t: "Entwurfsgenehmigung", f5d: "Sensible E-Mails werden zur Überprüfung an Sie gesendet.",
        f6t: "Automatische Archivierung", f6d: "E-Mails werden automatisch kategorisiert und archiviert.",
        viewPricing: "Preise ansehen",
        s1t: "Spart Stunden", s1s: "Jede Woche pro Kunde", s1b: "AUTOMATISIERT",
        s2t: "KI-gestützt", s2s: "Lokales Llama-Modell", s2b: "PRIVAT & SICHER",
        s3t: "Verschlüsselt", s3s: "Ihre Daten sind geschützt", s3b: "DSGVO-KONFORM",
        s4t: "Bereit zu starten", s4s: "Kontaktieren Sie uns", s4b: "READY TO START",
        priceTitle: "Einfache, transparente", priceSpan: "Preisgestaltung", priceDesc: "Keine versteckten Gebühren. Jederzeit kündbar.",
        mostPopular: "AM BELIEBTESTEN",
        planSmall: "Klein", planSmallDesc: "Perfekt für kleine Unternehmen",
        planMedium: "Mittel", planMediumDesc: "Für wachsende Unternehmen",
        planLarge: "Groß", planLargeDesc: "Unbegrenzte Kapazität",
        currencySmall: "€/Monat", currencyMedium: "€/Monat", currencyLarge: "€/Monat",
        p1f1: "500 E-Mails/Monat", p1f2: "Bis zu 10 Dokumente", p1f3: "Spam-Filterung", p1f4: "Automatische Antworten", p1f5: "E-Mail-Support",
        p2f1: "2.000 E-Mails/Monat", p2f2: "Bis zu 50 Dokumente", p2f3: "Spam-Filterung", p2f4: "Auto-Antworten + Entwürfe", p2f5: "Prioritäts-Support",
        p3f1: "Unbegrenzte E-Mails", p3f2: "Unbegrenzte Dokumente", p3f3: "Spam-Filterung", p3f4: "Auto-Antworten + Entwürfe", p3f5: "Dedizierter Support",
        btnGetStarted: "Loslegen",
        ctaTitle: "Bereit Ihren Posteingang zu automatisieren?", ctaSpan: "Posteingang", ctaDesc: "Lassen Sie uns besprechen wie KI Ihre E-Mail-Kommunikation transformieren kann.", ctaBtn: "Gespräch starten",
        loginTitle: "Willkommen zurück", loginSub: "In Ihr Dashboard einloggen",
        labelEmail: "E-Mail", labelPassword: "Passwort", labelCompany: "Firmenname", labelConfirm: "Passwort bestätigen",
        btnLogin: "Einloggen", btnRegister: "Konto erstellen",
        switchToRegister: "Kein Konto?", createFree: "Kostenlos erstellen",
        switchToLogin: "Haben Sie bereits ein Konto?", signIn: "Einloggen",
        registerTitle: "Konto erstellen", registerSub: "Beginnen Sie noch heute mit der Automatisierung",
        selectedPlan: "Ausgewählter Plan", paymentAfter: "Zahlungseinrichtung nach Kontoerstellung",
        errEmail: "Gültige E-Mail-Adresse eingeben", errPassword: "Passwort erforderlich", errCompany: "Firmenname erforderlich",
        errPassLen: "Mindestens 8 Zeichen", errPassMatch: "Passwörter stimmen nicht überein", errInvalid: "Ungültige E-Mail oder Passwort",
        paySuccess: "Zahlung erfolgreich! Ihr Bot ist jetzt aktiv.", payCancel: "Zahlung abgebrochen. Wählen Sie einen Plan."
    }
};

let currentLang = localStorage.getItem('glorifytc_lang') || 'sv';
let currentCurrency = 'SEK';

// Currency per language
const LANG_CURRENCY = { sv: 'SEK', en: 'SEK', no: 'NOK', fi: 'EUR', da: 'DKK', de: 'EUR' };
const BASE_PRICES = { small: 500, medium: 1500, large: 4000 };
let exchangeRates = { SEK: 1, NOK: 1.05, EUR: 0.088, DKK: 0.66 };

async function fetchRates() {
    try {
        const r = await fetch('https://open.er-api.com/v6/latest/SEK');
        const d = await r.json();
        if (d.rates) {
            exchangeRates.NOK = d.rates.NOK;
            exchangeRates.EUR = d.rates.EUR;
            exchangeRates.DKK = d.rates.DKK;
        }
    } catch (e) { }
}

function convertPrice(sekAmount, currency) {
    const rate = exchangeRates[currency] || 1;
    const converted = sekAmount * rate;
    return Math.round(converted).toLocaleString();
}

function updatePriceDisplay() {
    const priceIds = { small: 'priceSmall', medium: 'priceMedium', large: 'priceLarge' };
    for (const [plan, id] of Object.entries(priceIds)) {
        const el = document.getElementById(id);
        if (el) el.textContent = convertPrice(BASE_PRICES[plan], currentCurrency);
    }
}

function onCurrencyChange() {
    currentCurrency = document.getElementById('regCurrency')?.value || 'SEK';
    updatePriceDisplay();
}

function applyTranslations(lang) {
    const t = botTranslations[lang];
    if (!t) return;
    document.querySelectorAll('[data-bot]').forEach(el => {
        const key = el.dataset.bot;
        if (t[key] !== undefined) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    });
    // Update currency
    currentCurrency = LANG_CURRENCY[lang] || 'SEK';
    const sel = document.getElementById('regCurrency');
    if (sel) sel.value = currentCurrency;
    updatePriceDisplay();
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('glorifytc_lang', lang);
    const label = document.getElementById('currentLangLabel');
    if (label) label.textContent = lang.toUpperCase();
    applyTranslations(lang);
    highlightActiveLanguage(lang);
}

function highlightActiveLanguage(lang) {
    document.querySelectorAll('.language-option').forEach(option => {
        if (option.dataset.lang === lang) {
            option.classList.add('active-lang');
        } else {
            option.classList.remove('active-lang');
        }
    });
}

// ── AUTH MODAL FUNCTIONS ──
function openModal(view, plan) {
    pendingPlan = plan || null;
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('active');
    switchView(view);
    const badge = document.getElementById('planBadge');
    const badgeText = document.getElementById('planBadgeText');
    if (plan && badge && badgeText) {
        badge.style.display = 'flex';
        badgeText.textContent = plan;
    } else if (badge) {
        badge.style.display = 'none';
    }
}

function closeModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('active');
}

function switchView(view) {
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    if (loginView && registerView) {
        loginView.style.display = view === 'login' ? 'block' : 'none';
        registerView.style.display = view === 'register' ? 'block' : 'none';
    }
}

function showErr(id, msg) {
    const e = document.getElementById(id);
    if (e) {
        e.textContent = msg;
        e.style.display = 'block';
    }
}

function hideErr(id) {
    const e = document.getElementById(id);
    if (e) e.style.display = 'none';
}

function setLoading(btnId, on) {
    const btn = document.getElementById(btnId);
    if (btn) {
        if (on) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    }
}

function toast(msg, type = '') {
    const t = document.getElementById('ebToast');
    if (t) {
        t.textContent = msg;
        t.className = 'eb-toast show ' + type;
        setTimeout(() => t.className = 'eb-toast', 4000);
    } else {
        alert(msg);
    }
}

// ── REGISTER ──
async function handleRegister() {
    const t = botTranslations[currentLang];
    const company = document.getElementById('regCompany')?.value.trim() || '';
    const email = document.getElementById('regEmail')?.value.trim() || '';
    const pass = document.getElementById('regPassword')?.value || '';
    const confirm = document.getElementById('regConfirm')?.value || '';
    const currency = document.getElementById('regCurrency')?.value || 'SEK';

    let ok = true;
    ['regCompanyErr', 'regEmailErr', 'regPassErr', 'regConfirmErr'].forEach(hideErr);

    if (!company) {
        showErr('regCompanyErr', t.errCompany);
        ok = false;
    }
    if (!email || !email.includes('@')) {
        showErr('regEmailErr', t.errEmail);
        ok = false;
    }
    if (pass.length < 8) {
        showErr('regPassErr', t.errPassLen);
        ok = false;
    }
    if (pass !== confirm) {
        showErr('regConfirmErr', t.errPassMatch);
        ok = false;
    }
    if (!ok) return;

    setLoading('registerBtn', true);
    try {
        const res = await fetch(`${API}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ company, email, password: pass, currency })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Registration failed');

        authToken = data.token;
        localStorage.setItem('gt_token', authToken);
        closeModal();
        toast('✓ ' + (currentLang === 'en' ? 'Account created!' : 'Konto skapat!'), 'success');

        if (pendingPlan) {
            await doCheckout(pendingPlan);
        } else {
            setTimeout(() => window.location.href = 'dashboard.html', 1200);
        }
    } catch (e) {
        toast(e.message, 'error');
    } finally {
        setLoading('registerBtn', false);
    }
}

// ── LOGIN ──
async function handleLogin() {
    const t = botTranslations[currentLang];
    const email = document.getElementById('loginEmail')?.value.trim() || '';
    const pass = document.getElementById('loginPassword')?.value || '';

    let ok = true;
    hideErr('loginEmailErr');
    hideErr('loginPassErr');

    if (!email || !email.includes('@')) {
        showErr('loginEmailErr', t.errEmail);
        ok = false;
    }
    if (!pass) {
        showErr('loginPassErr', t.errPassword);
        ok = false;
    }
    if (!ok) return;

    setLoading('loginBtn', true);
    try {
        const res = await fetch(`${API}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || t.errInvalid);

        authToken = data.token;
        localStorage.setItem('gt_token', authToken);
        closeModal();

        if (pendingPlan) {
            await doCheckout(pendingPlan);
        } else {
            window.location.href = 'dashboard.html';
        }
    } catch (e) {
        toast(e.message, 'error');
    } finally {
        setLoading('loginBtn', false);
    }
}

// ── CHECKOUT ──
async function startCheckout(plan) {
    pendingPlan = plan;
    if (!authToken) {
        openModal('register', plan);
        return;
    }
    await doCheckout(plan);
}

async function doCheckout(plan) {
    try {
        const res = await fetch(`${API}/api/create-checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify({ plan, currency: currentCurrency })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Checkout failed');
        window.location.href = data.checkout_url;
    } catch (e) {
        toast(e.message, 'error');
    }
}

// ── PAYMENT BANNER ──
function checkPaymentResult() {
    const params = new URLSearchParams(window.location.search);
    const banner = document.getElementById('paymentBanner');
    const t = botTranslations[currentLang];
    if (params.get('payment') === 'success' && banner) {
        banner.textContent = '✓ ' + t.paySuccess;
        banner.className = 'payment-banner success';
        banner.style.display = 'block';
        history.replaceState({}, '', window.location.pathname);
    } else if (params.get('payment') === 'canceled' && banner) {
        banner.textContent = t.payCancel;
        banner.className = 'payment-banner canceled';
        banner.style.display = 'block';
        history.replaceState({}, '', window.location.pathname);
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

    function toggleChat() {
        chatModal.classList.toggle('open');
        if (chatModal.classList.contains('open') && chatInput) chatInput.focus();
    }

    if (chatButton) chatButton.addEventListener('click', toggleChat);
    if (chatClose) chatClose.addEventListener('click', toggleChat);
    if (chatModal) {
        chatModal.addEventListener('click', (e) => {
            if (e.target === chatModal) toggleChat();
        });
    }

    function sendMessage() {
        if (!chatInput || !sendButton || !chatMessages) return;
        const message = chatInput.value.trim();
        if (!message) return;

        const userDiv = document.createElement('div');
        userDiv.classList.add('message', 'user');
        userDiv.textContent = message;
        chatMessages.appendChild(userDiv);
        chatInput.value = '';
        sendButton.disabled = true;
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            const responses = [
                "Tack för ditt meddelande! Jag hjälper dig gärna.",
                "Vi specialiserar oss på AI-modeller och datalösningar. Hur kan jag hjälpa dig?",
                "Vårt team har lång erfarenhet inom AI-utveckling. Vad vill du veta mer om?",
                "Berätta gärna mer om dina behov så diskuterar vi hur AI kan transformera din verksamhet."
            ];
            const assistantDiv = document.createElement('div');
            assistantDiv.classList.add('message', 'assistant');
            assistantDiv.textContent = responses[Math.floor(Math.random() * responses.length)];
            chatMessages.appendChild(assistantDiv);
            if (sendButton) sendButton.disabled = false;
            if (chatInput) chatInput.focus();
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('input', () => {
            sendButton.disabled = !chatInput.value.trim();
        });
    }
}

// Language selector
const langBtn = document.getElementById('languageBtn');
const langDropdown = document.getElementById('languageDropdown');
if (langBtn && langDropdown) {
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('show');
    });
    document.addEventListener('click', () => langDropdown.classList.remove('show'));
    document.querySelectorAll('.language-option').forEach(o => {
        o.addEventListener('click', () => {
            setLanguage(o.dataset.lang);
            langDropdown.classList.remove('show');
        });
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    }
});

// Modal close on outside click
const authModal = document.getElementById('authModal');
if (authModal) {
    authModal.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    fetchRates();
    initChat();
    checkPaymentResult();

    // Check if already logged in → show dashboard link in nav
    if (authToken) {
        const cta = document.getElementById('navCta');
        if (cta) {
            cta.textContent = currentLang === 'sv' ? 'Min panel' : 'Dashboard';
            cta.onclick = () => window.location.href = 'dashboard.html';
        }
    }
    
    // Make functions globally available
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.switchView = switchView;
    window.handleLogin = handleLogin;
    window.handleRegister = handleRegister;
    window.startCheckout = startCheckout;
    window.onCurrencyChange = onCurrencyChange;
});