/**
 * Delegate to handle a media query being matched and unmatched.
 *
 * @param {object} options
 * @param {function} options.match callback for when the media query is matched
 * @param {function} [options.unmatch] callback for when the media query is unmatched
 * @param {function} [options.setup] one-time callback triggered the first time a query is matched
 * @param {boolean} [options.deferSetup=false] should the setup callback be run immediately, rather than first time query is matched?
 * @constructor
 */
function QueryHandler(options) {
    this.options = options;
    !options.deferSetup && this.setup();
}

QueryHandler.prototype = {

    constructor: QueryHandler,

    /**
     * coordinates setup of the handler
     *
     * @function
     */
    setup: function setup() {
        if (this.options.setup) {
            this.options.setup();
        }
        this.initialised = true;
    },

    /**
     * coordinates setup and triggering of the handler
     *
     * @function
     */
    on: function on() {
        !this.initialised && this.setup();
        this.options.match && this.options.match();
    },

    /**
     * coordinates the unmatch event for the handler
     *
     * @function
     */
    off: function off() {
        this.options.unmatch && this.options.unmatch();
    },

    /**
     * called when a handler is to be destroyed.
     * delegates to the destroy or unmatch callbacks, depending on availability.
     *
     * @function
     */
    destroy: function destroy() {
        this.options.destroy ? this.options.destroy() : this.off();
    },

    /**
     * determines equality by reference.
     * if object is supplied compare options, if function, compare match callback
     *
     * @function
     * @param {object || function} [target] the target for comparison
     */
    equals: function equals(target) {
        return this.options === target || this.options.match === target;
    }

};

var QueryHandler_1 = QueryHandler;

/**
 * Helper function for iterating over a collection
 *
 * @param collection
 * @param fn
 */
function each(collection, fn) {
    var i = 0,
        length = collection.length,
        cont;

    for (i; i < length; i++) {
        cont = fn(collection[i], i);
        if (cont === false) {
            break; //allow early exit
        }
    }
}

/**
 * Helper function for determining whether target object is an array
 *
 * @param target the object under test
 * @return {Boolean} true if array, false otherwise
 */
function isArray(target) {
    return Object.prototype.toString.apply(target) === '[object Array]';
}

/**
 * Helper function for determining whether target object is a function
 *
 * @param target the object under test
 * @return {Boolean} true if function, false otherwise
 */
function isFunction(target) {
    return typeof target === 'function';
}

var Util = {
    isFunction: isFunction,
    isArray: isArray,
    each: each
};

var each$1 = Util.each;

/**
 * Represents a single media query, manages it's state and registered handlers for this query
 *
 * @constructor
 * @param {string} query the media query string
 * @param {boolean} [isUnconditional=false] whether the media query should run regardless of whether the conditions are met. Primarily for helping older browsers deal with mobile-first design
 */
function MediaQuery(query, isUnconditional) {
    this.query = query;
    this.isUnconditional = isUnconditional;
    this.handlers = [];
    this.mql = window.matchMedia(query);

    var self = this;
    this.listener = function (mql) {
        // Chrome passes an MediaQueryListEvent object, while other browsers pass MediaQueryList directly
        self.mql = mql.currentTarget || mql;
        self.assess();
    };
    this.mql.addListener(this.listener);
}

MediaQuery.prototype = {

    constuctor: MediaQuery,

    /**
     * add a handler for this query, triggering if already active
     *
     * @param {object} handler
     * @param {function} handler.match callback for when query is activated
     * @param {function} [handler.unmatch] callback for when query is deactivated
     * @param {function} [handler.setup] callback for immediate execution when a query handler is registered
     * @param {boolean} [handler.deferSetup=false] should the setup callback be deferred until the first time the handler is matched?
     */
    addHandler: function addHandler(handler) {
        var qh = new QueryHandler_1(handler);
        this.handlers.push(qh);

        this.matches() && qh.on();
    },

    /**
     * removes the given handler from the collection, and calls it's destroy methods
     *
     * @param {object || function} handler the handler to remove
     */
    removeHandler: function removeHandler(handler) {
        var handlers = this.handlers;
        each$1(handlers, function (h, i) {
            if (h.equals(handler)) {
                h.destroy();
                return !handlers.splice(i, 1); //remove from array and exit each early
            }
        });
    },

    /**
     * Determine whether the media query should be considered a match
     *
     * @return {Boolean} true if media query can be considered a match, false otherwise
     */
    matches: function matches() {
        return this.mql.matches || this.isUnconditional;
    },

    /**
     * Clears all handlers and unbinds events
     */
    clear: function clear() {
        each$1(this.handlers, function (handler) {
            handler.destroy();
        });
        this.mql.removeListener(this.listener);
        this.handlers.length = 0; //clear array
    },

    /*
        * Assesses the query, turning on all handlers if it matches, turning them off if it doesn't match
        */
    assess: function assess() {
        var action = this.matches() ? 'on' : 'off';

        each$1(this.handlers, function (handler) {
            handler[action]();
        });
    }
};

var MediaQuery_1 = MediaQuery;

var each$2 = Util.each;
var isFunction$1 = Util.isFunction;
var isArray$1 = Util.isArray;

/**
 * Allows for registration of query handlers.
 * Manages the query handler's state and is responsible for wiring up browser events
 *
 * @constructor
 */
function MediaQueryDispatch() {
    if (!window.matchMedia) {
        throw new Error('matchMedia not present, legacy browsers require a polyfill');
    }

    this.queries = {};
    this.browserIsIncapable = !window.matchMedia('only all').matches;
}

MediaQueryDispatch.prototype = {

    constructor: MediaQueryDispatch,

    /**
     * Registers a handler for the given media query
     *
     * @param {string} q the media query
     * @param {object || Array || Function} options either a single query handler object, a function, or an array of query handlers
     * @param {function} options.match fired when query matched
     * @param {function} [options.unmatch] fired when a query is no longer matched
     * @param {function} [options.setup] fired when handler first triggered
     * @param {boolean} [options.deferSetup=false] whether setup should be run immediately or deferred until query is first matched
     * @param {boolean} [shouldDegrade=false] whether this particular media query should always run on incapable browsers
     */
    register: function register(q, options, shouldDegrade) {
        var queries = this.queries,
            isUnconditional = shouldDegrade && this.browserIsIncapable;

        if (!queries[q]) {
            queries[q] = new MediaQuery_1(q, isUnconditional);
        }

        //normalise to object in an array
        if (isFunction$1(options)) {
            options = { match: options };
        }
        if (!isArray$1(options)) {
            options = [options];
        }
        each$2(options, function (handler) {
            if (isFunction$1(handler)) {
                handler = { match: handler };
            }
            queries[q].addHandler(handler);
        });

        return this;
    },

    /**
     * unregisters a query and all it's handlers, or a specific handler for a query
     *
     * @param {string} q the media query to target
     * @param {object || function} [handler] specific handler to unregister
     */
    unregister: function unregister(q, handler) {
        var query = this.queries[q];

        if (query) {
            if (handler) {
                query.removeHandler(handler);
            } else {
                query.clear();
                delete this.queries[q];
            }
        }

        return this;
    }
};

var MediaQueryDispatch_1 = MediaQueryDispatch;

var src = new MediaQueryDispatch_1();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// https://github.com/WickyNilliams/enquire.js/issues/82
if (typeof window !== 'undefined') {
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
        return src.unregister(_this.breakpointMap[screen]);
      });
    }
  }, {
    key: 'register',
    value: function register() {
      var _this2 = this;

      Object.keys(this.breakpointMap).map(function (screen) {
        return src.register(_this2.breakpointMap[screen], {
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
