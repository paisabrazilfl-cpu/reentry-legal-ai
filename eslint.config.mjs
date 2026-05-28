// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/.local/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/.expo/**",
      "**/build/**",
      "lib/api-client-react/**",
      "lib/api-zod/**",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "warn",
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
  {
    files: [
      "**/*.cjs",
      "artifacts/mobile/metro.config.js",
      "artifacts/mobile/babel.config.js",
      "artifacts/mobile/scripts/**/*.js",
      "artifacts/mobile/server/**/*.js",
      "artifacts/api-server/build.mjs",
      "scripts/**/*.js",
    ],
    languageOptions: {
      globals: {
        require: "readonly",
        module: "writable",
        exports: "writable",
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
        console: "readonly",
        AbortController: "readonly",
        AbortSignal: "readonly",
        URL: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        Buffer: "readonly",
        fetch: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-console": "off",
    },
  },
  {
    files: ["**/audio-playback-worklet.js"],
    languageOptions: {
      globals: {
        AudioWorkletProcessor: "readonly",
        registerProcessor: "readonly",
        sampleRate: "readonly",
        currentTime: "readonly",
        currentFrame: "readonly",
      },
    },
  },
  {
    files: ["scripts/src/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  }
);
