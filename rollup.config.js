import path from 'path';
import fs from 'fs';
import babel from 'rollup-plugin-babel';

let pkg = JSON.parse(fs.readFileSync('./package.json'));

export default {
	input: 'src/vhtml.js',
	sourcemap: path.resolve(pkg.main),
	name: pkg.amdName,
	output:{
		file:pkg.main,
		format: 'umd'
	},
	plugins: [
		babel({
			babelrc: false,
			comments: false,
			presets: [
				['es2015', { loose:true, modules:false }]
			].concat(pkg.babel.presets.slice(1)),
			plugins: pkg.babel.plugins
		})
	]
};
