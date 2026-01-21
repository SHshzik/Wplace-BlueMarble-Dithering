import esbuild from 'esbuild';
import fs from 'fs';
// import path from 'path';
// import postcss from 'postcss';
// import postcssConfig from './postcss.config.cjs';

const cssOutFile = 'dist/styles.css';
let collectedCss = '';

const OUT_JS = 'dist/userscript.js';
const META_JS = 'meta/RedMarble.meta.js';

// /**
//  * CSS Modules plugin
//  */
// const cssModulesPlugin = {
//   name: 'css-modules',
//   setup(build) {
//     build.onLoad({ filter: /\.module\.css$/ }, async (args) => {
//       const css = await fs.promises.readFile(args.path, 'utf8');
//
//       let json = {};
//
//       const result = await postcss(postcssConfig.plugins).process(css, {
//         from: args.path
//       });
//
//       result.messages.forEach((msg) => {
//         if (msg.type === 'export') {
//           json = msg.exportTokens;
//         }
//       });
//
//       collectedCss += result.css + '\n';
//
//       return {
//         contents: `
//           export default ${JSON.stringify(json)};
//         `,
//         loader: 'js'
//       };
//     });
//
//     build.onEnd(() => {
//       fs.mkdirSync(path.dirname(cssOutFile), { recursive: true });
//       fs.writeFileSync(cssOutFile, collectedCss);
//     });
//   }
// };
//
// const cssModulesPlugin = {
//   name: 'css-modules',
//   setup(build) {
//     build.onLoad({ filter: /\.module\.css$/ }, async (args) => {
//       const css = await fs.promises.readFile(args.path, 'utf8');
//
//       let json = {};
//
//       const result = await postcss(postcssConfig.plugins).process(css, {
//         from: args.path
//       });
//
//       result.messages.forEach(msg => {
//         if (msg.type === 'export') json = msg.exportTokens;
//       });
//
//       // Prod: отдельный файл
//       collectedCss += result.css + '\n';
//       return {
//         contents: `export default ${JSON.stringify(json)};`,
//         loader: 'js'
//       };
//     });
//   }
// };

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: OUT_JS,
  bundle: true,
  format: 'iife',
  target: ['es2020'],
  // plugins: [cssModulesPlugin],
  minify: true
});

const [meta, bundle] = await Promise.all([
  fs.promises.readFile(META_JS, 'utf8'),
  fs.promises.readFile(OUT_JS, 'utf8')
]);

await fs.promises.writeFile(
  OUT_JS,
  `${meta.trim()}\n\n${bundle}`
);

