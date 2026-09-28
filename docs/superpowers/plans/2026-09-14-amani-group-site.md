# Amani Group Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the five Amani Group HTML mockups in `D:\CTO\test` into this Astro 7 project as static routes with a Tailwind v4 CSS-first design system, content in data files / a content collection, and no framework runtime.

**Architecture:** One `Layout.astro` (SEO head, nav, footer, one site script) wraps seven static routes. Copy lives in `src/data/site.ts`, units in `src/data/units.ts`, articles in a `src/content/articles` collection. `main.css` holds the whole design system (`@theme` tokens + `@layer components`). All interaction is one vanilla `site.ts` plus an inline script on the contact page.

**Tech Stack:** Astro 7.2, Tailwind v4 (`@tailwindcss/vite`), `@fontsource-variable/outfit`, `astro-seo-meta`, `astro-seo-schema` + `schema-dts`, `@lucide/astro`, `simple-icons-astro`, `@astrojs/sitemap`, `astro-robots-txt`. pnpm, oxlint, oxfmt.

**Spec:** `docs/superpowers/specs/2026-09-14-amani-group-site-design.md`

## Global Constraints

- Package manager is pnpm; Node >= 22.12. No test framework exists — verification is `pnpm astro check`, `pnpm build`, `pnpm exec oxlint`, `pnpm exec oxfmt .` and a browser pass.
- House style: no semicolons, double quotes, 90-column print width (`.oxfmtrc.json`). Run `pnpm exec oxfmt .` before every commit — it also sorts Tailwind classes.
- Copy is Bahasa Indonesia, taken verbatim from the mockups. Markup carries no copy; it lives in `src/data/` or the content collection.
- `investor.html` is not ported. Every `investor.html` link becomes `/contact?topic=investor`.
- Link rewrites: `x.html` → `/x`; `unit-usaha.html#slug` → `/unit-usaha/slug`; `artikel.html#slug` → `/artikel/slug`; `contact.html?topic=x` → `/contact?topic=x`.
- Tailwind v4 syntax: `bg-linear-to-r` (not `bg-gradient-to-r`), `aspect-4/5` (not `aspect-[4/5]`). Utilities beat `@layer components` classes, so `t-body text-sm` works.
- Remote Unsplash images stay `<img loading="lazy">`. Local images (unit logos) go through `<Image>` from `astro:assets`.
- Icons: `@lucide/astro` for UI; `simple-icons-astro` for Instagram/YouTube/WhatsApp. **Neither package ships a LinkedIn icon** (trademark removals) — LinkedIn is the mockup's inline path inside `SocialIcon.astro`. Size icons with rem classes (`h-4 w-4`), never the px `size` prop.
- Commit after every task with the attribution trailer:
  ```
  Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01KBtEPDee2g1HwEVYjjrdxo
  ```
  (Write the message to a file and `git commit -F` — the Windows shells here mangle multi-line `-m`.)

---

## File structure

```
astro.config.mjs                  drop vue()
package.json / pnpm-workspace.yaml drop vue/gsap/cobe deps, add fontsource
src/style/main.css                design system (rewritten)
src/scripts/site.ts               navbar, mobile menu, counters, reveals, rail arrows
src/lib/articles.ts               getArticles(), formatDate(), imageAt()
src/content.config.ts             `articles` collection
src/content/articles/*.md         4 articles
src/data/site.ts                  brand, nav, contact, socials, footer, stats, all copy
src/data/units.ts                 4 units, logos imported from src/assets/units
src/assets/units/                 moved from public/units (git mv)
src/layouts/Layout.astro          head, nav, slot, footer, script
src/components/SiteNav.astro
src/components/SiteFooter.astro
src/components/SocialIcon.astro   name → icon component
src/components/PageHeader.astro   dark sub-page header
src/components/SectionHeading.astro
src/components/Stats.astro
src/components/MisiGrid.astro
src/components/CtaBand.astro
src/components/UnitCard.astro
src/components/ArticleCard.astro
src/pages/index.astro
src/pages/about.astro
src/pages/unit-usaha/index.astro
src/pages/unit-usaha/[slug].astro
src/pages/artikel/index.astro
src/pages/artikel/[slug].astro
src/pages/contact.astro
CLAUDE.md / AGENTS.md             rewritten (byte-identical)
```

---

### Task 1: Dependencies and config

**Files:**

- Modify: `package.json`, `pnpm-workspace.yaml`, `astro.config.mjs`
- Move: `public/units/` → `src/assets/units/`

**Interfaces:**

- Produces: `@fontsource-variable/outfit` importable; `src/assets/units/<slug>.png` importable as `ImageMetadata`.

- [ ] **Step 1: Remove unused deps, add the font**

```
pnpm remove @astrojs/vue vue @lucide/vue gsap cobe vue-use-spring
pnpm add @fontsource-variable/outfit
```

- [ ] **Step 2: Drop `vue-demi` from `pnpm-workspace.yaml`** so it reads:

```yaml
allowBuilds:
  esbuild: true
  sharp: true
minimumReleaseAgeExclude:
  - astro@7.2.7
```

- [ ] **Step 3: Rewrite `astro.config.mjs`**

```js
// @ts-check
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import robotsTxt from "astro-robots-txt"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  // Required by @astrojs/sitemap and used for canonical/OG absolute URLs.
  // Change before deploying.
  site: "http://localhost:4321",
  integrations: [sitemap(), robotsTxt()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
})
```

- [ ] **Step 4: Move the unit logos**

```
git mv public/units src/assets/units
```

(`public/units` is untracked, so if `git mv` refuses: `mkdir -p src/assets && mv public/units src/assets/units`.)

- [ ] **Step 5: Verify** — `pnpm install` succeeds; `ls node_modules/@fontsource-variable/outfit/index.css` exists; `ls src/assets/units | wc -l` is 24.

- [ ] **Step 6: Commit** — `chore: drop vue/gsap deps, add Outfit, move unit logos to assets`

---

### Task 2: Design system (`main.css`)

**Files:**

- Rewrite: `src/style/main.css`

**Interfaces:**

- Produces: colour tokens `ink body muted line mist sand lime flame white black`; component classes `site t-overline t-h1 t-eyebrow t-label t-body t-card t-h2 t-h2-bold t-h3 t-stat btn btn-light btn-ghost btn-ghost-ink btn-outline btn-ink btn-flame nav-link navbar rail rail-wrap edge-left logo-tile timeline tl-item tl-card tl-img field article-body grain anim d-title-1..3 d-divider d-label d-desc d-btn-1..2 d-1..4 hero-img veil`; reveal states `[data-reveal]` / `.is-visible`.

- [ ] **Step 1: Write the file**

