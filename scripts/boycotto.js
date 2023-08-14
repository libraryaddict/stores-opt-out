/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  boycotto: () => (/* binding */ boycotto),
  main: () => (/* binding */ main)
});

;// CONCATENATED MODULE: external "kolmafia"
const external_kolmafia_namespaceObject = require("kolmafia");
;// CONCATENATED MODULE: ./src/Boycotto.ts
function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _iterableToArray(iter) {if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) return _arrayLikeToArray(arr);}function _createForOfIteratorHelper(o, allowArrayLike) {var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];if (!it) {if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {if (it) o = it;var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e) {throw _e;}, f: F };}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}var normalCompletion = true,didErr = false,err;return { s: function s() {it = it.call(o);}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e2) {didErr = true;err = _e2;}, f: function f() {try {if (!normalCompletion && it.return != null) it.return();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];return arr2;}

// We use a higher number as the prefix so we're aware if forbiddenStores was sorted sequentially, aka modified
var startingPrefix = 999999999 .toString();
var endingSuffix = 999999998 .toString();

function getIgnores() {
  var data = (0,external_kolmafia_namespaceObject.fileToBuffer)("boycotto_stores.txt").split(/[\r\n]+/);
  var userIds = [];var _iterator = _createForOfIteratorHelper(

      data),_step;try {for (_iterator.s(); !(_step = _iterator.n()).done;) {var line = _step.value;
      // Ignore empty lines or lines starting with a pound symbol
      if (line.startsWith("#") || line.length == 0) {
        continue;
      }

      var match = line.match(/^ID: (\d+)$/);

      if (match == null) {
        (0,external_kolmafia_namespaceObject.print)("Invalid line found while loading list for Boycotto: ".concat(
          line),
        "gray"
        );
        continue;
      }

      var userId = match[1];
      var reason = match[2];

      userIds.push(userId);
    }} catch (err) {_iterator.e(err);} finally {_iterator.f();}

  return userIds;
}

// A list of users that were in the forbidden stores list, before we modified it
function existingBoycotts() {
  return (0,external_kolmafia_namespaceObject.getProperty)("existingBoycotts").
  split(",").
  filter((s) => s.length > 0);
}

// Update the list of stores that were forbidden by the player, not the script
function updateExistingBoycotts() {
  var stores = (0,external_kolmafia_namespaceObject.getProperty)("forbiddenStores").split(",");

  // If the store list was modified by boycotto, ignore it
  if (stores.includes(startingPrefix) || stores.includes(endingSuffix)) {
    return;
  }

  // Sort the stores so that we're updating the preference as little as possible
  var sorted = stores.sort((s1, s2) => s1.localeCompare(s2));

  // Save the property
  (0,external_kolmafia_namespaceObject.setProperty)("existingBoycotts", sorted.join(","));
}

function getCleanedProperty(state) {
  var stores = (0,external_kolmafia_namespaceObject.getProperty)("forbiddenStores");

  // Get the starting index
  var startIndex = stores.indexOf(startingPrefix);

  // If index is not found, then the stores list isn't modified by boycotto
  if (startIndex < 0) {
    return stores;
  }

  // Get the index of the ending suffix, this should always be more than 0 of course
  var endIndex = stores.indexOf(endingSuffix);

  // Test if the suffix is before the prefix.
  // This should only be the case when the pref is corrupted or modified to an invalid state
  if (endIndex <= startIndex) {
    // This shouldn't happen on cleanup, but will be silent regardless
    if (state == "WARN") {
      // Enter recovery mode, we will delete all known ids
      (0,external_kolmafia_namespaceObject.print)(
        "Corrupted forbiddenStores was detected by Boycotto, attempted to remove all known IDs",
        "gray"
      );
    }

    // A list of stores known to exist before we started
    var playerIgnored = existingBoycotts();
    var ignores = getIgnores();
    ignores.push(startingPrefix);
    ignores.push(endingSuffix);

    var storeList = stores.
    split(",").
    filter((s) => playerIgnored.includes(s) || !ignores.includes(s));

    return storeList.join(",");
  }

  // At this point, the suffix should always be after the prefix
  // We only print a warning if this is unexpected
  if (state == "WARN") {
    (0,external_kolmafia_namespaceObject.print)(
      "forbiddenStores was not cleaned properly by Boycotto, this was corrected",
      "gray"
    );
  }

  // Get all entries up until our modified entries
  var prefix = stores.substring(0, startIndex);
  // Get all entries after our modified entries
  var suffix = stores.substring(endIndex + endingSuffix.length);

  // The prefix unless someone messed with forbidden stores, will always start with a comma or empty line
  // The suffix will always start with a comma or be an empty line
  var newProperty = prefix + suffix;

  // We want to clean up duplicate commas, so there's several ways we could do it. Lets just go with the simplest.
  // Split the string by comma, remove any empty lines, join with a comma.
  newProperty = newProperty.
  split(",").
  filter((s) => s.length > 0).
  join(",");

  return newProperty;
}

function start() {
  // Update existing boycotts on start, not on end
  updateExistingBoycotts();

  var cleanForbidden = getCleanedProperty("WARN");
  // Don't add players that are already ignored
  var newIgnores = getIgnores().filter(
    (i) => !cleanForbidden.split(",").includes(i)
  );
  // Use a prefix and suffix so we can avoid handling new entries
  var ignores = [startingPrefix].concat(_toConsumableArray(newIgnores), [endingSuffix]);
  var ignoresString = ignores.join(",");

  (0,external_kolmafia_namespaceObject.setProperty)(
    "forbiddenStores",
    (cleanForbidden.length > 0 ? cleanForbidden + "," : "") + ignoresString
  );
}

function end() {
  (0,external_kolmafia_namespaceObject.setProperty)("forbiddenStores", getCleanedProperty("SILENT"));
}

function boycotto(runnable) {
  try {
    start();

    runnable();
  } finally {
    // Finally we reset it to the original prefix
    end();
  }
}

/**
 * @internal
 *
 * Using the @internal flag so that developers are not confused by the existance
 * of a `main` function when they use this as a library, which is for when this
 * script is executed as a standalone
 */
function main() {var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  if (args == "start") {
    start();
    return;
  } else if (args == "stop") {
    end();
    return;
  } else if (args) {
    (0,external_kolmafia_namespaceObject.print)("Unrecognized argument '".concat(args, "'"), "red");
  }

  (0,external_kolmafia_namespaceObject.print)("To invoke this from commandline, provide 'start' or 'stop' as a parameter",

  "blue"
  );
}
var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;