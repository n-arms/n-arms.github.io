(()=>{"use strict";var n={446:(n,r,t)=>{var e=t(971),u=t(275),i=n=>{const r=new XMLHttpRequest;if(r.open("GET",n,!1),r.send(),200==r.status)return r.responseText};function o(n){switch(n){case"#blog":return 0;case"":case"#main":return 1;default:return n.length>=7?{_0:n.substring(6)}:4}}r.request=i,r.parseHash=o,r.init=function(n){var r=o(window.location.hash),t=JSON.parse(i("./pages/manifest.json")),a=u.fromArray(e.map(t.pages,(function(n){return[n.title.replace(/[ ]/g,"-"),{title:n.title,src:i("./pages/"+n.src),date:n.date}]})));return{page:r,hover:void 0,loadedPosts:a,manifest:t}}},536:(n,r,t)=>{var e=t(923),u=t(971),i=t(922),o=t(300);function a(n,r,t,u,a,c){return i.a(e.caml_equal(u.hover,t)?void 0!==r?[o.onMouseOut({TAG:1,_0:t}),o.props([["href",r]]),o.styles([["color",a?c?"black":"white":"#bee67e"],["text-decoration","none"]])]:[o.onMouseOut({TAG:1,_0:t}),o.onClick({TAG:2,_0:t}),o.styles([["color",a?c?"black":"white":"#bee67e"],["text-decoration","none"]])]:[o.onMouseOver({TAG:0,_0:t}),o.styles([["color",a?"#bee67e":c?"black":"white"],["text-decoration","none"]])],[n])}r.link=a,r.inlineLink=function(n,r,t,e){return a(n,r,t,e,!0,!1)},r.alternate=function(n){var r={contents:!1};return u.map(n,(function(n){var t=n[1],e=n[0];return r.contents=!r.contents,i.div([o.styles([["background-color",r.contents?"#ffffff":"#e6e6e6"],["padding","1em"],["display","flex"]])],r.contents?[e,t]:[t,e])}))},r.content=function(n){return i.div([o.styles([["color","white"]])],[i.text(n)])},r.centered=function(n){return i.div([o.styles([["text-align","center"],["color","white"]])],n)},r.outline=function(n){return i.p([],n)},r.styled_div=function(n,r){return i.div([o.styles(n)],r)}},300:(n,r,t)=>{var e=t(971);r.props=function(n){return{eval:function(r){return new Promise((function(t,u){return e.forEach(n,(function(n){r.setAttribute(n[0],n[1])}))}))}}},r.styles=function(n){return{eval:function(r){return new Promise((function(t,u){var i=e.reduce(e.map(n,(function(n){return n[0]+":"+n[1]+";"})),"",(function(n,r){return n+r}));r.setAttribute("style",i)}))}}},r.onClick=function(n){return{eval:function(r){return new Promise((function(t,e){r.addEventListener("click",(function(r){return t({_0:n})}))}))}}},r.onMouseOver=function(n){return{eval:function(r){return new Promise((function(t,e){r.addEventListener("mouseover",(function(r){return t({_0:n})}))}))}}},r.onMouseOut=function(n){return{eval:function(r){return new Promise((function(t,e){r.addEventListener("mouseout",(function(r){return t({_0:n})}))}))}}}},93:(n,r,t)=>{var e=t(386);r.$$then=function(n,r){return n.then(e.__1(r))},r.mainloop=function(n,r,t,u){var i=function(n,r,t,u){n.innerHTML="",Promise.race([e._1(e._1(u,r).eval,n),new Promise((function(n,r){window.addEventListener("hashchange",(function(r){return n(0)}),{once:!0,capture:!1,passive:!1})}))]).then((function(o){return Promise.resolve(i(n,o?e._2(t,o._0,r):r,t,u))}))};return i(n,r,t,u)},r.hash=function(n){return window.location.hash}},922:(n,r,t)=>{var e=t(386),u=t(971);function i(n,r,t){return{eval:function(i){var o=document.createElement(n);return i.appendChild(o),Promise.race(u.map(r,(function(n){return e._1(n.eval,o)})).concat(u.map(t,(function(n){return e._1(n.eval,o)}))))}}}r.node=i,r.p=function(n,r){return i("p",n,r)},r.h1=function(n,r){return i("h1",n,r)},r.h2=function(n,r){return i("h2",n,r)},r.h3=function(n,r){return i("h3",n,r)},r.h4=function(n,r){return i("h4",n,r)},r.h5=function(n,r){return i("h5",n,r)},r.h6=function(n,r){return i("h6",n,r)},r.div=function(n,r){return i("div",n,r)},r.button=function(n,r){return i("button",n,r)},r.a=function(n,r){return i("a",n,r)},r.ol=function(n,r){return i("ol",n,r)},r.ul=function(n,r){return i("ul",n,r)},r.li=function(n,r){return i("li",n,r)},r.table=function(n,r){return i("table",n,r)},r.th=function(n,r){return i("th",n,r)},r.tr=function(n,r){return i("tr",n,r)},r.td=function(n,r){return i("td",n,r)},r.img=function(n){return i("img",n,[])},r.text=function(n){return{eval:function(r){var t=document.createTextNode(n);return r.appendChild(t),new Promise((function(n,r){}))}}},r.literal=function(n){return{eval:function(r){var t=document.createElement("div");return r.appendChild(t),t.innerHTML=n,new Promise((function(n,r){}))}}}},971:(n,r,t)=>{var e=t(253),u=t(386),i=t(763),o=t(175);function a(n,r,t){var e=n[r];n[r]=n[t],n[t]=e}function c(n){for(var r=n.length,t=0;t<r;++t)a(n,t,i.random_int(t,r))}function f(n,r){if(n<=0)return[];for(var t=new Array(n),e=0;e<n;++e)t[e]=r(e);return t}function l(n,r){var t=f(n,r);return c(t),t}function s(n,r,t){for(var e=n.length,u=r.length,i=e<u?e:u,o=new Array(i),a=0;a<i;++a)o[a]=t(n[a],r[a]);return o}function v(n,r){for(var t=0,e=n.length;t<e;++t)r(n[t])}function _(n,r){for(var t=n.length,e=new Array(t),u=0;u<t;++u)e[u]=r(n[u]);return e}function d(n,r){for(var t,e=n.length,u=0;void 0===t&&u<e;){var i=n[u];r(i)&&(t=o.some(i)),u=u+1|0}return t}function h(n,r){for(var t,e=n.length,u=0;void 0===t&&u<e;)r(n[u])&&(t=u),u=u+1|0;return t}function m(n,r){for(var t=n.length,e=new Array(t),u=0,i=0;i<t;++i){var o=n[i];r(o)&&(e[u]=o,u=u+1|0)}return e.length=u,e}function g(n,r){for(var t=n.length,e=new Array(t),u=0,i=0;i<t;++i){var o=n[i];r(o,i)&&(e[u]=o,u=u+1|0)}return e.length=u,e}function p(n,r){for(var t=n.length,e=new Array(t),u=0,i=0;i<t;++i){var a=r(n[i]);void 0!==a&&(e[u]=o.valFromOption(a),u=u+1|0)}return e.length=u,e}function y(n,r){for(var t=0,e=n.length;t<e;++t)r(t,n[t])}function E(n,r){for(var t=n.length,e=new Array(t),u=0;u<t;++u)e[u]=r(u,n[u]);return e}function x(n,r,t){for(var e=r,u=0,i=n.length;u<i;++u)e=t(e,n[u]);return e}function w(n,r,t){for(var e=r,u=n.length-1|0;u>=0;--u)e=t(e,n[u]);return e}function b(n,r,t,u){for(var i=t,o=e.caml_int_min(n.length,r.length)-1|0;o>=0;--o)i=u(i,n[o],r[o]);return i}function k(n,r,t){for(var e=r,u=0,i=n.length;u<i;++u)e=t(e,n[u],u);return e}function A(n,r){for(var t=n.length,e=0;;){var u=e;if(u===t)return!0;if(!r(n[u]))return!1;e=u+1|0}}function N(n,r){for(var t=n.length,e=0;;){var u=e;if(u===t)return!1;if(r(n[u]))return!0;e=u+1|0}}function T(n,r,t,e,u){for(;;){var i=t;if(i===u)return!0;if(!e(n[i],r[i]))return!1;t=i+1|0}}function S(n,r,t){return T(n,r,0,t,e.caml_int_min(n.length,r.length))}function O(n,r,t){for(var u=0,i=e.caml_int_min(n.length,r.length);;){var o=u;if(o===i)return!1;if(t(n[o],r[o]))return!0;u=o+1|0}}function I(n,r,t){var e=n.length;return e===r.length&&T(n,r,0,t,e)}function M(n,r,t){var e=n.length,u=r.length;if(e>u)return 1;if(e<u)return-1;for(var i=0;;){var o=i;if(o===e)return 0;var a=t(n[o],r[o]);if(0!==a)return a;i=o+1|0}}function P(n,r){for(var t=n.length,e=0,u=0,i=new Array(t),o=new Array(t),a=0;a<t;++a){var c=n[a];r(c)?(i[e]=c,e=e+1|0):(o[u]=c,u=u+1|0)}return i.length=e,o.length=u,[i,o]}function U(n,r,t){var e=n.length;if(0===e)return"";for(var u=e-1|0,i=0,o="";;){var a=o,c=i;if(c===u)return a+t(n[c]);o=a+(t(n[c])+r),i=c+1|0}}r.get=function(n,r){if(r>=0&&r<n.length)return o.some(n[r])},r.getExn=function(n,r){if(!(r>=0&&r<n.length))throw{RE_EXN_ID:"Assert_failure",_1:["belt_Array.ml",27,4],Error:new Error};return n[r]},r.set=function(n,r,t){return r>=0&&r<n.length&&(n[r]=t,!0)},r.setExn=function(n,r,t){if(!(r>=0&&r<n.length))throw{RE_EXN_ID:"Assert_failure",_1:["belt_Array.ml",33,2],Error:new Error};n[r]=t},r.shuffleInPlace=c,r.shuffle=function(n){var r=n.slice(0);return c(r),r},r.reverseInPlace=function(n){for(var r=n.length,t=0,e=r/2|0;t<e;++t)a(n,0+t|0,((0+r|0)-t|0)-1|0)},r.reverse=function(n){for(var r=n.length,t=new Array(r),e=0;e<r;++e)t[e]=n[(r-1|0)-e|0];return t},r.make=function(n,r){if(n<=0)return[];for(var t=new Array(n),e=0;e<n;++e)t[e]=r;return t},r.range=function(n,r){var t=r-n|0;if(t<0)return[];for(var e=new Array(t+1|0),u=0;u<=t;++u)e[u]=n+u|0;return e},r.rangeBy=function(n,r,t){var e=r-n|0;if(e<0||t<=0)return[];for(var u=1+(e/t|0)|0,i=new Array(u),o=n,a=0;a<u;++a)i[a]=o,o=o+t|0;return i},r.makeByU=f,r.makeBy=function(n,r){return f(n,u.__1(r))},r.makeByAndShuffleU=l,r.makeByAndShuffle=function(n,r){return l(n,u.__1(r))},r.zip=function(n,r){for(var t=n.length,e=r.length,u=t<e?t:e,i=new Array(u),o=0;o<u;++o)i[o]=[n[o],r[o]];return i},r.zipByU=s,r.zipBy=function(n,r,t){return s(n,r,u.__2(t))},r.unzip=function(n){for(var r=n.length,t=new Array(r),e=new Array(r),u=0;u<r;++u){var i=n[u];t[u]=i[0],e[u]=i[1]}return[t,e]},r.concat=function(n,r){for(var t=n.length,e=r.length,u=new Array(t+e|0),i=0;i<t;++i)u[i]=n[i];for(var o=0;o<e;++o)u[t+o|0]=r[o];return u},r.concatMany=function(n){for(var r=n.length,t=0,e=0;e<r;++e)t=t+n[e].length|0;var u=new Array(t);t=0;for(var i=0;i<r;++i)for(var o=n[i],a=0,c=o.length;a<c;++a)u[t]=o[a],t=t+1|0;return u},r.slice=function(n,r,t){if(t<=0)return[];var u=n.length,i=r<0?e.caml_int_max(u+r|0,0):r,o=u-i|0,a=o<t?o:t;if(a<=0)return[];for(var c=new Array(a),f=0;f<a;++f)c[f]=n[i+f|0];return c},r.sliceToEnd=function(n,r){for(var t=n.length,u=r<0?e.caml_int_max(t+r|0,0):r,i=t-u|0,o=new Array(i),a=0;a<i;++a)o[a]=n[u+a|0];return o},r.fill=function(n,r,t,u){if(!(t<=0)){var i=n.length,o=r<0?e.caml_int_max(i+r|0,0):r,a=i-o|0,c=a<t?a:t;if(!(c<=0))for(var f=o,l=o+c|0;f<l;++f)n[f]=u}},r.blit=function(n,r,t,u,i){var o=n.length,a=t.length,c=r<0?e.caml_int_max(o+r|0,0):r,f=u<0?e.caml_int_max(a+u|0,0):u,l=e.caml_int_min(i,e.caml_int_min(o-c|0,a-f|0));if(f<=c)for(var s=0;s<l;++s)t[s+f|0]=n[s+c|0];else for(var v=l-1|0;v>=0;--v)t[v+f|0]=n[v+c|0]},r.blitUnsafe=function(n,r,t,e,u){if(e<=r)for(var i=0;i<u;++i)t[i+e|0]=n[i+r|0];else for(var o=u-1|0;o>=0;--o)t[o+e|0]=n[o+r|0]},r.forEachU=v,r.forEach=function(n,r){return v(n,u.__1(r))},r.mapU=_,r.map=function(n,r){return _(n,u.__1(r))},r.getByU=d,r.getBy=function(n,r){return d(n,u.__1(r))},r.getIndexByU=h,r.getIndexBy=function(n,r){return h(n,u.__1(r))},r.keepU=m,r.keep=function(n,r){return m(n,u.__1(r))},r.keepWithIndexU=g,r.keepWithIndex=function(n,r){return g(n,u.__2(r))},r.keepMapU=p,r.keepMap=function(n,r){return p(n,u.__1(r))},r.forEachWithIndexU=y,r.forEachWithIndex=function(n,r){return y(n,u.__2(r))},r.mapWithIndexU=E,r.mapWithIndex=function(n,r){return E(n,u.__2(r))},r.partitionU=P,r.partition=function(n,r){return P(n,u.__1(r))},r.reduceU=x,r.reduce=function(n,r,t){return x(n,r,u.__2(t))},r.reduceReverseU=w,r.reduceReverse=function(n,r,t){return w(n,r,u.__2(t))},r.reduceReverse2U=b,r.reduceReverse2=function(n,r,t,e){return b(n,r,t,u.__3(e))},r.reduceWithIndexU=k,r.reduceWithIndex=function(n,r,t){return k(n,r,u.__3(t))},r.joinWithU=U,r.joinWith=function(n,r,t){return U(n,r,u.__1(t))},r.someU=N,r.some=function(n,r){return N(n,u.__1(r))},r.everyU=A,r.every=function(n,r){return A(n,u.__1(r))},r.every2U=S,r.every2=function(n,r,t){return S(n,r,u.__2(t))},r.some2U=O,r.some2=function(n,r,t){return O(n,r,u.__2(t))},r.cmpU=M,r.cmp=function(n,r,t){return M(n,r,u.__2(t))},r.eqU=I,r.eq=function(n,r,t){return I(n,r,u.__2(t))}},275:(n,r,t)=>{var e=t(175),u=t(863),i=t(252),o=t(354);function a(n,r,t){for(;;){var e=t;if(void 0===e)return;var i=u.caml_hash_final_mix(u.caml_hash_mix_string(0,e.key))&(n.length-1|0),o=r[i];void 0!==o?o.next=e:n[i]=e,r[i]=e,t=e.next}}function c(n,r,t){var e=n.buckets,i=e.length,o=u.caml_hash_final_mix(u.caml_hash_mix_string(0,r))&(i-1|0),c=e[o];if(void 0!==c?function(n,r,t){for(;;){var e=t;if(e.key===n)return e.value=r,!1;var u=e.next;if(void 0===u)return!0;t=u}}(r,t,c)&&(e[o]={key:r,value:t,next:c},n.size=n.size+1|0):(e[o]={key:r,value:t,next:void 0},n.size=n.size+1|0),n.size>i<<1){var f=n.buckets,l=f.length,s=l<<1;if(s<l)return;var v=new Array(s),_=new Array(s);n.buckets=v;for(var d=0;d<l;++d)a(v,_,f[d]);for(var h=0;h<s;++h){var m=_[h];void 0!==m&&(m.next=void 0)}}}var f=o.clear,l=o.isEmpty,s=i.copy,v=i.forEachU,_=i.forEach,d=i.reduceU,h=i.reduce,m=i.keepMapInPlaceU,g=i.keepMapInPlace,p=i.toArray,y=i.keysToArray,E=i.valuesToArray,x=i.getBucketHistogram,w=i.logStats;r.make=function(n){return o.make(void 0,void 0,n)},r.clear=f,r.isEmpty=l,r.set=c,r.copy=s,r.get=function(n,r){var t=n.buckets,i=t[u.caml_hash_final_mix(u.caml_hash_mix_string(0,r))&(t.length-1|0)];if(void 0!==i){if(r===i.key)return e.some(i.value);var o=i.next;if(void 0!==o){if(r===o.key)return e.some(o.value);var a=o.next;if(void 0!==a){if(r===a.key)return e.some(a.value);for(var c=a.next;;){var f=c;if(void 0===f)return;if(r===f.key)return e.some(f.value);c=f.next}}}}},r.has=function(n,r){var t=n.buckets,e=t[u.caml_hash_final_mix(u.caml_hash_mix_string(0,r))&(t.length-1|0)];if(void 0===e)return!1;for(var i=e;;){var o=i;if(o.key===r)return!0;var a=o.next;if(void 0===a)return!1;i=a}},r.remove=function(n,r){var t=n.buckets,e=u.caml_hash_final_mix(u.caml_hash_mix_string(0,r))&(t.length-1|0),i=t[e];if(void 0!==i){if(i.key===r)return t[e]=i.next,void(n.size=n.size-1|0);for(var o=i,a=i.next;;){var c=a,f=o;if(void 0===c)return;var l=c.next;if(c.key===r)return f.next=l,void(n.size=n.size-1|0);a=l,o=c}}},r.forEachU=v,r.forEach=_,r.reduceU=d,r.reduce=h,r.keepMapInPlaceU=m,r.keepMapInPlace=g,r.size=function(n){return n.size},r.toArray=p,r.keysToArray=y,r.valuesToArray=E,r.fromArray=function(n){for(var r=n.length,t=o.make(void 0,void 0,r),e=0;e<r;++e){var u=n[e];c(t,u[0],u[1])}return t},r.mergeMany=function(n,r){for(var t=r.length,e=0;e<t;++e){var u=r[e];c(n,u[0],u[1])}},r.getBucketHistogram=x,r.logStats=w},517:(n,r,t)=>{var e=t(386),u=t(175);function i(n,r){if(void 0!==n&&r(u.valFromOption(n)))return n}function o(n,r){if(void 0!==n)return r(u.valFromOption(n))}function a(n,r,t){return void 0!==n?t(u.valFromOption(n)):r}function c(n,r){if(void 0!==n)return u.some(r(u.valFromOption(n)))}function f(n,r){if(void 0!==n)return r(u.valFromOption(n))}function l(n,r,t){return void 0!==n?void 0!==r&&t(u.valFromOption(n),u.valFromOption(r)):void 0===r}function s(n,r,t){return void 0!==n?void 0!==r?t(u.valFromOption(n),u.valFromOption(r)):1:void 0!==r?-1:0}r.keepU=i,r.keep=function(n,r){return i(n,e.__1(r))},r.forEachU=o,r.forEach=function(n,r){return o(n,e.__1(r))},r.getExn=function(n){if(void 0!==n)return u.valFromOption(n);throw{RE_EXN_ID:"Not_found",Error:new Error}},r.mapWithDefaultU=a,r.mapWithDefault=function(n,r,t){return a(n,r,e.__1(t))},r.mapU=c,r.map=function(n,r){return c(n,e.__1(r))},r.flatMapU=f,r.flatMap=function(n,r){return f(n,e.__1(r))},r.getWithDefault=function(n,r){return void 0!==n?u.valFromOption(n):r},r.isSome=function(n){return void 0!==n},r.isNone=function(n){return void 0===n},r.eqU=l,r.eq=function(n,r,t){return l(n,r,e.__2(t))},r.cmpU=s,r.cmp=function(n,r,t){return s(n,r,e.__2(t))}},252:(n,r,t)=>{var e=t(386),u=t(971),i=t(175);function o(n){if(void 0===n)return n;var r={key:n.key,value:n.value,next:void 0};return function(n,r){for(;;){var t=r,e=n;if(void 0===e)return;var u={key:e.key,value:e.value,next:void 0};t.next=u,r=u,n=e.next}}(n.next,r),r}function a(n){for(var r=n.length,t=new Array(r),e=0;e<r;++e)t[e]=o(n[e]);return t}function c(n,r){for(;;){var t=n;if(void 0===r)return t;r=r.next,n=t+1|0}}function f(n,r){for(;;){var t=r;if(void 0===t)return;n(t.key,t.value),r=t.next}}function l(n,r){for(var t=n.buckets,e=0,u=t.length;e<u;++e)f(r,t[e])}function s(n,r,t){for(;;){var e=r;if(void 0===e)return t;t=n(t,e.key,e.value),r=e.next}}function v(n,r,t){for(var e=n.buckets,u=r,i=0,o=e.length;i<o;++i)u=s(t,e[i],u);return u}function _(n){var r=function(n){return u.reduceU(n.buckets,0,(function(n,r){var t=c(0,r);return n>t?n:t}))}(n),t=u.makeByU(r+1|0,(function(n){return 0}));return u.forEachU(n.buckets,(function(n){var r=c(0,n);t[r]=t[r]+1|0})),t}function d(n,r,t,e,u){for(;;){var o=u,a=e,c=o.next,f=n(o.key,o.value);if(void 0===f){if(r.size=r.size-1|0,void 0===c)return void(void 0!==a?a.next=c:r.buckets[t]=a);u=c}else{if(void 0!==a?o.next=o:r.buckets[t]=o,o.value=i.valFromOption(f),void 0===c)return void(o.next=c);u=c,e=o}}}function h(n,r){for(var t=n.buckets,e=0,u=t.length;e<u;++e){var i=t[e];void 0!==i&&d(r,n,e,void 0,i)}}function m(n,r,t,e){for(;;){var u=t,i=n;r[i]=e(u);var o=u.next;if(void 0===o)return i+1|0;t=o,n=i+1|0}}function g(n,r){for(var t=n.buckets,e=0,u=new Array(n.size),i=0,o=t.length;i<o;++i){var a=t[i];void 0!==a&&(e=m(e,u,a,r))}return u}r.C=void 0,r.copy=function(n){return{size:n.size,buckets:a(n.buckets),hash:n.hash,eq:n.eq}},r.forEachU=l,r.forEach=function(n,r){return l(n,e.__2(r))},r.reduceU=v,r.reduce=function(n,r,t){return v(n,r,e.__3(t))},r.logStats=function(n){var r=_(n);console.log({bindings:n.size,buckets:n.buckets.length,histogram:r})},r.keepMapInPlaceU=h,r.keepMapInPlace=function(n,r){return h(n,e.__2(r))},r.fillArray=function(n,r,t){for(;;){var e=t,u=n;r[u]=[e.key,e.value];var i=e.next;if(void 0===i)return u+1|0;t=i,n=u+1|0}},r.keysToArray=function(n){return g(n,(function(n){return n.key}))},r.valuesToArray=function(n){return g(n,(function(n){return n.value}))},r.toArray=function(n){return g(n,(function(n){return[n.key,n.value]}))},r.getBucketHistogram=_},354:(n,r)=>{r.emptyOpt=void 0,r.make=function(n,r,t){var e=function(n,r){for(;;){if(n>=r)return n;if(n<<1<n)return n;n<<=1}}(16,t);return{size:0,buckets:new Array(e),hash:n,eq:r}},r.clear=function(n){n.size=0;for(var r=n.buckets,t=r.length,e=0;e<t;++e)r[e]=void 0},r.isEmpty=function(n){return 0===n.size}},253:(n,r)=>{function t(n,r){return n[1]===r[1]&&n[0]===r[0]}function e(n,r){var t=r[0],e=n[0];return e>t||!(e<t)&&n[1]>=r[1]}function u(n,r){return n[0]>r[0]||!(n[0]<r[0])&&n[1]>r[1]}r.caml_int_compare=function(n,r){return n<r?-1:n===r?0:1},r.caml_bool_compare=function(n,r){return n?r?0:1:r?-1:0},r.caml_float_compare=function(n,r){return n===r?0:n<r?-1:n>r||n==n?1:r==r?-1:0},r.caml_string_compare=function(n,r){return n===r?0:n<r?-1:1},r.caml_bool_min=function(n,r){return n?r:n},r.caml_int_min=function(n,r){return n<r?n:r},r.caml_float_min=function(n,r){return n<r?n:r},r.caml_string_min=function(n,r){return n<r?n:r},r.caml_int32_min=function(n,r){return n<r?n:r},r.caml_bool_max=function(n,r){return n||r},r.caml_int_max=function(n,r){return n>r?n:r},r.caml_float_max=function(n,r){return n>r?n:r},r.caml_string_max=function(n,r){return n>r?n:r},r.caml_int32_max=function(n,r){return n>r?n:r},r.i64_eq=t,r.i64_neq=function(n,r){return!t(n,r)},r.i64_lt=function(n,r){return!e(n,r)},r.i64_gt=u,r.i64_le=function(n,r){return!u(n,r)},r.i64_ge=e,r.i64_min=function(n,r){return e(n,r)?r:n},r.i64_max=function(n,r){return u(n,r)?n:r}},748:(n,r)=>{r.dup=function(n){return n.slice(0)},r.sub=function(n,r,t){for(var e=new Array(t),u=0,i=r;u<t;)e[u]=n[i],u=u+1|0,i=i+1|0;return e},r.concat=function(n){var r=function(n,r){for(;;){var t=r,e=n;if(!t)return e;r=t.tl,n=t.hd.length+e|0}}(0,n),t=new Array(r);return function(n,r,t){for(;;){var e=t,u=r;if(!e)return;for(var i=e.hd,o=i.length,a=u,c=0;c<o;)n[a]=i[c],a=a+1|0,c=c+1|0;t=e.tl,r=a}}(t,0,n),t},r.make=function(n,r){for(var t=new Array(n),e=0;e<n;++e)t[e]=r;return t},r.make_float=function(n){for(var r=new Array(n),t=0;t<n;++t)r[t]=0;return r},r.blit=function(n,r,t,e,u){if(e<=r)for(var i=0;i<u;++i)t[i+e|0]=n[i+r|0];else for(var o=u-1|0;o>=0;--o)t[o+e|0]=n[o+r|0]},r.get=function(n,r){if(r<0||r>=n.length)throw{RE_EXN_ID:"Invalid_argument",_1:"index out of bounds",Error:new Error};return n[r]},r.set=function(n,r,t){if(r<0||r>=n.length)throw{RE_EXN_ID:"Invalid_argument",_1:"index out of bounds",Error:new Error};n[r]=t}},863:(n,r)=>{function t(n,r){return n<<r|n>>>(32-r|0)|0}function e(n,r){var e=r;e=t(e=Math.imul(e,-862048943),15);var u=n^(e=Math.imul(e,461845907));return((u=t(u,13))+(u<<2)|0)-430675100|0}r.caml_hash_mix_int=e,r.caml_hash_mix_string=function(n,r){for(var t=r.length,u=(t/4|0)-1|0,i=n,o=0;o<=u;++o){var a=o<<2;i=e(i,r.charCodeAt(a)|r.charCodeAt(a+1|0)<<8|r.charCodeAt(a+2|0)<<16|r.charCodeAt(a+3|0)<<24)}var c=3&t;return 0!==c&&(i=e(i,3===c?r.charCodeAt(t-1|0)<<16|r.charCodeAt(t-2|0)<<8|r.charCodeAt(t-3|0):2===c?r.charCodeAt(t-1|0)<<8|r.charCodeAt(t-2|0):r.charCodeAt(t-1|0))),i^t},r.caml_hash_final_mix=function(n){var r=n^n>>>16;return r=Math.imul(r,-2048144789),r^=r>>>13,(r=Math.imul(r,-1028477387))^r>>>16}},923:(n,r,t)=>{var e=t(253),u=function(n,r){for(var t in n)r(t)};function i(n,r){if(n===r)return 0;var t=typeof n,u=typeof r;switch(t){case"boolean":if("boolean"===u)return e.caml_bool_compare(n,r);break;case"function":if("function"===u)throw{RE_EXN_ID:"Invalid_argument",_1:"compare: functional value",Error:new Error};break;case"number":if("number"===u)return e.caml_int_compare(n,r);break;case"string":return"string"===u?e.caml_string_compare(n,r):1;case"undefined":return-1}switch(u){case"string":return-1;case"undefined":return 1;default:if("boolean"===t)return 1;if("boolean"===u)return-1;if("function"===t)return 1;if("function"===u)return-1;if("number"===t)return null===r||void 0!==r.BS_PRIVATE_NESTED_SOME_NONE?1:-1;if("number"===u)return null===n||void 0!==n.BS_PRIVATE_NESTED_SOME_NONE?-1:1;if(null===n)return void 0!==r.BS_PRIVATE_NESTED_SOME_NONE?1:-1;if(null===r)return void 0!==n.BS_PRIVATE_NESTED_SOME_NONE?-1:1;if(void 0!==n.BS_PRIVATE_NESTED_SOME_NONE)return void 0!==r.BS_PRIVATE_NESTED_SOME_NONE?o(n,r):-1;var a=0|n.TAG,c=0|r.TAG;if(248===a)return e.caml_int_compare(n[1],r[1]);if(251===a)throw{RE_EXN_ID:"Invalid_argument",_1:"equal: abstract value",Error:new Error};if(a!==c)return a<c?-1:1;var f=0|n.length,l=0|r.length;if(f===l){if(!Array.isArray(n))return n instanceof Date&&r instanceof Date?n-r:o(n,r);for(var s=0;;){var v=s;if(v===f)return 0;var _=i(n[v],r[v]);if(0!==_)return _;s=v+1|0}}else if(f<l)for(var d=0;;){var h=d;if(h===f)return-1;var m=i(n[h],r[h]);if(0!==m)return m;d=h+1|0}else for(var g=0;;){var p=g;if(p===l)return 1;var y=i(n[p],r[p]);if(0!==y)return y;g=p+1|0}}}function o(n,r){var t={contents:void 0},o={contents:void 0},a=function(n,r){var t=n[2],e=n[1];if(!e.hasOwnProperty(r)||i(n[0][r],e[r])>0){var u=t.contents;return void 0!==u&&r>=u?void 0:void(t.contents=r)}},c=[n,r,o],f=[r,n,t];u(n,(function(n){return a(c,n)})),u(r,(function(n){return a(f,n)}));var l=t.contents,s=o.contents;return void 0!==l?void 0!==s?e.caml_string_compare(l,s):-1:void 0!==s?1:0}function a(n,r){if(n===r)return!0;var t=typeof n;if("string"===t||"number"===t||"boolean"===t||"undefined"===t||null===n)return!1;var e=typeof r;if("function"===t||"function"===e)throw{RE_EXN_ID:"Invalid_argument",_1:"equal: functional value",Error:new Error};if("number"===e||"undefined"===e||null===r)return!1;var i=0|n.TAG,o=0|r.TAG;if(248===i)return n[1]===r[1];if(251===i)throw{RE_EXN_ID:"Invalid_argument",_1:"equal: abstract value",Error:new Error};if(i!==o)return!1;var c=0|n.length;if(c!==(0|r.length))return!1;if(!Array.isArray(n)){if(n instanceof Date&&r instanceof Date)return!(n>r||n<r);var f={contents:!0};return u(n,(function(n){r.hasOwnProperty(n)||(f.contents=!1)})),f.contents&&u(r,(function(t){n.hasOwnProperty(t)&&a(r[t],n[t])||(f.contents=!1)})),f.contents}for(var l=0;;){var s=l;if(s===c)return!0;if(!a(n[s],r[s]))return!1;l=s+1|0}}r.caml_obj_dup=function(n){if(Array.isArray(n)){for(var r=n.length,t=new Array(r),e=0;e<r;++e)t[e]=n[e];return void 0!==n.TAG&&(t.TAG=n.TAG),t}return Object.assign({},n)},r.update_dummy=function(n,r){if(Array.isArray(r)){for(t=0;t<r.length;++t)n[t]=r[t];void 0!==r.TAG&&(n.TAG=r.TAG)}else for(var t in r)n[t]=r[t]},r.caml_compare=i,r.caml_equal=a,r.caml_equal_null=function(n,r){return null!==r?a(n,r):n===r},r.caml_equal_undefined=function(n,r){return void 0!==r?a(n,r):n===r},r.caml_equal_nullable=function(n,r){return null==r?n===r:a(n,r)},r.caml_notequal=function(n,r){return!a(n,r)},r.caml_greaterequal=function(n,r){return i(n,r)>=0},r.caml_greaterthan=function(n,r){return i(n,r)>0},r.caml_lessthan=function(n,r){return i(n,r)<0},r.caml_lessequal=function(n,r){return i(n,r)<=0},r.caml_min=function(n,r){return i(n,r)<=0?n:r},r.caml_max=function(n,r){return i(n,r)>=0?n:r}},175:(n,r)=>{function t(n){return void 0===n?{BS_PRIVATE_NESTED_SOME_NONE:0}:null!==n&&void 0!==n.BS_PRIVATE_NESTED_SOME_NONE?{BS_PRIVATE_NESTED_SOME_NONE:n.BS_PRIVATE_NESTED_SOME_NONE+1|0}:n}function e(n){if(null===n||void 0===n.BS_PRIVATE_NESTED_SOME_NONE)return n;var r=n.BS_PRIVATE_NESTED_SOME_NONE;return 0===r?void 0:{BS_PRIVATE_NESTED_SOME_NONE:r-1|0}}r.nullable_to_opt=function(n){return null==n?void 0:t(n)},r.undefined_to_opt=function(n){return void 0===n?void 0:t(n)},r.null_to_opt=function(n){return null===n?void 0:t(n)},r.valFromOption=e,r.some=t,r.isNested=function(n){return void 0!==n.BS_PRIVATE_NESTED_SOME_NONE},r.option_get=function(n){return void 0===n?void 0:e(n)},r.option_unwrap=function(n){return void 0!==n?n.VAL:n}},386:(n,r,t)=>{var e=t(748);function u(n,r){for(;;){var t=r,i=n,o=i.length,a=0===o?1:o,c=a-t.length|0;if(0===c)return i.apply(null,t);if(c>=0)return function(n,r){return function(t){return u(n,r.concat([t]))}}(i,t);r=e.sub(t,a,0|-c),n=i.apply(null,e.sub(t,0,a))}}function i(n,r){var t=n.length;if(1===t)return n(r);switch(t){case 1:return n(r);case 2:return function(t){return n(r,t)};case 3:return function(t,e){return n(r,t,e)};case 4:return function(t,e,u){return n(r,t,e,u)};case 5:return function(t,e,u,i){return n(r,t,e,u,i)};case 6:return function(t,e,u,i,o){return n(r,t,e,u,i,o)};case 7:return function(t,e,u,i,o,a){return n(r,t,e,u,i,o,a)};default:return u(n,[r])}}function o(n,r,t){var e=n.length;if(2===e)return n(r,t);switch(e){case 1:return u(n(r),[t]);case 2:return n(r,t);case 3:return function(e){return n(r,t,e)};case 4:return function(e,u){return n(r,t,e,u)};case 5:return function(e,u,i){return n(r,t,e,u,i)};case 6:return function(e,u,i,o){return n(r,t,e,u,i,o)};case 7:return function(e,u,i,o,a){return n(r,t,e,u,i,o,a)};default:return u(n,[r,t])}}function a(n,r,t,e){var i=n.length;if(3===i)return n(r,t,e);switch(i){case 1:return u(n(r),[t,e]);case 2:return u(n(r,t),[e]);case 3:return n(r,t,e);case 4:return function(u){return n(r,t,e,u)};case 5:return function(u,i){return n(r,t,e,u,i)};case 6:return function(u,i,o){return n(r,t,e,u,i,o)};case 7:return function(u,i,o,a){return n(r,t,e,u,i,o,a)};default:return u(n,[r,t,e])}}function c(n,r,t,e,i){var o=n.length;if(4===o)return n(r,t,e,i);switch(o){case 1:return u(n(r),[t,e,i]);case 2:return u(n(r,t),[e,i]);case 3:return u(n(r,t,e),[i]);case 4:return n(r,t,e,i);case 5:return function(u){return n(r,t,e,i,u)};case 6:return function(u,o){return n(r,t,e,i,u,o)};case 7:return function(u,o,a){return n(r,t,e,i,u,o,a)};default:return u(n,[r,t,e,i])}}function f(n,r,t,e,i,o){var a=n.length;if(5===a)return n(r,t,e,i,o);switch(a){case 1:return u(n(r),[t,e,i,o]);case 2:return u(n(r,t),[e,i,o]);case 3:return u(n(r,t,e),[i,o]);case 4:return u(n(r,t,e,i),[o]);case 5:return n(r,t,e,i,o);case 6:return function(u){return n(r,t,e,i,o,u)};case 7:return function(u,a){return n(r,t,e,i,o,u,a)};default:return u(n,[r,t,e,i,o])}}function l(n,r,t,e,i,o,a){var c=n.length;if(6===c)return n(r,t,e,i,o,a);switch(c){case 1:return u(n(r),[t,e,i,o,a]);case 2:return u(n(r,t),[e,i,o,a]);case 3:return u(n(r,t,e),[i,o,a]);case 4:return u(n(r,t,e,i),[o,a]);case 5:return u(n(r,t,e,i,o),[a]);case 6:return n(r,t,e,i,o,a);case 7:return function(u){return n(r,t,e,i,o,a,u)};default:return u(n,[r,t,e,i,o,a])}}function s(n,r,t,e,i,o,a,c){var f=n.length;if(7===f)return n(r,t,e,i,o,a,c);switch(f){case 1:return u(n(r),[t,e,i,o,a,c]);case 2:return u(n(r,t),[e,i,o,a,c]);case 3:return u(n(r,t,e),[i,o,a,c]);case 4:return u(n(r,t,e,i),[o,a,c]);case 5:return u(n(r,t,e,i,o),[a,c]);case 6:return u(n(r,t,e,i,o,a),[c]);case 7:return n(r,t,e,i,o,a,c);default:return u(n,[r,t,e,i,o,a,c])}}function v(n,r,t,e,i,o,a,c,f){var l=n.length;if(8===l)return n(r,t,e,i,o,a,c,f);switch(l){case 1:return u(n(r),[t,e,i,o,a,c,f]);case 2:return u(n(r,t),[e,i,o,a,c,f]);case 3:return u(n(r,t,e),[i,o,a,c,f]);case 4:return u(n(r,t,e,i),[o,a,c,f]);case 5:return u(n(r,t,e,i,o),[a,c,f]);case 6:return u(n(r,t,e,i,o,a),[c,f]);case 7:return u(n(r,t,e,i,o,a,c),[f]);default:return u(n,[r,t,e,i,o,a,c,f])}}r.app=u,r._1=i,r.__1=function(n){return 1===n.length?n:function(r){return i(n,r)}},r._2=o,r.__2=function(n){return 2===n.length?n:function(r,t){return o(n,r,t)}},r._3=a,r.__3=function(n){return 3===n.length?n:function(r,t,e){return a(n,r,t,e)}},r._4=c,r.__4=function(n){return 4===n.length?n:function(r,t,e,u){return c(n,r,t,e,u)}},r._5=f,r.__5=function(n){return 5===n.length?n:function(r,t,e,u,i){return f(n,r,t,e,u,i)}},r._6=l,r.__6=function(n){return 6===n.length?n:function(r,t,e,u,i,o){return l(n,r,t,e,u,i,o)}},r._7=s,r.__7=function(n){return 7===n.length?n:function(r,t,e,u,i,o,a){return s(n,r,t,e,u,i,o,a)}},r._8=v,r.__8=function(n){return 8===n.length?n:function(r,t,e,u,i,o,a,c){return v(n,r,t,e,u,i,o,a,c)}}},589:(n,r)=>{r.equal=function(n,r){return n===r},r.max=2147483647,r.min=-2147483648},763:(n,r,t)=>{var e=t(589);function u(n){return n>e.max?e.max:n<e.min?e.min:Math.ceil(n)}function i(n){return n>e.max?e.max:n<e.min?e.min:Math.floor(n)}var o=u,a=i;r.unsafe_ceil=function(n){return Math.ceil(n)},r.ceil_int=u,r.ceil=o,r.unsafe_floor=function(n){return Math.floor(n)},r.floor_int=i,r.floor=a,r.random_int=function(n,r){return i(Math.random()*(r-n|0))+n|0}}},r={};function t(e){var u=r[e];if(void 0!==u)return u.exports;var i=r[e]={exports:{}};return n[e](i,i.exports,t),i.exports}(()=>{var n=t(536),r=t(446),e=t(971),u=t(517),i=t(922),o=t(275),a=t(93),c=t(300),f=e.getExn(Array.prototype.slice.call(document.getElementsByTagName("body")),0);function l(r){return n.styled_div([["position","sticky"],["color","#bee67e"],["background-color","rgba(32, 32, 32, 0.8)"],["top","0"],["margin","0"],["display","flex"]],[n.link(i.h1([c.styles([["margin","0.25em"],["margin-left","2em"]])],[i.text("n-arms")]),void 0,1,r,!1,!1),n.link(i.p([c.styles([["margin","1em"],["margin-left","3em"],["font-size","1.2em"]])],[i.text("blog")]),void 0,0,r,!1,!1)])}function s(r){var t=(n,r)=>n%r,e=Date.now()/1e3-1643667192,u=String(t(Math.round(e),60)),o=String(t(Math.round(e/60),60)),a=String(t(Math.round(e/3600),24)),f=String(Math.round(e/86400));return i.div([c.styles([["background-color","#2f302f"],["padding","2em"],["display","flex"],["justify-content","center"],["flex-direction","column"],["min-height","15vh"]])],[n.outline([n.centered([i.text("find me on"),n.inlineLink(i.text(" GitHub "),"https://github.com/n-arms",2,r)])]),n.centered([i.text("this website is powered by the "),n.inlineLink(i.text("Stalwart Engine"),"https://github.com/n-arms/stalwart",3,r),i.text(" (written by yours truly), and has been online for "+u+" seconds, "+o+" minutes, "+a+" hours, and "+f+" days")])])}function v(r){return n.styled_div([["padding","3em"],["background","white"],["color","black"]],[i.h1([],[i.text("Previous Posts")]),i.div([],e.map(o.toArray(r.loadedPosts),(function(t){var e=t[1];return i.div([],[i.h2([],[n.link(i.text(e.title),void 0,{_0:t[0]},r,!1,!0)]),i.p([],[i.text("published "+e.date)])])})))])}function _(n,r){var t=o.get(n.loadedPosts,r);return i.div([c.styles([["background","white"],["padding","3em"]])],void 0!==t?[i.literal(t.src)]:(console.log("encountered error when trying to get post "+r+" from state:"),console.log(n),u.getExn(e.get([[]],1))))}a.mainloop(f,r.init(void 0),(function(n,r){switch(0|n.TAG){case 0:return{page:r.page,hover:n._0,loadedPosts:r.loadedPosts,manifest:r.manifest};case 1:return{page:r.page,hover:void 0,loadedPosts:r.loadedPosts,manifest:r.manifest};case 2:var t=n._0;return window.location.hash="number"==typeof t?1!==t?0!==t?window.location.hash:"blog":"":"post_"+t._0,{page:t,hover:t,loadedPosts:r.loadedPosts,manifest:r.manifest}}}),(function(r){var t=r.page;return n.styled_div([["id","content"],["background-color","#2f302f"],["margin","0"]],[l(r),n.styled_div([["min-height","70vh"],["background-color","white"]],["number"==typeof t?1!==t?0!==t?n.content("error: 404"):v(r):i.div([],[n.styled_div([["background-color","#2f302f"],["display","flex"],["flex-wrap","wrap"],["justify-content","center"]],[n.styled_div([["padding-left","2rem"]],[i.h1([c.styles([["color","#bee67e"],["font-size","5em"]])],[i.text("n-arms")]),i.p([c.styles([["color","white"],["font-size","2em"]])],[i.text("a high school student trying to find their way in the world of tech")])]),n.styled_div([["padding-left","2rem"],["display","flex"],["justify-content","center"],["align-content","center"],["flex-direction","column"],["color","white"],["font-size","1.25em"]],[])]),i.div([c.props([["id","content"]])],n.alternate(e.map([["f5 run file","A plugin for the atom text editor that allows you to run your code just by hitting f5",i.text("img here")],["Stalwart","The custom frontend web framework that powers this website. Inspired by elm's html library",i.text("img here")],["Neural Combinators","Experiments with combining neural networks and functional programming",i.img([c.props([["src","../resources/neural-net.svg"]])])],["CBreakable","A lightweight tool for building terminal user interfaces in golang",i.text("img here")]],(function(r){return[n.styled_div([["padding-left","2rem"],["flex-basis","auto"],["width","40%"]],[i.h1([],[i.text(r[0])]),i.p([],[i.text(r[1])])]),n.styled_div([["padding-left","2rem"],["flex-basis","auto"],["width","40%"]],[r[2]])]}))))]):_(r,t._0)]),n.styled_div([["min-height","30vh"]],[s(r)])])}))})()})();