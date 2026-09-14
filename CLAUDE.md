# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Development

Package manager is **pnpm** (Node >= 22.12). `AGENTS.md` is a byte-identical copy of this
file — edit both together.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

| Task                                          | Command             |
| :-------------------------------------------- | :------------------ |
| Build to `./dist/`                            | `pnpm build`        |
| Preview a production build                    | `pnpm preview`      |
| Typecheck (`.astro` + `.ts`)                  | `pnpm astro check`  |
| Lint                                          | `pnpm exec oxlint`  |
| Format + sort imports + sort Tailwind classes | `pnpm exec oxfmt .` |

There is no test framework and no `lint`/`format` npm scripts — oxlint and oxfmt are dev
dependencies invoked directly. Verification is `astro check` + `build` + a look in the
browser. House style (`.oxfmtrc.json`): no semicolons, double quotes, 90-column print
width; the formatter also normalises `class` attributes against `src/style/main.css`.

## What this is

The Amani Group corporate site — a holding company with four subsidiaries. Static Astro 7,
no adapter, no framework islands, no client-side router. It was ported from a set of
static HTML mockups (Tailwind Play CDN + AOS); the port's design and plan are under
`docs/superpowers/`. Copy is Bahasa Indonesia.

### Routes

| Route                | File                            | Content                                                                               |
| :------------------- | :------------------------------ | :------------------------------------------------------------------------------------ |
| `/`                  | `pages/index.astro`             | hero, visi + stats, misi, unit usaha, testimoni, CSR card, artikel rail, investor CTA |
| `/about`             | `pages/about.astro`             | header, `#visi`, `#misi`, `#sejarah` (timeline), `#tim`, investor CTA                 |
| `/unit-usaha`        | `pages/unit-usaha/index.astro`  | header, four `UnitCard`s, kemitraan CTA                                               |
| `/unit-usaha/[slug]` | `pages/unit-usaha/[slug].astro` | one unit: logo, description, facts, website, socials                                  |
| `/artikel`           | `pages/artikel/index.astro`     | latest article featured in the header, the rest in a grid                             |
| `/artikel/[slug]`    | `pages/artikel/[slug].astro`    | article body + three related, `Article` JSON-LD                                       |
| `/contact`           | `pages/contact.astro`           | `mailto:` form + direct channels; `?topic=` preselects the topic                      |

There is deliberately **no investor page**: the mockups had one, it was dropped, and every
"Investor" link on the site goes to `/contact?topic=investor` instead.

### Where things live

- **`src/data/site.ts`** — every piece of copy: brand, nav, contact details, socials,
  footer columns, stats, hero, vision, mission, testimonials, CSR, timeline, team, CTA
  bands, contact topics, per-page SEO strings. Markup carries no copy; edit here.
- **`src/data/units.ts`** — the four units. `logo` is an `import` from
  `src/assets/units/<slug>.png` so it goes through `astro:assets`. That folder holds
  twelve logo pairs (`<slug>.png` colour, `<slug>-black.png` mono); only the four colour
  ones are referenced. The lock-ups are 3240×4050 with a lot of transparent margin, which
  is why the mark looks small inside its tile — trim the PNGs, not the CSS.
- **`src/content/articles/*.md`** — the articles, a content collection defined in
  `src/content.config.ts` (`title`, `date`, `category`, `excerpt`, `image`). The file
  name is the slug. Adding an article is adding a file; `src/lib/articles.ts` sorts
  newest-first (`getArticles()`), formats dates in `id-ID` (`formatDate()`), and rewrites
  Unsplash widths (`imageAt()`).
- **`src/layouts/Layout.astro`** — the only layout. Props `title`, `description`,
  `solidNav`, `ogImage`; a `head` slot for page-level JSON-LD. Head: `<Seo>` from
  `astro-seo-meta`, canonical, Organization JSON-LD via `astro-seo-schema`, the Outfit
  font (`@fontsource-variable/outfit`), `main.css`. Body: `SiteNav`, slot, `SiteFooter`,
  and the one `<script>` importing `src/scripts/site.ts`.
- **`src/components/`** — `SiteNav` (`solid` prop, see below), `SiteFooter`,
  `SocialIcon`, `PageHeader` (dark sub-page header, optional side image), `SectionHeading`
  (the `h2` + paragraph split), `Stats` (counters), `MisiGrid`, `CtaBand` (sand band),
  `UnitCard`, `ArticleCard`.
- **Icons** — `@lucide/astro` for UI, `simple-icons-astro` for Instagram / YouTube /
  WhatsApp. **Neither ships LinkedIn any more** (trademark removals), so `SocialIcon`
  draws it inline. Size icons with rem classes (`h-4 w-4`), never the px `size` prop —
  the whole page scales with the root font-size.
- **Photos** are hot-linked from Unsplash as plain `<img loading="lazy">` — placeholders.
  Real photography should move into `src/assets/` and go through `<Image>`.

