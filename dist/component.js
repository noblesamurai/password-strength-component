var mountPasswordStrengthComponent = (function () {
	'use strict';

	const pDebounce = (fn, wait, options = {}) => {
	  if (!Number.isFinite(wait)) {
	    throw new TypeError('Expected `wait` to be a finite number');
	  }

	  let leadingValue;
	  let timer;
	  let resolveList = [];
	  return function (...arguments_) {
	    return new Promise(resolve => {
	      const runImmediately = options.leading && !timer;
	      clearTimeout(timer);
	      timer = setTimeout(() => {
	        timer = null;
	        const result = options.leading ? leadingValue : fn.apply(this, arguments_);

	        for (resolve of resolveList) {
	          resolve(result);
	        }

	        resolveList = [];
	      }, wait);

	      if (runImmediately) {
	        leadingValue = fn.apply(this, arguments_);
	        resolve(leadingValue);
	      } else {
	        resolveList.push(resolve);
	      }
	    });
	  };
	};

	var pDebounce_1 = pDebounce; // TODO: Remove this for the next major release

	var _default = pDebounce;
	pDebounce_1.default = _default;

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function ownKeys(object, enumerableOnly) {
	  var keys = Object.keys(object);

	  if (Object.getOwnPropertySymbols) {
	    var symbols = Object.getOwnPropertySymbols(object);
	    if (enumerableOnly) symbols = symbols.filter(function (sym) {
	      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
	    });
	    keys.push.apply(keys, symbols);
	  }

	  return keys;
	}

	function _objectSpread2(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};

	    if (i % 2) {
	      ownKeys(Object(source), true).forEach(function (key) {
	        _defineProperty(target, key, source[key]);
	      });
	    } else if (Object.getOwnPropertyDescriptors) {
	      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
	    } else {
	      ownKeys(Object(source)).forEach(function (key) {
	        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
	      });
	    }
	  }

	  return target;
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
	}

	function _iterableToArray(iter) {
	  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	  return arr2;
	}

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	/**
	 * Use the globally available zxcvbn lib to calculate a password's strength.
	 *
	 * Custom rules:
	 * - If the password is less than 8 characters the strength is always 0
	 * - If less than 8 characters and no other warnings we return a warning stating
	 *   that we require at least 8 characters.
	 * - If less than 8 characters and there is another warning, the 8 character
	 *   requirement is instead added to the start of the suggestions array.
	 *
	 * @param {string} password
	 * @return {object} with { score: {number}, suggestions: {string[]}, warning: string }
	 */
	function getPasswordFeedback(password) {
	  var _window$zxcvbn = window.zxcvbn(password),
	      score = _window$zxcvbn.score,
	      _window$zxcvbn$feedba = _window$zxcvbn.feedback;

	  _window$zxcvbn$feedba = _window$zxcvbn$feedba === void 0 ? {} : _window$zxcvbn$feedba;
	  var _window$zxcvbn$feedba2 = _window$zxcvbn$feedba.suggestions,
	      suggestions = _window$zxcvbn$feedba2 === void 0 ? [] : _window$zxcvbn$feedba2,
	      warning = _window$zxcvbn$feedba.warning;

	  if (password.length >= 8) {
	    return {
	      score: score,
	      suggestions: suggestions,
	      warning: warning
	    };
	  } // If the password is not long enough (at least 8 characters) then force the
	  // score to 0 and add a notice to either the warning (if no other warning) or
	  // to the start of the suggestions list.


	  return {
	    score: 0,
	    suggestions: warning ? ['Use at least 8 characters'].concat(_toConsumableArray(suggestions)) : suggestions,
	    warning: warning || 'Password must contain at least 8 characters'
	  };
	}

	var loadScript = function load(src, opts, cb) {
	  var head = document.head || document.getElementsByTagName('head')[0];
	  var script = document.createElement('script');

	  if (typeof opts === 'function') {
	    cb = opts;
	    opts = {};
	  }

	  opts = opts || {};

	  cb = cb || function () {};

	  script.type = opts.type || 'text/javascript';
	  script.charset = opts.charset || 'utf8';
	  script.async = 'async' in opts ? !!opts.async : true;
	  script.src = src;

	  if (opts.attrs) {
	    setAttributes(script, opts.attrs);
	  }

	  if (opts.text) {
	    script.text = '' + opts.text;
	  }

	  var onend = 'onload' in script ? stdOnEnd : ieOnEnd;
	  onend(script, cb); // some good legacy browsers (firefox) fail the 'in' detection above
	  // so as a fallback we always set onload
	  // old IE will ignore this and new IE will set onload

	  if (!script.onload) {
	    stdOnEnd(script, cb);
	  }

	  head.appendChild(script);
	};

	function setAttributes(script, attrs) {
	  for (var attr in attrs) {
	    script.setAttribute(attr, attrs[attr]);
	  }
	}

	function stdOnEnd(script, cb) {
	  script.onload = function () {
	    this.onerror = this.onload = null;
	    cb(null, script);
	  };

	  script.onerror = function () {
	    // this.onload = null here is necessary
	    // because even IE9 works not like others
	    this.onerror = this.onload = null;
	    cb(new Error('Failed to load ' + this.src), script);
	  };
	}

	function ieOnEnd(script, cb) {
	  script.onreadystatechange = function () {
	    if (this.readyState != 'complete' && this.readyState != 'loaded') return;
	    this.onreadystatechange = null;
	    cb(null, script); // there is no way to catch loading errors in IE8
	  };
	}

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var isBuffer = function isBuffer(arg) {
	  return arg instanceof Buffer;
	};

	var inherits_browser = createCommonjsModule(function (module) {
	  if (typeof Object.create === 'function') {
	    // implementation from standard node.js 'util' module
	    module.exports = function inherits(ctor, superCtor) {
	      ctor.super_ = superCtor;
	      ctor.prototype = Object.create(superCtor.prototype, {
	        constructor: {
	          value: ctor,
	          enumerable: false,
	          writable: true,
	          configurable: true
	        }
	      });
	    };
	  } else {
	    // old school shim for old browsers
	    module.exports = function inherits(ctor, superCtor) {
	      ctor.super_ = superCtor;

	      var TempCtor = function () {};

	      TempCtor.prototype = superCtor.prototype;
	      ctor.prototype = new TempCtor();
	      ctor.prototype.constructor = ctor;
	    };
	  }
	});

	var inherits = createCommonjsModule(function (module) {
	  try {
	    var util$1 = util;
	    if (typeof util$1.inherits !== 'function') throw '';
	    module.exports = util$1.inherits;
	  } catch (e) {
	    module.exports = inherits_browser;
	  }
	});

	var util = createCommonjsModule(function (module, exports) {
	  // Copyright Joyent, Inc. and other Node contributors.
	  //
	  // Permission is hereby granted, free of charge, to any person obtaining a
	  // copy of this software and associated documentation files (the
	  // "Software"), to deal in the Software without restriction, including
	  // without limitation the rights to use, copy, modify, merge, publish,
	  // distribute, sublicense, and/or sell copies of the Software, and to permit
	  // persons to whom the Software is furnished to do so, subject to the
	  // following conditions:
	  //
	  // The above copyright notice and this permission notice shall be included
	  // in all copies or substantial portions of the Software.
	  //
	  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	  // USE OR OTHER DEALINGS IN THE SOFTWARE.
	  var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(obj) {
	    var keys = Object.keys(obj);
	    var descriptors = {};

	    for (var i = 0; i < keys.length; i++) {
	      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
	    }

	    return descriptors;
	  };

	  var formatRegExp = /%[sdj%]/g;

	  exports.format = function (f) {
	    if (!isString(f)) {
	      var objects = [];

	      for (var i = 0; i < arguments.length; i++) {
	        objects.push(inspect(arguments[i]));
	      }

	      return objects.join(' ');
	    }

	    var i = 1;
	    var args = arguments;
	    var len = args.length;
	    var str = String(f).replace(formatRegExp, function (x) {
	      if (x === '%%') return '%';
	      if (i >= len) return x;

	      switch (x) {
	        case '%s':
	          return String(args[i++]);

	        case '%d':
	          return Number(args[i++]);

	        case '%j':
	          try {
	            return JSON.stringify(args[i++]);
	          } catch (_) {
	            return '[Circular]';
	          }

	        default:
	          return x;
	      }
	    });

	    for (var x = args[i]; i < len; x = args[++i]) {
	      if (isNull(x) || !isObject(x)) {
	        str += ' ' + x;
	      } else {
	        str += ' ' + inspect(x);
	      }
	    }

	    return str;
	  }; // Mark that a method should not be used.
	  // Returns a modified function which warns once by default.
	  // If --no-deprecation is set, then it is a no-op.


	  exports.deprecate = function (fn, msg) {
	    if (typeof process !== 'undefined' && process.noDeprecation === true) {
	      return fn;
	    } // Allow for deprecating things in the process of starting up.


	    if (typeof process === 'undefined') {
	      return function () {
	        return exports.deprecate(fn, msg).apply(this, arguments);
	      };
	    }

	    var warned = false;

	    function deprecated() {
	      if (!warned) {
	        if (process.throwDeprecation) {
	          throw new Error(msg);
	        } else if (process.traceDeprecation) {
	          console.trace(msg);
	        } else {
	          console.error(msg);
	        }

	        warned = true;
	      }

	      return fn.apply(this, arguments);
	    }

	    return deprecated;
	  };

	  var debugs = {};
	  var debugEnviron;

	  exports.debuglog = function (set) {
	    if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
	    set = set.toUpperCase();

	    if (!debugs[set]) {
	      if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	        var pid = process.pid;

	        debugs[set] = function () {
	          var msg = exports.format.apply(exports, arguments);
	          console.error('%s %d: %s', set, pid, msg);
	        };
	      } else {
	        debugs[set] = function () {};
	      }
	    }

	    return debugs[set];
	  };
	  /**
	   * Echos the value of a value. Trys to print the value out
	   * in the best way possible given the different types.
	   *
	   * @param {Object} obj The object to print out.
	   * @param {Object} opts Optional options object that alters the output.
	   */

	  /* legacy: obj, showHidden, depth, colors*/


	  function inspect(obj, opts) {
	    // default options
	    var ctx = {
	      seen: [],
	      stylize: stylizeNoColor
	    }; // legacy...

	    if (arguments.length >= 3) ctx.depth = arguments[2];
	    if (arguments.length >= 4) ctx.colors = arguments[3];

	    if (isBoolean(opts)) {
	      // legacy...
	      ctx.showHidden = opts;
	    } else if (opts) {
	      // got an "options" object
	      exports._extend(ctx, opts);
	    } // set default options


	    if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	    if (isUndefined(ctx.depth)) ctx.depth = 2;
	    if (isUndefined(ctx.colors)) ctx.colors = false;
	    if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	    if (ctx.colors) ctx.stylize = stylizeWithColor;
	    return formatValue(ctx, obj, ctx.depth);
	  }

	  exports.inspect = inspect; // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

	  inspect.colors = {
	    'bold': [1, 22],
	    'italic': [3, 23],
	    'underline': [4, 24],
	    'inverse': [7, 27],
	    'white': [37, 39],
	    'grey': [90, 39],
	    'black': [30, 39],
	    'blue': [34, 39],
	    'cyan': [36, 39],
	    'green': [32, 39],
	    'magenta': [35, 39],
	    'red': [31, 39],
	    'yellow': [33, 39]
	  }; // Don't use 'blue' not visible on cmd.exe

	  inspect.styles = {
	    'special': 'cyan',
	    'number': 'yellow',
	    'boolean': 'yellow',
	    'undefined': 'grey',
	    'null': 'bold',
	    'string': 'green',
	    'date': 'magenta',
	    // "name": intentionally not styling
	    'regexp': 'red'
	  };

	  function stylizeWithColor(str, styleType) {
	    var style = inspect.styles[styleType];

	    if (style) {
	      return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
	    } else {
	      return str;
	    }
	  }

	  function stylizeNoColor(str, styleType) {
	    return str;
	  }

	  function arrayToHash(array) {
	    var hash = {};
	    array.forEach(function (val, idx) {
	      hash[val] = true;
	    });
	    return hash;
	  }

	  function formatValue(ctx, value, recurseTimes) {
	    // Provide a hook for user-specified inspect functions.
	    // Check that value is an object with an inspect function on it
	    if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
	    value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
	    !(value.constructor && value.constructor.prototype === value)) {
	      var ret = value.inspect(recurseTimes, ctx);

	      if (!isString(ret)) {
	        ret = formatValue(ctx, ret, recurseTimes);
	      }

	      return ret;
	    } // Primitive types cannot have properties


	    var primitive = formatPrimitive(ctx, value);

	    if (primitive) {
	      return primitive;
	    } // Look up the keys of the object.


	    var keys = Object.keys(value);
	    var visibleKeys = arrayToHash(keys);

	    if (ctx.showHidden) {
	      keys = Object.getOwnPropertyNames(value);
	    } // IE doesn't make error fields non-enumerable
	    // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


	    if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	      return formatError(value);
	    } // Some type of object without properties can be shortcutted.


	    if (keys.length === 0) {
	      if (isFunction(value)) {
	        var name = value.name ? ': ' + value.name : '';
	        return ctx.stylize('[Function' + name + ']', 'special');
	      }

	      if (isRegExp(value)) {
	        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	      }

	      if (isDate(value)) {
	        return ctx.stylize(Date.prototype.toString.call(value), 'date');
	      }

	      if (isError(value)) {
	        return formatError(value);
	      }
	    }

	    var base = '',
	        array = false,
	        braces = ['{', '}']; // Make Array say that they are Array

	    if (isArray(value)) {
	      array = true;
	      braces = ['[', ']'];
	    } // Make functions say that they are functions


	    if (isFunction(value)) {
	      var n = value.name ? ': ' + value.name : '';
	      base = ' [Function' + n + ']';
	    } // Make RegExps say that they are RegExps


	    if (isRegExp(value)) {
	      base = ' ' + RegExp.prototype.toString.call(value);
	    } // Make dates with properties first say the date


	    if (isDate(value)) {
	      base = ' ' + Date.prototype.toUTCString.call(value);
	    } // Make error with message first say the error


	    if (isError(value)) {
	      base = ' ' + formatError(value);
	    }

	    if (keys.length === 0 && (!array || value.length == 0)) {
	      return braces[0] + base + braces[1];
	    }

	    if (recurseTimes < 0) {
	      if (isRegExp(value)) {
	        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	      } else {
	        return ctx.stylize('[Object]', 'special');
	      }
	    }

	    ctx.seen.push(value);
	    var output;

	    if (array) {
	      output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	    } else {
	      output = keys.map(function (key) {
	        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	      });
	    }

	    ctx.seen.pop();
	    return reduceToSingleString(output, base, braces);
	  }

	  function formatPrimitive(ctx, value) {
	    if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

	    if (isString(value)) {
	      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
	      return ctx.stylize(simple, 'string');
	    }

	    if (isNumber(value)) return ctx.stylize('' + value, 'number');
	    if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

	    if (isNull(value)) return ctx.stylize('null', 'null');
	  }

	  function formatError(value) {
	    return '[' + Error.prototype.toString.call(value) + ']';
	  }

	  function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	    var output = [];

	    for (var i = 0, l = value.length; i < l; ++i) {
	      if (hasOwnProperty(value, String(i))) {
	        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
	      } else {
	        output.push('');
	      }
	    }

	    keys.forEach(function (key) {
	      if (!key.match(/^\d+$/)) {
	        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
	      }
	    });
	    return output;
	  }

	  function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	    var name, str, desc;
	    desc = Object.getOwnPropertyDescriptor(value, key) || {
	      value: value[key]
	    };

	    if (desc.get) {
	      if (desc.set) {
	        str = ctx.stylize('[Getter/Setter]', 'special');
	      } else {
	        str = ctx.stylize('[Getter]', 'special');
	      }
	    } else {
	      if (desc.set) {
	        str = ctx.stylize('[Setter]', 'special');
	      }
	    }

	    if (!hasOwnProperty(visibleKeys, key)) {
	      name = '[' + key + ']';
	    }

	    if (!str) {
	      if (ctx.seen.indexOf(desc.value) < 0) {
	        if (isNull(recurseTimes)) {
	          str = formatValue(ctx, desc.value, null);
	        } else {
	          str = formatValue(ctx, desc.value, recurseTimes - 1);
	        }

	        if (str.indexOf('\n') > -1) {
	          if (array) {
	            str = str.split('\n').map(function (line) {
	              return '  ' + line;
	            }).join('\n').substr(2);
	          } else {
	            str = '\n' + str.split('\n').map(function (line) {
	              return '   ' + line;
	            }).join('\n');
	          }
	        }
	      } else {
	        str = ctx.stylize('[Circular]', 'special');
	      }
	    }

	    if (isUndefined(name)) {
	      if (array && key.match(/^\d+$/)) {
	        return str;
	      }

	      name = JSON.stringify('' + key);

	      if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	        name = name.substr(1, name.length - 2);
	        name = ctx.stylize(name, 'name');
	      } else {
	        name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
	        name = ctx.stylize(name, 'string');
	      }
	    }

	    return name + ': ' + str;
	  }

	  function reduceToSingleString(output, base, braces) {
	    var length = output.reduce(function (prev, cur) {
	      if (cur.indexOf('\n') >= 0) ;
	      return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	    }, 0);

	    if (length > 60) {
	      return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
	    }

	    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	  } // NOTE: These type checking functions intentionally don't use `instanceof`
	  // because it is fragile and can be easily faked with `Object.create()`.


	  function isArray(ar) {
	    return Array.isArray(ar);
	  }

	  exports.isArray = isArray;

	  function isBoolean(arg) {
	    return typeof arg === 'boolean';
	  }

	  exports.isBoolean = isBoolean;

	  function isNull(arg) {
	    return arg === null;
	  }

	  exports.isNull = isNull;

	  function isNullOrUndefined(arg) {
	    return arg == null;
	  }

	  exports.isNullOrUndefined = isNullOrUndefined;

	  function isNumber(arg) {
	    return typeof arg === 'number';
	  }

	  exports.isNumber = isNumber;

	  function isString(arg) {
	    return typeof arg === 'string';
	  }

	  exports.isString = isString;

	  function isSymbol(arg) {
	    return typeof arg === 'symbol';
	  }

	  exports.isSymbol = isSymbol;

	  function isUndefined(arg) {
	    return arg === void 0;
	  }

	  exports.isUndefined = isUndefined;

	  function isRegExp(re) {
	    return isObject(re) && objectToString(re) === '[object RegExp]';
	  }

	  exports.isRegExp = isRegExp;

	  function isObject(arg) {
	    return typeof arg === 'object' && arg !== null;
	  }

	  exports.isObject = isObject;

	  function isDate(d) {
	    return isObject(d) && objectToString(d) === '[object Date]';
	  }

	  exports.isDate = isDate;

	  function isError(e) {
	    return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
	  }

	  exports.isError = isError;

	  function isFunction(arg) {
	    return typeof arg === 'function';
	  }

	  exports.isFunction = isFunction;

	  function isPrimitive(arg) {
	    return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' || // ES6 symbol
	    typeof arg === 'undefined';
	  }

	  exports.isPrimitive = isPrimitive;
	  exports.isBuffer = isBuffer;

	  function objectToString(o) {
	    return Object.prototype.toString.call(o);
	  }

	  function pad(n) {
	    return n < 10 ? '0' + n.toString(10) : n.toString(10);
	  }

	  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

	  function timestamp() {
	    var d = new Date();
	    var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
	    return [d.getDate(), months[d.getMonth()], time].join(' ');
	  } // log is just a thin wrapper to console.log that prepends a timestamp


	  exports.log = function () {
	    console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	  };
	  /**
	   * Inherit the prototype methods from one constructor into another.
	   *
	   * The Function.prototype.inherits from lang.js rewritten as a standalone
	   * function (not on Function.prototype). NOTE: If this file is to be loaded
	   * during bootstrapping this function needs to be rewritten using some native
	   * functions as prototype setup using normal JavaScript does not work as
	   * expected during bootstrapping (see mirror.js in r114903).
	   *
	   * @param {function} ctor Constructor function which needs to inherit the
	   *     prototype.
	   * @param {function} superCtor Constructor function to inherit prototype from.
	   */


	  exports.inherits = inherits;

	  exports._extend = function (origin, add) {
	    // Don't do anything if add isn't an object
	    if (!add || !isObject(add)) return origin;
	    var keys = Object.keys(add);
	    var i = keys.length;

	    while (i--) {
	      origin[keys[i]] = add[keys[i]];
	    }

	    return origin;
	  };

	  function hasOwnProperty(obj, prop) {
	    return Object.prototype.hasOwnProperty.call(obj, prop);
	  }

	  var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

	  exports.promisify = function promisify(original) {
	    if (typeof original !== 'function') throw new TypeError('The "original" argument must be of type Function');

	    if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
	      var fn = original[kCustomPromisifiedSymbol];

	      if (typeof fn !== 'function') {
	        throw new TypeError('The "util.promisify.custom" argument must be of type Function');
	      }

	      Object.defineProperty(fn, kCustomPromisifiedSymbol, {
	        value: fn,
	        enumerable: false,
	        writable: false,
	        configurable: true
	      });
	      return fn;
	    }

	    function fn() {
	      var promiseResolve, promiseReject;
	      var promise = new Promise(function (resolve, reject) {
	        promiseResolve = resolve;
	        promiseReject = reject;
	      });
	      var args = [];

	      for (var i = 0; i < arguments.length; i++) {
	        args.push(arguments[i]);
	      }

	      args.push(function (err, value) {
	        if (err) {
	          promiseReject(err);
	        } else {
	          promiseResolve(value);
	        }
	      });

	      try {
	        original.apply(this, args);
	      } catch (err) {
	        promiseReject(err);
	      }

	      return promise;
	    }

	    Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
	    if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
	      value: fn,
	      enumerable: false,
	      writable: false,
	      configurable: true
	    });
	    return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
	  };

	  exports.promisify.custom = kCustomPromisifiedSymbol;

	  function callbackifyOnRejected(reason, cb) {
	    // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
	    // Because `null` is a special error value in callbacks which means "no error
	    // occurred", we error-wrap so the callback consumer can distinguish between
	    // "the promise rejected with null" or "the promise fulfilled with undefined".
	    if (!reason) {
	      var newReason = new Error('Promise was rejected with a falsy value');
	      newReason.reason = reason;
	      reason = newReason;
	    }

	    return cb(reason);
	  }

	  function callbackify(original) {
	    if (typeof original !== 'function') {
	      throw new TypeError('The "original" argument must be of type Function');
	    } // We DO NOT return the promise as it gives the user a false sense that
	    // the promise is actually somehow related to the callback's execution
	    // and that the callback throwing will reject the promise.


	    function callbackified() {
	      var args = [];

	      for (var i = 0; i < arguments.length; i++) {
	        args.push(arguments[i]);
	      }

	      var maybeCb = args.pop();

	      if (typeof maybeCb !== 'function') {
	        throw new TypeError('The last argument must be of type Function');
	      }

	      var self = this;

	      var cb = function () {
	        return maybeCb.apply(self, arguments);
	      }; // In true node style we process the callback on `nextTick` with all the
	      // implications (stack, `uncaughtException`, `async_hooks`)


	      original.apply(this, args).then(function (ret) {
	        process.nextTick(cb, null, ret);
	      }, function (rej) {
	        process.nextTick(callbackifyOnRejected, rej, cb);
	      });
	    }

	    Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
	    Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
	    return callbackified;
	  }

	  exports.callbackify = callbackify;
	});

	var scriptCache = {};
	var loadScript$1 = util.promisify(loadScript);
	/**
	 * Asynchronously load a script (once only).
	 *
	 * @param {string} options.src script source url to load.
	 * @param {string} options.integrity integrity check (sha256, sha384, sha512 hash).
	 */

	function loadScriptOnce(options) {
	  var src = options.src,
	      integrity = options.integrity;

	  if (!scriptCache[src]) {
	    var attrs = _objectSpread2(_objectSpread2({}, integrity && {
	      integrity: integrity
	    }), {}, {
	      crossorigin: 'anonymouse'
	    });

	    scriptCache[src] = loadScript$1(src, {
	      attrs: attrs
	    });
	  }

	  return scriptCache[src];
	}

	var INITIAL_LABEL = 'Calculating... &#x1F914;';
	var SCORE_LABELS = ['Too Weak &#x1F62D;', 'Weak &#x1F61F;', 'Average &#x1F610;', 'Strong &#x1F600;', 'Very Strong &#x1F60E;'];
	var INITIAL_HINT = 'Loading password checking rules. Please wait...';
	var INITIAL_COMPONENT_HTML = "\n  <section class=\"ns-password-strength-component\">\n    <header>Password Strength <span class=\"label\">".concat(INITIAL_LABEL, "</span></header>\n    <meter min=\"0\" max=\"4\" value=\"0\"></meter>\n    <aside class=\"hints\"><p>").concat(INITIAL_HINT, "</p></aside>\n  </section>");
	/**
	 * Render the password strength component and return an update function.
	 *
	 * Example:
	 * ```js
	 * const mountPasswordStrengthComponent = require('@noblesam/password-strength-component');
	 * const element = document.querySelector('#container');
	 * const update = mountPasswordStrengthComponent(element);
	 *
	 * // update the password strength component based on the password passed in and returns the
	 * // password strength to be used for form validation etc...
	 * const strength = update(password);
	 * ```
	 *
	 * @param {HTMLElement} element where to mount the password strength display
	 * @param {number} opts.delay min time between updates
	 * @param {string} opts.url where to load the zxcvbn.js file from
	 * @returns {function}
	 */

	function mountPasswordStrengthComponent(element) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  element.innerHTML = INITIAL_COMPONENT_HTML; // Start loading the zxcvbn lib...

	  var zxcvbnLoading = loadScriptOnce(options);
	  var version = 0;
	  var score = -1;

	  function update(password) {
	    var current = ++version;
	    return zxcvbnLoading.then(function () {
	      // If version is still current, update the score and the display to the
	      // new value... otherwise just return the existing value.
	      if (version === current) {
	        score = updateComponent(password, element);
	      }

	      return score;
	    }).catch(function (error) {
	      console.error('failed to load zxcvbn', error);
	    });
	  }

	  update(''); // Set to empty password initially (once loaded).

	  return pDebounce_1(update, options.delay || 200);
	}
	/**
	 * Update the component display based on the passed in password
	 *
	 * @param {string} password
	 * @param {HTMLElement} element
	 * @return {number}
	 */


	function updateComponent(password, element) {
	  var _getComponentParts = getComponentParts(element),
	      label = _getComponentParts.label,
	      meter = _getComponentParts.meter,
	      hints = _getComponentParts.hints;

	  var _getPasswordFeedback = getPasswordFeedback(password),
	      score = _getPasswordFeedback.score,
	      suggestions = _getPasswordFeedback.suggestions,
	      warning = _getPasswordFeedback.warning;

	  label.innerHTML = SCORE_LABELS[score];
	  label.className = "label score-".concat(score);
	  meter.value = score;
	  hints.innerHTML = [warning && "<p class=\"".concat(password && score < 1 ? 'warning' : 'notice', "\">").concat(warning, "</p>"), "<p>".concat(suggestions.join('. '), "</p>")].join('');
	  return score;
	}
	/**
	 * Get relevant part elements from the component element
	 *
	 * @param {HTMLElement} element
	 * @return {object}
	 */


	function getComponentParts(element) {
	  var label = element.querySelector('.label');
	  var meter = element.querySelector('meter');
	  var hints = element.querySelector('.hints');
	  return {
	    label: label,
	    meter: meter,
	    hints: hints
	  };
	}

	return mountPasswordStrengthComponent;

}());
