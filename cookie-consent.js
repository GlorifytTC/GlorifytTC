/* GlorifyTC — Cookie consent banner (EU/GDPR)
   Shared across all pages. Shows once until the visitor accepts or
   declines, then remembers the choice. Re-uses the site's existing
   language detection (glorifytc_lang in localStorage) so it speaks
   Swedish or English to match the rest of the page. */
(function () {
    var STORAGE_KEY = 'glorifytc_cookie_consent';

    function getLang() {
        var l = null;
        try { l = localStorage.getItem('glorifytc_lang'); } catch (e) {}
        if (l !== 'en' && l !== 'sv') l = (document.documentElement.lang === 'en') ? 'en' : 'sv';
        return l;
    }

    var COPY = {
        sv: {
            text: 'Vi använder cookies för att webbplatsen ska fungera korrekt, t.ex. för Google Maps-inbäddningen på vår kontaktsida. Genom att klicka på "Acceptera" godkänner du detta.',
            accept: 'Acceptera',
            decline: 'Endast nödvändiga',
            policy: 'Läs mer'
        },
        en: {
            text: 'We use cookies to make the site work properly, e.g. for the Google Maps embed on our contact page. By clicking "Accept" you agree to this.',
            accept: 'Accept',
            decline: 'Necessary only',
            policy: 'Learn more'
        }
    };

    function getConsent() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }
    function setConsent(value) {
        try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    }

    function buildBanner() {
        var lang = getLang();
        var c = COPY[lang] || COPY.sv;

        var wrap = document.createElement('div');
        wrap.id = 'cookieConsent';
        wrap.className = 'cookie-consent';
        wrap.setAttribute('role', 'dialog');
        wrap.setAttribute('aria-live', 'polite');
        wrap.innerHTML =
            '<div class="cookie-consent-inner">' +
                '<p class="cookie-consent-text">' + c.text + ' <a href="contact.html" class="cookie-consent-link">' + c.policy + '</a></p>' +
                '<div class="cookie-consent-actions">' +
                    '<button type="button" class="cookie-btn cookie-btn-decline" id="cookieDecline">' + c.decline + '</button>' +
                    '<button type="button" class="cookie-btn cookie-btn-accept" id="cookieAccept">' + c.accept + '</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(wrap);

        requestAnimationFrame(function () {
            wrap.classList.add('show');
        });

        function dismiss(value) {
            setConsent(value);
            wrap.classList.remove('show');
            setTimeout(function () { wrap.remove(); }, 350);
        }

        document.getElementById('cookieAccept').addEventListener('click', function () { dismiss('accepted'); });
        document.getElementById('cookieDecline').addEventListener('click', function () { dismiss('declined'); });
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (!getConsent()) {
            buildBanner();
        }
    });
})();
