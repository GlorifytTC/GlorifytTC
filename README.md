# GlorifyTC Website

Static marketing website for GlorifyTC — a Swedish AI, Data Science & digital development company. Hosted on GitHub Pages at [glorifytc.se](https://www.glorifytc.se).

## Structure

Pages (all static HTML):
- `index.html` — Home
- `services.html` — Services
- `about.html` — About
- `team.html` — Team
- `blog.html` — Blog index + three articles (`blog-*.html`)
- `projects.html` — Projects (TaskBridge)
- `contact.html` — Contact (Formspree-powered form)

Shared assets:
- `styles.css` — Global styles (home page + shared components)
- `about.css`, `services.css`, `team.css`, `blog.css`, `contact.css` — Page-specific styles
- `footer.css` — Shared footer + logo styling (single source of truth)
- `chatbot.js` — Shared bilingual (SV/EN) site chatbot
- `nav-menu.js` — Navigation / mobile menu
- `cookie-consent.js` — GDPR cookie banner
- `scroll-fx.js`, `space-bg.js` — Visual effects
- Images: `logo.png`, `og-image.jpg`, favicons, team photos

SEO:
- `sitemap.xml`, `robots.txt`
- Open Graph, Twitter Card, hreflang, JSON-LD on all pages
- `google188e49467e73ea46.html` — Google Search Console verification

## Deployment

Push to the `main` branch. GitHub Pages serves the site automatically.

Custom domain: set in repo Settings → Pages. DNS must point `glorifytc.se` to GitHub Pages.

## Contact

info@glorifytc.se · Flygfältsvägen 13, 177 45 Järfälla
