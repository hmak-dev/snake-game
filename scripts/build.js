const fs = require('fs');
const esbuild = require('esbuild');
const {sassPlugin} = require('esbuild-sass-plugin');
const minimist = require('minimist');

const args = minimist(process.argv);

if (!fs.existsSync('build')) {
	fs.mkdirSync('build');
}

console.log('- Copying HTML File...');
fs.copyFileSync('src/index.html', 'build/index.html');

const config = {
	entryPoints: ['src/main.ts', 'src/main.sass'],
	outdir: 'build',
	bundle: true,
	minify: true,
	keepNames: false,
	legalComments: 'none',
	plugins: [sassPlugin()],
};

if (args.serve) {
	console.log('- Starting Server...');

	esbuild.serve({
		servedir: 'build',
		host: args.host || '0.0.0.0',
		port: args.port || 8000,
	}, config).then(() => {
		console.log('+ Server Started at http://0.0.0.0:8000');
	})
} else {
	config.watch = args.watch;

	console.log('- Bundling...');

	esbuild.build(config).then(() => {
		console.log('+ Build Finished Successfully');
	})
}
