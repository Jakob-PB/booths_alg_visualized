module.exports = {
    env: {
        es6: true,
        node: true,
        browser: true
    },
    extends: ["airbnb", "prettier"],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module"
    },
    // 0 = "off", 1 = "warn", 2 = "error"
    rules: {
        "max-len": 0, // Let Prettier handle this
        "no-else-return": 0, // Turning this off as it favors slightly less typing over clarity.
        "no-bitwise": 0, // Turn off just for the bitwise stuff needed in the CS project.
        "no-param-reassign": 0, // This rule is an overcompensation for this project.
        "prefer-const": 1, // Very distracting as an error, perfer this for a Git hook or CI.
        "no-unused-vars": [1, { vars: "local", args: "none" }], // Distracting as an error, perfer this for a Git hook or CI.
        "no-plusplus": [1, { allowForLoopAfterthoughts: true }], // Allow classic style for loops
        "operator-assignment": 0 // Off for increased clarity
    }
};
