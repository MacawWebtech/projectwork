# Sweet Moments Bakery — Website Documentation

A static, multi-page marketing site for a bakery: home, about, products,
custom orders, pricing, delivery, contact, plus a 404 and a coming-soon
page. Built with HTML5, Bootstrap 5.3.3, and a custom CSS design system,
with a client-side light/dark mode toggle. No build step, no backend —
open the HTML files directly or serve them with any static file host.

---

## 1. Folder Structure

```
/
├── index.html               Root redirect → Pages/index.html (for GitHub Pages)
├── README.md                This file
├── Pages/
│   ├── index.html          Home (primary)
│   ├── index2.html         Home — alternate layout ("Home 02")
│   ├── about.html          About Us
│   ├── products.html       Products
│   ├── Custom cake.html    Custom Orders
│   ├── pricing.html        Pricing
│   ├── delivery.html       Delivery
│   ├── Contact.html        Contact
│   ├── coming-soon.html    "Coming soon" holding page
│   └── 404.html            Not-found page
└── assets/
    ├── css/
    │   ├── main.css            Design tokens + all page/component styles
    │   ├── dark-mode.css       Dark-mode variable overrides only
    │   ├── special-pages.css   Extra styling for 404 / coming-soon
    │   └── header-footer.css   Legacy file, not linked by any page (see §6)
    └── images/                 Photography, logo, icons (41 files)
```

All real pages live under `Pages/`; the root `index.html` is just a
1-line redirect so the site works when hosted at a domain/repo root
(e.g. GitHub Pages), where visitors land on `/` by default.
`Pages/index.html` is the actual primary home page.

---

## 2. Tech Stack & Dependencies

Everything is loaded from CDNs — nothing to install locally.

| Dependency | Source | Purpose |
|---|---|---|
| Bootstrap 5.3.3 (CSS + JS bundle) | jsDelivr CDN | Grid, flex utilities, dropdowns, collapse (mobile menu) |
| Google Fonts — Montserrat | fonts.googleapis.com | Body text |
| Google Fonts — Playfair Display | fonts.googleapis.com | Headings / brand serif |
| Material Symbols Outlined | fonts.googleapis.com | All icons (menu, sun/moon, social, contact icons) |

There is no separate JavaScript file — the mobile nav and dropdowns come
from Bootstrap's bundled JS, and the dark-mode toggle is a small inline
`<script>` at the bottom of each page (see §5).

---

## 3. Pages Reference

| File | `<title>` | Notes |
|---|---|---|
| `Pages/index.html` | Sweet Moments Bakery | Primary home page — hero, about teaser, products, custom-order CTA, pricing teaser, footer |
| `Pages/index2.html` | Sweet Moments Bakery | Alternate home page design, linked from the header's "Home" dropdown as "Home 02" |
| `Pages/about.html` | Sweet Moments Bakery | About Us, with page banner + breadcrumb |
| `Pages/products.html` | Sweet Moments - Products | Product catalogue |
| `Pages/Custom cake.html` | Custom Orders \| Sweet Moments | Custom order form/CTA page |
| `Pages/pricing.html` | Sweet Moments - Pricing | Pricing tiers/cards |
| `Pages/delivery.html` | Delivery \| Sweet Moments Bakery | Delivery info |
| `Pages/Contact.html` | Sweet Moments - Contact | Contact form, map, contact details |
| `Pages/coming-soon.html` | Coming Soon \| Sweet Moments Bakery | Holding page, uses `special-pages.css` |
| `Pages/404.html` | Page Not Found \| Sweet Moments Bakery | Error page, uses `special-pages.css` |

Every page shares the same fixed header and footer markup and links the
same two core stylesheets: `main.css` and `dark-mode.css`.

---

## 4. Design System

Defined as CSS custom properties in `main.css`'s `:root` (light mode);
`dark-mode.css` re-points the *same* variable names under `body.dark-mode`,
so components never need dark-mode-specific rules — they just reference
the variable and re-theme automatically.

**Brand palette**
| Token | Hex | Use |
|---|---|---|
| `--primary` | `#26170C` | Espresso brown — CTAs, dark sections |
| `--secondary` | `#7D562D` | Caramel/gold — accents, buttons |
| `--tertiary` | `#2D1213` | Deep wine — badges, quotes |
| `--background` / `--surface` | `#FEF9EF` | Cream page background |
| `--on-surface` | `#1D1C16` | Primary text ink |

**Typography**
- Headings / brand: `Playfair Display` (serif)
- Body: `Montserrat` (sans-serif)

**Other tokens:** border-radius scale (`--radius-sm` 12px → `--radius-xl`
48px), two shadow presets (`--shadow-soft`, `--shadow-strong`), and brand
gradients (`--gradient-brand`, `--gradient-brand-soft`).

To re-theme the whole site (e.g. change the accent color), edit the
variable values in `main.css`'s `:root` block — don't hunt for hardcoded
hex codes in individual component rules.

---

## 5. Dark Mode

- Toggled via the sun/moon icon button (`#themeToggle`) in the header.
- State is stored in `localStorage` under the key `sweetMomentsTheme`
  (`"dark"` or absent/`"light"`).
- An inline script at the very top of `<body>` reads that key *before*
  the page paints, adding `dark-mode` to `<body>` immediately — this
  avoids a flash of light-mode on page load.
