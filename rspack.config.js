const HtmlPlugin = require('@rspack/plugin-html').default

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
	context: __dirname,
	entry: {
		main: "./src/main.js"
	},
	mode: 'development',

	// 1. use builtins, not working
	// builtins: {
	// 	html: [
	// 		{
	// 			template: "./index.html"
	// 		}
	// 	]
	// },

	// 2. use plugin-html, not working
	plugins: [
		new HtmlPlugin({
			template: "./index.html"
		})
	]

	// expected: `builtins.html` or `plugin-html` should work
};
