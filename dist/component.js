(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.mountPasswordStrengthComponent = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

	var check = function (it) {
	  return it && it.Math == Math && it;
	}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


	var global_1 = // eslint-disable-next-line no-undef
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func
	Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
	  1: 2
	}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable

	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;
	var objectPropertyIsEnumerable = {
	  f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split; // fallback for non-array-like ES3 and non-enumerable old V8 strings

	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string

	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document; // typeof document.createElement is 'object' in old IE

	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) {
	    /* empty */
	  }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};
	var objectGetOwnPropertyDescriptor = {
	  f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  }

	  return it;
	};

	var nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty

	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};
	var objectDefineProperty = {
	  f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  }

	  return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});
	var sharedStore = store;

	var functionToString = Function.toString; // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper

	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;
	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var shared = createCommonjsModule(function (module) {
	  (module.exports = function (key, value) {
	    return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	  })('versions', []).push({
	    version: '3.6.5',
	    mode:  'global',
	    copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	  });
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    }

	    return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;

	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };

	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;

	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };

	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	  var getInternalState = internalState.get;
	  var enforceInternalState = internalState.enforce;
	  var TEMPLATE = String(String).split('String');
	  (module.exports = function (O, key, value, options) {
	    var unsafe = options ? !!options.unsafe : false;
	    var simple = options ? !!options.enumerable : false;
	    var noTargetGet = options ? !!options.noTargetGet : false;

	    if (typeof value == 'function') {
	      if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	      enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	    }

	    if (O === global_1) {
	      if (simple) O[key] = value;else setGlobal(key, value);
	      return;
	    } else if (!unsafe) {
	      delete O[key];
	    } else if (!noTargetGet && O[key]) {
	      simple = true;
	    }

	    if (simple) O[key] = value;else createNonEnumerableProperty(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	  })(Function.prototype, 'toString', function toString() {
	    return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	  });
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace]) : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor; // `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger

	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min; // `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength

	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key); // Don't enum bug & hidden keys


	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }

	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames

	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
	  f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;
	var objectGetOwnPropertySymbols = {
	  f: f$4
	};

	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == 'function' ? fails(detection) : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';
	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/

	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }

	  if (target) for (key in source) {
	    sourceProperty = source[key];

	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];

	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    } // add a flag to not completely full polyfills


	    if (options.sham || targetProperty && targetProperty.sham) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    } // extend global


	    redefine(target, key, sourceProperty, options);
	  }
	};

	// https://tc39.github.io/ecma262/#sec-isarray

	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// https://tc39.github.io/ecma262/#sec-toobject

	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol // eslint-disable-next-line no-undef
	&& !Symbol.sham // eslint-disable-next-line no-undef
	&& typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  }

	  return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species'); // `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate

	var arraySpeciesCreate = function (originalArray, length) {
	  var C;

	  if (isArray(originalArray)) {
	    C = originalArray.constructor; // cross-realm fallback

	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  }

	  return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process$1 = global_1.process;
	var versions = process$1 && process$1.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);

	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};

	    constructor[SPECIES$1] = function () {
	      return {
	        foo: 1
	      };
	    };

	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded'; // We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679

	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});
	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT; // `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: FORCED
	}, {
	  concat: function concat(arg) {
	    // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;

	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];

	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);

	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }

	    A.length = n;
	    return A;
	  }
	});

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () {
	      throw 1;
	    }, 1);
	  });
	};

	var nativeJoin = [].join;
	var ES3_STRINGS = indexedObject != Object;
	var STRICT_METHOD = arrayMethodIsStrict('join', ','); // `Array.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.join

	_export({
	  target: 'Array',
	  proto: true,
	  forced: ES3_STRINGS || !STRICT_METHOD
	}, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

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

	function ownKeys$1(object, enumerableOnly) {
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
	      ownKeys$1(Object(source), true).forEach(function (key) {
	        _defineProperty(target, key, source[key]);
	      });
	    } else if (Object.getOwnPropertyDescriptors) {
	      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
	    } else {
	      ownKeys$1(Object(source)).forEach(function (key) {
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

})));
