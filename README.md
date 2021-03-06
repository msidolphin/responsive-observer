# responsive-observer

> A lightweight media queries javascript library, more convenient and easy to use enquire.js

## Usage

### Install

```bash
npm install responsive-observer -S
```

### Use
```js
// default breakPonits
const breakPonits = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)'
}

let observer = new ResponsiveObserver(breakPonits)
// subscribe
observer.subscribe((screens) => {
  // do something
})
// unsubscribe
observer.unsubscribe()
```
### Vue Demo
reference to [ant design](https://ant.design/components/descriptions/)
```vue
<template>
  <div id="app">
    <table style="width: 100%;">
      <tbody>
        <tr v-for="(row, index) in rows" :key="index">
          <template v-for="(column, i) in row">
            <td :key="`th-${i}`">{{column.label}}</td>
            <td :key="`td-${i}`" v-html="column.value" :colspan="column.span ? column.span : 1"></td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ResponsiveObserver, { breakpointArray } from 'responsive-observer'
export default {
  name: 'App',
  data () {
    return {
      responsive: {
        xxl: 4,
        xl: 3,
        lg: 3,
        md: 3,
        sm: 2,
        xs: 1
      },
      data: [
        {
          label: 'Product',
          value: 'Cloud Database',
          span: 4
        },
        {
          label: 'Billing',
          value: 'Prepaid'
        },
        {
          label: 'time',
          value: '18:00:00'
        },
        {
          label: 'Amount',
          value: '$80.00'
        },
        {
          label: 'Discount',
          value: '$20.00'
        },
        {
          label: 'Official',
          value: '$60.00'
        },
        {
          label: 'Config Info',
          value: `Data disk type: MongoDB <br/> Database version: 3.4 <br/> Package: dds.mongo.mid <br/> Storage space: 10 GB <br/> Replication_factor: 3 <br/> Region: East China 1`
        }
      ],
      rows: []
    }
  },
  methods: {
    generateRows (screens) {
      let rows = []
      let breakpoint = 0
      for (let i = 0; i < breakpointArray.length; ++i) {
        if (screens[breakpointArray[i]]) {
          breakpoint = this.responsive[breakpointArray[i]]
          break
        }
      }
      let columns = null
      let leftSpans = breakpoint
      this.data.forEach((item, index) => {
        if (!columns) {
          columns = []
          rows.push(columns)
        }
        let span = item.span ? item.span : 1
        columns.push(item)
        leftSpans -= span
        if (leftSpans <= 0) {
          columns = null
          leftSpans = breakpoint
        }
      })
      this.rows = rows
    }
  },
  created () {
    this.observer = new ResponsiveObserver()
    this.observer.subscribe((screens) => {
      this.generateRows(screens)
    })
  },
  destroyed () {
    if (this.observer) this.observer.unsubscribe()
  }
}
</script>
```


## License
[MIT](http://opensource.org/licenses/MIT)

Copyright © 2019-present, msidolphin
