import{Q as i}from"./QToggle.e2fd78bb.js";import{b as n,u as d,c as u,Q as p,a as c}from"./storage.bf68715b.js";import{_ as f,Q as g,r as y,o as S,R as v,S as U,T as r,a7 as m,U as o,a0 as b}from"./index.fca2a0f3.js";import{Q}from"./QPage.2ccaab82.js";import"./format.e8610ab1.js";const V=g({name:"SettingsPage",setup(){const e=y(""),a=async()=>{const s=await n();s.myUsernames=e.value.split(",").map(t=>t.trim()).filter(t=>t),await u(s)};return S(async()=>{const s=await n();e.value=s.myUsernames.join(",")}),{textMyUsernames:e,save:a,useLocalStorage:d}}}),w={class:"q-pa-md col",style:{"max-width":"720px"}},x=m("div",{class:"text-h3"},"Settings",-1);function _(e,a,s,t,M,B){return v(),U(Q,{class:"row items-center justify-evenly"},{default:r(()=>[m("div",w,[x,o(c,{class:"q-mt-md",onSubmit:e.save},{default:r(()=>[o(i,{disable:"",modelValue:e.useLocalStorage,"onUpdate:modelValue":a[0]||(a[0]=l=>e.useLocalStorage=l),label:"Use Local Storage"},null,8,["modelValue"]),o(p,{label:"My Usernames (Separated by commas)",modelValue:e.textMyUsernames,"onUpdate:modelValue":a[1]||(a[1]=l=>e.textMyUsernames=l),filled:"",type:"textarea"},null,8,["modelValue"]),o(b,{class:"q-mt-md",type:"submit",label:"Save"})]),_:1},8,["onSubmit"])])]),_:1})}var h=f(V,[["render",_]]);export{h as default};
