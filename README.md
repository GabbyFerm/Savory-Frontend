<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Savory-Frontend

A fullstack recipe management application where users can store, organize, and manage their personal recipes with ease.

---

## Development notes (template)

This project uses React + TypeScript + Vite. The template includes a minimal setup to get React working in Vite with HMR and some ESLint rules.

Useful notes from the template:

- Plugins:
  - `@vitejs/plugin-react` uses Babel for Fast Refresh.
  - `@vitejs/plugin-react-swc` uses SWC for Fast Refresh.

## React Compiler

The React Compiler is not enabled in this template because of its impact on dev & build performance. To add it, see the official documentation: https://react.dev/learn/react-compiler/installation

## Expanding the ESLint configuration

For production apps, enable type-aware lint rules. Example snippet to include in `eslint.config.js`:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // or tseslint.configs.strictTypeChecked
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

You can also add React-specific lint plugins such as `eslint-plugin-react-x` and `eslint-plugin-react-dom` if desired.

---

If you'd like, I can further edit this README to include setup instructions, local development commands, or a short contributor guide. 
      // Other configs...
