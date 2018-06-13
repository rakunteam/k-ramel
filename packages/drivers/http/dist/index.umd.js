!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t["@k-ramel/driver-http"]=e()}(this,function(){"use strict";var t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},n=function(t){if(Array.isArray(t)){for(var e=0,n=Array(t.length);e<t.length;e++)n[e]=t[e];return n}return Array.from(t)},r=function(t){return function(e){return function(n){return function(r,o,i,a){return t.dispatch({type:"@@http/"+e+">"+n+">"+r,payload:o,status:i,fetch:a})}}}},o=function(o){var i={},a=function(a){var u,s,c=(u=regeneratorRuntime.mark(function t(u){for(var s=arguments.length,c=Array(s>2?s-2:0),f=2;f<s;f++)c[f-2]=arguments[f];var d,p,h,y,l,v,m,b,g,A,E=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return d=E.method,p=void 0===d?"GET":d,h=e({},i.headers,E.headers),y=e({},i,E,{headers:h}),l=r(o)(a)(p),v=void 0,m=void 0,b=[u,y].concat(n(c)),l("STARTED",void 0,void 0,b),t.prev=8,t.next=11,(g=global||window).fetch.apply(g,n(b));case 11:if(m=t.sent,v=m,!(m.headers&&m.headers.get("Content-Type")&&m.headers.get("Content-Type").includes("json"))){t.next=17;break}return t.next=16,m.json();case 16:v=t.sent;case 17:t.next=23;break;case 19:return t.prev=19,t.t0=t.catch(8),l("FAILED",t.t0,(m||{}).status,b),t.abrupt("return",t.t0);case 23:return A=m.status,l(A>=400||A<200?"FAILED":"ENDED",v,A),t.abrupt("return",v);case 26:case"end":return t.stop()}},t,void 0,[[8,19]])}),s=function(){var t=u.apply(this,arguments);return new Promise(function(e,n){return function r(o,i){try{var a=t[o](i),u=a.value}catch(t){return void n(t)}if(!a.done)return Promise.resolve(u).then(function(t){r("next",t)},function(t){r("throw",t)});e(u)}("next")})},function(t){return s.apply(this,arguments)});return["GET","POST","HEAD","PUT","DELETE","OPTIONS","CONNECT"].forEach(function(n){c[n.toLowerCase()]=function(r,o){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=e({},i.headers),u=i;if(o&&["object","array"].includes(void 0===o?"undefined":t(o))){var s=o;o instanceof FormData||(a["Content-Type"]=a["Content-Type"]||"application/json",s=JSON.stringify(o)),u=e({},u,{body:s})}return u=e({},u,{method:n,headers:a}),c(r,u)}}),c};return a.setCredentials=function(t){i=e({},i,{credentials:t})},a.setOptions=function(t){i=e({},t,{headers:e({},t.headers)})},a.setAuthorization=function(t){var n=e({},i.headers,{Authorization:t});return t||delete n.Authorization,a.setOptions(e({},i,{headers:n}))},a.clearAuthorization=function(){return a.setAuthorization()},a};return function(){return{getDriver:o}}});
//# sourceMappingURL=index.umd.js.map
