// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"js/closest-points.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ClosestPoints =
/*#__PURE__*/
function () {
  function ClosestPoints() {
    _classCallCheck(this, ClosestPoints);
  }

  _createClass(ClosestPoints, [{
    key: "bruteForce",
    value: function bruteForce(points) {
      var minDistance = Number.MAX_VALUE;
      var pointA, pointB;

      for (var i = 0; i < points.length; i++) {
        for (var j = i + 1; j < points.length; j++) {
          var distance = this._getDistance(points[i], points[j]);

          if (distance < minDistance) {
            minDistance = distance;
            pointA = points[i];
            pointB = points[j];
          }
        }
      }

      return {
        distance: minDistance,
        pointA: pointA,
        pointB: pointB
      };
    }
  }, {
    key: "divideAndConquer",
    value: function divideAndConquer(points) {
      this.events = [];
      this.points = points;
      points.sort(function (a, b) {
        return a.x - b.x;
      });
      this.pointsOrderedByX = points.slice();
      points.sort(function (a, b) {
        return a.y - b.y;
      });
      this.pointsOrderedByY = points.slice();

      var result = this._closestPair(this.pointsOrderedByX);

      return {
        distance: result.distance,
        events: this.events
      };
    }
  }, {
    key: "_closestPair",
    value: function _closestPair(points, childType) {
      this.events.push({
        type: 'highlightRect',
        x: points[0].x - 6,
        y: 0,
        width: points[points.length - 1].x - points[0].x + 12,
        height: 530
      });

      if (points.length <= 3) {
        var bruteResult = this.bruteForce(points);
        this.events.push({
          type: 'drawLine',
          pointA: bruteResult.pointA,
          pointB: bruteResult.pointB,
          label: 'd'
        });
        return bruteResult;
      }

      var middleIndex = Math.floor(points.length / 2);
      var middlePoint = points[middleIndex];
      var leftPoints = points.slice(0, middleIndex);
      var rightPoints = points.slice(middleIndex);

      var leftResult = this._closestPair(leftPoints, 'left');

      var minDistanceLeft = leftResult.distance;

      var rightResult = this._closestPair(rightPoints, 'right');

      var minDistanceRight = rightResult.distance;
      this.events.push({
        type: 'highlightLeftRight',
        x: points[0].x - 6,
        y: 0,
        width: points[points.length - 1].x - points[0].x + 12,
        height: 530,
        pointLeftA: leftResult.pointA,
        pointLeftB: leftResult.pointB,
        labelLeft: 'dl',
        pointRightA: rightResult.pointA,
        pointRightB: rightResult.pointB,
        labelRight: 'dr'
      });
      var combinedResult = leftResult.distance < rightResult.distance ? leftResult : rightResult;
      this.events.push({
        type: 'combine',
        x: points[0].x - 6,
        y: 0,
        width: points[points.length - 1].x - points[0].x + 12,
        height: 530,
        pointA: combinedResult.pointA,
        pointB: combinedResult.pointB,
        label: 'd'
      });
      var strip = this.pointsOrderedByY.filter(function (point) {
        return Math.abs(point.x - middlePoint.x) <= combinedResult.distance && point.x >= points[0].x && point.x <= points[points.length - 1].x;
      });
      this.events.push({
        type: 'highlightStrip',
        x: Math.max(points[0].x - 6, middlePoint.x - combinedResult.distance - 6),
        y: 0,
        width: Math.min(points[points.length - 1].x - Math.max(points[0].x, middlePoint.x - combinedResult.distance - 6), 2 * combinedResult.distance + 12),
        height: 530,
        pointA: combinedResult.pointA,
        pointB: combinedResult.pointB
      });

      var stripResult = this._getMinimumDistanceStrip(strip);

      var totalResult = combinedResult.distance < stripResult.distance ? combinedResult : stripResult;
      this.events.push({
        type: points.length == this.points.length ? 'highlightFinish' : 'highlightResult',
        x: points[0].x - 6,
        y: 0,
        width: points[points.length - 1].x - points[0].x + 12,
        height: 530,
        pointA: totalResult.pointA,
        pointB: totalResult.pointB,
        label: 'd'
      });
      return totalResult;
    }
  }, {
    key: "_getDistance",
    value: function _getDistance(first, second) {
      return Math.sqrt(Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2));
    }
  }, {
    key: "_getMinimumDistanceStrip",
    value: function _getMinimumDistanceStrip(strip) {
      var minDistance = Number.MAX_VALUE;
      var pointA, pointB;

      for (var i = 0; i < strip.length; i++) {
        for (var j = i + 1; j < strip.length && j - i <= 15; j++) {
          if (this._getDistance(strip[i], strip[j]) < minDistance) {
            minDistance = this._getDistance(strip[i], strip[j]);
            pointA = strip[i];
            pointB = strip[j];
          }

          this.events.push({
            type: 'highlightPoints',
            pointA: strip[i],
            pointB: strip[j]
          });
        }
      }

      return {
        distance: minDistance,
        pointA: pointA,
        pointB: pointB
      };
    }
  }]);

  return ClosestPoints;
}();