```css
@import "tailwindcss";

/* ==========================================================================
   Amani Group — design system. Tailwind v4 is CSS-first: this file IS the
   theme. Tokens in @theme become utilities (bg-ink, text-muted, shadow-card…);
   the reusable classes live in @layer components so any utility on the same
   element wins (`t-body text-sm`, `btn px-7`).
   ========================================================================== */

@theme {
  --font-sans: "Outfit Variable", ui-sans-serif, system-ui, sans-serif;

  /* The palette is eight colours plus white/black. Tailwind's default ramp is
     reset so nothing on the page can reach for a colour that is not ours. */
  --color-*: initial;
  --color-white: #ffffff;
  --color-black: #000000;
  --color-ink: #141414; /* near-black: navbar, hero, CSR card, footer */
  --color-body: #1f1f1f; /* heading text */
  --color-muted: #6b6b6b; /* paragraph text */
  --color-line: #e3e3e3; /* hairline borders */
  --color-mist: #f4f4f4; /* light-grey section & card backgrounds */
  --color-sand: #e6ddd2; /* beige vision / CTA panels */
  --color-lime: #a3d65c; /* small square accents, focus ring */
  --color-flame: #f4511e; /* orange CTA, required-field asterisk */

  --shadow-card: 0 24px 60px -30px rgb(0 0 0 / 0.45);

  --ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);

  --animate-fade-up: fade-up 0.55s var(--ease-out-soft) forwards;
  --animate-fade-in: fade-in 0.6s ease 0.05s both;
  --animate-line-grow: line-grow 0.6s var(--ease-out-soft) 0.44s both;
  --animate-ken-burns: ken-burns 1.6s var(--ease-out-soft) both;

  @keyframes fade-up {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes line-grow {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
  @keyframes ken-burns {
    from {
      transform: scale(1.08) translateX(1.5%);
    }
    to {
      transform: scale(1) translateX(0);
    }
  }
}

@layer base {
  /* Viewport scale. Every size on the site is in rem, so scaling the root
     font-size scales the whole page. 16px is the baseline (360px up to 1080p);
     small phones shrink a little, and from 1920px up the page grows with the
     viewport so QHD / 4K screens do not get a sparse strip of tiny type.
       320px -> 14px | 360-1920px -> 16px | 2560px -> 20px | 3840px -> 28px */
  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }
  @media (max-width: 359px) {
    html {
      font-size: clamp(14px, 5vw - 2px, 16px);
    }
  }
  @media (min-width: 1920px) {
    html {
      font-size: clamp(16px, 0.625vw + 4px, 32px);
    }
  }

  /* Content container: full width on phones, then a share of the viewport that
     narrows as screens grow. --gutter is the space left on each side, used by
     full-bleed panels (`edge-left`, `rail`). */
  :root {
    --site-w: 100%;
    --gutter: 0px;
  }
  @media (min-width: 768px) {
    :root {
      --site-w: 90%;
      --gutter: 5vw;
    }
  }
  @media (min-width: 1024px) {
    :root {
      --site-w: 85%;
      --gutter: 7.5vw;
    }
  }
  @media (min-width: 1280px) {
    :root {
      --site-w: 75%;
      --gutter: 12.5vw;
    }
  }

  body {
    @apply bg-white font-sans text-body antialiased;
  }

  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible,
  summary:focus-visible {
    outline: 2px solid var(--color-lime);
    outline-offset: 3px;
  }
}

@layer components {
  /* The page measure. Replaces `mx-auto max-w-site px-6` everywhere. */
  .site {
    width: 100%;
    max-width: var(--site-w);
    margin-inline: auto;
    padding-inline: 1.5rem;
  }

  /* ---------- Type scale: one family, a handful of sizes ---------- */
  .t-overline {
    font-size: 0.875rem;
    font-weight: 300;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgb(255 255 255 / 0.6);
  }
  .t-h1 {
    font-size: clamp(2.25rem, 1.4rem + 2.6vw, 3.75rem);
    line-height: 1.08;
    font-weight: 300;
    letter-spacing: -0.025em;
  }
  .t-eyebrow {
    font-size: 1rem;
    font-weight: 300;
    color: var(--color-muted);
  }
  .t-label {
    font-size: 0.8125rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-muted);
  }
  .t-body {
    font-size: 1.0625rem;
    line-height: 1.65;
    font-weight: 300;
    color: var(--color-muted);
  }
  .t-card {
    font-size: 1.25rem;
    line-height: 1.35;
    font-weight: 400;
    color: var(--color-body);
  }
  .t-h2,
  .t-h2-bold {
    font-size: clamp(1.875rem, 1.3rem + 1.6vw, 2.5rem);
    line-height: 1.2;
    font-weight: 400;
    color: var(--color-body);
    letter-spacing: -0.01em;
  }
  .t-h2-bold {
    font-weight: 700;
  }
  .t-h3 {
    font-size: clamp(1.5rem, 1.2rem + 0.8vw, 1.875rem);
    line-height: 1.25;
    font-weight: 400;
    color: var(--color-body);
    letter-spacing: -0.01em;
  }
  .t-stat {
    font-size: clamp(2.25rem, 1.6rem + 2vw, 3.25rem);
    line-height: 1;
    font-weight: 400;
    color: var(--color-body);
    font-variant-numeric: tabular-nums;
  }

  /* Article body (rendered markdown) */
  .article-body {
    display: grid;
    gap: 1.5rem;
  }
  .article-body p {
    font-size: 1.125rem;
    line-height: 1.65;
    font-weight: 300;
    color: var(--color-muted);
  }

  /* ---------- Buttons ---------- */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-radius: 0.375rem;
    padding: 0.8rem 1.5rem;
    font-size: 0.9375rem;
    font-weight: 400;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      color 0.3s ease,
      border-color 0.3s ease,
      transform 0.3s ease;
  }
  .btn-light {
    background: var(--color-white);
    color: var(--color-ink);
    border: 1px solid var(--color-white);
  }
  .btn-light:hover {
    background: transparent;
    color: var(--color-white);
  }
  .btn-ghost {
    background: transparent;
    color: var(--color-white);
    border: 1px solid rgb(255 255 255 / 0.45);
  }
  .btn-ghost:hover {
    background: var(--color-white);
    color: var(--color-ink);
    border-color: var(--color-white);
  }
  /* Ghost button for light backgrounds */
  .btn-ghost-ink {
    background: transparent;
    color: var(--color-body);
    border: 1px solid rgb(20 20 20 / 0.3);
  }
  .btn-ghost-ink:hover {
    background: var(--color-ink);
    color: var(--color-white);
    border-color: var(--color-ink);
  }
  .btn-outline {
    background: var(--color-white);
    color: var(--color-body);
    border: 1px solid #dadada;
  }
  .btn-outline:hover {
    border-color: var(--color-body);
  }
  .btn-ink {
    background: var(--color-ink);
    color: var(--color-white);
    border: 1px solid var(--color-ink);
  }
  .btn-ink:hover {
    background: var(--color-black);
  }
  .btn-flame {
    background: var(--color-flame);
    color: var(--color-white);
    border: 1px solid var(--color-flame);
    box-shadow: 0 10px 30px -10px rgb(244 81 30 / 0.8);
  }
  .btn-flame:hover {
    background: #e2440f;
  }

  /* ---------- Navbar ---------- */
  .navbar {
    transition:
      background-color 0.35s ease,
      backdrop-filter 0.35s ease,
      border-color 0.35s ease;
  }
  .navbar.is-scrolled {
    background-color: rgb(20 20 20 / 0.92);
    backdrop-filter: blur(10px);
    border-color: rgb(255 255 255 / 0.08);
  }
  /* Nav links: underline that draws in from the left */
  .nav-link {
    position: relative;
  }
  .nav-link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;
    width: 100%;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.35s var(--ease-out-soft);
  }
  .nav-link:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
  .nav-link.is-active {
    color: var(--color-white);
  }
  .nav-link.is-active::after {
    transform: scaleX(1);
    transform-origin: left;
  }

  /* ---------- Horizontal article rail ---------- */
  /* Hidden scrollbar; bleeds to the right edge of the viewport from md up. */
  .rail {
    scrollbar-width: none;
    margin-right: -1.5rem;
    padding-right: 1.5rem;
  }
  .rail::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 768px) {
    .rail {
      margin-right: calc(-1 * (var(--gutter) + 1.5rem));
      padding-right: calc(var(--gutter) + 1.5rem);
    }
  }
  .rail-wrap {
    overflow-x: clip;
  }

  /* Container-aligned left edge for the full-bleed vision panel */
  .edge-left {
    padding-left: calc(var(--gutter) + 1.5rem);
  }

  /* Unit-usaha logo tile: the PNG lock-ups have mixed aspect ratios, so the
     tile is a fixed box and the image fits inside it. */
  .logo-tile {
    display: grid;
    place-items: center;
  }
  .logo-tile img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  /* Hero grain plate */
  .grain {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.7%22/></svg>");
  }

  /* ---------- Company timeline (about page) ---------- */
  /* Vertical spine; entries alternate sides on md+. */
  .timeline {
    --tl-x: 0.5rem;
    --tl-dot: 0.75rem;
  }
  .timeline::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--tl-x);
    width: 1px;
    background: linear-gradient(
      to bottom,
      var(--color-line) 0%,
      var(--color-line) 85%,
      transparent 100%
    );
  }
  .tl-item {
    position: relative;
    padding-left: 2.75rem;
  }
  .tl-item + .tl-item {
    margin-top: 3.5rem;
  }
  .tl-item::before {
    /* dot on the spine */
    content: "";
    position: absolute;
    top: 0.85rem;
    left: calc(var(--tl-x) - var(--tl-dot) / 2);
    width: var(--tl-dot);
    height: var(--tl-dot);
    border-radius: 999px;
    background: var(--color-ink);
    box-shadow:
      0 0 0 4px var(--color-white),
      0 0 0 5px var(--color-line);
  }
  .tl-item::after {
    /* short connector from the dot to the entry */
    content: "";
    position: absolute;
    top: calc(0.85rem + var(--tl-dot) / 2);
    left: calc(var(--tl-x) + var(--tl-dot) / 2 + 4px);
    width: 1.25rem;
    height: 1px;
    background: var(--color-line);
  }
  .tl-item:last-child::before {
    background: var(--color-lime);
  }
  .tl-img img {
    transition: transform 0.7s var(--ease-out-soft);
  }
  .tl-item:hover .tl-img img {
    transform: scale(1.04);
  }
  @media (min-width: 768px) {
    .timeline {
      --tl-x: 50%;
    }
    .tl-item {
      width: 50%;
      padding-left: 0;
    }
    /* entries carry an image, so pull each one up to interleave with the
       previous (opposite-side) entry instead of leaving a blank half-row */
    .tl-item + .tl-item {
      margin-top: -5rem;
    }
    .tl-item:nth-child(odd) {
      padding-right: 3.5rem;
      text-align: right;
    }
    .tl-item:nth-child(even) {
      margin-left: 50%;
      padding-left: 3.5rem;
    }
    .tl-item:nth-child(odd)::before {
      left: auto;
      right: calc(-1 * var(--tl-dot) / 2);
    }
    .tl-item:nth-child(even)::before {
      left: calc(-1 * var(--tl-dot) / 2);
    }
    .tl-item:nth-child(odd)::after {
      left: auto;
      right: calc(var(--tl-dot) / 2 + 4px);
    }
    .tl-item:nth-child(even)::after {
      left: calc(var(--tl-dot) / 2 + 4px);
    }
    .tl-card {
      max-width: 28rem;
    }
    .tl-item:nth-child(odd) .tl-card {
      margin-left: auto;
    }
  }

  /* ---------- Form fields ---------- */
  .field {
    width: 100%;
    border: 1px solid #dadada;
    border-radius: 0.375rem;
    background: var(--color-white);
    padding: 0.85rem 1rem;
    font-size: 1rem;
    font-weight: 300;
    color: var(--color-body);
    transition: border-color 0.25s ease;
  }
  .field:focus {
    outline: none;
    border-color: var(--color-ink);
  }
  .field::placeholder {
    color: #a3a3a3;
  }

  /* ---------- Load-time entrances (hero and page headers) ---------- */
  .anim {
    opacity: 0;
    animation: var(--animate-fade-up);
  }
  /* sequenced hero entrance — fast but readable */
  .d-title-1 {
    animation-delay: 0.1s;
  }
  .d-title-2 {
    animation-delay: 0.22s;
  }
  .d-title-3 {
    animation-delay: 0.34s;
  }
  .d-divider {
    animation: var(--animate-line-grow);
    transform-origin: left;
  }
  .d-label {
    animation-delay: 0.52s;
  }
  .d-desc {
    animation-delay: 0.62s;
  }
  .d-btn-1 {
    animation-delay: 0.72s;
  }
  .d-btn-2 {
    animation-delay: 0.8s;
  }
  /* sub-page headers: plain top-to-bottom order */
  .d-1 {
    animation-delay: 0.1s;
  }
  .d-2 {
    animation-delay: 0.25s;
  }
  .d-3 {
    animation-delay: 0.4s;
  }
  .d-4 {
    animation-delay: 0.55s;
  }
  .hero-img {
    animation: var(--animate-ken-burns);
  }
  .veil {
    animation: var(--animate-fade-in);
  }

  /* ---------- Scroll reveals ---------- */
  /* `data-reveal` starts hidden; src/scripts/site.ts adds `.is-visible` when the
     element enters the viewport. Same speed, curve and travel as the hero. */
  [data-reveal] {
    opacity: 0;
    transform: translate3d(0, 24px, 0);
    transition:
      opacity 0.55s var(--ease-out-soft),
      transform 0.55s var(--ease-out-soft);
  }
  [data-reveal].is-visible {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .anim,
  .d-divider,
  .hero-img,
  .veil {
    animation: none !important;
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 2: Verify** — `pnpm exec oxfmt src/style/main.css` runs clean (it may reflow; that's fine). A build is not possible yet (no pages); the CSS is exercised in Task 5.

- [ ] **Step 3: Commit** — `feat: Tailwind v4 design system for Amani Group`

---

### Task 3: Data — `site.ts`, `units.ts`, articles collection, `lib/articles.ts`

**Files:**

- Create: `src/data/site.ts`, `src/data/units.ts`, `src/content.config.ts`, `src/content/articles/{rotasi-manajer-satu-tahun,cabang-ketujuh-tanpa-utang,satu-format-laporan-empat-unit,pemasok-lokal-rantai-grup}.md`, `src/lib/articles.ts`

**Interfaces:**

- Produces (site.ts): `brand`, `navLinks`, `contact`, `socials`, `footerColumns`, `stats`, `hero`, `visi`, `misi`, `unitUsahaIntro`, `testimonials`, `csr`, `artikelIntro`, `investorCta`, `kemitraanCta`, `timeline`, `team`, `contactTopics`, `pageHeaders`, `contactPage`; types `SocialIconName`, `Cta`.
- Produces (units.ts): `Unit` type, `units: Unit[]`, `getUnit(slug)`.
- Produces (lib/articles.ts): `Article` type, `getArticles()`, `formatDate(d)`, `imageAt(url, w)`.

- [ ] **Step 1: `src/data/site.ts`**

```ts
// Every piece of copy on the site. Markup stays copy-free; edit here.

export type SocialIconName = "instagram" | "linkedin" | "youtube" | "whatsapp"

export interface Cta {
  label: string
  href: string
}

export const brand = {
  name: "Amani Group",
  mark: "A",
  description:
    "Amani Group mengelola empat unit usaha di tujuh cabang di bawah satu standar tata kelola.",
}

export const navLinks: Cta[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Unit Usaha", href: "/unit-usaha" },
  { label: "Artikel", href: "/artikel" },
]

export const contact = {
  address: ["Ruko Bumi Asri Jl. Cikiray Kidul No.A6, Sukamanah, Kec. Cisaat, Kabupaten Sukabumi", "Jawa Barat 43152"],
  email: "badiuzzamanciptaamani@gmail.com",
  investorEmail: "admin@badiuzzaman.com",
  phone: "+62 851 7826 1908",
  whatsapp: "https://wa.me/6285178261908",
  whatsappPrefilled:
    "https://wa.me/6285178261908?text=Halo%20PT%20Badiuzzaman%2C%20saya%20ingin%20bertanya%20mengenai%20",
  instagramHandle: "@badiuzzamanentrepreneur",
  instagram: "https://instagram.com/badiuzzamanentrepreneur",
  hours: ["Senin – Jumat", "08.00 – 17.00 WIB"],
}

export const socials: { label: string; href: string; icon: SocialIconName }[] = [
  { label: "Instagram", href: "https://instagram.com/badiuzzamanentrepreneur", icon: "instagram" },
  // {
  //   label: "LinkedIn",
  //   href: "https://linkedin.com/company/amanigroup",
  //   icon: "linkedin",
  // },
  { label: "WhatsApp", href: "https://wa.me/6285178261908", icon: "whatsapp" },
]

export const footerColumns: { title: string; links: Cta[] }[] = [
  {
    title: "Menu",
    links: [
      { label: "Tentang kami", href: "/about" },
      { label: "Visi & misi", href: "/about#misi" },
      { label: "Tim manajemen", href: "/about#tim" },
      { label: "Artikel", href: "/artikel" },
    ],
  },
  {
    title: "Unit usaha",
    links: [
      { label: "Amani Laundry", href: "/unit-usaha/amani-laundry" },
      { label: "Amani Karpet", href: "/unit-usaha/amani-karpet" },
      { label: "Warkop Amani", href: "/unit-usaha/warkop-amani" },
      { label: "PAT", href: "/unit-usaha/pat" },
    ],
  },
  {
    title: "Hubungi",
    links: [
      { label: "Relasi investor", href: "/contact?topic=investor" },
      { label: "Karier", href: "/contact?topic=karier" },
      { label: "Kemitraan pemasok", href: "/contact?topic=pemasok" },
      { label: "Media", href: "/contact?topic=media" },
    ],
  },
]

export const legalLinks: Cta[] = [
  { label: "Kebijakan privasi", href: "#" },
  { label: "Syarat & ketentuan", href: "#" },
]

export const stats: { value: number; suffix?: string; label: string }[] = [
  { value: 4, label: "Unit usaha aktif" },
  { value: 7, label: "Cabang beroperasi" },
  { value: 50, suffix: " M", label: "Nilai aset dikelola" },
  { value: 5000, label: "Pelanggan dilayani" },
]

export const hero = {
  lines: ["Tata Kelola Disiplin,", "Pertumbuhan yang", "Terukur"],
  label: "Grup usaha",
  description:
    "Amani Group mengelola empat unit usaha di tujuh cabang di bawah satu standar tata kelola. Setiap unit dijalankan dengan disiplin keuangan, pengawasan internal, dan target pertumbuhan yang terukur.",
  image:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1800&auto=format&fit=crop",
  primary: { label: "Lihat Unit Usaha", href: "/unit-usaha" } satisfies Cta,
  secondary: { label: "Tentang Amani Group", href: "/about" } satisfies Cta,
}

export const visi = {
  eyebrow: "Visi kami",
  statement:
    "Menjadi perusahaan induk yang menghadirkan manfaat nyata melalui layanan berstandar tinggi, serta berkontribusi secara berkelanjutan terhadap penguatan perekonomian masyarakat.",
  // The about page sets two phrases in a heavier weight.
  segments: [
    { text: "Menjadi perusahaan induk yang menghadirkan " },
    { text: "manfaat nyata", strong: true },
    { text: " melalui layanan berstandar tinggi, serta berkontribusi secara " },
    { text: "berkelanjutan", strong: true },
    { text: " terhadap penguatan perekonomian masyarakat." },
  ],
  intro:
    "Satu kalimat yang menjadi tolok ukur setiap keputusan: pembukaan cabang, pembentukan unit usaha baru, hingga pemilihan pemasok.",
  pillars: [
    {
      title: "Layanan berstandar tinggi",
      body: "Prosedur baku yang sama di setiap unit dan cabang, diukur dan diaudit secara berkala.",
    },
    {
      title: "Manfaat nyata",
      body: "Nilai yang dirasakan langsung oleh pelanggan, karyawan, dan mitra pemasok, bukan sekadar angka pada laporan.",
    },
    {
      title: "Kontribusi berkelanjutan",
      body: "Pertumbuhan yang dibiayai oleh kinerja dan mengutamakan pemasok lokal, sehingga manfaatnya bertahan lama.",
    },
  ],
}

