var c=Object.defineProperty;var a=Object.getOwnPropertySymbols;var f=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;var o=(n,t,e)=>t in n?c(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e,s=(n,t)=>{for(var e in t||(t={}))f.call(t,e)&&o(n,e,t[e]);if(a)for(var e of a(t))i.call(t,e)&&o(n,e,t[e]);return n};import{a as l,h as d}from"./index.e5b2123a.js";const m={name:String};function F(n={}){return(t,e,u)=>{t[e](d("input",s({class:"hidden"+(u||"")},n.value)))}}function I(n){return l(()=>n.name||n.for)}function b(n,t,e){return e<=t?t:Math.min(e,Math.max(t,n))}function v(n,t,e){if(e<=t)return t;const u=e-t+1;let r=t+(n-t)%u;return r<t&&(r=u+r),r===0?0:r}export{F as a,b,I as c,v as n,m as u};