(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("MarkdownTokenizer", [], factory);
	else if(typeof exports === 'object')
		exports["MarkdownTokenizer"] = factory();
	else
		root["MarkdownTokenizer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module === 'object' && module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
}(this, function () {
    "use strict";
    var noop = function() {};
    var undefinedType = "undefined";

    function realMethod(methodName) {
        if (typeof console === undefinedType) {
            return false; // We can't build a real method without a console to log to
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // these private functions always need `this` to be set properly

    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }
    }

    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      var storageKey = "loglevel";
      if (name) {
        storageKey += ":" + name;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public API
       *
       */

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Package-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    return defaultLogger;
}));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _loglevel = __webpack_require__(0);

var log = _interopRequireWildcard(_loglevel);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

log.enableAll();

var STATE_KEYWORDS = ['START', 'DONE', 'IN_HEADER_1', 'IN_HEADER_1_TEXT', 'IN_HEADER_2', 'IN_HEADER_2_TEXT', 'IN_TEXT', 'IN_INLINE_COMMENT', 'IN_COMMENT_BLOCK', 'LEFT_ARROW', 'EXCLAMATION_MARK', 'HEAD_FIRST_DASH', 'HEAD_SECOND_DASH', 'TAIL_FIRST_DASH', 'TAIL_SECOND_DASH', 'EXCLAMATION_MARK', 'IN_COMMENT_'];

var TOKEN_TYPES = ['newline', 'tab', 'header1', 'header2', 'text', 'image', 'inline comment', 'multi-line comment'];

var StateType = STATE_KEYWORDS.reduce(function (acc, cur, i) {
  acc[cur] = i;
  return acc;
}, {});

var TokenType = TOKEN_TYPES.reduce(function (acc, cur, i) {
  acc[cur] = {
    enum: i,
    name: cur
  };
  return acc;
}, {});

var MarkdownTokenizer = function () {
  function MarkdownTokenizer(text) {
    _classCallCheck(this, MarkdownTokenizer);

    this.lines = text.split("\n").map(function (d) {
      return d + "\n";
    });
    this.line_no = 0;
    this.char_pos = -1;
    this.EOF_flag = false;
    this.line = this._get_next_line();
  }

  _createClass(MarkdownTokenizer, [{
    key: '_print_cur_char',
    value: function _print_cur_char() {
      var character = this.line[this.char_pos];
      switch (character) {
        case "\t":
          character = "\\t";
          break;
        case "\n":
          character = "\\n";
          break;
      }

      console.log('- At line ' + this.line_no + ', position ' + (this.char_pos + 1) + ', "' + character + '"');
    }
  }, {
    key: '_print_token',
    value: function _print_token(token) {
      console.log('Token \'' + token.type.name + '\', body: ' + token.body.toString());
    }
  }, {
    key: '_get_next_line',
    value: function _get_next_line() {
      this.line_no += 1;
      return this.lines.shift();
    }
  }, {
    key: '_get_next_char',
    value: function _get_next_char() {
      if (this.EOF_flag) {
        return null;
      }
      this.char_pos += 1;
      var character = this.line[this.char_pos];
      if (character !== undefined) {
        this._print_cur_char();
        return character;
      }
      this.line = this._get_next_line();
      if (this.line !== undefined) {
        this.char_pos = 0;
        character = this.line[this.char_pos];
        this._print_cur_char();
        return character;
      }
      this.EOF_flag = true;
      console.log('End of the file');
      return null;
    }
  }, {
    key: '_back_to_prev_char',
    value: function _back_to_prev_char() {
      this.char_pos -= 1;
    }
  }, {
    key: 'get_token',
    value: function get_token() {
      return this.scan_token();
    }
  }, {
    key: 'scan_token',
    value: function scan_token() {
      var state = StateType.START;
      var token = {};
      var token_type = null;
      var token_string = '';
      var token_string_stack = [];

      while (state != StateType.DONE) {
        var character = this._get_next_char();
        if (character === null) {
          return null;
        }

        switch (state) {
          case StateType.START:
            if (character === "\n") {
              state = StateType.DONE;
              token_type = TokenType.newline;
            } else if (character === "#") {
              state = StateType.IN_HEADER_1;
            } else {
              state = StateType.IN_TEXT;
              token_string += character;
            }
            break;
          case StateType.IN_HEADER_1:
            if (character === " ") {
              state = StateType.IN_HEADER_1_TEXT;
            } else if (character === "#") {
              state = StateType.IN_HEADER_2;
            }
            break;
          case StateType.IN_HEADER_1_TEXT:
            if (character === "\n") {
              state = StateType.DONE;
              token_type = TokenType.header1;
              token_string_stack.push(token_string);
            } else {
              state = StateType.IN_HEADER_1_TEXT;
              token_string += character;
            }
            break;
          case StateType.IN_HEADER_2:
            if (character === " ") {
              state = StateType.IN_HEADER_2_TEXT;
            }
            break;
          case StateType.IN_HEADER_2_TEXT:
            if (character === "\n") {
              state = StateType.DONE;
              token_type = TokenType.header2;
              token_string_stack.push(token_string);
            } else {
              state = StateType.IN_HEADER_2_TEXT;
              token_string += character;
            }
            break;
          case StateType.IN_TEXT:
            if (character === "\n") {
              state = StateType.DONE;
              token_type = TokenType.text;
              token_string_stack.push(token_string);
            } else if (character === "<") {
              state = StateType.LEFT_ARROW;
            } else {
              state = StateType.IN_TEXT;
              token_string += character;
            }
            break;
          case StateType.DONE:
            break;
        }
        if (state === StateType.DONE) {
          token.type = token_type;
          token.body = token_string_stack, this._print_token(token);
          return token;
        }
      }
    }
  }]);

  return MarkdownTokenizer;
}();

module.exports = MarkdownTokenizer;

/***/ })
/******/ ]);
});