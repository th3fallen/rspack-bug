const webpack = require('webpack');
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const { getConfig } = require('../config');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const CopyPlugin = require('copy-webpack-plugin');
require('regenerator-runtime/runtime');

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

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-source-map',
	entry: {
		app: ['./app/shared/vendor', './app/main'],
	},
	output: {
		publicPath: publicPath || '/',
		path: path.resolve(cwd, 'dist'),
		filename: 'assets/js/[name].js',
	},
	resolve: {
		mainFields: ['browser', 'main', 'module'],
		modules: [path.resolve('node_modules'), 'node_modules', path.resolve(cwd, 'app')].concat(/* ... */),
		extensions: ['.wasm', '.mjs', '.ts', '.tsx', '.js', '.jsx', '.json'],
		fallback: { 'util': require.resolve('util/') },
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {}, // god dammit Twilio why do you always reference Node stuff in your browser code?? why?????
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			CONFIG: JSON.stringify(env),
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'app/index.html',
			faviconPath: `${ publicPath }assets/img/favicon.ico`,
			googleMapsToken: config.GOOGLE_MAPS_TOKEN,
			iconLibraryRoot: `${ config.ICON_LIBRARY_HOST }/${ config.ICON_LIBRARY_VERSION }`,
			chunksSortMode: 'none',
			noindex: config.NOINDEX,
		}),
		new HtmlWebpackPlugin({
			filename: 'ok',
			template: 'app/ok',
			build: JSON.stringify(env.DEPLOY).toLocaleLowerCase(),
			inject: false,
		}),
		new CopyPlugin({
			patterns: [
				{ from: 'app/shared/static-assets', to: 'static-assets' },
				{ from: 'app/shared/well-known', to: '.well-known' },
			],
		}),
		new ReactRefreshWebpackPlugin({
			esModule: true,
			overlay: false,
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: false,
		}),
	],
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
		liveReload: false,
		allowedHosts: 'all',
		historyApiFallback: true,
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					// this caches all the vendors which are unlikely to change
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				loader: 'swc-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(scss|css)$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									require('autoprefixer'),
								],
							},
						},
					},
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
				loader: 'yml-loader',
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
