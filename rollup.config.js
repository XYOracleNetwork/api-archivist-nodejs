import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import strip from '@rollup/plugin-strip'
import typescriptPlugin from 'rollup-plugin-typescript2'
import typescript from 'typescript'

import pkg from './package.json'

const deps = Object.keys(Object.assign({}, pkg.peerDependencies, pkg.dependencies))

const BUILD_TARGET_MAGIC_STRING = '__BUILD_TARGET__'

function generateBuildTargetReplaceConfig(moduleFormat, languageTarget) {
  let buildTarget = ''

  switch (moduleFormat.toLowerCase()) {
    case 'esm':
      buildTarget += 'esm'
      break
    case 'cjs':
      buildTarget += 'cjs'
      break
    default:
      throw Error(`unsupported module format ${moduleFormat}. Valid values are esm and cjs.`)
  }

  if (typeof languageTarget !== 'number') {
    throw Error('languageTarget accepts only number')
  }

  // simplified input validation
  if (languageTarget != 5 && languageTarget < 2015) {
    throw Error(`invalid languageTarget ${languageTarget}. Valid values are 5, 2015, 2016, etc.`)
  }

  buildTarget += languageTarget

  return {
    [BUILD_TARGET_MAGIC_STRING]: buildTarget,
    preventAssignment: true,
  }
}

function emitModulePackageFile() {
  return {
    generateBundle() {
      this.emitFile({
        fileName: 'package.json',
        source: '{"type":"module"}',
        type: 'asset',
      })
    },
    name: 'emit-module-package-file',
  }
}

const es5BuildPlugins = [
  json(),
  strip({
    functions: ['debugAssert.*'],
  }),
  typescriptPlugin({
    typescript,
  }),
  commonjs(),
]

const es2017BuildPlugins = [
  json(),
  strip({
    functions: ['debugAssert.*'],
  }),
  typescriptPlugin({
    tsconfigOverride: {
      compilerOptions: {
        target: 'es2017',
      },
    },
    typescript,
  }),
]

const nodeBuilds = [
  {
    external: (id) => deps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
    input: {
      index: 'src/index.ts',
    },
    output: [{ dir: 'dist/node', format: 'cjs', sourcemap: true }],
    plugins: [...es5BuildPlugins, replace(generateBuildTargetReplaceConfig('cjs', 5))],
  },
  {
    external: (id) => deps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
    input: {
      index: 'src/index.ts',
    },
    output: [{ dir: 'dist/node-esm', format: 'es', sourcemap: true }],
    plugins: [...es2017BuildPlugins, replace(generateBuildTargetReplaceConfig('esm', 2017)), emitModulePackageFile()],
  },
]

// eslint-disable-next-line import/no-default-export
export default [...nodeBuilds]
