const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
	context: __dirname,
	entry: {
		main: "./src/main.js"
	},
	mode: 'development',
	plugins: [
		// nice work
		new HtmlWebpackPlugin({
			template: "./index.html"
		})
	]
};
