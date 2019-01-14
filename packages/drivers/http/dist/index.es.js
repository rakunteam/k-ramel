function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function asyncGeneratorStep(e,t,r,n,o,a,i){try{var c=e[a](i),u=c.value}catch(e){return void r(e)}c.done?t(u):Promise.resolve(u).then(n,o)}function _asyncToGenerator(e){return function(){var t=this,r=arguments;return new Promise(function(n,o){var a=e.apply(t,r);function i(e){asyncGeneratorStep(a,n,o,i,c,"next",e)}function c(e){asyncGeneratorStep(a,n,o,i,c,"throw",e)}i(void 0)})}}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),n.forEach(function(t){_defineProperty(e,t,r[t])})}return e}function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_nonIterableRest()}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_nonIterableSpread()}function _arrayWithoutHoles(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}function _arrayWithHoles(e){if(Array.isArray(e))return e}function _iterableToArray(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function _iterableToArrayLimit(e,t){var r=[],n=!0,o=!1,a=void 0;try{for(var i,c=e[Symbol.iterator]();!(n=(i=c.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){o=!0,a=e}finally{try{n||null==c.return||c.return()}finally{if(o)throw a}}return r}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}var fromEntries=function(e){return Object.assign.apply(Object,[{}].concat(_toConsumableArray(Array.from(e,function(e){var t=_slicedToArray(e,2);return _defineProperty({},t[0],t[1])}))))},dispatchFactory=function(e){return function(t,r){return function(n){return function(o,a,i,c,u){return e.dispatch({type:"@@http/".concat(t,">").concat(n,">").concat(o),payload:a,status:i,headers:c,fetch:u,context:r})}}}},getDriver=function(e){var t={},r=function(r,n){var o=function(){var o=_asyncToGenerator(regeneratorRuntime.mark(function o(a){var i,c,u,s,f,y,p,l,d,h,b,v,_,m,S,A=arguments;return regeneratorRuntime.wrap(function(o){for(;;)switch(o.prev=o.next){case 0:for(i=A.length>1&&void 0!==A[1]?A[1]:{},c=i.method,u=void 0===c?"GET":c,s=_objectSpread({},t.headers,i.headers),f=_objectSpread({},t,i,{headers:s}),y=dispatchFactory(e)(r,n)(u),h=A.length,b=new Array(h>2?h-2:0),v=2;v<h;v++)b[v-2]=A[v];return _=[a,f].concat(b),y("STARTED",void 0,void 0,void 0,_),o.prev=8,o.next=11,(m=global||window).fetch.apply(m,_toConsumableArray(_));case 11:if(l=o.sent,p=l,l.headers&&l.headers.entries&&(d=fromEntries(l.headers.entries())),!(l.headers&&l.headers.get("Content-Type")&&l.headers.get("Content-Type").includes("json"))){o.next=18;break}return o.next=17,l.json();case 17:p=o.sent;case 18:o.next=24;break;case 20:return o.prev=20,o.t0=o.catch(8),y("FAILED",o.t0,(l||{}).status,d,_),o.abrupt("return",o.t0);case 24:return S=l.status,y(S>=400||S<200?"FAILED":"ENDED",p,S,d),o.abrupt("return",p);case 27:case"end":return o.stop()}},o,this,[[8,20]])}));return function(e){return o.apply(this,arguments)}}();return["GET","POST","HEAD","PATCH","PUT","DELETE","OPTIONS","CONNECT"].forEach(function(e){o[e.toLowerCase()]=function(t,r){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=_objectSpread({},n.headers),i=n;if(r&&["object","array"].includes(_typeof(r))){var c=r;r instanceof FormData||(a["Content-Type"]=a["Content-Type"]||"application/json",c=JSON.stringify(r)),i=_objectSpread({},i,{body:c})}return i=_objectSpread({},i,{method:e,headers:a}),o(t,i)}}),o};return r.setCredentials=function(e){t=_objectSpread({},t,{credentials:e})},r.setOptions=function(e){t=_objectSpread({},e,{headers:_objectSpread({},e.headers)})},r.setAuthorization=function(e){var n=_objectSpread({},t.headers,{Authorization:e});return e||delete n.Authorization,r.setOptions(_objectSpread({},t,{headers:n}))},r.clearAuthorization=function(){return r.setAuthorization()},r},http=function(){return{getDriver:getDriver}};export default http;
