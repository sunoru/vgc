import{ab as p,ac as u}from"./index.a4c264c5.js";const h=[null,document,document.body,document.scrollingElement,document.documentElement];function b(o,t){let n=p(t);if(n===void 0){if(o==null)return window;n=o.closest(".scroll,.scroll-y,.overflow-auto")}return h.includes(n)?window:n}function g(o){return o===window?window.pageYOffset||window.scrollY||document.body.scrollTop||0:o.scrollTop}function v(o){return o===window?window.pageXOffset||window.scrollX||document.body.scrollLeft||0:o.scrollLeft}function w(o,t,n=0){const i=arguments[3]===void 0?performance.now():arguments[3],e=g(o);if(n<=0){e!==t&&a(o,t);return}requestAnimationFrame(s=>{const r=s-i,c=e+(t-e)/Math.max(r,n)*r;a(o,c),c!==t&&w(o,t,n-r,s)})}function m(o,t,n=0){const i=arguments[3]===void 0?performance.now():arguments[3],e=v(o);if(n<=0){e!==t&&d(o,t);return}requestAnimationFrame(s=>{const r=s-i,c=e+(t-e)/Math.max(r,n)*r;d(o,c),c!==t&&m(o,t,n-r,s)})}function a(o,t){if(o===window){window.scrollTo(window.pageXOffset||window.scrollX||document.body.scrollLeft||0,t);return}o.scrollTop=t}function d(o,t){if(o===window){window.scrollTo(t,window.pageYOffset||window.scrollY||document.body.scrollTop||0);return}o.scrollLeft=t}function y(o,t,n){if(n){w(o,t,n);return}a(o,t)}function x(o,t,n){if(n){m(o,t,n);return}d(o,t)}let l;function T(){if(l!==void 0)return l;const o=document.createElement("p"),t=document.createElement("div");u(o,{width:"100%",height:"200px"}),u(t,{position:"absolute",top:"0px",left:"0px",visibility:"hidden",width:"200px",height:"150px",overflow:"hidden"}),t.appendChild(o),document.body.appendChild(t);const n=o.offsetWidth;t.style.overflow="scroll";let i=o.offsetWidth;return n===i&&(i=t.clientWidth),t.remove(),l=n-i,l}function E(o,t=!0){return!o||o.nodeType!==Node.ELEMENT_NODE?!1:t?o.scrollHeight>o.clientHeight&&(o.classList.contains("scroll")||o.classList.contains("overflow-auto")||["auto","scroll"].includes(window.getComputedStyle(o)["overflow-y"])):o.scrollWidth>o.clientWidth&&(o.classList.contains("scroll")||o.classList.contains("overflow-auto")||["auto","scroll"].includes(window.getComputedStyle(o)["overflow-x"]))}const f=["B","KB","MB","GB","TB","PB"];function L(o){let t=0;for(;parseInt(o,10)>=1024&&t<f.length-1;)o/=1024,++t;return`${o.toFixed(1)}${f[t]}`}function z(o,t,n){return n<=t?t:Math.min(n,Math.max(t,o))}function P(o,t,n){if(n<=t)return t;const i=n-t+1;let e=t+(o-t)%i;return e<t&&(e=i+e),e===0?0:e}export{v as a,z as b,g as c,b as d,x as e,L as f,T as g,E as h,P as n,y as s};