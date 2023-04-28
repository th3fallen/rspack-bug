/** @type {import('@rspack/cli').Configuration} */


const path = require('path');

const cwd = process.cwd();


const getSourceMapType = envFlag => {
	switch (envFlag) {
		case 'staging':
			return 'eval-source-map';
		case 'development':
			return 'cheap-module-source-map';
		default:
			return false;
	}
};

module.exports = function (envFlag) {
	const envName = Object.keys(envFlag).pop() ?? process.env.NODE_ENV;

	const isDevelopment = envName === 'development';


	const env = {
		ENV: envName,
		DEPLOY: {
			SHA: process.env.GIT_SHA,
			TAG: process.env.GIT_TAG,
		},
	};

	return {
		mode: 'production',
		devtool: getSourceMapType(envName),
		builtins: {
			presetEnv: {
				corejs: 3,
			},
			define: {
				'process.env': {}, // god dammit Twilio why do you always reference Node stuff in your browser code?? why?????
				CONFIG: JSON.stringify(env),
			},
			html: [
				{
					template: 'app/index.html',
					filename: 'index.html',
					templateParameters: {
					},
				},
			],
			react: {
				runtime: 'automatic',
			},
		},
		target: ['web'],
		entry: './app/main',
		output: {
			publicPath: '/',
			path: path.resolve(cwd, 'dist'),
			filename: isDevelopment ? 'assets/js/[name].js' : 'assets/js/[name]-[contenthash].js',
			cssFilename: isDevelopment ? 'assets/css/[name].css' : 'assets/css/[name]-[contenthash].css',
			cssChunkFilename: 'assets/css/[name]-[contenthash].css',
		},
		resolve: {
			modules: ['node_modules', 'app'],
		},
		devServer: isDevelopment ? {
			host: '0.0.0.0',
			port: 3001,
			hot: true,
			allowedHosts: 'all',
			historyApiFallback: true,
		} : {},
		optimization: {
			splitChunks: {
				chunks: 'all',
				minChunks: 1,
				cacheGroups: {
					defaultVendors: {
						test: /[\\/]node_modules[\\/]/,
						priority: -10,
						name: 'vendor',
					},
					default: {
						minChunks: 2,
						priority: -20,
					},
				},
			},
		},
		module: {
			rules: [
				{
					test: /\.(ts |jsx?)$/,
					type: 'jsx',
					exclude: /node_modules/,
				},
				{
					test: /\.mjs$/i,
					type: 'javascript/esm',
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
					type: 'asset',
					generator: {
						filename: 'assets/img/[name][ext][query]',
					},
				},
			],
		},
	};
};