export const misi = {
  title: "Misi Kami",
  intro:
    "Empat komitmen yang menjadi kerangka kerja seluruh unit usaha Amani Group. Setiap komitmen diterjemahkan menjadi prosedur baku, diukur secara berkala, dan menjadi dasar pengambilan keputusan manajemen.",
  items: [
    {
      title: "Permodalan bertahap",
      body: "Pendanaan disalurkan secara bertahap berdasarkan capaian kinerja. Setiap unit memperoleh modal sesuai kemampuannya menghasilkan pendapatan yang terverifikasi.",
      image:
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Satu standar tata kelola",
      body: "Standar pelaporan keuangan, audit internal, dan kepatuhan yang seragam diterapkan tanpa pengecualian di seluruh unit dan cabang.",
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Pengembangan talenta lintas unit",
      body: "Program rotasi manajemen yang terstruktur memastikan kompetensi yang terbentuk di satu unit menjadi aset seluruh grup.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Sinergi rantai pasok",
      body: "Kebutuhan pengadaan, logistik, dan bahan baku dipenuhi secara internal antarunit, sehingga nilai tambah tetap berada di dalam grup.",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    },
  ],
}

export const unitUsahaIntro = {
  title: "Unit Usaha",
  intro:
    "Amani Group menaungi empat unit usaha yang beroperasi di tujuh cabang. Setiap unit menjalankan model bisnisnya masing-masing di bawah standar tata kelola, pengelolaan talenta, dan rantai pasok yang sama.",
}

export const testimonials = {
  title: "Testimoni Klien",
  intro:
    "Penilaian dari klien yang menggunakan lebih dari satu layanan Amani Group. Satu kontrak, satu narahubung, dan standar pelayanan yang sama di seluruh unit usaha.",
  items: [
    {
      quote:
        "Sejak 2024 seluruh linen hotel kami ditangani Amani Laundry dan karpet lobi dirawat Amani Karpet. Jadwal penyelesaian selalu ditepati dan laporan kualitas disampaikan setiap bulan tanpa perlu diminta.",
      name: "Rahmat Hidayat",
      role: "Manajer Operasional, Hotel Sekar Wangi",
      units: ["Amani Laundry", "Amani Karpet"],
    },
    {
      quote:
        "Kami menggunakan Amani Karpet untuk perawatan karpet masjid dan PAT untuk pengadaan perlengkapan rutin. Administrasi tertib, harga transparan, dan setiap pekerjaan didokumentasikan dengan berita acara.",
      name: "Ir. Budi Santoso",
      role: "Ketua Takmir, Masjid Al-Ikhlas",
      units: ["Amani Karpet", "PAT"],
    },
    {
      quote:
        "Warkop Amani menjadi mitra konsumsi rapat kami, sementara seragam karyawan dikelola Amani Laundry. Satu kontrak, satu narahubung, dan standar pelayanan yang konsisten di kedua unit.",
      name: "Dewi Anggraini",
      role: "Head of People, PT Solusi Digital Nusantara",
      units: ["Warkop Amani", "Amani Laundry"],
    },
  ],
}

export const csr = {
  title: "Tumbuh Bersama Masyarakat",
  body: "Program tanggung jawab sosial Amani Group dijalankan di setiap cabang: pelatihan kerja bagi warga sekitar, kemitraan dengan pemasok lokal, dan dukungan pendidikan bagi keluarga karyawan. Dampak setiap program diukur dan dilaporkan secara berkala.",
  cta: { label: "Lihat Program CSR", href: "/contact?topic=csr" } satisfies Cta,
}

export const artikelIntro = {
  title: "Artikel",
  intro:
    "Catatan manajemen mengenai pengelolaan unit usaha, pembentukan tim, dan pembelajaran dari setiap cabang yang dibuka.",
  cta: { label: "Semua Artikel", href: "/artikel" } satisfies Cta,
  listTitle: "Seluruh artikel",
  listIntro:
    "Catatan keputusan, evaluasi program, dan pembelajaran manajemen dari pengelolaan empat unit usaha di tujuh cabang.",
  author: "Manajemen Amani Group",
}

export const investorCta = {
  eyebrow: "Investor",
  heading:
    "Amani Group membuka kesempatan bagi investor yang mengutamakan pertumbuhan bertahap, tata kelola yang jelas, dan pelaporan yang transparan.",
  cta: { label: "Informasi Investor", href: "/contact?topic=investor" } satisfies Cta,
  note: "Tanggapan diberikan dalam 2 hari kerja.",
}

export const kemitraanCta = {
  eyebrow: "Kemitraan",
  heading:
    "Membutuhkan lebih dari satu layanan? Amani Group menyediakan satu kontrak dan satu narahubung untuk seluruh unit usaha.",
  cta: { label: "Hubungi Kami", href: "/contact?topic=kemitraan" } satisfies Cta,
  note: "Tanggapan diberikan dalam 2 hari kerja.",
}

export const timeline = {
  title: "Perjalanan Perusahaan",
  intro:
    "Sepuluh tahun pertumbuhan yang dibangun secara bertahap. Setiap unit dan cabang baru dibuka setelah unit sebelumnya memenuhi indikator kinerja yang ditetapkan.",
  items: [
    {
      year: "2022",
      title: "Amani Laundry didirikan",
      body: "Cabang pertama dibuka di Jakarta Selatan dengan fokus pada segmen rumah tangga dan hunian kos. Prosedur operasional baku disusun sejak hari pertama.",
      image:
        "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=800&q=80",
      alt: "Cabang pertama Amani Laundry",
    },
    {
      year: "2018",
      title: "Ekspansi ke cabang kedua dan ketiga",
      body: "Dua cabang tambahan dibuka setelah cabang pertama mencatat arus kas positif selama dua belas bulan berturut-turut. Kontrak pertama dengan klien perhotelan ditandatangani.",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      alt: "Cabang kedua dan ketiga Amani Laundry",
    },
    {
      year: "2019",
      title: "Amani Karpet mulai beroperasi",
      body: "Permintaan pencucian karpet dari klien laundry menjadi dasar pembentukan unit kedua, dengan fasilitas dan mesin pengering industri tersendiri.",
      image:
        "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=800&q=80",
      alt: "Fasilitas pencucian karpet Amani Karpet",
    },
    {
      year: "2021",
      title: "Warkop Amani dibuka",
      body: "Unit ketiga dikembangkan sebagai kedai kopi dengan standar kebersihan dan konsistensi layanan yang sama dengan unit jasa.",
      image:
        "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=800&q=80",
      alt: "Kedai Warkop Amani",
    },
    {
      year: "2022",
      title: "Pembentukan Amani Group",
      body: "Ketiga unit dikonsolidasikan di bawah satu perusahaan induk. Satu standar tata kelola, bagan akun, dan mekanisme audit internal diberlakukan untuk seluruh unit.",
      image:
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
      alt: "Kantor pusat Amani Group",
    },
    {
      year: "2023",
      title: "PAT dibentuk",
      body: "Fungsi pengadaan dan logistik seluruh unit dipusatkan pada unit keempat, dengan kebijakan prioritas pemasok lokal terverifikasi.",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      alt: "Gudang dan logistik PAT",
    },
    {
      year: "2025",
      title: "Program rotasi manajemen",
      body: "Rotasi manajer antarunit ditetapkan sebagai program tetap dengan siklus dua belas bulan, disertai dokumen serah terima dan laporan pembelajaran.",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      alt: "Program rotasi manajemen",
    },
    {
      year: "2026",
      title: "Cabang ketujuh beroperasi",
      body: "Cabang ketiga Amani Laundry dibuka di Depok, sepenuhnya dibiayai dari laba ditahan dan alokasi modal bertahap tanpa pinjaman perbankan.",
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
      alt: "Cabang ketujuh di Depok",
    },
  ],
}

export const team = {
  title: "Tim Manajemen",
  intro:
    "Direksi Amani Group bertanggung jawab atas penetapan standar, pengawasan kinerja unit, dan pengambilan keputusan alokasi modal.",
  members: [
    {
      name: "Ahmad Fauzi",
      role: "Direktur Utama",
      bio: "Pendiri Amani Laundry. Bertanggung jawab atas arah strategis grup dan keputusan alokasi modal.",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Siti Nurhaliza",
      role: "Direktur Keuangan",
      bio: "Menetapkan standar pelaporan keuangan grup dan memimpin fungsi audit internal di seluruh unit.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Rizky Pratama",
      role: "Direktur Operasional",
      bio: "Mengawasi prosedur operasional baku seluruh cabang dan memimpin program rotasi manajemen.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Maya Kartika",
      role: "Direktur Pengembangan Usaha",
      bio: "Bertanggung jawab atas kemitraan korporasi, relasi investor, dan evaluasi peluang unit usaha baru.",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    },
  ],
}

export const pageHeaders = {
  about: {
    eyebrow: "Tentang kami",
    title: "Perusahaan induk dengan disiplin tata kelola sebagai fondasi.",
    lead: "Amani Group didirikan untuk menaungi unit-unit usaha yang tumbuh dari satu standar yang sama: keuangan yang tertib, pengawasan internal yang konsisten, dan pertumbuhan yang dibiayai oleh kinerja, bukan oleh utang.",
  },
  unitUsaha: {
    eyebrow: "Amani Group",
    title: "Unit Usaha",
    lead: unitUsahaIntro.intro,
  },
}

export const contactTopics: { value: string; label: string }[] = [
  { value: "layanan", label: "Layanan unit usaha" },
  { value: "kemitraan", label: "Kemitraan korporasi" },
  { value: "investor", label: "Relasi investor" },
  { value: "pemasok", label: "Kemitraan pemasok" },
  { value: "karier", label: "Karier" },
  { value: "csr", label: "Program CSR" },
  { value: "media", label: "Media" },
  { value: "lainnya", label: "Lainnya" },
]

export const contactPage = {
  title: "Formulir Kontak",
  intro:
    "Setelah menekan tombol kirim, aplikasi email Anda akan terbuka dengan pesan yang telah terisi. Pastikan pesan terkirim dari aplikasi email tersebut.",
  privacy: "Data yang Anda kirimkan hanya digunakan untuk menanggapi permintaan ini.",
  error: "Lengkapi seluruh kolom yang wajib diisi dengan alamat email yang valid.",
  channelsTitle: "Saluran langsung",
  channelsIntro:
    "Untuk tanggapan yang lebih cepat, hubungi kami melalui saluran berikut pada jam kerja.",
}

export const seo = {
  home: {
    title: "Amani Group — Tata Kelola Disiplin, Pertumbuhan Terukur",
    description: brand.description,
  },
  about: {
    title: "Tentang Kami — Amani Group",
    description:
      "Amani Group adalah perusahaan induk dengan disiplin tata kelola sebagai fondasi: visi, misi, perjalanan perusahaan, dan tim manajemen.",
  },
  unitUsaha: {
    title: "Unit Usaha — Amani Group",
    description:
      "Empat unit usaha Amani Group: Amani Laundry, Amani Karpet, Warkop Amani, dan PAT.",
  },
  artikel: {
    title: "Artikel — Amani Group",
    description:
      "Catatan manajemen Amani Group mengenai tata kelola, keuangan, talenta, dan rantai pasok.",
  },
  contact: {
    title: "Hubungi Kami — Amani Group",
    description: "Hubungi Amani Group melalui formulir email, WhatsApp, atau Instagram.",
  },
}
```

- [ ] **Step 2: `src/data/units.ts`**

```ts
import type { ImageMetadata } from "astro"
import amaniKarpet from "@/assets/units/amani-karpet.png"
import amaniLaundry from "@/assets/units/amani-laundry.png"
import pat from "@/assets/units/pat.png"
import warkopAmani from "@/assets/units/warkop-amani.png"
import type { SocialIconName } from "@/data/site"

// Unit usaha data — single source for the listing and the detail pages.
// Logos are the full-colour lock-ups from src/assets/units; the `-black` siblings
// there are unused but kept as the pair every new unit is expected to ship.

export interface Unit {
  slug: string
  name: string
  sector: string
  logo: ImageMetadata
  summary: string
  description: string[]
  facts: [label: string, value: string][]
  website: string
  socials: { label: string; href: string; icon: SocialIconName }[]
}

