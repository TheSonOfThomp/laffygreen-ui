import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import urlPlugin from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import fs from 'fs';
import path from 'path';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.ts', '.tsx'];

const { name } = require(path.resolve(process.cwd(), 'package.json'));

function getAllPackages(dir) {
  const dirList = fs.readdirSync(dir);

  return dirList
    .map(subDir => `${path.resolve(dir, subDir)}/package.json`)
    .filter(packageJsonPath => fs.existsSync(packageJsonPath))
    .map(packageJsonPath => require(packageJsonPath).name);
}

function getLodashExternals() {
  return fs
    .readdirSync(path.resolve(__dirname, 'node_modules', 'lodash'))
    .filter(fileName => {
      const splitName = fileName.split('.');
      const extension = splitName[splitName.length - 1];

      return extension === 'js';
    })
    .map(fileName => 'lodash/' + fileName.split('.')[0]);
}

function getGeneratedFiles() {
  const directory = path.resolve(process.cwd(), 'src/generated');

  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter(file => /\.tsx?$/.test(file))
    .map(file => path.resolve(directory, file));
}

const allPackages = getAllPackages(path.resolve(__dirname, 'packages'));

// Mapping of packages to the `window` property they'd be
// bound to if used in the browser without a module loader.
// This is defined on a best effort basis since not all
// modules are compatible with being loaded directly.
const globals = {
  clipboard: 'ClipboardJS',
  'highlightjs-graphql': 'hljsDefineGraphQL',
  polished: 'polished',
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
  lodash: '_',
  /**
   * External dependencies that must be loaded by a module loader
   *   - lodash/*
   *   - highlight.js
   *   - create-emotion
   *   - create-emotion-server
   *   - react-transition-group
   **/
};

allPackages.forEach(packageName => {
  globals[packageName] = packageName;
});

const moduleFormatToDirectory = {
  esm: 'dist/esm/',
  umd: 'dist',
};

const config = ['esm', 'umd'].flatMap(format => {
  const baseConfig = {
    input: 'src/index.ts',
    output: {
      dir: moduleFormatToDirectory[format],
      name,

      format,
      sourcemap: true,
      globals,
    },
    plugins: [
      resolve({ extensions }),

      babel({
        babelrc: false,
        babelHelpers: 'bundled',
        extensions,
        configFile: path.resolve(__dirname, 'babel.config.js'),
        sourceMaps: 'inline',
        envName: 'production',
      }),

      urlPlugin({
        limit: 50000,
        include: ['**/*.png'],
      }),

      urlPlugin({
        limit: 0,
        include: ['**/*.less'],
        fileName: '[name][extname]',
      }),

      svgr(),

      terser(),
    ],
    external: id =>
      [
        'clipboard',
        'highlight.js',
        'highlightjs-graphql',
        'react',
        'react-dom',
        '@emotion/server',
        '@emotion/css',
        '@emotion/css/create-instance',
        '@emotion/server/create-instance',
        'polished',
        'prop-types',
        'react-is',
        'react-transition-group',
        '@testing-library/react',
        'lodash',
        'focus-trap-react',
        ...getLodashExternals(),
        ...allPackages,
      ].includes(id) ||
      // We test if an import includes lodash to avoid having
      // to whitelist every nested lodash module individually
      /^lodash\//.test(id) ||
      /^highlight\.js\//.test(id),
  };

  return [
    baseConfig,
    ...getGeneratedFiles().map(input => ({
      ...baseConfig,
      input: `src/generated/${path.basename(input)}`,
      output: {
        ...baseConfig.output,
        name: `${path.basename(input, path.extname(input))}.js`,
      },
    })),
  ];
});

export default config;
