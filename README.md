
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

