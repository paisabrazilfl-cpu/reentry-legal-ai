// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/.local/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.expo/**",
      "**/lib/api-client-react/src/generated/**",
      "**/lib/api-zod/src/generated/**",
      "**/artifacts/mobile/scripts/**",
      "**/artifacts/mobile/server/**",
      "**/artifacts/mobile/metro.config.js",
      "**/artifacts/mobile/babel.config.js",
      "**/artifacts/api-server/build.mjs",
      "**/artifacts/mockup-sandbox/**",
      "**/lib/integrations-openai-ai-react/src/audio/audio-playback-worklet.js",
      "**/lib/integrations-openai-ai-server/**",
      "**/lib/integrations/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "error",
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
);
