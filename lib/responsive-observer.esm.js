var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var enquire = null;

// https://github.com/WickyNilliams/enquire.js/issues/82
if (typeof window !== 'undefined') {
  enquire = require('enquire.js');
  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      addListener: function addListener() {},
      removeListener: function removeListener() {}
    };
  };
}

var breakpointArray = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];

var BREAKPOINTMAP = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)'
};

var ResponsiveObserver = function () {
  function ResponsiveObserver() {
    var breakpointMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : BREAKPOINTMAP;

    _classCallCheck(this, ResponsiveObserver);

    this.breakpointMap = breakpointMap;
    this.subscriber = function () {};
    this.screens = {};
  }

  _createClass(ResponsiveObserver, [{
    key: 'dispatch',
    value: function dispatch(screens) {
      this.screens = JSON.parse(JSON.stringify(screens));
      if (this.subscriber && typeof this.subscriber === 'function') {
        this.subscriber(this.getResult(this.screens));
      }
    }
  }, {
    key: 'subscribe',
    value: function subscribe(func) {
      this.register();
      this.subscriber = func;
      func(this.getResult(this.screens));
    }
  }, {
    key: 'getResult',
    value: function getResult(screens) {
      var rets = {};
      breakpointArray.forEach(function (breakpoint) {
        rets[breakpoint] = screens[breakpoint] ? screens[breakpoint] : false;
      });
      return rets;
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe() {
      this.subscribers = function () {};
      this.unregister();
    }
  }, {
    key: 'unregister',
    value: function unregister() {
      var _this = this;

      Object.keys(this.breakpointMap).map(function (screen) {
        return enquire.unregister(_this.breakpointMap[screen]);
      });
    }
  }, {
    key: 'register',
    value: function register() {
      var _this2 = this;

      Object.keys(this.breakpointMap).map(function (screen) {
        return enquire.register(_this2.breakpointMap[screen], {
          match: function match() {
            var pointMap = _extends({}, _this2.screens, _defineProperty({}, screen, true));
            _this2.dispatch(pointMap);
          },
          unmatch: function unmatch() {
            var pointMap = _extends({}, _this2.screens, _defineProperty({}, screen, false));
            _this2.dispatch(pointMap);
          },
          destroy: function destroy() {}
        });
      });
    }
  }]);

  return ResponsiveObserver;
}();

export default ResponsiveObserver;
export { BREAKPOINTMAP, ResponsiveObserver, breakpointArray };
