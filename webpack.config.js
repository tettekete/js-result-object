const path = require('path');

module.exports =
{
	entry: './src/index.ts',
	target: 'node',	// or 'web'
	mode: 'none',	// or 'development' or 'production'
	// 書き出し先設定
	output:
	{
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist')
	},

	// TypeScript のローダー設定
	module: {
    	rules:[
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},

	// 拡張子なしの import 文の拡張子解決順指定
	resolve:
	{
		extensions: [ '.ts' ,'.js' ]
	},

	// ソースマップは開発中のみ有効化
  	devtool: 'source-map',

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
}