export const units: Unit[] = [
  {
    slug: "amani-laundry",
    name: "Amani Laundry",
    sector: "Jasa pencucian dan perawatan tekstil",
    logo: amaniLaundry,
    summary:
      "Layanan pencucian, penyetrikaan, dan perawatan tekstil untuk segmen rumah tangga, hunian kos, perhotelan, dan fasilitas kesehatan dengan jaminan waktu penyelesaian.",
    description: [
      "Amani Laundry adalah unit usaha pertama Amani Group dan menjadi acuan standar operasional bagi unit-unit berikutnya. Seluruh proses, mulai dari penerimaan, penyortiran, pencucian, hingga penyerahan, dijalankan berdasarkan prosedur baku yang terdokumentasi dan diaudit secara berkala.",
      "Layanan tersedia untuk segmen rumah tangga, hunian kos, perhotelan, dan fasilitas kesehatan. Untuk klien korporasi, Amani Laundry menyediakan perjanjian tingkat layanan (SLA) dengan jadwal penjemputan tetap, laporan kualitas bulanan, dan satu narahubung khusus.",
    ],
    facts: [
      ["Berdiri", "2022"],
      ["Cabang", "3 cabang"],
      ["Segmen", "Rumah tangga, kos, hotel, klinik"],
    ],
    website: "https://laundry.amanigroup.co.id",
    socials: [
      {
        label: "Instagram",
        href: "https://instagram.com/amanilaundry",
        icon: "instagram",
      },
      { label: "WhatsApp", href: "https://wa.me/62215550123", icon: "whatsapp" },
    ],
  },
  {
    slug: "amani-karpet",
    name: "Amani Karpet",
    sector: "Jasa pencucian dan perawatan karpet",
    logo: amaniKarpet,
    summary:
      "Layanan pencucian dan perawatan karpet untuk masjid, perkantoran, dan hunian, mencakup penjemputan serta pengantaran kembali ke lokasi.",
    description: [
      "Amani Karpet menangani pencucian dan perawatan karpet berukuran besar yang tidak dapat ditangani oleh fasilitas laundry umum. Fasilitas pencucian dilengkapi mesin pengering industri sehingga waktu penyelesaian dapat dipastikan sejak awal pemesanan.",
      "Klien utama unit ini adalah pengurus masjid, pengelola gedung perkantoran, dan hunian. Setiap pekerjaan didokumentasikan dengan foto sebelum dan sesudah, serta berita acara serah terima yang ditandatangani kedua pihak.",
    ],
    facts: [
      ["Berdiri", "2019"],
      ["Cabang", "2 cabang"],
      ["Segmen", "Masjid, perkantoran, hunian"],
    ],
    website: "https://karpet.amanigroup.co.id",
    socials: [
      {
        label: "Instagram",
        href: "https://instagram.com/amanikarpet",
        icon: "instagram",
      },
      { label: "WhatsApp", href: "https://wa.me/62215550123", icon: "whatsapp" },
    ],
  },
  {
    slug: "warkop-amani",
    name: "Warkop Amani",
    sector: "Kedai kopi dan layanan konsumsi",
    logo: warkopAmani,
    summary:
      "Kedai kopi dengan menu harian berharga terjangkau, ruang yang layak untuk bekerja dan bertemu, serta pasokan bahan baku dari mitra lokal terverifikasi.",
    description: [
      "Warkop Amani dikembangkan sebagai kedai kopi dengan standar kebersihan, konsistensi rasa, dan pelayanan yang terukur. Seluruh bahan baku dipasok melalui PAT dari mitra lokal yang telah melalui proses verifikasi mutu.",
      "Selain layanan kedai, Warkop Amani menyediakan layanan konsumsi rapat dan acara untuk klien korporasi dengan kontrak berkala, sehingga kebutuhan konsumsi dapat direncanakan dan dianggarkan secara pasti.",
    ],
    facts: [
      ["Berdiri", "2021"],
      ["Cabang", "1 cabang"],
      ["Segmen", "Umum, korporasi"],
    ],
    website: "https://warkop.amanigroup.co.id",
    socials: [
      {
        label: "Instagram",
        href: "https://instagram.com/warkopamani",
        icon: "instagram",
      },
      { label: "WhatsApp", href: "https://wa.me/62215550123", icon: "whatsapp" },
    ],
  },
  {
    slug: "pat",
    name: "PAT",
    sector: "Pengadaan, logistik, dan pasokan lintas unit",
    logo: pat,
    summary:
      "Unit pendukung yang mengelola pengadaan, logistik, dan pasokan lintas unit agar kebutuhan operasional grup terpenuhi secara internal dan terkendali.",
    description: [
      "PAT dibentuk untuk memusatkan fungsi pengadaan dan logistik seluruh unit usaha Amani Group. Dengan konsolidasi pembelian, grup memperoleh posisi tawar yang lebih baik terhadap pemasok dan pengendalian mutu bahan yang lebih ketat.",
      "PAT juga melayani klien eksternal untuk pengadaan perlengkapan rutin dan jasa logistik. Seluruh transaksi didukung dokumen penawaran, kontrak, dan laporan penyerahan yang lengkap.",
    ],
    facts: [
      ["Berdiri", "2023"],
      ["Cabang", "1 cabang"],
      ["Segmen", "Internal grup, korporasi, institusi"],
    ],
    website: "https://pat.amanigroup.co.id",
    socials: [
      {
        label: "LinkedIn",
        href: "https://linkedin.com/company/amanigroup",
        icon: "linkedin",
      },
      { label: "WhatsApp", href: "https://wa.me/62215550123", icon: "whatsapp" },
    ],
  },
]

export const getUnit = (slug: string) => units.find((u) => u.slug === slug)
```

- [ ] **Step 3: `src/content.config.ts`**

```ts
import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { defineCollection } from "astro:content"

// Articles: one markdown file per article in src/content/articles. The file name
// is the slug (`/artikel/<id>`); the body is the article.
const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    excerpt: z.string(),
    image: z.url(),
  }),
})

export const collections = { articles }
```

- [ ] **Step 4: The four articles** (`src/content/articles/<slug>.md`)

`rotasi-manajer-satu-tahun.md`:

```md
---
title: "Rotasi manajer: hasil evaluasi setelah satu tahun"
date: 2026-08-12
category: Manajemen
excerpt: Tiga manajer dipindahkan antarunit selama dua belas bulan. Berikut hasil evaluasi program dan penyesuaian yang ditetapkan untuk periode berikutnya.
image: https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80
---

Pada Agustus 2025, Amani Group memulai program rotasi manajemen dengan memindahkan tiga manajer unit ke unit yang berbeda selama dua belas bulan. Program ini dirancang untuk memastikan kompetensi operasional yang terbentuk di satu unit dapat diterapkan di unit lain, sekaligus mengurangi ketergantungan grup pada individu tertentu.

Evaluasi dilakukan pada tiga aspek: kualitas laporan keuangan unit, ketepatan pelaksanaan prosedur baku, dan tingkat kepuasan pelanggan. Ketiga unit yang menerima manajer rotasi mencatat peningkatan ketepatan pelaporan dari 82% menjadi 96%, tanpa penurunan pada indikator kepuasan pelanggan.

Temuan utama adalah bahwa praktik terbaik di Amani Laundry mengenai penjadwalan penjemputan dapat diadopsi langsung oleh Amani Karpet, sementara sistem pengendalian persediaan Warkop Amani menjadi dasar penyempurnaan prosedur PAT.

Berdasarkan hasil ini, manajemen menetapkan rotasi sebagai program tetap dengan siklus dua belas bulan. Setiap manajer yang dirotasi diwajibkan menyusun dokumen serah terima dan laporan pembelajaran yang menjadi bagian dari basis pengetahuan grup.
```

`cabang-ketujuh-tanpa-utang.md`:

```md
---
title: Membuka cabang ketujuh tanpa pendanaan utang
date: 2026-07-28
category: Keuangan
excerpt: Mekanisme permodalan bertahap memungkinkan ekspansi dibiayai dari arus kas unit, dengan pengendalian risiko yang tetap terjaga.
image: https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80
---

Cabang ketujuh Amani Group, yaitu cabang ketiga Amani Laundry di Depok, mulai beroperasi pada Juli 2026. Seluruh biaya pendirian dibiayai dari laba ditahan unit dan alokasi modal bertahap dari grup, tanpa pinjaman perbankan.

Mekanisme permodalan bertahap mensyaratkan setiap unit memenuhi tiga indikator sebelum memperoleh alokasi modal ekspansi: rasio arus kas operasional positif selama enam bulan berturut-turut, tingkat retensi pelanggan di atas 70%, dan hasil audit internal tanpa temuan material.

Amani Laundry memenuhi seluruh indikator pada kuartal pertama 2026. Alokasi modal kemudian dicairkan dalam tiga tahap yang dikaitkan dengan capaian pembangunan, perekrutan, dan pencapaian target pendapatan bulan pertama.

Pendekatan ini memperlambat laju ekspansi dibandingkan pendanaan utang, namun memastikan setiap cabang baru berdiri di atas kinerja yang terbukti. Manajemen menilai pendekatan ini sebagai standar yang akan dipertahankan untuk seluruh rencana ekspansi grup.
```

`satu-format-laporan-empat-unit.md`:

```md
---
title: Satu format laporan untuk empat unit yang berbeda
date: 2026-07-09
category: Tata kelola
excerpt: "Penyeragaman laporan keuangan laundry, karpet, kedai kopi, dan pengadaan: kendala yang dihadapi dan standar yang akhirnya ditetapkan."
image: https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80
---

Empat unit usaha Amani Group beroperasi pada sektor yang berbeda, dengan struktur biaya dan siklus pendapatan yang tidak sama. Sebelum 2024, setiap unit menyusun laporan dengan format masing-masing sehingga konsolidasi di tingkat grup memerlukan penyesuaian manual yang memakan waktu dan rawan kesalahan.

Manajemen menetapkan satu bagan akun standar yang berlaku untuk seluruh unit, dengan sub-akun khusus yang hanya diaktifkan bila relevan dengan sektor unit tersebut. Laporan bulanan disusun dalam satu format tetap: laporan laba rugi, arus kas, posisi keuangan, dan indikator operasional utama.

Kendala terbesar adalah pada pengakuan pendapatan Amani Karpet yang bersifat proyek dan pengelolaan persediaan Warkop Amani yang bersifat harian. Kedua hal ini diselesaikan dengan kebijakan akuntansi tertulis yang disahkan oleh direksi.

Sejak format tunggal diberlakukan, waktu konsolidasi laporan grup berkurang dari empat belas hari menjadi lima hari kerja, dan seluruh laporan dapat diaudit dengan kertas kerja yang sama.
```

`pemasok-lokal-rantai-grup.md`:

```md
---
title: Pemasok lokal sebagai bagian dari rantai pasok grup
date: 2026-06-21
category: Rantai pasok
excerpt: Alasan Amani Group membina pemasok di sekitar setiap cabang, dan standar verifikasi yang diberlakukan sebelum kemitraan disepakati.
image: https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80
---

Melalui PAT, Amani Group menetapkan kebijakan untuk memprioritaskan pemasok yang berlokasi dalam radius operasional cabang. Kebijakan ini bertujuan menekan biaya logistik, mempercepat waktu pasok, dan memperkuat perekonomian di sekitar lokasi usaha.

Setiap calon pemasok wajib melalui proses verifikasi yang mencakup legalitas usaha, kapasitas produksi, standar kebersihan, dan konsistensi mutu selama masa percobaan tiga bulan. Hanya pemasok yang memenuhi seluruh kriteria yang ditetapkan sebagai mitra tetap.

Hingga pertengahan 2026, 68% kebutuhan bahan baku Warkop Amani dan 100% kebutuhan bahan kimia pencucian Amani Laundry dipasok oleh mitra lokal terverifikasi. Seluruh mitra dievaluasi setiap semester berdasarkan ketepatan pengiriman dan tingkat penolakan barang.

Kemitraan dengan pemasok lokal merupakan bagian dari misi sinergi rantai pasok dan program tanggung jawab sosial grup, serta menjadi salah satu indikator yang dilaporkan kepada pemegang saham setiap tahun.
```

- [ ] **Step 5: `src/lib/articles.ts`**

```ts
import { getCollection, type CollectionEntry } from "astro:content"

export type Article = CollectionEntry<"articles">

