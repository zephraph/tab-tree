import { defineConfig } from "wxt";
import { preprocessMeltUI, sequence } from "@melt-ui/pp";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  extensionApi: "webextension-polyfill",
  modules: ["@wxt-dev/module-svelte"],
  vite: () => ({
    plugins: [
      // TODO there's a type conflict here
      tailwindcss() as any,
    ],
  }),
  svelte: {
    vite: {
      preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
    },
  },
});
