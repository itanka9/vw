parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"nd6g":[function(require,module,exports) {
"use strict";function t(t,e){return fetch("https://api.github.com/repos/".concat(t.user,"/").concat(t.repo,"/contents/").concat(t.path,"/").concat(e),{headers:{Accept:"application/vnd.github.v3+json"}}).then(function(t){return t.json()}).then(function(t){return atob(t.content)})}Object.defineProperty(exports,"__esModule",{value:!0}),exports.fetchFile=void 0,exports.fetchFile=t;
},{}],"RLAs":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.metadata=void 0,exports.metadata={};
},{}],"Iryx":[function(require,module,exports) {
"use strict";function e(e){return new RegExp("^(?:[a-z]+:)?//","i").test(e)}function s(e){var s=e.slice(1).split(/\//g);return{user:s[0],repo:s[1],path:s.slice(2).join("/")}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.parseHash=exports.isAbsoluteUrl=void 0,exports.isAbsoluteUrl=e,exports.parseHash=s;
},{}],"Mp0e":[function(require,module,exports) {
"use strict";var t=this&&this.__assign||function(){return(t=Object.assign||function(t){for(var e,r=1,a=arguments.length;r<a;r++)for(var n in e=arguments[r])Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t}).apply(this,arguments)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.embedAllReferences=void 0;var e=require("./gtihub-api"),r=require("./metadata"),a=require("./url");function n(a,n,i,c){var o=i.split(/\//g),s=o.slice(0,-1),u=o.slice(-1)[0];return(0,e.fetchFile)(t(t({},c),{path:[c.path].concat(s).join("/")}),u).then(function(t){r.metadata.scripts||(r.metadata.scripts={}),0===s.filter(function(t){return"."!==t}).length&&(r.metadata[n]||(r.metadata[n]={}),r.metadata[n][u]=t),a.setAttribute("src","data:".concat(n,";base64,").concat(btoa(t)))})}function i(t,e){var i=(new DOMParser).parseFromString(t,"text/html"),c=[],o=i.querySelector("title");r.metadata.title=o?o.textContent:"";var s=i.querySelector('meta[name="description"]');return r.metadata.description=s?s.getAttribute("content"):"",i.querySelectorAll("script").forEach(function(t){var r=t.getAttribute("src");r&&!(0,a.isAbsoluteUrl)(r)&&c.push(n(t,"text/javascript",r,e))}),Promise.all(c).then(function(){return i.documentElement.outerHTML})}exports.embedAllReferences=i;
},{"./gtihub-api":"nd6g","./metadata":"RLAs","./url":"Iryx"}],"niwX":[function(require,module,exports) {
"use strict";function e(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;")}Object.defineProperty(exports,"__esModule",{value:!0}),exports.esc=void 0,exports.esc=e;
},{}],"QCba":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./embedder"),t=require("./escape"),a=require("./gtihub-api"),n=require("./metadata"),d=require("./url");function i(e){var t=document.createElement("div");return t.innerHTML='<iframe\n      width="1100"\n      height="600"\n      frameBorder="0"\n      src="data:text/html;base64,'.concat(btoa(e),'"\n    ></iframe>'),t}var r=(0,d.parseHash)(window.location.hash);(0,a.fetchFile)(r,"index.html").then(function(t){return n.metadata["index.html"]=t,(0,e.embedAllReferences)(t,r)}).then(function(e){if(n.metadata.title){var a=document.createElement("h1");a.textContent=n.metadata.title,document.body.appendChild(a),document.title="vw: "+n.metadata.title}if(n.metadata.description){var d=document.createElement("p");d.textContent=n.metadata.description,document.body.appendChild(d)}document.body.appendChild(i(e));var r=document.createElement("div");for(var c in r.classList.add("file"),r.innerHTML='<label>index.html</label>\n      <pre><code class="language-html">'.concat((0,t.esc)(n.metadata["index.html"]),"</code></pre>"),document.body.appendChild(r),n.metadata["text/javascript"]){var l=n.metadata["text/javascript"][c],o=document.createElement("div");o.classList.add("file"),o.innerHTML="<label>".concat(c,'</label>\n        <pre><code class="language-javascript">').concat(l,"</code></pre>"),document.body.appendChild(o)}window.hljs.highlightAll()});
},{"./embedder":"Mp0e","./escape":"niwX","./gtihub-api":"nd6g","./metadata":"RLAs","./url":"Iryx"}]},{},["QCba"], null)
//# sourceMappingURL=/src.b3a1fd12.js.map