- A second inline script near the bottom of the page wires up the click
  handler, flips the `dark-mode` class, updates the icon glyph and the
  button's `aria-label`/`title`, and writes the new value back to
  `localStorage`.
- All actual color changes come from `dark-mode.css` overriding the same
  CSS variables `main.css` defines — no component CSS needs to know
  about dark mode directly.

---

## 6. CSS Architecture

- **`main.css`** — single consolidated stylesheet: design tokens, and
  every page/section/component style (header, footer, hero, cards,
  pricing, forms, page banners, etc.), plus the site-wide **full-width
  layout system** described below. Everything except dark-mode color
  overrides and the two special pages lives here.
- **`dark-mode.css`** — only variable re-declarations under
  `body.dark-mode`. Kept separate intentionally so the color theme can be
  audited or edited independently of layout/component rules.
- **`special-pages.css`** — extra styling used only by `404.html` and
  `coming-soon.html`.
- **`header-footer.css`** — present in `assets/css/` but **not linked by
  any page**. It's an earlier draft of header/footer styling that was
  superseded by rules now inside `main.css`. Safe to delete; kept only
  as a historical reference. Don't edit it expecting it to affect the
  live site.

**Load order on every page:** `main.css` → `dark-mode.css` (→
`special-pages.css` on the two pages that use it).

### Full-width layout system

Every page container (`.container-custom`, plus Bootstrap's plain
`.container` and a few page-specific wrapper classes —
`.content-container`, `.bakery-container`, `.section-container`) is
full-width with responsive edge padding instead of a fixed max-width
column:

| Breakpoint | Horizontal padding |
|---|---|
| Mobile (`<576px`) | 18px |
| Tablet (`≥576px`) | 28px |
| Desktop (`≥992px`) | 48px |

The header, footer, and inner-page banner (the breadcrumb strip under
the header on inner pages) use this same 18/28/48 scale via their own
slightly more specific selectors (`.main-header .container-custom`,
`.site-footer .container-custom`, `.page-banner .container-custom`), so
they can carry their own edge-to-edge treatment without that padding
leaking into ordinary page sections.

These full-width rules are appended at the very end of `main.css` on
purpose: `main.css` was assembled by merging several earlier per-page
stylesheets, and a few of those left behind duplicate, page-scoped
rules (e.g. a stray `.header-inner { max-width: 1200px }`) that share
the same CSS specificity as the full-width rules. Because CSS resolves
ties by source order, keeping the full-width block last is what makes
it reliably win the cascade without relying on `!important`.

---

## 7. Header, Footer & Navigation

- **Header** (`.main-header`) is `position: fixed`, so every page's
  `<main>` carries top padding to clear it.
- **Desktop nav** (`≥1200px`) shows the full link row, with a "Home"
  dropdown offering the two homepage variants (`index.html` /
  `index2.html`).
- **Mobile nav** (`<1200px`) collapses into a hamburger-triggered
  Bootstrap `collapse` drawer.
- **Footer** (`.site-footer`) is a fixed dark "brand panel" in both light
  and dark mode (uses the `--panel-bg`/`--panel-text` tokens rather than
  the normal surface tokens, so it doesn't flip color with the theme
  toggle) — includes a newsletter signup, contact list, and social icons.

---

## 8. Responsive Breakpoints

The site follows Bootstrap's standard breakpoints, used consistently
throughout `main.css`'s media queries:

| Name | Width |
|---|---|
| Mobile | `<576px` |
| Small tablet | `576–767.98px` |
| Tablet | `768–991.98px` |
| Small desktop | `992–1199.98px` |
| Desktop | `≥1200px` (full desktop nav appears here) |

---

## 9. Running / Previewing the Site

No build tools or package manager are required.

- **Quickest:** open `Pages/index.html` directly in a browser.
- **Recommended (avoids any local file-path quirks):** serve the folder
  with any static server, e.g. from the project root:
  ```
  npx serve .
  ```
  or
  ```
  python3 -m http.server 8000
  ```
  then visit `http://localhost:.../Pages/index.html`.

---

## 10. Common Maintenance Tasks

- **Change a brand color:** edit the corresponding `--variable` in
  `main.css`'s `:root` (and its dark-mode counterpart in
  `dark-mode.css` if it should differ in dark mode).
- **Change the full-width padding scale:** edit the single rule block at
  the very end of `main.css` (search for `FULL-WIDTH LAYOUT`) plus the
  matching header/footer/page-banner blocks just above it.
- **Add a new page:** copy an existing page in `Pages/` as a starting
  point (so the header/footer markup and stylesheet links match), update
  the header nav links across all pages to include it if it should
  appear in navigation.
- **Add a new image:** drop it in `assets/images/` and reference it with
  a relative path from `Pages/`, e.g. `../assets/images/your-file.jpg`.

---

## 11. Known Quirks / Notes for Future Maintainers

- `assets/css/header-footer.css` is orphaned (not linked anywhere) — see
  §6.
- `main.css` contains some duplicated legacy rules from its merge
  history (e.g. more than one `.container-custom` or `.header-inner`
  declaration). The **last** declaration of a given selector in the file
  is the one that takes effect; the full-width layout block at the end
  of the file is placed there deliberately for this reason (§6).
- `Pages/index2.html` is a second, alternate homepage design kept
  side-by-side with the primary `Pages/index.html` — both are reachable
  from the header's "Home" dropdown.