/** All articles, newest first. The first one is the featured article. */
export async function getArticles(): Promise<Article[]> {
  const all = await getCollection("articles")
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

// Dates are stored as calendar days; format in UTC so the day never shifts.
const dateFormat = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

export const formatDate = (date: Date) => dateFormat.format(date)

/** Rewrite the `w=` of an Unsplash URL so cards fetch a smaller rendition. */
export const imageAt = (url: string, width: number) => url.replace(/w=\d+/, `w=${width}`)
```

- [ ] **Step 6: Verify** — `pnpm astro sync` then `pnpm astro check` reports no errors in `src/data`, `src/lib`, `src/content.config.ts` (there are no pages yet, so nothing else is checked).

- [ ] **Step 7: Commit** — `feat: site copy, unit data and articles collection`

---

### Task 4: Site script

**Files:**

- Create: `src/scripts/site.ts`

**Interfaces:**

- Consumes DOM: `#navbar` (`[data-solid]`), `#menu-btn`, `#mobile-menu`, `[data-count][data-suffix]`, `[data-reveal][data-reveal-delay]`, `.rail`, `.rail-prev`, `.rail-next`.

- [ ] **Step 1: Write it**

```ts
// Shared behaviour for every page: navbar, mobile menu, reveals, counters,
// article rail. Every block is guarded on its elements so any page can import it.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

// ---------- Navbar: solid once scrolled past the top ----------
// Pages without a dark header set data-solid on #navbar to keep it solid always.
const navbar = document.getElementById("navbar")
const menuBtn = document.getElementById("menu-btn")
const mobileMenu = document.getElementById("mobile-menu")

if (navbar) {
  const alwaysSolid = navbar.hasAttribute("data-solid")
  const menuOpen = () => mobileMenu !== null && !mobileMenu.hidden
  const update = () =>
    navbar.classList.toggle(
      "is-scrolled",
      alwaysSolid || menuOpen() || window.scrollY > 24,
    )
  update()
  window.addEventListener("scroll", update, { passive: true })

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.hidden = !mobileMenu.hidden
      menuBtn.setAttribute("aria-expanded", String(!mobileMenu.hidden))
      update()
    })
    for (const link of mobileMenu.querySelectorAll("a")) {
      link.addEventListener("click", () => {
        mobileMenu.hidden = true
        menuBtn.setAttribute("aria-expanded", "false")
      })
    }
  }
}

// ---------- Scroll reveals ----------
// `[data-reveal]` starts hidden (main.css); add `.is-visible` on first entry.
const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]")
if (reveals.length > 0) {
  if (reduceMotion) {
    for (const el of reveals) el.classList.add("is-visible")
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          const delay = Number(el.dataset.revealDelay ?? 0)
          if (delay > 0) el.style.transitionDelay = `${delay}ms`
          el.classList.add("is-visible")
          obs.unobserve(el)
        }
      },
      { rootMargin: "0px 0px -60px 0px" },
    )
    for (const el of reveals) observer.observe(el)
  }
}

// ---------- Counting stats ----------
const numberFormat = new Intl.NumberFormat("id-ID")

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count)
  const suffix = el.dataset.suffix ?? ""
  if (reduceMotion) {
    el.textContent = numberFormat.format(target) + suffix
    return
  }
  const duration = 1800
  const start = performance.now()
  const tick = (now: number) => {
    const p = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - p, 3)
    el.textContent = numberFormat.format(Math.round(target * eased)) + suffix
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

const counters = document.querySelectorAll<HTMLElement>("[data-count]")
if (counters.length > 0) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        countUp(entry.target as HTMLElement)
        obs.unobserve(entry.target)
      }
    },
    { threshold: 0.6 },
  )
  for (const el of counters) observer.observe(el)
}

// ---------- Article rail arrows (home page) ----------
const rail = document.querySelector<HTMLElement>(".rail")
if (rail) {
  const step = () => (rail.firstElementChild?.getBoundingClientRect().width ?? 340) + 32
  const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth"
  document
    .querySelector(".rail-prev")
    ?.addEventListener("click", () => rail.scrollBy({ left: -step(), behavior }))
  document
    .querySelector(".rail-next")
    ?.addEventListener("click", () => rail.scrollBy({ left: step(), behavior }))
}
```

- [ ] **Step 2: Verify** — `pnpm exec oxlint src/scripts/site.ts` clean.

- [ ] **Step 3: Commit** — `feat: site script (navbar, reveals, counters, rail)`

---

### Task 5: Layout, nav, footer, social icons, and a smoke page

**Files:**

- Create: `src/components/SocialIcon.astro`, `src/components/SiteNav.astro`, `src/components/SiteFooter.astro`, `src/layouts/Layout.astro`, `src/pages/index.astro` (placeholder, replaced in Task 7)

**Interfaces:**

- Produces: `Layout` props `{ title: string; description: string; solidNav?: boolean; ogImage?: string }` and a `head` slot. `SocialIcon` props `{ name: SocialIconName; class?: string }`. `SiteNav` props `{ solid?: boolean }`.

- [ ] **Step 1: `src/components/SocialIcon.astro`**

```astro
---
import { Instagram, Whatsapp, Youtube } from "simple-icons-astro"
import type { SocialIconName } from "@/data/site"

// Instagram, YouTube and WhatsApp come from simple-icons. LinkedIn is drawn
// inline: both simple-icons and lucide removed it (trademark policy).

interface Props {
  name: SocialIconName
  class?: string
}

const { name, class: className } = Astro.props
const brands = { instagram: Instagram, youtube: Youtube, whatsapp: Whatsapp }
const Brand = name === "linkedin" ? null : brands[name]
---

{
  Brand ? (
    <Brand class={className} fill="currentColor" aria-hidden="true" />
  ) : (
    <svg viewBox="0 0 24 24" fill="currentColor" class={className} aria-hidden="true">
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.5c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21h-4z" />
    </svg>
  )
}
```

- [ ] **Step 2: `src/components/SiteNav.astro`**

```astro
---
import { Menu } from "@lucide/astro"
import { brand, navLinks } from "@/data/site"

// Fixed bar. Transparent over a dark header, solid (`is-scrolled`) once the page
// scrolls or the mobile menu opens — see src/scripts/site.ts. Pages without a
// dark header pass `solid` so the white links never sit on a white page.

interface Props {
  solid?: boolean
}

const { solid = false } = Astro.props
const path = Astro.url.pathname.replace(/\/$/, "") || "/"
const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href))
const linkClass =
  "nav-link text-[0.9375rem] font-light tracking-wide text-white/80 transition-colors hover:text-white"
---

<header
  id="navbar"
  class:list={["navbar fixed inset-x-0 top-0 z-50 border-b border-transparent", solid && "is-scrolled"]}
  data-solid={solid || undefined}
>
  <div class="site flex items-center justify-between py-5">
    <a href="/" class="flex items-center gap-2.5 text-white">
      <span
        class="grid h-7 w-7 place-items-center rounded-[0.1875rem] border border-white/70 text-xs font-semibold"
      >
        {brand.mark}
      </span>
      <span class="text-lg font-light tracking-wide">{brand.name}</span>
    </a>

    <nav class="hidden items-center gap-10 whitespace-nowrap lg:flex" aria-label="Utama">
      {
        navLinks.map(({ label, href }) => (
          <a
            href={href}
            class:list={[linkClass, isActive(href) && "is-active"]}
            aria-current={isActive(href) ? "page" : undefined}
          >
            {label}
          </a>
        ))
      }
    </nav>

    <div class="flex items-center gap-3">
      <a href="/contact" class="btn btn-ghost hidden py-2.5 lg:inline-flex">Contact</a>
      <button
        id="menu-btn"
        type="button"
        class="grid h-10 w-10 place-items-center rounded text-white lg:hidden"
        aria-label="Buka menu"
        aria-expanded="false"
        aria-controls="mobile-menu"
      >
        <Menu class="h-[1.375rem] w-[1.375rem]" stroke-width={1.5} />
      </button>
    </div>
  </div>

  <div id="mobile-menu" class="border-t border-white/10 bg-ink px-6 py-4 lg:hidden" hidden>
    <nav class="flex flex-col gap-3" aria-label="Utama (mobile)">
      {
        [...navLinks, { label: "Contact", href: "/contact" }].map(({ label, href }) => (
          <a href={href} class="text-base text-white/85">
            {label}
          </a>
        ))
      }
    </nav>
  </div>
</header>
```

- [ ] **Step 3: `src/components/SiteFooter.astro`**

```astro
---
import SocialIcon from "@/components/SocialIcon.astro"
import { brand, contact, footerColumns, legalLinks, socials } from "@/data/site"

const year = new Date().getFullYear()
---

<footer id="contact" class="bg-ink text-white">
  <div class="site pt-28 pb-12">
    <div class="grid gap-16 md:grid-cols-12">
      <div class="md:col-span-4">
        <a href="/" class="flex items-center gap-2.5">
          <span
            class="grid h-8 w-8 place-items-center rounded-[0.1875rem] border border-white/70 text-sm font-semibold"
          >
            {brand.mark}
          </span>
          <span class="text-lg">{brand.name}</span>
        </a>
        <p class="mt-6 max-w-xs text-[0.9375rem] leading-relaxed font-light text-white/60">
          {contact.address.join(", ")}<br />
          {contact.email}<br />
          {contact.phone}
        </p>
        <div class="mt-6 flex gap-2">
          {
            socials.map(({ label, href, icon }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener"
                aria-label={label}
                class="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white hover:text-white"
              >
                <SocialIcon name={icon} class="h-[1.125rem] w-[1.125rem]" />
              </a>
            ))
          }
        </div>
      </div>

      <div class="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-8">
        {
          footerColumns.map(({ title, links }) => (
            <div>
              <p class="text-base">{title}</p>
              <ul class="mt-4 space-y-3 text-[0.9375rem] font-light text-white/60">
                {links.map(({ label, href }) => (
                  <li>
                    <a href={href} class="transition-colors hover:text-white">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))
        }
      </div>
    </div>

    <div
      class="mt-20 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm font-light text-white/45 sm:flex-row sm:items-center sm:justify-between"
    >
      <p>© {year} {brand.name}. Seluruh hak cipta dilindungi.</p>
      <div class="flex gap-5">
        {
          legalLinks.map(({ label, href }) => (
            <a href={href} class="transition-colors hover:text-white">
              {label}
            </a>
          ))
        }
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 4: `src/layouts/Layout.astro`**

```astro
---
import "@fontsource-variable/outfit"
import "@/style/main.css"
import { Seo } from "astro-seo-meta"
import { Schema } from "astro-seo-schema"
import SiteFooter from "@/components/SiteFooter.astro"
import SiteNav from "@/components/SiteNav.astro"
import { brand, contact, socials } from "@/data/site"

interface Props {
  title: string
  description: string
  /** Pages with no dark header keep the navbar solid from the top. */
  solidNav?: boolean
  ogImage?: string
}

const { title, description, solidNav = false, ogImage } = Astro.props
const canonical = new URL(Astro.url.pathname, Astro.site).href
---

<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <Seo
      title={title}
      description={description}
      icon="/favicon.svg"
      themeColor="#141414"
      facebook={{ url: canonical, type: "website", image: ogImage }}
      twitter={{ card: ogImage ? "summary_large_image" : "summary", image: ogImage }}
    />
    <link rel="canonical" href={canonical} />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <Schema
      item={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: brand.name,
        url: Astro.site?.href,
        email: contact.email,
        telephone: contact.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: contact.address[0],
          addressLocality: contact.address[1],
          addressCountry: "ID",
        },
        sameAs: socials.map((s) => s.href),
      }}
    />
    <slot name="head" />
  </head>
  <body>
    <SiteNav solid={solidNav} />
    <slot />
    <SiteFooter />
    <script>
      import "@/scripts/site"
    </script>
  </body>
</html>
```

- [ ] **Step 5: Smoke page `src/pages/index.astro`** (temporary — Task 7 replaces it)

```astro
---
import Layout from "@/layouts/Layout.astro"
import { seo } from "@/data/site"
---

<Layout title={seo.home.title} description={seo.home.description}>
  <section class="bg-ink pt-40 pb-24 text-white">
    <div class="site"><h1 class="t-h1 anim d-1">Smoke</h1></div>
  </section>
</Layout>
```

- [ ] **Step 6: Verify** — `pnpm astro check` passes; `pnpm build` succeeds and `dist/index.html` contains `<header id="navbar"` and `<footer`. Then `pnpm exec oxfmt .` and `pnpm exec oxlint`.

- [ ] **Step 7: Commit** — `feat: layout, navbar, footer, social icons`

---

### Task 6: Shared section components

**Files:**

- Create: `src/components/PageHeader.astro`, `src/components/SectionHeading.astro`, `src/components/Stats.astro`, `src/components/MisiGrid.astro`, `src/components/CtaBand.astro`, `src/components/UnitCard.astro`, `src/components/ArticleCard.astro`

**Interfaces:**

- `PageHeader` props `{ eyebrow: string; title: string; lead?: string; image?: { src: string; alt: string } }`, slots `default` (below the lead, inside the container).
- `SectionHeading` props `{ title: string; text: string; bold?: boolean }` (default `bold = true`).
- `Stats` props `{ items?: typeof stats }` (defaults to `stats` from site.ts).
- `MisiGrid` props `{ id?: string }`.
- `CtaBand` props `{ eyebrow: string; heading: string; cta: Cta; note?: string }`.
- `UnitCard` props `{ unit: Unit; delay?: number; withProfile?: boolean }`.
- `ArticleCard` props `{ article: Article; delay?: number; withCategory?: boolean; class?: string }`.

- [ ] **Step 1: `PageHeader.astro`**

```astro
---
// Dark sub-page header. With `image` the photo bleeds down the right 55% on lg
// and the copy sits over its faded left edge (the Artikel featured post).

interface Props {
  eyebrow: string
  title: string
  lead?: string
  image?: { src: string; alt: string }
}

const { eyebrow, title, lead, image } = Astro.props
---

<section class="relative isolate overflow-hidden bg-ink text-white">
  {
    image && (
      <div class="veil absolute inset-y-0 right-0 hidden w-[55%] overflow-hidden lg:block">
        <img src={image.src} alt={image.alt} class="hero-img h-full w-full object-cover" />
        <div class="absolute inset-0 bg-linear-to-r from-ink via-ink/60 to-ink/10" />
        <div class="absolute inset-0 bg-linear-to-t from-ink via-transparent to-ink/30" />
      </div>
    )
  }
  <div class="site relative z-10 pt-40 pb-24 lg:pt-52 lg:pb-32">
    <p class="anim d-1 t-overline">{eyebrow}</p>
    <h1 class="anim d-2 t-h1 mt-5 max-w-3xl">{title}</h1>
    {
      lead && (
        <p class="anim d-3 mt-8 max-w-2xl text-lg leading-relaxed font-light text-white/75">
          {lead}
        </p>
      )
    }
    <slot />
  </div>
</section>
```

- [ ] **Step 2: `SectionHeading.astro`**

```astro
---
// The `h2` + paragraph split used at the top of most sections.

interface Props {
  title: string
  text: string
  bold?: boolean
}

const { title, text, bold = true } = Astro.props
---

<div class="grid gap-12 md:grid-cols-12 md:items-end md:gap-x-6 lg:gap-x-8" data-reveal>
  <div class="md:col-span-6">
    <h2 class:list={[bold ? "t-h2-bold" : "t-h2"]}>{title}</h2>
  </div>
  <p class="t-body md:col-span-6">{text}</p>
</div>
```

- [ ] **Step 3: `Stats.astro`**

```astro
---
import { stats } from "@/data/site"

// Counters run up from zero when 60% visible — see src/scripts/site.ts.
// Two columns on phones, evenly spread across the row from md up.

interface Props {
  items?: typeof stats
}

const { items = stats } = Astro.props
---

<div
  class="site grid grid-cols-2 gap-y-12 py-20 md:flex md:items-start md:justify-between"
  data-reveal
>
  {
    items.map(({ value, suffix = "", label }) => (
      <div>
        <p class="t-stat">
          <span data-count={value} data-suffix={suffix}>
            0{suffix}
          </span>
        </p>
        <p class="t-eyebrow mt-4">{label}</p>
      </div>
    ))
  }
