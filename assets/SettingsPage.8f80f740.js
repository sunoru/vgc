import{Q as m}from"./QToggle.6ebdbaa9.js";import{Q as f}from"./QInput.587a26c1.js";import{d as c,I as v,r as u,o as g,B as S,C as V,D as d,af as i,f as o,L as r,K as _}from"./index.59160731.js";import{Q as b}from"./QForm.3f5c71b8.js";import{_ as y}from"./PageBase.58059345.js";import"./use-checkbox.a4be7486.js";import"./use-dark.07293c8a.js";import"./QPage.8a3eb1c2.js";const x={class:"q-pa-md col",style:{"max-width":"720px"}},U=i("div",{class:"text-h3"},"Settings",-1),j=c({__name:"SettingsPage",setup(w){const e=v().config,s=u(""),l=u(!0),p=()=>{l.value||(l.value=!0,e.showdownUsernames=s.value.split(`
`).map(n=>n.trim()).filter(n=>n),setTimeout(()=>{l.value=!1},500))};return g(()=>{s.value=e.showdownUsernames.join(`
`),l.value=!1}),(n,a)=>(S(),V(y,{class:"row items-center justify-evenly",title:"Settings"},{default:d(()=>[i("div",x,[U,o(b,{class:"q-mt-md",onSubmit:p},{default:d(()=>[i("div",null,[o(m,{disable:"",modelValue:r(e).useLocalStorage,"onUpdate:modelValue":a[0]||(a[0]=t=>r(e).useLocalStorage=t),label:"Use Local Storage"},null,8,["modelValue"])]),i("div",null,[o(m,{modelValue:r(e).darkMode,"onUpdate:modelValue":a[1]||(a[1]=t=>r(e).darkMode=t),label:"Dark Mode"},null,8,["modelValue"])]),o(f,{label:"My Usernames (Separated by linebreaks)",modelValue:s.value,"onUpdate:modelValue":a[2]||(a[2]=t=>s.value=t),filled:"",type:"textarea"},null,8,["modelValue"]),o(_,{class:"q-mt-md",color:"primary",type:"submit",label:"Save",loading:l.value},null,8,["loading"])]),_:1})])]),_:1}))}});export{j as default};