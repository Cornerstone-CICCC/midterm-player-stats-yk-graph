// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";

// bejamas:astro-fonts:start
/** @type {NonNullable<import("astro/config").AstroUserConfig["fonts"]>} */
const BEJAMAS_ASTRO_FONTS = [
  {
    provider: fontProviders.google(),
    name: "Inter",
    cssVariable: "--font-sans",
    subsets: ["latin"],
  },
];
// bejamas:astro-fonts:end

// https://astro.build/config
export default defineConfig({
  fonts: BEJAMAS_ASTRO_FONTS,
  output: "server",
  adapter: node({ mode: "standalone" }),
  vite: {
    plugins: [tailwindcss()],
  },
});
