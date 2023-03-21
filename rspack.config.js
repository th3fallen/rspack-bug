const { getConfig } = require('./config');

const path = require('path');


const { config } = getConfig();
const cwd = process.cwd();

const publicPath =
	(config.PREFIX || '').replace(/\/$/, '') +
	path.join(process.env.PUBLIC_PATH || '/').replace(/^\./, '');
const env = {
	...config,
	PUBLIC_PATH: publicPath || '/',
	ENV: process.env.NODE_ENV || 'dev',
	DEPLOY: {
		SHA: process.env.GIT_SHA,
		TAG: process.env.GIT_TAG,
	},
};

console.log('rspack.config:22', cwd);
module.exports = {
	builtins: {
		presetEnv: {
			corejs: 3,
		},
		define: {
			'process.env': {}, // god dammit Twilio why do you always reference Node stuff in your browser code?? why?????
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			CONFIG: JSON.stringify(env),
		},
		html: [
			{
				template: 'app/index.html',
				filename: 'index.html',
				favicon: 'app/styles/assets/img/favicon.ico',
				templateParameters: {
					googleMapsToken: config.GOOGLE_MAPS_TOKEN,
					iconLibraryRoot: `${ config.ICON_LIBRARY_HOST }/${ config.ICON_LIBRARY_VERSION }`,
				},
			},
			// {
			//   filename: 'ok',
			//   template: 'app/ok',
			//   templateParameters: {
			//     build: JSON.stringify(env.DEPLOY).toLocaleLowerCase(),
			//   },
			// },
		],
		copy: {
			patterns: [
				{ from: 'app/shared/static-assets', to: 'static-assets' },
				{ from: 'app/shared/well-known', to: '.well-known' },
			],
		},
	},
	target: ['web'],
	devtool: 'source-map',
	entry: {
		main: './app/main',
		thirdParty: './app/shared/vendor',
	},
	output: {
		publicPath: publicPath || '/',
		path: path.resolve(cwd, 'dist'),
		filename: 'assets/js/[name]-[chunkhash].js',
	},
	resolve: {
		mainFields: ['browser', 'main', 'module'],
		modules: [path.resolve('node_modules'), 'node_modules', path.resolve(cwd, 'app')].concat(/* ... */),
		extensions: ['.wasm', '.mjs', '.ts', '.tsx', '.js', '.jsx', '.json'],
		fallback: { 'util': require.resolve('util/') },
	},
	devServer: {
		client: {
			overlay: true,
			progress: true,
			webSocketURL: {
				protocol: 'wss',
				hostname: 'appx.whenidev.net',
				port: 443,
			},
		},
		host: '0.0.0.0',
		port: 3000,
		hot: 'only',
		allowedHosts: 'all',
		historyApiFallback: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				type: 'jsx',
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'postcss-loader',
					},
				],
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: 'sass-loader',
						options: {
							additionalData: '@import "styles/resources";',
							sassOptions: {
								quietDeps: true,
								includePaths: [path.join(cwd, 'app')],
							},
						},
					},
				],
				type: 'css',
			},
			{
				test: /\.mjs$/,
				type: 'javascript/auto',
			},
			{
				test: /\.(woff|woff2|eot|ttf)$/,
				type: 'asset',
				parser: {
					dataUrlCondition: {
						maxSize: 4 * 1024,
					},
				},
				generator: {
					filename: 'assets/font/[hash][ext][query]',
				},
			},

			{
				test: /\.(png|jpe?g|gif|svg|xlsx)$/,
				type: 'asset',
				parser: {
					dataUrlCondition: {
						maxSize: 4 * 1024,
					},
				},
				generator: {
					filename: 'assets/img/[hash][ext][query]',
				},
			},
			{
				test: /\.yml$/,
				type: 'asset',
			},
			{
				test: /\.ico$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/img/[name][ext][query]',
				},
			},
		],
	},
};