### Behaviour (`src/scripts/site.ts`)

One module, imported by the layout, every block guarded on its elements:

- **Navbar** — transparent over a dark header, `is-scrolled` (solid, blurred) past 24px
  or while the mobile menu is open. `/contact` has no dark header, so it passes
  `solidNav` to the layout → `SiteNav solid` → `data-solid` on `#navbar`, which keeps the
  bar solid from the top. Any new page without a dark header must do the same or its
  white links sit on white. The active link is computed at build from
  `Astro.url.pathname`.
- **Reveals** — `data-reveal` starts an element hidden (CSS), an IntersectionObserver
  adds `.is-visible` once; `data-reveal-delay="100"` staggers (ms). Under
  `prefers-reduced-motion` everything is visible at rest.
- **Counters** — `[data-count]` (+ optional `data-suffix`) run 0 → value over 1.8s when
  60% visible, formatted `id-ID` (`5.000`, `50 M`).
- **Rail** — `.rail-prev` / `.rail-next` scroll the home article rail by one card.
- The **contact form** has its own inline `<script>` in `contact.astro`: `?topic=`
  preselect, native validation, and a `mailto:` built from the fields — investor
  enquiries go to `investor@…`, everything else to `halo@…`. There is no backend.

Load-time entrances (hero, page headers) are pure CSS: `anim` + a `d-*` delay class.

## Styling

Tailwind v4 is **CSS-first** — there is no `tailwind.config.*`. `src/style/main.css` is
the whole design system, imported once by the layout:

- **`@theme`** — `--font-sans` (Outfit Variable); the palette with Tailwind's default
  colours **reset** (`--color-*: initial`) so only `ink body muted line mist sand lime
flame white black` exist as utilities; `--shadow-card`; the entrance keyframes as
  `--animate-*`. `text-body` is a colour (`#1F1F1F`), `t-body` is a type class — both
  exist, don't confuse them.
- **`@layer base`** — the viewport scale: `html` font-size is 16px from 360px to 1920px,
  eases down to 14px on tiny phones and up to 32px on 4K, so every rem on the page
  scales together. `--site-w` / `--gutter` are the container share and the space either
  side of it (100% / 90% / 85% / 75% at the breakpoints); full-bleed elements
  (`edge-left`, `rail`) reach across `--gutter`.
- **`@layer components`** — `.site` (the page measure; replaces `mx-auto max-w-site
px-6` from the mockups), the `t-*` type scale (`t-overline t-h1 t-eyebrow t-label
t-body t-card t-h2 t-h2-bold t-h3 t-stat`), `btn` + `btn-light/ghost/ghost-ink/
outline/ink/flame`, `navbar`/`nav-link`, `rail`/`rail-wrap`, `logo-tile`, `grain`,
  `timeline`/`tl-*`, `field`, `article-body`, the `anim`/`d-*` entrances and the
  `[data-reveal]` states. Utilities win over this layer, which is what lets `t-body
text-sm` or `btn px-7` work.
- **Timeline invariant** — on `md+` each `.tl-item` is pulled up `-5rem` into the
  previous entry's row; that only works because every entry carries a `16/10` image of
  the same height. An entry without an image, or a much longer body, breaks the zig-zag.
- **Reduced motion** block at the end disables reveals and entrances and restores native
  scrolling. Any new animation belongs there too.

Tailwind v4 gotchas already hit: it's `bg-linear-to-r` not `bg-gradient-to-r`,
`aspect-4/5` not `aspect-[4/5]`; and `sharp` must be a direct dependency or
`astro:assets` fails at build.

## Config

`astro.config.mjs`: `@astrojs/sitemap` + `astro-robots-txt` (both derive from `site`),
`@tailwindcss/vite`, and the `@` → `/src` alias (mirrored in `tsconfig.json` `paths` so
`astro check` and the editor resolve it). `pnpm-workspace.yaml` allows the `esbuild` /
`sharp` build scripts and carries a `minimumReleaseAgeExclude` for `astro@7.2.7`.

## Still outstanding

- `site` in `astro.config.mjs` is `http://localhost:4321` — **change before deploying**;
  canonical, OG and sitemap URLs all come from it.
- Photography is Unsplash placeholders.
- `public/logo.png`, `public/logo-black.png`, `public/logo-white.png` and
  `public/hero.mp4` are unreferenced leftovers; the brand mark is the "A" box from the
  mockups. `logo-white.png` is the obvious swap-in for the navbar.
- `legalLinks` in `site.ts` point at `#`.
- The home rail shows each article's full `excerpt`; the mockup used shorter, rail-only
  blurbs.
- Unit logos render small because the PNGs carry wide transparent margins.

## Documentation

Full documentation: https://docs.astro.build

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Images](https://docs.astro.build/en/guides/images/)
- [Styling / Tailwind](https://docs.astro.build/en/guides/styling/)
