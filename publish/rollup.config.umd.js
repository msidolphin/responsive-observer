import baseConfig from './rollup.config.base'
import buildConfig from './config'

const config = Object.assign({}, baseConfig, {
  output: {
    exports: 'named',
    name: `${buildConfig.libraryName}`,
    file: `${buildConfig.publishPath}/${buildConfig.library}.umd.js`,
    format: 'umd'
  },
})

export default config
