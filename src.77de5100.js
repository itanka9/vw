// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
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

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
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
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"gtihub-api.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchFile = void 0;

function fetchFile(pathSpec, fileName) {
  return fetch("https://api.github.com/repos/".concat(pathSpec.user, "/").concat(pathSpec.repo, "/contents/").concat(pathSpec.path, "/").concat(fileName), {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  }).then(function (r) {
    return r.json();
  }).then(function (r) {
    return atob(r.content);
  });
}

exports.fetchFile = fetchFile;
},{}],"metadata.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metadata = void 0;
exports.metadata = {};
},{}],"url.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseHash = exports.isAbsoluteUrl = void 0;

function isAbsoluteUrl(url) {
  var r = new RegExp('^(?:[a-z]+:)?//', 'i');
  return r.test(url);
}

exports.isAbsoluteUrl = isAbsoluteUrl;

function parseHash(locationHash) {
  var _a = locationHash.slice(1).split(/\//g),
      user = _a[0],
      repo = _a[1],
      path = _a.slice(2);

  return {
    user: user,
    repo: repo,
    path: path.join('/')
  };
}

exports.parseHash = parseHash;
},{}],"embedder.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.embedAllReferences = void 0;

var gtihub_api_1 = require("./gtihub-api");

var metadata_1 = require("./metadata");

var url_1 = require("./url");

function embedResource(el, mime, src, pathSpec) {
  var parts = src.split(/\//g);
  var path = parts.slice(0, -1);
  var fileName = parts.slice(-1)[0];
  return (0, gtihub_api_1.fetchFile)(__assign(__assign({}, pathSpec), {
    path: [pathSpec.path].concat(path).join('/')
  }), fileName).then(function (file) {
    if (!metadata_1.metadata['scripts']) {
      metadata_1.metadata['scripts'] = {};
    }

    if (path.filter(function (p) {
      return p !== '.';
    }).length === 0) {
      if (!metadata_1.metadata[mime]) {
        metadata_1.metadata[mime] = {};
      }

      metadata_1.metadata[mime][fileName] = file;
    }

    el.setAttribute('src', "data:".concat(mime, ";base64,").concat(btoa(file)));
  });
}

function embedAllReferences(htmlText, pathSpec) {
  var parser = new DOMParser();
  var htmlDoc = parser.parseFromString(htmlText, 'text/html');
  var promises = [];
  var titleEl = htmlDoc.querySelector('title');
  metadata_1.metadata['title'] = titleEl ? titleEl.textContent : '';
  var descriptionMeta = htmlDoc.querySelector('meta[name="description"]');
  metadata_1.metadata['description'] = descriptionMeta ? descriptionMeta.getAttribute('content') : '';
  htmlDoc.querySelectorAll('script').forEach(function (el) {
    var src = el.getAttribute('src');

    if (src && !(0, url_1.isAbsoluteUrl)(src)) {
      promises.push(embedResource(el, 'text/javascript', src, pathSpec));
    }
  });
  return Promise.all(promises).then(function () {
    return htmlDoc.documentElement.outerHTML;
  });
}

exports.embedAllReferences = embedAllReferences;
},{"./gtihub-api":"gtihub-api.ts","./metadata":"metadata.ts","./url":"url.ts"}],"escape.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esc = void 0;

function esc(html) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

exports.esc = esc;
},{}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var embedder_1 = require("./embedder");

var escape_1 = require("./escape");

var gtihub_api_1 = require("./gtihub-api");

var metadata_1 = require("./metadata");

var url_1 = require("./url");

function createPreview(indexHtml) {
  var div = document.createElement('div');
  div.innerHTML = "<iframe\n      width=\"1100\"\n      height=\"600\"\n      frameBorder=\"0\"\n      src=\"data:text/html;base64,".concat(btoa(indexHtml), "\"\n    ></iframe>");
  return div;
}

var pathSpec = (0, url_1.parseHash)(window.location.hash);
(0, gtihub_api_1.fetchFile)(pathSpec, 'index.html').then(function (indexHtml) {
  metadata_1.metadata['index.html'] = indexHtml;
  return (0, embedder_1.embedAllReferences)(indexHtml, pathSpec);
}).then(function (processedIndexHtml) {
  if (metadata_1.metadata['title']) {
    var h1 = document.createElement('h1');
    h1.textContent = metadata_1.metadata['title'];
    document.body.appendChild(h1);
    document.title = 'vw: ' + metadata_1.metadata['title'];
  }

  if (metadata_1.metadata['description']) {
    var title = document.createElement('p');
    title.textContent = metadata_1.metadata['description'];
    document.body.appendChild(title);
  }

  document.body.appendChild(createPreview(processedIndexHtml));
  var div = document.createElement('div');
  div.classList.add('file');
  div.innerHTML = "<label>index.html</label>\n      <pre><code class=\"language-html\">".concat((0, escape_1.esc)(metadata_1.metadata['index.html']), "</code></pre>");
  document.body.appendChild(div);

  for (var scriptName in metadata_1.metadata['text/javascript']) {
    var scriptContent = metadata_1.metadata['text/javascript'][scriptName];
    var div_1 = document.createElement('div');
    div_1.classList.add('file');
    div_1.innerHTML = "<label>".concat(scriptName, "</label>\n        <pre><code class=\"language-javascript\">").concat(scriptContent, "</code></pre>");
    document.body.appendChild(div_1);
  }

  window.hljs.highlightAll();
});
},{"./embedder":"embedder.ts","./escape":"escape.ts","./gtihub-api":"gtihub-api.ts","./metadata":"metadata.ts","./url":"url.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55781" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
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

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
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
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.js.map