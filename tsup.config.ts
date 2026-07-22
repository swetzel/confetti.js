import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["./src/index.ts"],
        format: ["cjs", "esm"],
        dts: true,
        splitting: true,
        sourcemap: true,
        clean: true,
    },
    {
        entry: { confetti: "src/browser.ts" },
        format: ["iife"],
        outDir: "dist",
        minify: true,
        sourcemap: false,
        clean: false,
        outExtension: () => ({ js: ".min.js" }),
    },
]);
