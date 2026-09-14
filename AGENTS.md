# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

Package manager is **pnpm** (Node >= 22.12). `AGENTS.md` is a byte-identical copy of
this file — edit both together.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

| Task                                          | Command             |
| :-------------------------------------------- | :------------------ |
| Build to `./dist/`                            | `pnpm build`        |
| Preview a production build                    | `pnpm preview`      |
| Typecheck (`.astro` + `.ts` + `.vue`)         | `pnpm astro check`  |
| Lint                                          | `pnpm exec oxlint`  |
| Format + sort imports + sort Tailwind classes | `pnpm exec oxfmt .` |

There is no test framework in this project, and no `lint`/`format` npm scripts — oxlint
and oxfmt are dev dependencies invoked directly.

## Architecture

A single-site Astro 7 landing page. Static by default; no adapter or SSR is configured.

**`astro.config.mjs`** wires everything:

- `@astrojs/vue` — Vue 3 for interactive islands (`client:*` directives). `.astro`
  components are still the default and should stay so unless a piece genuinely needs
  client-side state. The three `.vue` files under `src/components/ui/` are all vendored
  from [Inspira UI](https://inspira-ui.com) — see **Inspira UI components** below.
- `@astrojs/sitemap` + `astro-robots-txt` — both derive from the `site` option, which is
  still `http://localhost:4321`. **Change `site` before any deploy**; it also backs
  canonical and absolute OG URLs.
- `@tailwindcss/vite` — Tailwind v4 via the Vite plugin, not the Astro integration.
- Alias `@` → `/src` (declared in `vite.resolve.alias`, e.g. `import "@/style/main.css"`).

SEO is dependency-driven rather than hand-rolled: `astro-seo-meta` for meta tags and
`astro-seo-schema` + `schema-dts` for typed JSON-LD. Icons come from `@lucide/astro`,
`@lucide/vue`, and `simple-icons-astro`.

**Motion** is GSAP, and all of it lives in `src/scripts/motion.ts` — one module, imported
once from `index.astro`, with every section's setup guarded on its elements existing.
Two things about it are load-bearing:

- `Layout.astro` wraps the page in `#smooth-wrapper > #smooth-content` for
  **ScrollSmoother**. That inner element is transformed, so anything `position: fixed`
  must go in the layout's `overlay` slot instead — a fixed child of a transformed
  ancestor resolves against the ancestor and scrolls away with the page.
- ScrollSmoother runs with `effects: true`, so any element with `data-speed` gets
  parallax for free. It was put there for the Karya gallery's columns; that gallery and
  the section around it are gone and nothing carries the attribute at the moment, but
  when something wants parallax again this is how it gets it — don't reach for a
  ScrollTrigger to do the same job.

`prefers-reduced-motion` is read once at the top of the module: ScrollSmoother is never
created, entrance timelines are skipped, and anchor clicks fall back to
`scrollIntoView()`. Anything animated needs a resting state for that branch.

**GSAP owns entrances; CSS owns hovers.** Card hovers used to be tweened from
`motion.ts` and are not any more — GSAP writes inline styles, so a pointer leaving
mid-tween could strand a card half-inverted, and none of it answered to the keyboard.
Hover and `:focus-within` states now live in `main.css`. The corollary is a trap worth
knowing: any GSAP entrance on an element that also has a CSS hover transform **must**
pass `clearProps: "transform,opacity"`, or the inline `transform: translate(0px, 0px)`
GSAP leaves behind outranks the hover rule forever. Both `initUnitUsaha` and `initMisi`
do this.

**The hero background is a video** — `public/hero.mp4`, described by `heroVideo` in
`site.ts` and used by `Hero.astro` alone. It replaced a three-photo cross-fade, so
nothing named `heroSlides`, `.hero-slide` or `.hero-flash` is left. It is meant to win
the download race, and three things arrange that:

- `index.astro` passes `heroVideo.src` to the layout's `preloadVideo` prop, which emits
  `<link rel="preload" as="video" fetchpriority="high">` as the **first** resource in
  `<head>` — ahead of the icons, the font stylesheet and Astro's own bundles, because
  the preload scanner queues in source order. Anything new in `<head>` goes below it.
- The `<video>` also carries `preload="auto"` and is the first element in the body:
  Firefox and Safari ignore `as="video"` and fall back to the element's own hint. And
  `muted` is not decoration — autoplay is refused without it.
- There is no poster, on purpose. A poster is a second full-screen download racing the
  one file that has to arrive first; the section's `bg-ink` covers the gap instead.

`initHero` pauses the video when the hero leaves the viewport or the tab goes to the
background, and retries `play()` once on the first `pointerdown` for browsers that want
a gesture even for muted video. Under `prefers-reduced-motion` it still autoplays — that
is what paints the first frame at all — and is frozen there, so the resting state is a
still rather than a black section.

**Content lives in `src/data/site.ts`**, not in the markup — brand details, nav, and one
export per section. Copy is Bahasa Indonesia.

### Inspira UI components

[Inspira UI](https://inspira-ui.com) is a copy-in registry, not a package, so its
components are vendored into `src/components/ui/` with their source URL in the file
header. Two are in use:

- **`Globe.vue`** — the WebGL globe, wrapping `cobe`. It **is not on the page any
  more**: Kinerja closed on it until that section became a photo carousel, and that
  section has since been merged into Tentang. Nothing imports it now. The file, `globeMarkers` in `site.ts` and the
  `.globe-*` rules' replacement in `main.css` all went with it; `cobe` and
  `vue-use-spring` are still installed and unused. Colours were 0–1 floats, and the
  landmass dots came out at `baseColor × mapBrightness`, so those two only ever moved
  together.
- **`TextScrollReveal.vue`** + **`ScrollWord.vue`** — the word-by-word fill on the Visi
  statement, which lives in `Tentang.astro` now. Upstream reads progress in a `scroll`
  listener; here it is a rAF loop gated by an IntersectionObserver, because
  ScrollSmoother leaves the native scroll position alone and transforms the content to
  lag behind it — a scroll-event reading is always ahead of where the words actually are.
  The raw reading is also remapped onto the `start`/`end` props instead of being used
  directly: upstream runs 0 → 1 across the whole pin, which leaves the sentence sitting
  fully dim until its top edge reaches the top of the viewport. Both are negated
  fractions of the viewport height, so a negative value is a block still below the top
  edge.

  It also takes a `pin` prop, and `Tentang.astro` passes `false`. Pinned (upstream, the
  default) the block is `h-[150vh]` with the sentence stuck to the middle of the screen,
  and `end` must stay inside the pin — block height minus `100vh`, so `50vh`, which
  `0.35` clears. Unpinned there is no height and no sticky child: the paragraph is an
  ordinary block, the fill runs as it travels up the viewport, and the range
  (`-0.78` → `-0.12`) finishes it before the figures below come into view. That is the
  whole reason the prop exists — the statement now shares its section with those
  figures and cannot hold the screen for a viewport and a half on its own.

Both were edited to take `cn` from `@/lib/utils` (a plain join) rather than
`@inspira-ui/plugins`. Nothing passes conflicting utilities into them, so the
`tailwind-merge` half of the real helper would be dead weight.

## Styling

Tailwind v4 is **CSS-first** — there is no `tailwind.config.*`. The entire design system
lives in `src/style/main.css`, imported once by `src/layouts/Layout.astro`, so every page
inherits it through the layout.

That file is the single source of truth for:

- **Brand tokens** in `@theme`: `primary`/`secondary` (navy + gold) with light/dark
  variants, `ink`/`ink-soft` (dark surfaces), `canvas`/`canvas-soft` (`#FCFAF6`, the
  page ground — `body` paints it and every light section either inherits or restates
  it), `carbon`/`carbon-soft` (the reading black and its muted step), and the `sans`
  (Manrope) / `serif` (Lora) font stacks. Use the token utilities (`text-carbon`,
  `bg-secondary-dark`, …) instead of raw hex.
- **Text is black or white and nothing else.** `body` is set in `carbon`, so every
  light section — headings, kickers, body copy, the Visi words, nav links in the
  solid state — inherits the reading black, and `carbon-soft` is the only step down.
  Copy on the dark sections (hero, CTA, footer, the unit-usaha reveal) is `white`,
  muted with an opacity (`text-white/70`) rather than a colour. The gold is not a
  text colour: it is fills, borders, the dot grid, the Misi progress bar, the unit
  mark and list markers. `ink`/`ink-soft` are backgrounds only. A new heading or paragraph
  needs no colour utility at all on a light section — inheriting is correct.
- **An overridden type scale.** `xs`–`2xl` are deliberately one notch larger than
  Tailwind's defaults with roomier line-heights. `text-base` is the site's default body
  size for all running copy; `text-sm` is reserved for genuinely secondary text (chips,
  field labels, meta rows); `text-xs` only for uppercase micro-labels.
- **The heading system: `display-1`, `display-2`, `display-3`, `kicker`.** Headings do
  **not** set their own size/weight/tracking any more — every one of them picks one of
  these four. All three display classes are the same family at the same weight
  (**bold**, 700; `display-3` is 600) and tracking, so the hero and every section title
  below it read as one typeface;
  only the size changes. `display-1` is the hero headline and is the only thing that
  uses that size, `display-2` is every section `h2`, `display-3` is a card title, and
  `kicker` is the uppercase micro-label above a heading (it also carries the
  light-section colour — black — which the kickers on dark grounds, the CTA's and
  Kepedulian's, override with `text-white/70`; utilities are layered after components,
  so the utility wins). `vision-text` is the one deliberate exception: it is a statement
  rather than a headline and is set on its own scale, between `display-2` and
  `display-1` — it used to run larger than `display-1`, and was brought down when the
  statement moved into a two-thirds column beside the figures. It still matches on
  weight and tracking. The whole display system ran at 300 until the headings were asked
  to carry more force; if the weight moves again, `vision-text` and `menu-item` are the
  two that have to move with it, because both exist to read as the same typeface. There is no serif on the
  page: `--font-serif` is declared and used only by `prose-article`.
- **The page measure.** `shell` and `shell-wide` are both `width: 80%` with no
  max-width and no padding of their own. They are identical rules kept under two names
  because the components already use both and the distinction may come back.
  `shell-narrow` (760px) is the one real exception, for reading columns.
- **Named component classes** carrying the site's signature effects — `card-lift`,
  `btn-glass-primary`, `section-backdrop`, `stack-card` (sticky card stack, currently
  unused), `pulse-ring`, `is-disabled`, `prose-article` (blog body), `pill-kicker` (the
  kicker drawn as an outlined chip with a gold dot, which is what every section header
  above a heading uses now), `link-underline` (the small caps link that leads out of a
  section), plus the per-section blocks described below. Several have load-bearing invariants documented in
  comments directly above them (sticky offsets clearing the ~4.75rem navbar,
  `section-backdrop` needing a `relative` parent). Read the comment before changing one.
- **`dot-pattern` is the ground for the light sections** — Unit Usaha, Kepedulian and
  Magang carry it. Tentang is the exception, and the reason the cell size and tint live
  in `--dot-cell` / `--dot-ink` on `:root`: `.tentang-bg` paints its own dots (a tighter
  20px cell, inked in the reading black rather than the gold, both overridden locally)
  over a faint gold wash, and the class and that gradient both want the same
  `background` shorthand, so it restates the dot layer instead of applying the class.
  Misi is the other exception — its ground is `.section-backdrop`, a washed-out
  photograph.
- **Three section textures, and they are meant to stay quiet.** `.section-aurora` draws
  two very large radial washes on a pseudo-element — warm gold from one top corner, cool
  slate from the opposite bottom one — so a light section has colour moving across it
  without becoming a picture; Unit Usaha and Magang carry it. `.section-backdrop` is a
  whole photograph at a fifth of its strength, desaturated and masked away down the
  block; Misi carries it. `.texture-grain` is the CTA's SVG turbulence plate as a
  reusable class, and nothing carries it at the moment — the dark Misi ground it was
  added for is gone. All three are pseudo-elements or absolute layers at `z-index: -1`
  behind a positioned parent, which is what leaves the section's own `background` free
  for the dot grid. If a wash ever becomes a shape you can point at, it is too strong.
- **The landing page's own classes**, in a marked block at the end of the components
  layer, each under a `--- Section ---` banner — navbar states, hero scrim, mobile menu,
  the unit-usaha bento and its tiles, the Tentang figures, the Misi cards, the Magang
  columns, the Kepedulian frame, the CTA photographic ground, the footer watermark.
  Colours there are `color-mix` over the brand tokens rather than literals, so
  re-tinting the site never means editing that block. Four of those blocks carry
  invariants:
  - **`.unit-bento`** sets `grid-auto-rows` to a fixed height, never `auto`. The tiles
    are photographs, so with `auto` every row would take its own image's intrinsic
    height and the composition — which is entirely a matter of which cell is twice the
    width of which — collapses into a ragged list. That one number is also the size of
    the whole block, since every row is one tile tall. Two columns three rows deep with
    the middle cell spanning both (half/half, wide, half/half); the span is a single
    `sm:` utility in `UnitUsaha.astro`, next to the diagram of the layout it makes.
    Below `sm` it does not apply and the grid is one column.
  - **`.unit-tile`** is `height: 100%`, so its size is the cell's and never its
    contents', and everything inside it is absolutely positioned for the same reason —
    a long `blurb` can crowd a small tile but can never resize one. Nothing shows at
    rest but the photograph and the mark; the name, blurb and visit link open under the
    mark on hover or focus, as real text held at zero opacity (so a screen reader has it
    either way) with `tabindex` on the tile to open it from the keyboard. Both the mark
    and that panel are capped as well as proportional — `min(58%, 20rem)` and a 34rem
    max-width centred by auto side margins — because the bento's wide cell is twice the
    width of a half cell and a bare percentage would put a double-size lock-up and a
    single very long line of blurb on it. The mark is
    `logo`, the all-black lock-up, crushed to white by `brightness(0) invert(1)` —
    both files in `public/units/` are drawn for a light ground, so neither can be laid
    on a darkened photo unaltered. Its hover lift animates `top`, not `transform`: the
    `translate(-50%, -50%)` that centres it has to stay put, and a `top` expressed as a
    share of the tile lifts by the same fraction of the cell at every size. The 28% lift
    against the mark's 18% height clears the panel's 38% top edge — those are a pair —
    and the lift is deliberately **not** dropped under `prefers-reduced-motion`, because
    it is what makes the room the panel opens into.
  - **`.misi-panel`** carries no solid background of its own — the gradient _is_ the
    background, running from transparent to the footer's ink over the panel's own top
    padding. That padding is therefore load-bearing: shrink it and the photograph above
    ends in a hard edge instead of fading into the panel. The panel is also a flex item
    at the foot of the card rather than an absolutely positioned box, so a longer body
    grows it upward into the photograph instead of overflowing; all four cards stay the
    same height because the grid stretches them to the row.
  - **`.csr-frame`** has no aspect ratio below `sm` and its copy stays in the flow
    there; from `sm` up the frame is a ratio and `.csr-copy` is pinned to the top edge.
    The same words need a great deal more of the picture at 360px than at 1440, and a
    fixed ratio on a phone is how the last line of the paragraph ends up outside the
    frame. The photograph is absolute either way, so it covers whatever height the copy
    asks for.
  - **`.cta-section`** is one blurred photograph under a gradient, plus the SVG noise
    plate. Three things are load-bearing and all three are commented in place: the
    section has no bottom padding and `.cta-fade` ends on exactly `--color-ink-soft`
    (the footer's own background) so the join is seamless; `.cta-photo img` is scaled
    past its box because a blur samples transparent black outside the element and would
    otherwise feather to grey at all four edges; and the noise stays, because a heavy
    blur is a gradient by another name and bands just as visibly on 8-bit displays.
- A `prefers-reduced-motion` block that disables the animations above. Any new animation
  belongs there too.

Two Tailwind v4 gotchas this page has already hit:

- `translate-*`, `scale-*` and `rotate-*` compile to the standalone `translate` /
  `scale` / `rotate` properties, **not** to `transform`. GSAP writes `transform`, so a
  Tailwind translate on a GSAP-animated element is an offset nothing can override. Set
  the starting position from GSAP instead.
- GSAP cannot interpolate `var(--token)`. If a tween ever needs a brand colour again,
  resolve it off `:root` with `getComputedStyle` and hand GSAP a literal — do not
  restate the palette in JS. (There is no such tween left; every colour change on the
  page is now a CSS transition.)

`.oxfmtrc.json` points oxfmt's Tailwind class sorter at `src/style/main.css`, so running
the formatter also normalizes `class` attributes and `clsx`/`cn` calls. House style: no
semicolons, double quotes, 90-column print width.

## Current state

The site is PT Badiuzzaman Cipta Amani, a holding company. `src/pages/index.astro` is
the landing page: Hero → Tentang → Unit Usaha → Misi → Kepedulian → Magang → CTA →
footer, with each section a component under `src/components/landing/` and its content in
`src/data/site.ts`. `src/pages/unit-usaha.astro` is the second page — every
unit, where the landing page shows five.

**Tentang** is Visi and Kinerja merged. It is the pill kicker in a narrow left column,
the Visi statement with its word-by-word fill in a two-thirds column beside it, and the
four figures set directly under the statement — an icon tile, a headline reading
"`<counter> <label>`", and one supporting line each — all of it on `.tentang-bg`, a gold
wash that deepens down the section so the statement starts on the plain canvas and the
figures sit on colour. The counters that run up from zero are unchanged. Gone with the
merge: the pinned full-screen Visi section, the Kinerja photo carousel and its 5s timer
(`kinerjaGallery`), and the hairline rules between the figures. The anchors `#visi` and `#kinerja` no longer exist; both are
`#tentang`.

**Unit Usaha** is a **bento of five** — two halves, one full-width, two halves, as
described under `.unit-bento` in the styling notes — and `featuredUnitNames` in
`site.ts` is which five and in what order, the third being the one that gets the wide
row. All twelve live on `/unit-usaha`, in a plain three-column grid of the same
`UnitTile`. Nothing named `unit-card`, `unit-mark` or `unit-panel` is left.

**Misi** is the other half of the vision/mission pair: Tentang states what the group is
for, Misi states how it gets done. The layout has been five things — an editorial index
card as Layanan, a four-up grid, a horizontal accordion, a lock-up on a photograph that
only opened its copy on hover, and a photo card with the copy set beneath it on a
charcoal ground. It is now a **centred header over four tall cards**, each a photograph
with a dark panel across its foot carrying a gold icon, the pillar's title and its body.
Nothing is on hover: all four pillars are readable at rest, which is the point of the
layout.

Every trace of the accordion — the slats, the spine, the 10s progress rule, the `--slat`
flex-basis mechanism and the rAF clock in `motion.ts` — is long gone, and so is the dark
ground that briefly replaced it: `.misi-section`, its gold glow and the `.texture-grain`
on it. The section is back on the page's own canvas with `.section-backdrop` over it —
the washed-out photograph from `misiIntro.backdrop`, held at a fifth of its strength and
masked away down the block, which is what the section needs `relative` for.

**Kepedulian** introduces Yayasan Khairul Ummah Al Fath, the group's social arm. It is
one photograph with the whole block of copy — kicker, foundation name, heading,
paragraph, button — set inside it along the top edge and centred.

**Magang** is the internship programme and the last section before the CTA: three
columns — a `4 / 5` photograph, the vacancy card, and the copy with its three rows. The
first two are the fixed pair — the photograph carries the row's height and the card
stretches to it — so the copy on the right can run to any length without the row going
ragged.

**Karya is gone.** It was an editorial statement, a three-column parallax gallery and a
second statement ("Dunia bergerak cepat…"); the gallery and the second statement went
first, then the section with them. `galeri` in site.ts, `initKarya` in motion.ts, the
`#karya` anchor and the only `data-speed` on the page all went too. ScrollSmoother still
runs with `effects: true`, so the next element to carry that attribute gets parallax for
free.

**The CTA no longer has doors.** "Hubungi kami" and "Lihat unit usaha" — the two
oversized panels under the headline — are gone, along with `cta.cards` and every
`.cta-door*` rule. What is left is the kicker, the headline and the paragraph over the
blurred photograph, with a longer run-out below them so `.cta-fade` still has the length
it needs to reach the footer's ink. The navbar's own "Hubungi kami" is now the only
contact target on the page.

The bracketed kickers — `(01) Misi`, `(02) Kepedulian`, `(03) Magang`, `(04) Mulai` —
run in page order across those four sections. Inserting a section between them means
renumbering. The kickers on Tentang and Unit Usaha are deliberately outside that
sequence.
Both pages import `src/scripts/motion.ts`, and every init in it is guarded on its own
elements, so `/unit-usaha` gets the smoother, the menu and the tile entrances and
nothing else. One thing there is not automatic: `SiteNav` takes a `solid` prop and
`/unit-usaha` passes it. The bar's light state is normally flipped by a ScrollTrigger on
`#hero`, and without a hero nothing would ever flip it — the links would stay white on
cream. `SiteNav` and `SiteFooter` also rewrite a bare `#section` href to `/#section` off
the landing page, because `motion.ts` only intercepts `a[href^="#"]` and a bare anchor
would otherwise lead nowhere.

Still outstanding:

- `src/components/Welcome.astro` and `src/assets/*.svg` are leftover Astro starter files
  that nothing imports any more.
- `site` in `astro.config.mjs` is still `http://localhost:4321`.
- Photography is hot-linked from Unsplash. Real assets should move into `src/assets/`
  and go through `astro:assets`.
- `public/hero.mp4` is an encode, not a master. The master is `media/hero-master.mp4` —
  51 MB of 1920×1080 h264 at 20 Mbps, gitignored because `media/` is, and kept out of
  `public/` so it is never shipped. **Always re-encode from the master**, never from
  `public/hero.mp4`, which is already lossy. The shipped file is:

  ```
  ffmpeg -i media/hero-master.mp4 -an -c:v libx264 -preset veryslow -crf 28 \
    -profile:v high -level 4.0 -pix_fmt yuv420p -g 60 -movflags +faststart public/hero.mp4
  ```

  4.6 MB at 1.8 Mbps, still full 1080p so it stays sharp under the push-in's 108% scale.
  `-an` drops the audio a `muted` video could never play; `+faststart` puts the `moov`
  index at the front so the player can decode a frame without reading to the end of the
  file. CRF 28 was picked off a measured curve rather than by eye — `libvmaf` against
  the master scores it 89.7, versus 93.9 at CRF 24 (7.6 MB) and 84.8 at CRF 31 (3.4 MB).
  Behind the hero scrim that is where the file stops getting meaningfully better. There
  is still no WebM/AV1 sibling and no smaller cut for narrow viewports.

- The unit usaha tiles carry the real subsidiary logos from `public/units/`. Only the
  all-black lock-up (`logo`) is on the page now, crushed to white by a CSS filter, so
  `logoHover` — the full-colour variant — is unused by any component and is kept because
  the pair is what a new unit is expected to ship. Those PNGs are still served straight
  from `public/`, not through `astro:assets`, and several are far larger than the mark
  they render into. Their `url` fields are all still `"#"`, which is what renders the
  visit link `aria-disabled`.
- The navbar has **no section links on desktop**. The link row in `SiteNav.astro` is
  commented out and the burger that opens the mobile menu is `md:hidden`, so above `md`
  the only thing in the bar is the wordmark and "Hubungi kami" — `navLinks` is exported,
  kept in step with the page, and rendered nowhere (which is the one warning `astro
check` reports). Left as found; uncommenting that row is the whole fix if the links
  are wanted back.
- Parts of the stylesheet still describe pages that do not exist: a `trackingDisabled`
  flag for shipment tracking, blog article bodies (`prose-article`), and `stack-card`
  (written for a sticky-stack version of the section that is now Misi).
- `src/components/ui/Globe.vue`, `globeMarkers` in `site.ts` and the `cobe` /
  `vue-use-spring` dependencies are dead since Kinerja lost its globe. Nothing imports
  Vue any more either — `@astrojs/vue` is still wired up for the two Inspira UI
  components that remain (`TextScrollReveal` / `ScrollWord` in Tentang), so the
  integration stays, but the globe half can be deleted whenever it is clearly not
  coming back.

## Dependency notes

`pnpm-workspace.yaml` enables post-install builds for `esbuild`, `sharp` and `vue-demi`,
and pins a `minimumReleaseAge` exception for `astro@7.2.7`. Very fresh releases are
blocked by pnpm's release-age gate; adding one needs a `minimumReleaseAgeExclude` entry
there. `vue-demi` (transitively, via `vue-use-spring`) genuinely needs its postinstall:
it picks the Vue 2 or Vue 3 entry point, and skipping it resolves the package to the
Vue 2 shim. pnpm fails the install outright until a new build script is listed either
way, so a fresh dependency can break `astro check` before it breaks anything else.

`cobe` (WebGL globe) and `vue-use-spring` (its drag inertia) are there for
`src/components/ui/Globe.vue` and nothing else — and that component is no longer on the
page, so both are currently dead weight. See **Still outstanding**.

`gsap` is a single package — since 3.13 the former Club plugins ship inside it under the
standard licence, so `ScrollTrigger` and `ScrollSmoother` are plain
`import … from "gsap/ScrollSmoother"`. There is nothing extra to install and no private
registry to configure.

`tsconfig.json` mirrors the `@` → `/src` alias as a `paths` entry. Vite resolves the
alias at build time regardless; the tsconfig copy is what makes `astro check` and the
editor resolve it.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
