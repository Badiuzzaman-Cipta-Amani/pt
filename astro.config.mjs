import sitemap from "@astrojs/sitemap"
import vue from "@astrojs/vue"
import tailwindcss from "@tailwindcss/vite"
import robotsTxt from "astro-robots-txt"
// @ts-check
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  // Required by @astrojs/sitemap and used for canonical/OG absolute URLs.
  site: "http://localhost:4321",
  integrations: [vue(), sitemap(), robotsTxt()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
})
