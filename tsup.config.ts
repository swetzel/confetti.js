import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["./src/index.ts"],
        format: ["cjs", "esm"],
        dts: true,
        splitting: true,
        sourcemap: false,
        clean: true,
    },
    {
        entry: { confetti: "src/browser.ts" },
        format: ["iife"],
        outDir: "dist",
        minify: true,
        clean: true,
    },
]);
