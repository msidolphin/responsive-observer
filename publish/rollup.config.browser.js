import baseConfig from './rollup.config.base'
import uglify from 'rollup-plugin-uglify-es'
import buildConfig from './config'

const config = Object.assign({}, baseConfig, {
  output: {
    exports: 'named',
    name: `${buildConfig.libraryName}`,
    file: `${buildConfig.publishPath}/${buildConfig.library}.min.js`,
    format: 'iife'
  },
})

config.plugins.push(uglify())

export default config
