import{x as g,r,w as v,e as b,L as C,y as n,z as u,A as f,a8 as c,aN as x,aj as w,C as p,aO as k,H as D,B as S,D as z}from"./index.55feafb7.js";import{u as B,Q as N}from"./use-quasar.b8a0e5ab.js";import{_ as q}from"./PageBase.07259883.js";import{a as V}from"./utils.c00d461e.js";import{_ as j}from"./plugin-vue_export-helper.21dcd24c.js";import"./use-dark.d00c2c10.js";import"./QPage.f8c20756.js";const E={class:"col"},P={key:0,class:"row justify-center"},Q=z(" Source by nerd-of-now. "),T=g({__name:"DamageCalcPage",setup(L){const _="https://github.com/nerd-of-now/NCP-VGC-Damage-Calculator",s=r(),y=B(),o=r(!1),l=r("auto"),h=r(),i=a=>{const e=s.value;if(!e||!e.contentDocument)return;const t=e.contentDocument.querySelector("#switchTheme");!t||(t.style.visibility="hidden",a===(t.value==="dark")&&t.click())};return v(()=>y.dark.isActive,i),b(()=>{const a=s.value;!a||(a.onload=()=>{var t;i(C.useDarkMode);const e=(t=a.contentDocument)==null?void 0:t.body;if(e){e.style.boxSizing="border-box",e.style.height="100%",e.parentElement&&(e.parentElement.style.boxSizing="border-box",e.parentElement.style.height="100%");const m=e.querySelector(".header");m&&(m.style.display="none");const d=e.querySelector("body>.wrapper");d&&(d.style.paddingTop="20px")}a.contentWindow&&(h.value=a.contentWindow),o.value=!0,V(()=>void(l.value=e?e.scrollHeight+10+"px":"auto"))})}),(a,e)=>(n(),u(q,{class:"row items-top justify-evenly",title:"Damage Calculator"},{default:f(()=>[c("div",E,[c("div",{class:"row justify-center",style:x({height:l.value})},[o.value?p("",!0):(n(),u(w,{key:0,class:"q-mt-md",color:"primary",size:"3em"})),c("iframe",{class:k(["col iframe",{hidden:!o.value}]),ref_key:"iframeRef",ref:s,src:"/deps/damagecalc/index.html",frameborder:"0"},null,2)],4),o.value?(n(),D("div",P,[S(N,{href:_,target:"_blank"},{default:f(()=>[Q]),_:1})])):p("",!0)])]),_:1}))}});var $=j(T,[["__scopeId","data-v-02cbf37e"]]);export{$ as default};
