
import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

const minify = process.argv.includes('--minify');
const watch = process.argv.includes('--watch');
const server = process.argv.includes('--server');
// --tree-shaking=true

const ctx = await esbuild.context({
  entryPoints: ["./app/main.js"],
  outdir: "./dist",
  bundle: true,
  allowOverwrite: true,
  plugins: [sassPlugin({
    loadPaths: ['./node_modules']
  })],
  sourcemap: true,
  publicPath: 'assets',
  sourcemap: true,
  banner: {
    js: server ? `new EventSource('/esbuild').addEventListener('change', () => location.reload());` : '',
  }
});

if (minify) {
  await ctx.minify();
}

if (watch) {
  await ctx.watch();
} else {
  await ctx.rebuild();;
  ctx.dispose();
}



if (server) {
  const { host, port } = await ctx.serve({
    servedir: './',
    // port: 5500,
    // fallback: "www/index.html"
  });
  console.log('serve app at http://' + host + ':' + port);
}






