module.exports = {
	files: ['./dist/component.css', './dist/component.js', './index.html'],
	server: {
		baseDir: './docs',
		routes: {
			'/node_modules': 'node_modules',
			'/dist': 'dist'
		}
	},
	https: true
};