exports.default = ClosestPoints;
},{}],"js/index.js":[function(require,module,exports) {
'use strict';

var _closestPoints = _interopRequireDefault(require("./closest-points"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const testPoints = [{ x: 2, y: 3 }, { x: 12, y: 30 }, { x: 40, y: 50 }, { x: 5, y: 1 }, { x: 12, y: 10 }, { x: 3, y: 4 }];
// const closestPoints = new ClosestPoints();
// console.log(testPoints);
// console.log(closestPoints.divideAndConquer(testPoints));
// console.log(closestPoints.bruteForce(testPoints));
// Drawing
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var pointSize = 7;
var clearButton = document.getElementById('clear');
var nextButton = document.getElementById('next');
var backButton = document.getElementById('back');
var startButton = document.getElementById('start');
var points = [];
var eventIndex = -1;
var events = [];

function drawOnClick(event) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  drawPoint(x, y);
  points.push({
    x: x,
    y: y
  });
}

function drawPoint(x, y) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
  ctx.fillStyle = "#4E9AF1";
  ctx.fill();
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawLine(a, b) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
  points.forEach(function (p) {
    return drawPoint(p.x, p.y);
  });
}

function drawLabel(text, p1, p2, padding) {
  if (p1.x > p2.x) {
    var t = p1;
    p1 = p2;
    p2 = t;
  }

  var alignment = 'center';
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  var p = p1;
  var pad = 1 / 2;
  ctx.save();
  ctx.textAlign = alignment;
  ctx.fillStyle = '#0E0A19';
  ctx.font = 'bold 17px Arial';
  ctx.translate(p.x + dx * pad, p.y + dy * pad);
  ctx.rotate(Math.atan2(dy, dx));
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function highlightPoint(x, y, color) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
  ctx.fillStyle = "#0000ff";
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function highlightRect(x, y, width, height, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);
  ctx.restore();
  points.forEach(function (p) {
    return drawPoint(p.x, p.y);
  });
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points = [];
  eventIndex = 0;
  console.log('evo me');
  nextButton.style.display = 'none';
  backButton.style.display = 'none';
}

function next() {
  if (eventIndex < events.length - 1) {
    if (eventIndex >= 0) {
      var _event = events[eventIndex];

      if (_event.type == 'highlightRect') {
        highlightRect(_event.x, _event.y, _event.width, _event.height, '#C7C4C0');
      } else if (_event.type == 'highlightPoints') {
        highlightPoint(_event.pointA.x, _event.pointA.y, '#00000');
        highlightPoint(_event.pointB.x, _event.pointB.y, '#00000');
      }
    }

    eventIndex++;
    var event = events[eventIndex];

    if (event.type == 'highlightRect') {
      highlightRect(event.x, event.y, event.width, event.height, '#fef36f');
    } else if (event.type == 'drawLine') {
      drawLine(event.pointA, event.pointB);
      drawLabel(event.label, event.pointA, event.pointB); //console.log('label = ' + event.label);
    } else if (event.type == 'highlightPoints') {
      highlightPoint(event.pointA.x, event.pointA.y, '#ff0000');
      highlightPoint(event.pointB.x, event.pointB.y, '#ff0000');
    } else if (event.type == 'combine') {
      highlightRect(event.x, event.y, event.width, event.height, '#fef36f');
      drawLine(event.pointA, event.pointB);
      drawLabel(event.label, event.pointA, event.pointB);
    } else if (event.type == 'highlightStrip') {
      highlightRect(event.x, event.y, event.width, event.height, '#4CAF50');
      drawLine(event.pointA, event.pointB);
    } else if (event.type == 'highlightResult') {
      highlightRect(event.x, event.y, event.width, event.height, '#fef36f');
      drawLine(event.pointA, event.pointB);
      drawLabel(event.label, event.pointA, event.pointB);
    } else if (event.type == 'highlightLeftRight') {
      highlightRect(event.x, event.y, event.width, event.height, '#fef36f');
      drawLine(event.pointLeftA, event.pointLeftB);
      drawLabel(event.labelLeft, event.pointLeftA, event.pointLeftB);
      drawLine(event.pointRightA, event.pointRightB);
      drawLabel(event.labelRight, event.pointRightA, event.pointRightB);
    } else if (event.type == 'highlightFinish') {
      highlightRect(0, 0, 1024, 530, '#C7C4C0');
      drawLine(event.pointA, event.pointB);
      drawLabel(event.label, event.pointA, event.pointB);
    }
  }
}

function back() {
  if (eventIndex > 0) {
    eventIndex--;
    var event = events[eventIndex];

    if (event.type == 'highlightRect') {
      highlightRect(event.x, event.y, event.width, event.height, '#' + Math.floor(Math.random() * 16777215).toString(16));
    } else if (event.type == 'highlightRect') {
      highlightRect(event.x, event.y, event.width, event.height, '#f8f5f0');
    } else if (event.type == 'drawLine') {
      drawLine(event.pointA, event.pointB);
    }
  }
}

function start() {
  var closestPoints = new _closestPoints.default();
  var result = closestPoints.divideAndConquer(points);
  events = result.events;
  nextButton.style.display = 'inline';
  backButton.style.display = 'inline';
}

canvas.addEventListener('click', drawOnClick);
clearButton.addEventListener('click', clearCanvas);
nextButton.addEventListener('click', next);
backButton.addEventListener('click', back);
startButton.addEventListener('click', start);
},{"./closest-points":"js/closest-points.js"}],"C:/Users/Fulu/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63719" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["C:/Users/Fulu/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.map