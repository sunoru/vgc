import{d as _,r,aS as v,I as b,w,o as k,B as n,C as u,D as f,af as i,aT as C,ak as x,E as p,aU as S,M as D,f as B,G as T}from"./index.59160731.js";import{Q as q}from"./QItem.2e8021d8.js";import{_ as z}from"./PageBase.58059345.js";import"./use-dark.07293c8a.js";import"./QPage.8a3eb1c2.js";const E={class:"col"},N={key:0,class:"row justify-center"},V="https://github.com/nerd-of-now/NCP-VGC-Damage-Calculator",P=_({__name:"DamageCalcPage",setup(Q){const s=r(),y=v(),o=r(!1),c=r("auto"),h=r(),l=t=>{const e=s.value;if(!e||!e.contentDocument)return;const a=e.contentDocument.querySelector("#switchTheme");!a||(a.style.visibility="hidden",t===(a.value==="dark")&&a.click())},g=b().config;return w(()=>y.dark.isActive,l),k(()=>{const t=s.value;!t||(t.onload=()=>{var a;l(g.darkMode);const e=(a=t.contentDocument)==null?void 0:a.body;if(e){e.style.boxSizing="border-box",e.style.height="100%",e.parentElement&&(e.parentElement.style.boxSizing="border-box",e.parentElement.style.height="100%");const d=e.querySelector(".header");d&&(d.style.display="none");const m=e.querySelector("body>.wrapper");m&&(m.style.paddingTop="20px")}t.contentWindow&&(h.value=t.contentWindow),o.value=!0,setTimeout(()=>void(c.value=e?e.scrollHeight+10+"px":"auto"),0)})}),(t,e)=>(n(),u(z,{class:"row items-top justify-evenly",title:"Damage Calculator"},{default:f(()=>[i("div",E,[i("div",{class:"row justify-center",style:C({height:c.value})},[o.value?p("",!0):(n(),u(x,{key:0,class:"q-mt-md",color:"primary",size:"3em"})),i("iframe",{class:S(["col iframe",{hidden:!o.value}]),style:{border:"none"},ref_key:"iframeRef",ref:s,src:"/deps/damagecalc/index.html",frameborder:"0"},null,2)],4),o.value?(n(),D("div",N,[B(q,{href:V,target:"_blank"},{default:f(()=>[T(" Source by nerd-of-now. ")]),_:1})])):p("",!0)])]),_:1}))}});export{P as default};