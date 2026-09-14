# Amani Group site — design

Port of the static mockups in `D:\CTO\test` (`index.html`, `about.html`,
`unit-usaha.html`, `artikel.html`, `contact.html` and `assets/`) into this Astro 7
project. `investor.html` is deliberately **not** ported.

## Goals

- Every page in the mockups reproduced as a static Astro route, faithful in intent
  (same copy, layout, type scale, palette, motion).
- Tailwind Play-CDN config + `site.css` rewritten as a Tailwind v4 CSS-first design
  system in `src/style/main.css`.
- Content out of the markup: articles as a content collection, units and all page copy
  in `src/data/`.
- The old Badiuzzaman site (its `main.css`, `CLAUDE.md`/`AGENTS.md`, unused deps) is
  replaced wholesale.

## Stack

- Remove: `@astrojs/vue`, `vue`, `@lucide/vue`, `gsap`, `cobe`, `vue-use-spring`; the
  `vue-demi` entry in `pnpm-workspace.yaml`; `vue()` from `astro.config.mjs`.
- Add: `@fontsource-variable/outfit` (self-hosted Outfit, imported once in the layout).
- Keep and use: `@astrojs/sitemap`, `astro-robots-txt`, `astro-seo-meta`,
  `astro-seo-schema` + `schema-dts`, `@lucide/astro` (UI icons), `simple-icons-astro`
  (brand icons: Instagram, LinkedIn, YouTube, WhatsApp).
- No AOS. Scroll reveals are a `data-reveal` attribute + IntersectionObserver in our
  own script; CSS carries the transition (550 ms, 24 px, `cubic-bezier(.22,1,.36,1)`),
  `data-reveal-delay="100"` for stagger. Reduced motion shows everything at rest.

## Routes

| Route                | File                            | Notes                                                                                                                |
| -------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `/`                  | `pages/index.astro`             | hero, visi + stats, misi, unit usaha, testimoni, CSR, artikel rail, investor CTA                                     |
| `/about`             | `pages/about.astro`             | header, `#visi` (statement + pillars + stats), `#misi`, `#sejarah` timeline, `#tim`, investor CTA                    |
| `/unit-usaha`        | `pages/unit-usaha/index.astro`  | header, 4-up grid of `UnitCard`, kemitraan CTA                                                                       |
| `/unit-usaha/[slug]` | `pages/unit-usaha/[slug].astro` | `getStaticPaths` from `units.ts`; logo, sector, name, description, facts, website, socials; back link; kemitraan CTA |
| `/artikel`           | `pages/artikel/index.astro`     | featured latest (side-bleed image on lg), grid of the rest                                                           |
| `/artikel/[slug]`    | `pages/artikel/[slug].astro`    | dark header, hero image, author/category aside, body, 3 related; Article JSON-LD                                     |
| `/contact`           | `pages/contact.astro`           | form + channels; `SiteNav solid`; `?topic=` preselect                                                                |

Link rewrites from the mockups: `x.html` → `/x`; `unit-usaha.html#slug` →
`/unit-usaha/slug`; `artikel.html#slug` → `/artikel/slug`; `investor.html` →
`/contact?topic=investor`. The Investor nav item is removed. Active nav link is computed
from `Astro.url.pathname` at build time.

## Content

- `src/content.config.ts` defines `articles` (glob loader over
  `src/content/articles/*.md`). Schema: `title`, `date` (`z.coerce.date()`),
  `category`, `excerpt`, `image` (URL string). Body = the mockup paragraphs as markdown.
  Sorted by date desc; the first is the featured one on `/artikel` and the rail on `/`
  shows all four in that order. Dates rendered with
  `Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" })`.
- `src/data/units.ts`: the four units (slug, name, sector, summary, description[],
  facts[], website, socials[]) with `logo` imported from `src/assets/units/<slug>.png`.
  `public/units/` is moved to `src/assets/units/` (`git mv`) so logos ship through
  `astro:assets`; the eight unused pairs come along, unreferenced.
- `src/data/site.ts`: brand, nav, contact details, socials, footer columns, stats,
  mission pillars, testimonials, team, timeline, vision pillars, hero copy, page
  headers, CTA bands, contact topics. Markup carries no copy.

## Components

- `layouts/Layout.astro` — props `title`, `description`, optional `solidNav`. Head:
  charset/viewport, `<Seo>` from `astro-seo-meta` (title, description, canonical, OG),
  Organization JSON-LD via `astro-seo-schema`, a `head` slot for page-level schema,
  fontsource import, `main.css`. Body: `SiteNav`, `<slot />`, `SiteFooter`,
  `<script>` importing `@/scripts/site.ts`.
