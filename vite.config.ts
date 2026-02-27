import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import monkey, { cdn } from 'vite-plugin-monkey';

export default defineConfig({
  css: {
    modules: {
      generateScopedName: '[hash:base64:5]',
      localsConvention: 'camelCase',
    }
  },
  build: {
    minify: true,
  },
  plugins: [
    preact(),
    monkey({
      entry: 'src/main.tsx',

      userscript: {
        name: 'Red Marble New',
        namespace: 'https://github.com/SHshzik/',
        version: '0.86.10',
        description: 'A userscript to automate and/or enhance the user experience on Wplace.live. Make sure to comply with the site\'s Terms of Service, and rules! This script is not affiliated with Wplace.live in any way, use at your own risk. This script is not affiliated with TamperMonkey. The author of this userscript is not responsible for any damages, issues, loss of data, or punishment that may occur as a result of using this script. This script is provided "as is" under the MPL-2.0 license. The "Blue Marble" icon is licensed under CC0 1.0 Universal (CC0 1.0) Public Domain Dedication. The image is owned by NASA.',
        author: 'SHshzik',
        license: 'MPL-2.0',
        homepageURL: 'https://github.com/SHshzik/Wplace-BlueMarble-Dithering',
        icon: 'https://raw.githubusercontent.com/SHshzik/Wplace-BlueMarble-Dithering/refs/heads/main/dist/assets/Favicon.png',
        updateURL: 'https://github.com/SHshzik/Wplace-BlueMarble-Dithering/blob/main/dist/RedMarble.user.js',
        downloadURL: 'https://github.com/SHshzik/Wplace-BlueMarble-Dithering/blob/main/dist/RedMarble.user.js',
        match: ['https://wplace.live/*'],
        // grant: ['GM_getResourceText', 'GM_addStyle', 'GM.setValue', 'GM_getValue'],
        resource: { 'CSS-BM-File': 'https://raw.githubusercontent.com/SHshzik/Wplace-BlueMarble-Dithering/refs/heads/feature/global/dist/styles.css' }
      },

      build: {
        externalGlobals: {
          preact: cdn.jsdelivr('preact', 'dist/preact.min.js'),
        },
      },
    }),
  ],
});
