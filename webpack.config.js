const path = require('path');

module.exports = (env, argv) => (
{
	entry: './src/result.ts',
	target: 'node',	// or 'web'
	mode: argv.mode || 'none',	// or 'development' or 'production'
	// 書き出し先設定
	output:
	{
		filename: 'result.js',
		path: path.resolve(__dirname, 'dist'),
		library: {
			// name: 'Result',
			type: 'umd',
		}
	},

	// TypeScript のローダー設定
	module: {
    	rules:[
			{
				test: /\.ts$/,
				use: {
					loader: 'ts-loader'
				},
				exclude: /node_modules/
			}
		]
	},

	// stats: 'verbose',

	// 拡張子なしの import 文の拡張子解決順指定
	resolve:
	{
		extensions: [ '.ts' ,'.js' ]
	},

	// ソースマップは開発中のみ有効化
	devtool: argv.mode === 'development' ? 'source-map' : false,

	// target: node の場合、これらはバンドルしない（node で提供されているため）
	externals: {
		fs: 'commonjs fs',
		path: 'commonjs path',
	},

	// __dirname,__filename について Webpack で上書きしない
	node: {
		__dirname: false,
		__filename: false,
	},
});
