const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

module.exports = {
    roots: [
        "<rootDir>/src",
    ],
    preset: "ts-jest",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.ts?$": "ts-jest",
    },
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
    moduleDirectories: ["node_modules", "src", "tests"],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    globals: {
        "NODE_ENV": "test",
    },
    testEnvironment: "node",
};
