import js from "@eslint/js"
import globals from "globals"
import stylisticJs from "@stylistic/eslint-plugin-js"

export default [
	js.configs.recommended, // https://eslint.org/docs/latest/use/configure/configuration-files#using-predefined-configurations
	{
		plugins: {
			"@stylistic/js": stylisticJs
		},
		ignores:         ["pkg/**/*", ".wrangler/**/*", "node_modules/**/*", "**/dist/**/*" ],
		languageOptions: {
			ecmaVersion:   "latest",
			sourceType:    "module",
			parserOptions: { ecmaFeatures: { impliedStrict: true } },
			globals:       {
				...globals.browser
			}
		},
		rules: {
			"no-unused-vars": ["error", {
				"varsIgnorePattern": "_",
				"argsIgnorePattern": "_"
			}],
			"prefer-const":                  [ "error", { "ignoreReadBeforeAssign": true }],
			"eqeqeq":                        [ "error", "always" ], // enforce the use of strict equality operators
			"strict":                        [ "error", "global" ], // enforce the use of strict mode, which is enabled by default in ES6

			// (Optional) Stylistic rules
			"@stylistic/js/no-multi-spaces":     [ "error", { "ignoreEOLComments": false } ],
			"@stylistic/js/indent":              [ "error", "tab" ],
			"@stylistic/js/linebreak-style":     [ "error", "unix" ],
			"@stylistic/js/quotes":              [ "error", "double" ],
			"@stylistic/js/semi":                [ "error", "never" ],
			"@stylistic/js/space-infix-ops":     [ "error", { "int32Hint": false } ],
			"@stylistic/js/space-before-blocks": [ "error", {
				"functions": "always",
				"keywords":  "always",
				"classes":   "never"
			}
			],
			"@stylistic/js/key-spacing": [ "error", {
				"beforeColon": false,
				"afterColon":  true,
				"mode":        "minimum",
				"align":       "value"
			}
			],
		},
	}
]
