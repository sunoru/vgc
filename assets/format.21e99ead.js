import{a,h as o}from"./index.89ae4b1a.js";const c={name:String};function f(e={}){return(t,n,u)=>{t[n](o("input",{class:"hidden"+(u||""),...e.value}))}}function i(e){return a(()=>e.name||e.for)}function l(e,t,n){return n<=t?t:Math.min(n,Math.max(t,e))}function d(e,t,n){if(n<=t)return t;const u=n-t+1;let r=t+(e-t)%u;return r<t&&(r=u+r),r===0?0:r}export{f as a,l as b,i as c,d as n,c as u};
