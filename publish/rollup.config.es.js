import baseConfig from './rollup.config.base'
import buildConfig from './config'

const config = Object.assign({}, baseConfig, {
  output: {
    name: `${buildConfig.libraryName}`,
    file: `${buildConfig.publishPath}/${buildConfig.library}.esm.js`,
    format: 'es',
  }
})

export default config
