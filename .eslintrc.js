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
	rules: {
		// 0 = "off", 1 = "warn", 2 = "error"
		"max-len": [1, 120, 2, { ignoreComments: true }],
		// "quote-props": [1, "consistent-as-needed"],
		"no-else-return": 0, // This is just dumb and favors slightly less typing over clarity.
		"no-bitwise": 0, // Just for the bitwise stuff needed in the CS project.
		"no-console": 0, // When on it makes warnings ignorable because they are always there. Default is bad.
		// "no-param-reassign": ["error", { props: false }],
		"no-param-reassign": 0, // Dumb overcompensation
		"prefer-const": 1, // Distracting as an error
		"no-unused-vars": [1, { vars: "local", args: "none" }], // Distracting as an error
		"no-plusplus": 0, // No semicolon is a stupid reason to remove this classic operator
		"operator-assignment": 0,
		"spaced-comment": 0,
		radix: 0
		//indent: ["error", "tab"]
	}
};
