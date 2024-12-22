import { defineConfig } from "wxt";
import { preprocessMeltUI, sequence } from "@melt-ui/pp";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  extensionApi: "webextension-polyfill",
  modules: ["@wxt-dev/module-svelte"],
  vite: () => ({
    resolve: {
      alias: {
        $lib: path.resolve(__dirname, "./src/lib"),
      },
    },
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