</div>
```

- [ ] **Step 4: `MisiGrid.astro`**

```astro
---
import { misi } from "@/data/site"

interface Props {
  id?: string
}

const { id = "misi" } = Astro.props
---

<section id={id} class="scroll-mt-20 bg-mist">
  <div class="site py-32">
    <div class="mx-auto max-w-2xl text-center" data-reveal>
      <h2 class="t-h2-bold">{misi.title}</h2>
      <p class="t-body mt-6">{misi.intro}</p>
    </div>

    <div class="mt-20 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
      {
        misi.items.map(({ title, body, image }, i) => (
          <article data-reveal data-reveal-delay={i * 100}>
            <div class="aspect-4/5 overflow-hidden bg-white">
              <img src={image} alt={title} class="h-full w-full object-cover" loading="lazy" />
            </div>
            <h3 class="t-card mt-6">{title}</h3>
            <p class="t-body mt-3">{body}</p>
          </article>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 5: `CtaBand.astro`**

```astro
---
import type { Cta } from "@/data/site"

interface Props {
  eyebrow: string
  heading: string
  cta: Cta
  note?: string
}

const { eyebrow, heading, cta, note } = Astro.props
---

<section class="bg-sand">
  <div class="site py-32" data-reveal>
    <div class="grid items-center gap-12 md:grid-cols-12 md:gap-x-6 lg:gap-x-8">
      <div class="md:col-span-8">
        <p class="t-eyebrow">{eyebrow}</p>
        <h2 class="t-h2 mt-4 max-w-2xl">{heading}</h2>
      </div>
      <div class="md:col-span-4 md:text-right">
        <a href={cta.href} class="btn btn-ink px-8 py-4 text-base">{cta.label}</a>
        {note && <p class="t-body mt-3 text-sm">{note}</p>}
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 6: `UnitCard.astro`**

```astro
---
import { Image } from "astro:assets"
import type { Unit } from "@/data/units"

// Mist tile: logo, name, summary, then the actions pinned to the foot.
// `withProfile` adds the "Lihat profil" button (the /unit-usaha listing).

interface Props {
  unit: Unit
  delay?: number
  withProfile?: boolean
}

const { unit, delay = 0, withProfile = false } = Astro.props
const href = `/unit-usaha/${unit.slug}`
---

<article
  class="group flex flex-col bg-mist p-8 transition-colors duration-300 hover:bg-[#ececec]"
  data-reveal
  data-reveal-delay={delay}
>
  <a href={href} class="logo-tile mx-auto h-20 w-28" aria-label={unit.name}>
    <Image src={unit.logo} alt="" width={224} densities={[1, 2]} />
  </a>
  <h3 class="t-card mt-8"><a href={href} class="hover:underline">{unit.name}</a></h3>
  <p class="t-body mt-3">{unit.summary}</p>
  <div class="mt-auto flex flex-wrap gap-3 pt-8">
    {withProfile && <a href={href} class="btn btn-ink">Lihat profil</a>}
    <a href={unit.website} target="_blank" rel="noopener" class="btn btn-ghost-ink">
      Kunjungi situs
    </a>
  </div>
</article>
```

- [ ] **Step 7: `ArticleCard.astro`**

```astro
---
import { formatDate, imageAt, type Article } from "@/lib/articles"

interface Props {
  article: Article
  delay?: number
  /** Show `Category · date` instead of the date alone. */
  withCategory?: boolean
  class?: string
}

const { article, delay = 0, withCategory = false, class: className } = Astro.props
const { title, excerpt, category, date, image } = article.data
---

<a
  href={`/artikel/${article.id}`}
  class:list={["group", className]}
  data-reveal
  data-reveal-delay={delay}
>
  <div class="aspect-4/5 overflow-hidden bg-mist">
    <img
      src={imageAt(image, 800)}
      alt=""
      class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      loading="lazy"
    />
  </div>
  <p class="t-label mt-5">
    {withCategory && <>{category} · </>}{formatDate(date)}
  </p>
  <h3 class="t-card mt-2 group-hover:underline">{title}</h3>
  <p class="t-body mt-2">{excerpt}</p>
</a>
```

- [ ] **Step 8: Verify** — `pnpm astro check` passes (components are type-checked even when unused).

- [ ] **Step 9: Commit** — `feat: shared section components`

---

### Task 7: Home page

**Files:**

- Rewrite: `src/pages/index.astro`

- [ ] **Step 1: Write it**

```astro
---
import { ChevronLeft, ChevronRight, Quote } from "@lucide/astro"
import ArticleCard from "@/components/ArticleCard.astro"
import CtaBand from "@/components/CtaBand.astro"
import MisiGrid from "@/components/MisiGrid.astro"
import SectionHeading from "@/components/SectionHeading.astro"
import Stats from "@/components/Stats.astro"
import UnitCard from "@/components/UnitCard.astro"
import {
  artikelIntro,
  csr,
  hero,
  investorCta,
  seo,
  testimonials,
  unitUsahaIntro,
  visi,
} from "@/data/site"
import { units } from "@/data/units"
import Layout from "@/layouts/Layout.astro"
import { getArticles } from "@/lib/articles"

const articles = await getArticles()
---

<Layout title={seo.home.title} description={seo.home.description}>
  <!-- ================= HERO ================= -->
  <section
    id="home"
    class="relative isolate flex min-h-svh w-full flex-col overflow-hidden bg-ink text-white"
  >
    <!-- Background image (right side), Ken Burns settle -->
    <div class="veil absolute inset-y-0 right-0 w-full overflow-hidden lg:w-[62%]">
      <img
        src={hero.image}
        alt=""
        class="hero-img h-full w-full object-cover object-center grayscale-25"
      />
      <!-- gradient veils to blend into the dark left panel -->
      <div class="absolute inset-0 bg-linear-to-r from-ink via-ink/75 to-ink/10 lg:via-ink/45">
      </div>
      <div class="absolute inset-0 bg-linear-to-t from-ink/85 via-transparent to-ink/40"></div>
    </div>

    <!-- subtle grain -->
    <div class="grain pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay">
    </div>

    <div class="site relative z-10 flex flex-1 flex-col justify-end pt-32 pb-10 lg:pb-12">
      <h1
        class="max-w-3xl text-[13vw] leading-[1.04] font-light tracking-tight sm:text-7xl lg:text-[5.375rem]"
      >
        {
          hero.lines.map((line, i) => (
            <span class:list={["anim block", `d-title-${i + 1}`]}>{line}</span>
          ))
        }
      </h1>

      <!-- growing divider -->
      <div class="d-divider mt-10 h-px w-full bg-white/15 lg:mt-12"></div>

      <!-- Bottom row: label anchored left, description + actions offset toward the centre-right -->
      <div class="mt-8 flex flex-col gap-8 lg:mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-6">
        <p class="anim d-label t-overline shrink-0 lg:col-span-5">{hero.label}</p>

        <div class="lg:col-span-7 lg:col-start-6 lg:max-w-xl">
          <p class="anim d-desc text-lg leading-relaxed font-light text-white/85 lg:text-xl">
            {hero.description}
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-4">
            <a href={hero.primary.href} class="anim d-btn-1 btn btn-light px-7 py-3">
              {hero.primary.label}
            </a>
            <a href={hero.secondary.href} class="anim d-btn-2 btn btn-ghost px-7 py-3">
              {hero.secondary.label}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= VISI KAMI ================= -->
  <section id="about" class="bg-white">
    <div class="grid lg:grid-cols-12">
      <div
        class="edge-left flex flex-col justify-center pt-20 pr-6 pb-12 md:pr-[calc(var(--gutter)+1.5rem)] lg:col-span-6 lg:pr-12 2xl:col-span-5"
        data-reveal
      >
        <p class="t-eyebrow">{visi.eyebrow}</p>
        <h2 class="t-h2 mt-8 max-w-[20em]">{visi.statement}</h2>
      </div>

      <!-- Sand panel with isometric line art, bleeding to the right edge -->
      <div
        class="relative h-80 overflow-hidden bg-sand lg:col-span-6 lg:h-[32.5rem] 2xl:col-span-7"
        data-reveal
        data-reveal-delay="100"
      >
        <svg
          class="absolute inset-0 h-full w-full"
          viewBox="0 0 900 520"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          stroke="#FFFFFF"
          stroke-opacity="0.9"
          stroke-width="1"
          aria-hidden="true"
        >
          <polyline points="700,0 230,270 230,520"></polyline>
          <polyline points="230,270 470,410 900,150"></polyline>
          <polyline points="230,430 700,160 900,275"></polyline>
          <line x1="700" y1="160" x2="700" y2="520"></line>
          <line x1="700" y1="380" x2="900" y2="500"></line>
          <line x1="470" y1="410" x2="470" y2="520"></line>
        </svg>
      </div>
    </div>

    <Stats />
  </section>

  <MisiGrid />

  <!-- ================= UNIT USAHA ================= -->
  <section id="unit-usaha" class="bg-white">
    <div class="site py-32">
      <SectionHeading title={unitUsahaIntro.title} text={unitUsahaIntro.intro} />
      <div class="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {units.map((unit, i) => <UnitCard unit={unit} delay={i * 100} />)}
      </div>
    </div>
  </section>

  <!-- ================= TESTIMONI ================= -->
  <section id="testimoni" class="bg-mist">
    <div class="site py-32">
      <SectionHeading title={testimonials.title} text={testimonials.intro} />
      <div class="mt-20 grid gap-6 lg:grid-cols-3">
        {
          testimonials.items.map(({ quote, name, role, units: tags }, i) => (
            <figure class="flex flex-col bg-white p-8" data-reveal data-reveal-delay={i * 100}>
              <Quote class="h-7 w-7 fill-lime stroke-lime" stroke-width={1} />
              <blockquote class="t-card mt-6 font-light">{quote}</blockquote>
              <figcaption class="mt-auto pt-8">
                <p class="text-base text-body">{name}</p>
                <p class="t-body text-[0.9375rem]">{role}</p>
                <div class="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span class="t-label rounded-full border border-line px-3 py-1 text-[0.6875rem]">
                      {tag}
                    </span>
                  ))}
                </div>
              </figcaption>
            </figure>
          ))
        }
      </div>
    </div>
  </section>

  <!-- ================= CSR ================= -->
  <section id="csr" class="bg-white">
    <div class="site py-32">
      <div
        class="relative isolate overflow-hidden rounded-2xl bg-ink px-6 py-24 text-center text-white shadow-card md:py-36"
        data-reveal
      >
        <!-- network lines background -->
        <svg
          class="absolute inset-0 -z-10 h-full w-full opacity-60"
          viewBox="0 0 1200 520"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          stroke="#fff"
          stroke-opacity="0.12"
          stroke-width="1"
          aria-hidden="true"
        >
          <path d="M-20 420 L180 300 L360 380 L540 240 L760 330 L940 200 L1220 300"></path>
          <path d="M-20 200 L160 120 L340 210 L520 90 L720 180 L900 60 L1220 140"></path>
          <path d="M180 300 L160 120 M360 380 L340 210 M540 240 L520 90 M760 330 L720 180 M940 200 L900 60"
          ></path>
          <path d="M-20 520 L200 460 L420 520 M700 520 L880 440 L1220 500"></path>
          <path d="M160 120 L340 -20 M520 90 L600 -20 M900 60 L980 -20"></path>
          <g fill="#fff" fill-opacity="0.35" stroke="none">
            <circle cx="180" cy="300" r="2.5"></circle>
            <circle cx="360" cy="380" r="2.5"></circle>
            <circle cx="540" cy="240" r="2.5"></circle>
            <circle cx="760" cy="330" r="2.5"></circle>
            <circle cx="940" cy="200" r="2.5"></circle>
            <circle cx="160" cy="120" r="2.5"></circle>
            <circle cx="340" cy="210" r="2.5"></circle>
            <circle cx="520" cy="90" r="2.5"></circle>
            <circle cx="720" cy="180" r="2.5"></circle>
            <circle cx="900" cy="60" r="2.5"></circle>
          </g>
        </svg>
        <div
          class="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(255,255,255,0.06),transparent_70%)]"
        >
        </div>

        <h2
          class="mx-auto max-w-3xl text-[2.25rem] leading-tight font-light tracking-tight sm:text-5xl md:text-6xl"
        >
          {csr.title}
        </h2>
        <p
          class="mx-auto mt-8 max-w-2xl text-base leading-relaxed font-light text-white/65 md:text-lg"
        >
          {csr.body}
        </p>
        <a href={csr.cta.href} class="btn btn-flame mt-10 px-7">{csr.cta.label}</a>
      </div>
    </div>
  </section>

  <!-- ================= ARTIKEL ================= -->
  <section id="artikel" class="rail-wrap bg-white">
    <div class="site py-32">
      <div class="grid gap-14 lg:grid-cols-12 lg:gap-x-8">
        <div class="lg:col-span-4" data-reveal>
          <h2 class="t-h2">{artikelIntro.title}</h2>
          <p class="t-body mt-5 max-w-sm">{artikelIntro.intro}</p>
          <a href={artikelIntro.cta.href} class="btn btn-ghost-ink mt-8">{artikelIntro.cta.label}</a>
          <div class="mt-8 hidden gap-2 lg:flex">
            <button
              type="button"
              class="rail-prev grid h-12 w-12 place-items-center rounded-full border border-line text-body transition-colors hover:border-body"
              aria-label="Sebelumnya"
            >
              <ChevronLeft class="h-[1.125rem] w-[1.125rem]" stroke-width={1.5} />
            </button>
            <button
              type="button"
              class="rail-next grid h-12 w-12 place-items-center rounded-full border border-line text-body transition-colors hover:border-body"
              aria-label="Berikutnya"
            >
              <ChevronRight class="h-[1.125rem] w-[1.125rem]" stroke-width={1.5} />
            </button>
          </div>
        </div>

        <!-- Carousel bleeds past the container to the right edge of the viewport -->
        <div class="min-w-0 lg:col-span-8" data-reveal data-reveal-delay="100">
          <div class="rail flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4">
            {
              articles.map((article) => (
                <ArticleCard
                  article={article}
                  class="w-[17.5rem] shrink-0 snap-start sm:w-[21.25rem]"
                />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  </section>

  <CtaBand
    eyebrow={investorCta.eyebrow}
    heading={investorCta.heading}
    cta={investorCta.cta}
    note={investorCta.note}
  />
</Layout>
```

Note: the article cards inside the rail each carry `data-reveal`; the rail wrapper does too. That is fine — both reveal on entry.

- [ ] **Step 2: Verify** — `pnpm astro check`, `pnpm build`; `grep -c "data-reveal" dist/index.html` > 10; `grep -o 'href="/artikel/[a-z-]*"' dist/index.html | sort -u` lists the four slugs; `grep -o 'href="/unit-usaha/[a-z-]*"' dist/index.html | sort -u` lists the four units.

- [ ] **Step 3: Commit** — `feat: home page`

---

### Task 8: About page

**Files:**

- Create: `src/pages/about.astro`

- [ ] **Step 1: Write it**

```astro
---
import CtaBand from "@/components/CtaBand.astro"
import MisiGrid from "@/components/MisiGrid.astro"
import PageHeader from "@/components/PageHeader.astro"
import SectionHeading from "@/components/SectionHeading.astro"
import Stats from "@/components/Stats.astro"
import { investorCta, pageHeaders, seo, team, timeline, visi } from "@/data/site"
import Layout from "@/layouts/Layout.astro"

const pad = (n: number) => String(n).padStart(2, "0")
---

<Layout title={seo.about.title} description={seo.about.description}>
  <PageHeader {...pageHeaders.about} />

  <!-- ================= VISI KAMI ================= -->
  <section id="visi" class="scroll-mt-20 bg-white">
    <!-- Sand statement band: the vision as one large pull-statement, the isometric
         line art kept as a faint watermark behind it -->
    <div class="relative isolate overflow-hidden bg-sand">
      <svg
        class="pointer-events-none absolute inset-y-0 right-0 -z-10 h-full w-full lg:w-[60%]"
        viewBox="0 0 900 520"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="#FFFFFF"
        stroke-opacity="0.7"
        stroke-width="1"
        aria-hidden="true"
      >
        <polyline points="700,0 230,270 230,520"></polyline>
        <polyline points="230,270 470,410 900,150"></polyline>
        <polyline points="230,430 700,160 900,275"></polyline>
        <line x1="700" y1="160" x2="700" y2="520"></line>
        <line x1="700" y1="380" x2="900" y2="500"></line>
        <line x1="470" y1="410" x2="470" y2="520"></line>
      </svg>
      <div class="site py-32">
        <div class="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div class="lg:col-span-4" data-reveal>
            <p class="t-eyebrow">{visi.eyebrow}</p>
            <div class="mt-6 h-px w-16 bg-body/30"></div>
            <p class="t-body mt-8 max-w-sm">{visi.intro}</p>
          </div>
          <div class="lg:col-span-8" data-reveal data-reveal-delay="100">
            <h2
              class="text-[clamp(1.75rem,1.1rem+2.4vw,3.25rem)] leading-[1.18] font-light tracking-[-0.015em] text-body"
            >
              {
                visi.segments.map(({ text, strong }) =>
                  strong ? <span class="font-medium">{text}</span> : text,
                )
              }
            </h2>
          </div>
        </div>

        <!-- Three pillars drawn from the statement -->
        <div class="mt-20 grid gap-10 border-t border-body/15 pt-12 sm:grid-cols-3 lg:gap-16">
          {
            visi.pillars.map(({ title, body }, i) => (
              <div data-reveal data-reveal-delay={i * 100}>
                <p class="t-label">{pad(i + 1)}</p>
                <h3 class="t-card mt-4">{title}</h3>
                <p class="t-body mt-3 text-[0.9375rem]">{body}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>

    <Stats />
  </section>

  <MisiGrid />

  <!-- ================= SEJARAH ================= -->
  <section id="sejarah" class="scroll-mt-20 bg-white">
    <div class="site py-32">
      <SectionHeading title={timeline.title} text={timeline.intro} />

      <!-- Vertical timeline: a centre spine on md+, entries alternate left/right.
           On phones the spine sits on the left and every entry hangs to its right. -->
      <ol class="timeline relative mt-20">
        {
          timeline.items.map(({ year, title, body, image, alt }) => (
            <li class="tl-item" data-reveal>
              <div class="tl-card">
                <p class="t-stat text-[2rem]">{year}</p>
                <div class="tl-img mt-5 aspect-16/10 overflow-hidden bg-mist">
                  <img src={image} alt={alt} class="h-full w-full object-cover" loading="lazy" />
                </div>
                <h3 class="t-card mt-6">{title}</h3>
                <p class="t-body mt-3">{body}</p>
              </div>
            </li>
          ))
        }
      </ol>
    </div>
  </section>

  <!-- ================= TIM ================= -->
  <section id="tim" class="scroll-mt-20 bg-mist">
    <div class="site py-32">
      <SectionHeading title={team.title} text={team.intro} />
      <div class="mt-20 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {
          team.members.map(({ name, role, bio, image }, i) => (
            <article data-reveal data-reveal-delay={i * 100}>
              <div class="aspect-4/5 overflow-hidden bg-white">
                <img
                  src={image}
                  alt={name}
                  class="h-full w-full object-cover grayscale"
                  loading="lazy"
                />
              </div>
              <h3 class="t-card mt-6">{name}</h3>
              <p class="t-body mt-1">{role}</p>
              <p class="t-body mt-3 text-[0.9375rem]">{bio}</p>
            </article>
          ))
        }
      </div>
    </div>
  </section>

  <CtaBand
    eyebrow={investorCta.eyebrow}
    heading={investorCta.heading}
    cta={investorCta.cta}
    note={investorCta.note}
  />
</Layout>
```

- [ ] **Step 2: Verify** — `pnpm astro check`, `pnpm build`; `dist/about/index.html` contains `id="visi"`, `id="misi"`, `id="sejarah"`, `id="tim"` and eight `class="tl-item"`.

- [ ] **Step 3: Commit** — `feat: about page`

---

### Task 9: Unit Usaha listing and detail

**Files:**

- Create: `src/pages/unit-usaha/index.astro`, `src/pages/unit-usaha/[slug].astro`

- [ ] **Step 1: `unit-usaha/index.astro`**

```astro
---
import CtaBand from "@/components/CtaBand.astro"
import PageHeader from "@/components/PageHeader.astro"
import UnitCard from "@/components/UnitCard.astro"
import { kemitraanCta, pageHeaders, seo } from "@/data/site"
import { units } from "@/data/units"
import Layout from "@/layouts/Layout.astro"
---

<Layout title={seo.unitUsaha.title} description={seo.unitUsaha.description}>
  <PageHeader {...pageHeaders.unitUsaha} />

  <section id="unit-usaha" class="bg-white">
    <div class="site py-32">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {units.map((unit, i) => <UnitCard unit={unit} delay={i * 100} withProfile />)}
      </div>
    </div>
  </section>

  <CtaBand
    eyebrow={kemitraanCta.eyebrow}
    heading={kemitraanCta.heading}
    cta={kemitraanCta.cta}
    note={kemitraanCta.note}
  />
</Layout>
```

- [ ] **Step 2: `unit-usaha/[slug].astro`**

```astro
---
import { ArrowUpRight, ChevronLeft } from "@lucide/astro"
import { Image } from "astro:assets"
import CtaBand from "@/components/CtaBand.astro"
import PageHeader from "@/components/PageHeader.astro"
import SocialIcon from "@/components/SocialIcon.astro"
import { brand, kemitraanCta } from "@/data/site"
import { units } from "@/data/units"
import Layout from "@/layouts/Layout.astro"

export const getStaticPaths = () => units.map((unit) => ({ params: { slug: unit.slug }, props: { unit } }))

const { unit } = Astro.props
---

<Layout title={`${unit.name} — ${brand.name}`} description={unit.summary}>
  <PageHeader eyebrow="Unit usaha" title={unit.name} lead={unit.sector} />

  <section id="unit-detail" class="bg-mist">
    <div class="site py-28 lg:py-32">
      <a
        href="/unit-usaha"
        class="inline-flex items-center gap-2 text-[0.9375rem] font-light text-muted transition-colors hover:text-body"
      >
        <ChevronLeft class="h-4 w-4" stroke-width={1.5} />
        Seluruh unit usaha
      </a>

      <div class="mt-10 grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-20">
        <!-- Left: logo -->
        <div class="lg:col-span-5" data-reveal>
          <div class="grid aspect-square w-full place-items-center bg-white p-16 sm:p-24">
            <div class="logo-tile h-40 w-full sm:h-52">
              <Image src={unit.logo} alt={`Logo ${unit.name}`} width={640} densities={[1, 2]} />
            </div>
          </div>
        </div>

        <!-- Right: sector, name, description, facts, website, socials -->
        <div class="lg:col-span-7" data-reveal data-reveal-delay="100">
          <p class="t-eyebrow">{unit.sector}</p>
          <h2 class="t-h2-bold mt-4">{unit.name}</h2>
          <div class="mt-8 space-y-5">
            {unit.description.map((p) => <p class="t-body">{p}</p>)}
          </div>
          <dl
            class="mt-10 grid grid-cols-1 gap-y-4 border-t border-line pt-8 sm:grid-cols-3 sm:gap-x-6"
          >
            {
              unit.facts.map(([label, value]) => (
                <div>
                  <dt class="t-label">{label}</dt>
                  <dd class="mt-1 text-base text-body">{value}</dd>
                </div>
              ))
            }
          </dl>
          <div class="mt-10 flex flex-wrap items-center gap-6">
            <a href={unit.website} target="_blank" rel="noopener" class="btn btn-ink px-7 py-3.5">
              Kunjungi situs
              <ArrowUpRight class="h-4 w-4" stroke-width={1.5} />
            </a>
            <div class="flex gap-2">
              {
                unit.socials.map(({ label, href, icon }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener"
                    aria-label={label}
                    title={label}
                    class="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-body transition-colors hover:border-body"
                  >
                    <SocialIcon name={icon} class="h-[1.125rem] w-[1.125rem]" />
                  </a>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <CtaBand
    eyebrow={kemitraanCta.eyebrow}
    heading={kemitraanCta.heading}
    cta={kemitraanCta.cta}
    note={kemitraanCta.note}
  />
</Layout>
```

- [ ] **Step 3: Verify** — `pnpm astro check`, `pnpm build`; `ls dist/unit-usaha` shows `index.html amani-laundry amani-karpet warkop-amani pat`; `ls dist/_astro/*.webp | wc -l` ≥ 4 (optimized logos).

- [ ] **Step 4: Commit** — `feat: unit usaha listing and detail pages`

---

### Task 10: Artikel listing and detail

**Files:**

- Create: `src/pages/artikel/index.astro`, `src/pages/artikel/[slug].astro`

- [ ] **Step 1: `artikel/index.astro`**

```astro
---
import ArticleCard from "@/components/ArticleCard.astro"
import PageHeader from "@/components/PageHeader.astro"
import { artikelIntro, seo } from "@/data/site"
import Layout from "@/layouts/Layout.astro"
import { formatDate, getArticles, imageAt } from "@/lib/articles"

// The latest article is featured in the header; the grid lists the rest.
const [featured, ...rest] = await getArticles()
---

<Layout title={seo.artikel.title} description={seo.artikel.description}>
  {
    featured && (
      <PageHeader
        eyebrow="Artikel · Terbaru"
        title={featured.data.title}
        lead={featured.data.excerpt}
        image={{ src: featured.data.image, alt: featured.data.title }}
      >
        <div class="anim d-4 mt-10 flex flex-wrap items-center gap-6">
          <a href={`/artikel/${featured.id}`} class="btn btn-light px-7 py-3">
            Baca artikel
          </a>
          <p class="text-sm font-light text-white/60">
            {featured.data.category} · {formatDate(featured.data.date)}
          </p>
        </div>
        <!-- image for screens without the side bleed -->
        <div class="anim d-4 mt-14 aspect-video overflow-hidden bg-white/5 lg:hidden">
          <img
            src={imageAt(featured.data.image, 1000)}
            alt={featured.data.title}
            class="h-full w-full object-cover"
          />
        </div>
      </PageHeader>
    )
  }

  <section class="bg-white">
    <div class="site py-32">
      <div class="flex flex-wrap items-end justify-between gap-6" data-reveal>
        <h2 class="t-h2-bold">{artikelIntro.listTitle}</h2>
        <p class="t-body max-w-md">{artikelIntro.listIntro}</p>
      </div>
      <div class="mt-20 grid gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
        {
          rest.map((article, i) => (
            <ArticleCard article={article} delay={(i % 3) * 100} withCategory />
          ))
        }
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: `artikel/[slug].astro`**

```astro
---
import { ChevronLeft } from "@lucide/astro"
import { Schema } from "astro-seo-schema"
import { render } from "astro:content"
import ArticleCard from "@/components/ArticleCard.astro"
import { artikelIntro, brand } from "@/data/site"
import Layout from "@/layouts/Layout.astro"
import { formatDate, getArticles } from "@/lib/articles"

export async function getStaticPaths() {
  const articles = await getArticles()
  return articles.map((article) => ({
    params: { slug: article.id },
    props: { article, related: articles.filter((a) => a.id !== article.id).slice(0, 3) },
  }))
}

const { article, related } = Astro.props
const { title, excerpt, category, date, image } = article.data
const { Content } = await render(article)
---

<Layout title={`${title} — ${brand.name}`} description={excerpt} ogImage={image}>
  <Schema
    slot="head"
    item={{
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description: excerpt,
      image,
      datePublished: date.toISOString(),
      author: { "@type": "Organization", name: artikelIntro.author },
      publisher: { "@type": "Organization", name: brand.name },
    }}
  />

  <section class="bg-ink text-white">
    <div class="site pt-40 pb-20 lg:pt-52 lg:pb-28">
      <a
        href="/artikel"
        class="anim d-1 inline-flex items-center gap-2 text-[0.9375rem] font-light text-white/60 transition-colors hover:text-white"
      >
        <ChevronLeft class="h-4 w-4" stroke-width={1.5} />
        Seluruh artikel
      </a>
      <p class="anim d-2 t-overline mt-10">{category} · {formatDate(date)}</p>
      <h1 class="anim d-3 t-h1 mt-5 max-w-4xl">{title}</h1>
    </div>
  </section>

  <section class="bg-white">
    <div class="site pb-32">
      <div class="aspect-2/1 overflow-hidden bg-mist lg:aspect-16/7">
        <img src={image} alt={title} class="h-full w-full object-cover" />
      </div>
      <div class="grid gap-16 pt-20 lg:grid-cols-12 lg:gap-x-8">
        <aside class="lg:col-span-3">
          <p class="t-label">Penulis</p>
          <p class="mt-2 text-base text-body">{artikelIntro.author}</p>
          <p class="t-label mt-8">Kategori</p>
          <p class="mt-2 text-base text-body">{category}</p>
        </aside>
        <div class="article-body lg:col-span-7">
          <Content />
        </div>
      </div>

      <div class="mt-20 border-t border-line pt-14">
        <h2 class="t-h3">Artikel lainnya</h2>
        <div class="mt-8 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {
            related.map((a, i) => (
              <ArticleCard article={a} delay={i * 100} withCategory />
            ))
          }
        </div>
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 3: Verify** — `pnpm astro check`, `pnpm build`; `ls dist/artikel` shows `index.html` + 4 slug folders; `grep -c '"@type":"Article"' dist/artikel/rotasi-manajer-satu-tahun/index.html` is 1; the featured header on `dist/artikel/index.html` names "Rotasi manajer" and the grid has three cards.

- [ ] **Step 4: Commit** — `feat: artikel listing and detail pages`

---

### Task 11: Contact page

**Files:**

- Create: `src/pages/contact.astro`

- [ ] **Step 1: Write it**

```astro
---
import { ArrowRight, ArrowUpRight, Mail } from "@lucide/astro"
import SocialIcon from "@/components/SocialIcon.astro"
import { contact, contactPage, contactTopics, seo } from "@/data/site"
import Layout from "@/layouts/Layout.astro"

// No dark header: the page opens straight on the form, so the navbar is solid.
const channels = [
  { label: "WhatsApp", value: contact.phone, href: contact.whatsapp + "?text=" + encodeURIComponent("Halo Amani Group, saya ingin bertanya mengenai "), icon: "whatsapp" as const },
  { label: "Instagram", value: contact.instagramHandle, href: contact.instagram, icon: "instagram" as const },
  { label: "Email", value: contact.email, href: `mailto:${contact.email}`, icon: null },
]
---

<Layout title={seo.contact.title} description={seo.contact.description} solidNav>
  <section class="bg-white">
    <div class="site pt-40 pb-32 lg:pt-48">
      <div class="grid grid-cols-1 gap-20 xl:grid-cols-12 xl:gap-x-8">
        <!-- Form -->
        <div class="xl:col-span-7" data-reveal>
          <h1 class="t-h2-bold">{contactPage.title}</h1>
          <p class="t-body mt-4 max-w-xl">{contactPage.intro}</p>

          <form
            id="contact-form"
            class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2"
            novalidate
            data-email={contact.email}
            data-investor-email={contact.investorEmail}
          >
            <div>
              <label for="f-name" class="t-label block">
                Nama lengkap <span class="text-flame">*</span>
              </label>
              <input
                id="f-name"
                name="name"
                type="text"
                required
                autocomplete="name"
                class="field mt-2"
                placeholder="Nama Anda"
              />
            </div>
            <div>
              <label for="f-email" class="t-label block">
                Email <span class="text-flame">*</span>
              </label>
              <input
                id="f-email"
                name="email"
                type="email"
                required
                autocomplete="email"
                class="field mt-2"
                placeholder="nama@perusahaan.com"
              />
            </div>
            <div>
              <label for="f-company" class="t-label block">Perusahaan / Institusi</label>
              <input
                id="f-company"
                name="company"
                type="text"
                autocomplete="organization"
                class="field mt-2"
                placeholder="Opsional"
              />
            </div>
            <div>
              <label for="f-topic" class="t-label block">
                Topik <span class="text-flame">*</span>
              </label>
              <select id="f-topic" name="topic" required class="field mt-2">
                {contactTopics.map(({ value, label }) => <option value={value}>{label}</option>)}
              </select>
            </div>
            <div class="sm:col-span-2">
              <label for="f-message" class="t-label block">
                Pesan <span class="text-flame">*</span>
              </label>
              <textarea
                id="f-message"
                name="message"
                rows="6"
                required
                class="field mt-2"
                placeholder="Jelaskan kebutuhan Anda secara singkat dan jelas."></textarea>
            </div>
            <div class="sm:col-span-2">
              <p id="form-error" class="mb-4 text-[0.9375rem] text-flame" hidden>
                {contactPage.error}
              </p>
              <button type="submit" class="btn btn-ink px-8 py-4 text-base">
                Kirim Pesan
                <ArrowRight class="h-4 w-4" stroke-width={1.5} />
              </button>
              <p class="t-body mt-4 text-sm">{contactPage.privacy}</p>
            </div>
          </form>
        </div>

        <!-- Channels -->
        <aside class="xl:col-span-5" data-reveal data-reveal-delay="100">
          <div class="bg-mist p-8 sm:p-10">
            <h2 class="t-h3">{contactPage.channelsTitle}</h2>
            <p class="t-body mt-3">{contactPage.channelsIntro}</p>
            <div class="mt-8 grid gap-3">
              {
                channels.map(({ label, value, href, icon }) => (
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={href.startsWith("mailto:") ? undefined : "noopener"}
                    class="group flex items-center gap-4 bg-white p-5 transition-colors hover:bg-ink hover:text-white"
                  >
                    <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line transition-colors group-hover:border-white/30">
                      {icon ? (
                        <SocialIcon name={icon} class="h-5 w-5" />
                      ) : (
                        <Mail class="h-5 w-5" stroke-width={1.6} />
                      )}
                    </span>
                    <span class="min-w-0">
                      <span class="block text-base">{label}</span>
                      <span class="block text-[0.9375rem] font-light break-words opacity-70">
                        {value}
                      </span>
                    </span>
                    <ArrowUpRight class="ml-auto h-4 w-4 shrink-0 opacity-50" stroke-width={1.5} />
                  </a>
                ))
              }
            </div>

            <dl class="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <dt class="t-label">Kantor pusat</dt>
                <dd class="t-body mt-2">{contact.address[0]}<br />{contact.address[1]}</dd>
              </div>
              <div>
                <dt class="t-label">Jam kerja</dt>
                <dd class="t-body mt-2">{contact.hours[0]}<br />{contact.hours[1]}</dd>
              </div>
              <div>
                <dt class="t-label">Telepon</dt>
                <dd class="t-body mt-2">{contact.phone}</dd>
              </div>
              <div>
                <dt class="t-label">Relasi investor</dt>
                <dd class="t-body mt-2">{contact.investorEmail}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  </section>
</Layout>

<script>
  // The form builds a mailto: link — there is no backend. `?topic=` (used by CTA
  // links across the site) preselects the topic; investor enquiries go to the
  // investor relations mailbox.
  const form = document.getElementById("contact-form") as HTMLFormElement
  const topic = document.getElementById("f-topic") as HTMLSelectElement
  const error = document.getElementById("form-error") as HTMLElement

  const preset = new URLSearchParams(location.search).get("topic")
  if (preset && [...topic.options].some((o) => o.value === preset)) topic.value = preset

  const recipientFor = (t: string) =>
    t === "investor" ? form.dataset.investorEmail : form.dataset.email

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    const valid = form.checkValidity()
    error.hidden = valid
    if (!valid) {
      form.querySelector<HTMLElement>(":invalid")?.focus()
      return
    }
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>
    const topicLabel = topic.options[topic.selectedIndex]?.text ?? ""
    const subject = `[${topicLabel}] Permintaan dari ${data.name}`
    const body = [
      `Nama: ${data.name}`,
      `Email: ${data.email}`,
      `Perusahaan/Institusi: ${data.company || "-"}`,
      `Topik: ${topicLabel}`,
      "",
      data.message,
    ].join("\n")
    location.href = `mailto:${recipientFor(data.topic)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  })
</script>
```

- [ ] **Step 2: Verify** — `pnpm astro check`, `pnpm build`; `dist/contact/index.html` has `data-solid` on `#navbar`, eight `<option`, and no `investor@` in the visible form except the aside.

- [ ] **Step 3: Commit** — `feat: contact page`

---

### Task 12: Lint, format, browser pass

**Files:** any touched by the formatter.

- [ ] **Step 1: Run** `pnpm exec oxfmt .` then `pnpm exec oxlint` then `pnpm astro check` then `pnpm build`. All clean (astro check may warn about unused `legalLinks`-style exports only if something is genuinely unused — fix rather than ignore).

- [ ] **Step 2: Browser pass** — `pnpm astro dev --background`, then open each of `/`, `/about`, `/unit-usaha`, `/unit-usaha/pat`, `/artikel`, `/artikel/cabang-ketujuh-tanpa-utang`, `/contact?topic=csr` at ~390, 1024 and 1440 px. Check: navbar transparent on dark headers and solid after scrolling / on `/contact`; mobile burger opens the menu and it closes on link click; reveals fade up once; counters run to 4 / 7 / 50 M / 5.000; rail arrows scroll the cards; unit logos render inside their tiles; article body paragraphs are styled; contact topic is preselected to "Program CSR"; hover states on nav links, unit cards, article images, timeline images. Fix anything off. `pnpm astro dev stop` when done.

- [ ] **Step 3: Commit** — `chore: format and lint`

---

### Task 13: Documentation

**Files:**

- Rewrite: `CLAUDE.md`, `AGENTS.md` (byte-identical copy), `README.md` (short project blurb + command table)
- Delete: nothing (old spec/plan stay under `docs/`)

- [ ] **Step 1: Write `CLAUDE.md`** covering: pnpm + Node floor, commands table (dev in background mode, build, preview, `astro check`, oxlint, oxfmt), no test framework; architecture (`astro.config.mjs` — sitemap, robots, `site` placeholder to change before deploy, Tailwind via vite plugin, `@` alias; SEO via `astro-seo-meta`/`astro-seo-schema`; icons via `@lucide/astro` + `simple-icons-astro`, LinkedIn inline because neither ships it; Outfit via fontsource); routes table; content (site.ts, units.ts + `src/assets/units` with the unused 8 pairs, articles collection — add an article by adding a `.md`); the `Layout` props and `head` slot; `SiteNav solid` and why; styling (Tailwind v4 CSS-first, `@theme` palette reset to 8 colours, `.site` measure, `t-*` scale, `btn-*`, the viewport font-size ramp, `--site-w`/`--gutter`, `rail` bleed, `timeline` invariants — `.tl-item + .tl-item { margin-top: -5rem }` on md+ relies on every entry having an image; reduced-motion block); motion (`anim`/`d-*` load entrances, `data-reveal` + `data-reveal-delay` scroll reveals from `site.ts`, counters `data-count`/`data-suffix`); Tailwind v4 gotchas (`bg-linear-*`, `aspect-4/5`, utilities beat `@layer components`); oxfmt house style; "Still outstanding": `site` is localhost, Unsplash placeholders, `public/logo*.png` and `public/hero.mp4` unused, `legalLinks` hrefs are `#`, `investor.html` not ported, `article` rail uses the full excerpt.

- [ ] **Step 2: Copy** — `cp CLAUDE.md AGENTS.md`; `cmp CLAUDE.md AGENTS.md` prints nothing.

- [ ] **Step 3: Commit** — `docs: CLAUDE.md for the Amani Group site`

---

## Self-review

- **Spec coverage:** Stack (T1), routes (T7–T11), content (T3), components (T5–T6), styling (T2), scripts (T4, T11), config (T1), verification (T12), docs (T13). Investor drop + link rewrites are in the data (T3) and nav (T5).
- **Placeholders:** none — every file's full content is in its task. T13's CLAUDE.md is an outline by design (prose, written from the finished code).
- **Type consistency:** `SocialIconName` (site.ts) used by units.ts, SocialIcon, SiteFooter, contact; `Cta` used by CtaBand and site.ts; `Unit` from units.ts used by UnitCard and `[slug]`; `Article`/`formatDate`/`imageAt`/`getArticles` from lib/articles used by ArticleCard, index, artikel pages; `stats` typed `typeof stats` in Stats.astro; `Layout` props `title/description/solidNav/ogImage` + `head` slot used in artikel/[slug].
