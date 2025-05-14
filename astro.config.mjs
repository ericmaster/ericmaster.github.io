// @ts-check
import { defineConfig } from "astro/config";
import Icons from "unplugin-icons/vite";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://ericmaster.github.io",

  vite: {
    plugins: [
      Icons({
        compiler: "astro",
        autoInstall: true,
      }),
      tailwindcss(),
    ],
  },

  integrations: [icon()],
});