- `components/SiteNav.astro` — fixed bar, desktop links, Contact button, burger +
  mobile menu. `solid` prop keeps `is-scrolled` on.
- `components/SiteFooter.astro` — brand, address, socials, three link columns, legal row.
- `components/PageHeader.astro` — dark sub-page header: eyebrow, h1, lead, optional
  actions slot, optional side image (used by `/artikel` featured).
- `components/SectionHeading.astro` — `h2` + paragraph in the 12-col split.
- `components/Stats.astro` — counters row (`data-count`, `data-suffix`).
- `components/MisiGrid.astro` — centred header + 4 photo cards (`/` and `/about`).
- `components/CtaBand.astro` — sand band: eyebrow, heading, button, note.
- `components/UnitCard.astro` — mist tile: logo, name, summary, buttons.
- `components/ArticleCard.astro` — image, label, title, excerpt.
- Icons: `@lucide/astro` `Menu`, `ChevronLeft/Right`, `ArrowRight`, `ArrowUpRight`,
  `Mail`, `Quote`; `simple-icons-astro` `SiInstagram`, `SiLinkedin`, `SiYoutube`,
  `SiWhatsapp`. Sized with rem classes, never the px `size` prop.
- Remote Unsplash photos stay `<img loading="lazy">` (placeholders). Local images use
  `<Image>` from `astro:assets`.

## Styling (`src/style/main.css`)

- `@import "tailwindcss"`.
- `@theme`: `--font-sans: "Outfit Variable", ui-sans-serif, system-ui, sans-serif`;
  colours `ink #141414`, `body #1F1F1F`, `muted #6B6B6B`, `line #E3E3E3`,
  `mist #F4F4F4`, `sand #E6DDD2`, `lime #A3D65C`, `flame #F4511E`; `--shadow-card`;
  `--animate-fade-up`, `--animate-fade-in`, `--animate-line-grow`, `--animate-ken-burns`
  with their `@keyframes`.
- `@layer base`: `html` font-size ramp (14–32 px), `:root { --site-w; --gutter }`
  breakpoints, `body` defaults, focus-visible outline.
- `@layer components`: `.site` (= `mx-auto w-full max-w-[var(--site-w)] px-6`),
  `t-eyebrow t-label t-body t-card t-h2 t-h2-bold t-h3 t-stat`, `btn btn-light
btn-ghost btn-ghost-ink btn-outline btn-ink btn-flame`, `nav-link`, `#navbar`
  states, `rail`/`rail-wrap`, `edge-left`, `logo-tile`, `timeline`/`tl-*`, `field`,
  hero `anim`/`d-*` delays, `hero-img`, `veil`, `[data-reveal]` states,
  `prefers-reduced-motion` block.
- Dropped: `gold`/`btn-gold`, `faq` (investor-only), `svg[width=…]` overrides, the
  `.md\:grid-cols-12` column-gap override (replaced by responsive `gap-x-*` in markup).
- v4 syntax: `bg-linear-to-r`, `aspect-4/5`, `text-body` etc. from the theme tokens.

## Scripts

`src/scripts/site.ts`, imported once by the layout, each block guarded on its
elements: navbar scroll state + mobile menu; counters
(`Intl.NumberFormat("id-ID")`, 1.8 s ease-out cubic, IntersectionObserver at 0.6);
reveals; article rail arrows. `contact.astro` has its own inline `<script>`: `?topic=`
preselect, validation, `mailto:` builder routing `investor` to
`investor@amanigroup.co.id`.

## Config

- `astro.config.mjs`: drop `vue()`; keep sitemap, robots, tailwind vite plugin, alias.
  `site` stays a placeholder and is noted in CLAUDE.md.
- `tsconfig.json` unchanged.

## Verification

`pnpm astro check`, `pnpm build`, `pnpm exec oxlint`, `pnpm exec oxfmt .`; dev server

- browser screenshots of every route at ~390 / 1024 / 1440 px checking navbar state,
  mobile menu, reveals, counters, rail arrows, unit + article detail, contact preselect.
  Then `CLAUDE.md`/`AGENTS.md` rewritten for this site (byte-identical copies).

## Defaults taken

- Brand mark is the mockup's "A" box + "Amani Group" text (`public/logo-white.png`
  is available if wanted).
- `public/logo*.png`, `public/hero.mp4` are left in place, unreferenced.
