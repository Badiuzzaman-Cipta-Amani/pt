# Amani Group

Corporate site for Amani Group — a holding company with four subsidiaries. Static
[Astro 7](https://astro.build) + Tailwind v4, no framework runtime.

## Commands

| Command             | Action                                         |
| :------------------ | :--------------------------------------------- |
| `pnpm install`      | Install dependencies                           |
| `pnpm dev`          | Dev server at `localhost:4321`                 |
| `pnpm build`        | Build the site to `./dist/`                    |
| `pnpm preview`      | Preview the production build                   |
| `pnpm astro check`  | Typecheck                                      |
| `pnpm exec oxlint`  | Lint                                           |
| `pnpm exec oxfmt .` | Format (also sorts imports + Tailwind classes) |

## Layout

```text
src/
├── content/articles/   one .md per article (the file name is the slug)
├── data/site.ts        every piece of copy on the site
├── data/units.ts       the four business units
├── assets/units/       unit logos (served through astro:assets)
├── components/         nav, footer, section blocks
├── layouts/Layout.astro
├── pages/              /  /about  /unit-usaha[/slug]  /artikel[/slug]  /contact
├── scripts/site.ts     navbar, reveals, counters, rail
└── style/main.css      the Tailwind v4 design system
```

See `CLAUDE.md` for the full map, invariants and what is still outstanding. Set `site`
in `astro.config.mjs` before deploying.
