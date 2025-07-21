
# 📊 Wikidata Backend API

This project is a backend REST API built with **Node.js**, **TypeScript**, and **Express**, using **Inversify** for dependency injection and **Jest** for testing.

Follow the setup instructions below to get started:

---

## ⚙️ Setup Instructions

### 1. Install dependencies
Make sure you have **Node.js** (>=18) and **npm** installed.

Then install the project dependencies:

```bash
npm install
```

---

### 2. Environment configuration
Create a `.env` file at the root of your project and define your environment variables. For example:

```
PORT=3000
NODE_ENV=development
```

The `dotenv` package is used to load these variables automatically.

---

### 3. Start the development server

To run the server using TypeScript directly:

```bash
npm start
```

Or to run the compiled JavaScript (after build):

```bash
npm run start:js
```

---

### 4. Build the project

Compile the TypeScript code into JavaScript:

```bash
npm run build
```

To check for TypeScript errors **without generating files**:

```bash
npm run tsc:noEmit
```

---

## 🧪 Running Tests

This project uses **Jest** and **ts-jest** for unit testing. To run the tests:

```bash
npm test
```

The test environment is configured in `jest.config.js`.

---

## 📁 Project structure

```
src/
 └── server/
      └── index.ts       # Entry point of the application
tests/
 └── *.test.ts           # Jest test files
```

---

## 🧩 Main Technologies

| Tool             | Purpose                         |
|------------------|----------------------------------|
| `express`        | HTTP server framework           |
| `typescript`     | Typed JavaScript                |
| `inversify`      | Dependency Injection container  |
| `jest`           | Testing framework               |
| `ts-node`        | Run TypeScript without compiling |
| `dotenv`         | Environment variable loader     |
| `helmet`         | Secures HTTP headers            |

---

# 📊 Wikidata  Front End


# React + TypeScript + Vite

This project provides a modern and minimal boilerplate for building React applications using **TypeScript** and **Vite**, with **Hot Module Replacement (HMR)** and configurable **ESLint** support.

## Features

* 🚀 **Fast development** with [Vite](https://vitejs.dev/)
* ⚛️ **React** with TypeScript support
* ♻️ **HMR** for instant updates during development
* ✅ **ESLint** integration for code quality and consistency

## Plugins

This template currently supports two official Vite plugins for React:

* [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react): uses [Babel](https://babeljs.io/) for Fast Refresh
* [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc): uses [SWC](https://swc.rs/) for even faster builds

You can choose the one that best fits your performance or tooling needs.

---

## Improving the ESLint Configuration

For production-grade applications, we recommend enabling type-aware linting by updating your ESLint configuration.

```ts
export default tseslint.config({
  extends: [
    // Recommended type-checked rules
    ...tseslint.configs.recommendedTypeChecked,
    
    // Or stricter rules for better safety
    ...tseslint.configs.strictTypeChecked,

    // Optional: stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

### Optional: Add React-Specific ESLint Plugins

You can enhance linting further by adding:

* [`eslint-plugin-react-x`](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x)
* [`eslint-plugin-react-dom`](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)

#### Example:

```ts
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

---

## Getting Started

1. **Install dependencies**:

```bash
npm install
```

2. **Start the development server**:

```bash
npm run dev
```

3. **Build for production**:

```bash
npm run build
```

4. **Preview production build locally**:

```bash
npm run preview
```

---

## License

This project is provided under the [MIT License](LICENSE).
