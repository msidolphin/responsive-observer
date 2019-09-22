import resolve from 'rollup-plugin-node-resolve' // 告诉 Rollup 如何查找外部模块
import commonjs from 'rollup-plugin-commonjs' // 将CommonJS模块转换为 ES2015 供 Rollup 处理
import vue from 'rollup-plugin-vue' // 处理vue文件
import babel from 'rollup-plugin-babel'  // rollup 的 babel 插件，ES6转ES5
import css from 'rollup-plugin-css-only' // 提取css，压缩能力不行
import json from 'rollup-plugin-json'
import CleanCSS from 'clean-css' // 压缩css
import { writeFileSync } from 'fs' // 写文件
import config from './config'

export default {
  input: config.entry,
  plugins: [
    json(),
    resolve({ extensions: ['.vue', '.js', '.json'] }),
    commonjs(),
    css({ output(style) {
      // 压缩 css 写入 dist/vue-rollup-component-template.css
      writeFileSync(`${config.publishPath}/index.css`, new CleanCSS().minify(style).styles)
    } }),
    // css: false 将<style>块转换为导入语句，rollup-plugin-css-only可以提取.vue文件中的样式
    vue({ css: false }),
    babel({
      runtimeHelpers: true
    })
  ]
}
