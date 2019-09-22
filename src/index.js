import enquire from 'enquire.js'

// https://github.com/WickyNilliams/enquire.js/issues/82
if (typeof window !== 'undefined') {
  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {}
    }
  }
}

export const breakpointArray = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs']

export const BREAKPOINTMAP = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)'
}

export class ResponsiveObserver {
  constructor (breakpointMap = BREAKPOINTMAP) {
    this.breakpointMap = breakpointMap
    this.subscriber = () => {}
    this.screens = {}
  }

  dispatch (screens) {
    this.screens = JSON.parse(JSON.stringify(screens))
    if (this.subscriber && typeof this.subscriber === 'function') {
      this.subscriber(screens)
    }
  }

  subscribe (func) {
    this.register()
    this.subscriber = func
    func(this.screens)
  }

  unsubscribe () {
    this.subscribers = () => {}
    this.unregister()
  }

  unregister () {
    Object.keys(this.breakpointMap).map((screen) =>
      enquire.unregister(this.breakpointMap[screen])
    )
  }

  register () {
    Object.keys(this.breakpointMap).map((screen) =>
      enquire.register(this.breakpointMap[screen], {
        match: () => {
          const pointMap = {
            ...this.screens,
            [screen]: true
          }
          this.dispatch(pointMap)
        },
        unmatch: () => {
          const pointMap = {
            ...this.screens,
            [screen]: false
          }
          this.dispatch(pointMap)
        },
        destroy () {}
      })
    )
  }
}

export default ResponsiveObserver
