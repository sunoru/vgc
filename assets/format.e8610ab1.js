var c=Object.defineProperty;var n=Object.getOwnPropertySymbols;var d=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;var r=(t,e,a)=>e in t?c(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a,u=(t,e)=>{for(var a in e||(e={}))d.call(e,a)&&r(t,a,e[a]);if(n)for(var a of n(e))i.call(e,a)&&r(t,a,e[a]);return t};import{a as s,h as l}from"./index.fca2a0f3.js";const k={dark:{type:Boolean,default:null}};function h(t,e){return s(()=>t.dark===null?e.dark.isActive:t.dark)}const p={name:String};function F(t={}){return(e,a,o)=>{e[a](l("input",u({class:"hidden"+(o||"")},t.value)))}}function b(t){return s(()=>t.name||t.for)}function v(t,e,a){return a<=e?e:Math.min(a,Math.max(e,t))}export{h as a,v as b,p as c,F as d,b as e,k as u};
