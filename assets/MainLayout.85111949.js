import{c as W,a as i,h as p,b as Y,e as D,r as S,w as h,o as de,d as Ee,i as fe,l as Z,g as N,f as Te,n as ye,j as Ne,k as be,p as Le,m as Ue,q as je,s as Ke,t as Ge,u as K,v as Je,x as Xe,y as xe,z as E,A as J,B as x,C as $,Q as Ye,D as Ze,E as X,F as we,L as pe,G as ke,H as Se,I as et,J as tt,K as at,M as lt}from"./index.ac067182.js";import{Q as ot}from"./QToggle.e65941bd.js";import{Q as se,u as nt,a as it,b as rt,c as ut,d as st,e as ct,T as re,g as dt,f as ft,h as vt,i as ue,j as qe,k as ce,l as mt}from"./QItemSection.23baa6fe.js";import{u as ht,a as gt}from"./use-dark.15a5c7b5.js";import{b as G}from"./format.2a3572e1.js";import{Q as yt}from"./QItem.e733bbd3.js";import{_ as ze}from"./plugin-vue_export-helper.21dcd24c.js";import{u as bt}from"./use-quasar.4b8a8b76.js";import"./use-form.6a9e846f.js";var wt=W({name:"QToolbarTitle",props:{shrink:Boolean},setup(e,{slots:m}){const o=i(()=>"q-toolbar__title ellipsis"+(e.shrink===!0?" col-shrink":""));return()=>p("div",{class:o.value},Y(m.default))}}),pt=W({name:"QToolbar",props:{inset:Boolean},setup(e,{slots:m}){const o=i(()=>"q-toolbar row no-wrap items-center"+(e.inset===!0?" q-toolbar--inset":""));return()=>p("div",{class:o.value,role:"toolbar"},Y(m.default))}}),kt=W({name:"QHeader",props:{modelValue:{type:Boolean,default:!0},reveal:Boolean,revealOffset:{type:Number,default:250},bordered:Boolean,elevated:Boolean,heightHint:{type:[String,Number],default:50}},emits:["reveal","focusin"],setup(e,{slots:m,emit:o}){const{proxy:{$q:r}}=N(),l=fe(Z,D);if(l===D)return console.error("QHeader needs to be child of QLayout"),D;const c=S(parseInt(e.heightHint,10)),g=S(!0),q=i(()=>e.reveal===!0||l.view.value.indexOf("H")>-1||r.platform.is.ios&&l.isContainer.value===!0),y=i(()=>{if(e.modelValue!==!0)return 0;if(q.value===!0)return g.value===!0?c.value:0;const n=c.value-l.scroll.value.position;return n>0?n:0}),b=i(()=>e.modelValue!==!0||q.value===!0&&g.value!==!0),a=i(()=>e.modelValue===!0&&b.value===!0&&e.reveal===!0),z=i(()=>"q-header q-layout__section--marginal "+(q.value===!0?"fixed":"absolute")+"-top"+(e.bordered===!0?" q-header--bordered":"")+(b.value===!0?" q-header--hidden":"")+(e.modelValue!==!0?" q-layout--prevent-focus":"")),B=i(()=>{const n=l.rows.value.top,C={};return n[0]==="l"&&l.left.space===!0&&(C[r.lang.rtl===!0?"right":"left"]=`${l.left.size}px`),n[2]==="r"&&l.right.space===!0&&(C[r.lang.rtl===!0?"left":"right"]=`${l.right.size}px`),C});function d(n,C){l.update("header",n,C)}function f(n,C){n.value!==C&&(n.value=C)}function Q({height:n}){f(c,n),d("size",n)}function k(n){a.value===!0&&f(g,!0),o("focusin",n)}h(()=>e.modelValue,n=>{d("space",n),f(g,!0),l.animate()}),h(y,n=>{d("offset",n)}),h(()=>e.reveal,n=>{n===!1&&f(g,e.modelValue)}),h(g,n=>{l.animate(),o("reveal",n)}),h(l.scroll,n=>{e.reveal===!0&&f(g,n.direction==="up"||n.position<=e.revealOffset||n.position-n.inflectionPoint<100)});const v={};return l.instances.header=v,e.modelValue===!0&&d("size",c.value),d("space",e.modelValue),d("offset",y.value),de(()=>{l.instances.header===v&&(l.instances.header=void 0,d("size",0),d("offset",0),d("space",!1))}),()=>{const n=Ee(m.default,[]);return e.elevated===!0&&n.push(p("div",{class:"q-layout__shadow absolute-full overflow-hidden no-pointer-events"})),n.push(p(se,{debounce:0,onResize:Q})),p("header",{class:z.value,style:B.value,onFocusin:k},n)}}});const $e=150;var St=W({name:"QDrawer",inheritAttrs:!1,props:{...nt,...ht,side:{type:String,default:"left",validator:e=>["left","right"].includes(e)},width:{type:Number,default:300},mini:Boolean,miniToOverlay:Boolean,miniWidth:{type:Number,default:57},breakpoint:{type:Number,default:1023},showIfAbove:Boolean,behavior:{type:String,validator:e=>["default","desktop","mobile"].includes(e),default:"default"},bordered:Boolean,elevated:Boolean,overlay:Boolean,persistent:Boolean,noSwipeOpen:Boolean,noSwipeClose:Boolean,noSwipeBackdrop:Boolean},emits:[...it,"onLayout","miniState"],setup(e,{slots:m,emit:o,attrs:r}){const l=N(),{proxy:{$q:c}}=l,g=gt(e,c),{preventBodyScroll:q}=ct(),{registerTimeout:y,removeTimeout:b}=rt(),a=fe(Z,D);if(a===D)return console.error("QDrawer needs to be child of QLayout"),D;let z,B,d;const f=S(e.behavior==="mobile"||e.behavior!=="desktop"&&a.totalWidth.value<=e.breakpoint),Q=i(()=>e.mini===!0&&f.value!==!0),k=i(()=>Q.value===!0?e.miniWidth:e.width),v=S(e.showIfAbove===!0&&f.value===!1?!0:e.modelValue===!0),n=i(()=>e.persistent!==!0&&(f.value===!0||Be.value===!0));function C(t,u){if(V(),t!==!1&&a.animate(),_(0),f.value===!0){const T=a.instances[U.value];T!==void 0&&T.belowBreakpoint===!0&&T.hide(!1),M(1),a.isContainer.value!==!0&&q(!0)}else M(0),t!==!1&&oe(!1);y(()=>{t!==!1&&oe(!0),u!==!0&&o("show",t)},$e)}function s(t,u){I(),t!==!1&&a.animate(),M(0),_(R.value*k.value),ne(),u!==!0?y(()=>{o("hide",t)},$e):b()}const{show:w,hide:L}=ut({showing:v,hideOnRouteChange:n,handleShow:C,handleHide:s}),{addToHistory:V,removeFromHistory:I}=st(v,L,n),H={belowBreakpoint:f,hide:L},P=i(()=>e.side==="right"),R=i(()=>(c.lang.rtl===!0?-1:1)*(P.value===!0?1:-1)),ve=S(0),F=S(!1),ee=S(!1),me=S(k.value*R.value),U=i(()=>P.value===!0?"left":"right"),te=i(()=>v.value===!0&&f.value===!1&&e.overlay===!1?e.miniToOverlay===!0?e.miniWidth:k.value:0),ae=i(()=>e.overlay===!0||e.miniToOverlay===!0||a.view.value.indexOf(P.value?"R":"L")>-1||c.platform.is.ios===!0&&a.isContainer.value===!0),A=i(()=>e.overlay===!1&&v.value===!0&&f.value===!1),Be=i(()=>e.overlay===!0&&v.value===!0&&f.value===!1),_e=i(()=>"fullscreen q-drawer__backdrop"+(v.value===!1&&F.value===!1?" hidden":"")),Qe=i(()=>({backgroundColor:`rgba(0,0,0,${ve.value*.4})`})),he=i(()=>P.value===!0?a.rows.value.top[2]==="r":a.rows.value.top[0]==="l"),Pe=i(()=>P.value===!0?a.rows.value.bottom[2]==="r":a.rows.value.bottom[0]==="l"),De=i(()=>{const t={};return a.header.space===!0&&he.value===!1&&(ae.value===!0?t.top=`${a.header.offset}px`:a.header.space===!0&&(t.top=`${a.header.size}px`)),a.footer.space===!0&&Pe.value===!1&&(ae.value===!0?t.bottom=`${a.footer.offset}px`:a.footer.space===!0&&(t.bottom=`${a.footer.size}px`)),t}),Me=i(()=>{const t={width:`${k.value}px`,transform:`translateX(${me.value}px)`};return f.value===!0?t:Object.assign(t,De.value)}),Oe=i(()=>"q-drawer__content fit "+(a.isContainer.value!==!0?"scroll":"overflow-auto")),Ve=i(()=>`q-drawer q-drawer--${e.side}`+(ee.value===!0?" q-drawer--mini-animate":"")+(e.bordered===!0?" q-drawer--bordered":"")+(g.value===!0?" q-drawer--dark q-dark":"")+(F.value===!0?" no-transition":v.value===!0?"":" q-layout--prevent-focus")+(f.value===!0?" fixed q-drawer--on-top q-drawer--mobile q-drawer--top-padding":` q-drawer--${Q.value===!0?"mini":"standard"}`+(ae.value===!0||A.value!==!0?" fixed":"")+(e.overlay===!0||e.miniToOverlay===!0?" q-drawer--on-top":"")+(he.value===!0?" q-drawer--top-padding":""))),He=i(()=>{const t=c.lang.rtl===!0?e.side:U.value;return[[re,Ie,void 0,{[t]:!0,mouse:!0}]]}),We=i(()=>{const t=c.lang.rtl===!0?U.value:e.side;return[[re,ge,void 0,{[t]:!0,mouse:!0}]]}),Re=i(()=>{const t=c.lang.rtl===!0?U.value:e.side;return[[re,ge,void 0,{[t]:!0,mouse:!0,mouseAllDir:!0}]]});function le(){Ae(f,e.behavior==="mobile"||e.behavior!=="desktop"&&a.totalWidth.value<=e.breakpoint)}h(f,t=>{t===!0?(z=v.value,v.value===!0&&L(!1)):e.overlay===!1&&e.behavior!=="mobile"&&z!==!1&&(v.value===!0?(_(0),M(0),ne()):w(!1))}),h(()=>e.side,(t,u)=>{a.instances[u]===H&&(a.instances[u]=void 0,a[u].space=!1,a[u].offset=0),a.instances[t]=H,a[t].size=k.value,a[t].space=A.value,a[t].offset=te.value}),h(a.totalWidth,()=>{(a.isContainer.value===!0||document.qScrollPrevented!==!0)&&le()}),h(()=>e.behavior+e.breakpoint,le),h(a.isContainer,t=>{v.value===!0&&q(t!==!0),t===!0&&le()}),h(a.scrollbarWidth,()=>{_(v.value===!0?0:void 0)}),h(te,t=>{O("offset",t)}),h(A,t=>{o("onLayout",t),O("space",t)}),h(P,()=>{_()}),h(k,t=>{_(),ie(e.miniToOverlay,t)}),h(()=>e.miniToOverlay,t=>{ie(t,k.value)}),h(()=>c.lang.rtl,()=>{_()}),h(()=>e.mini,()=>{e.modelValue===!0&&(Fe(),a.animate())}),h(Q,t=>{o("miniState",t)});function _(t){t===void 0?ye(()=>{t=v.value===!0?0:k.value,_(R.value*t)}):(a.isContainer.value===!0&&P.value===!0&&(f.value===!0||Math.abs(t)===k.value)&&(t+=R.value*a.scrollbarWidth.value),me.value=t)}function M(t){ve.value=t}function oe(t){const u=t===!0?"remove":a.isContainer.value!==!0?"add":"";u!==""&&document.body.classList[u]("q-body--drawer-toggle")}function Fe(){clearTimeout(B),l.proxy&&l.proxy.$el&&l.proxy.$el.classList.add("q-drawer--mini-animate"),ee.value=!0,B=setTimeout(()=>{ee.value=!1,l&&l.proxy&&l.proxy.$el&&l.proxy.$el.classList.remove("q-drawer--mini-animate")},150)}function Ie(t){if(v.value!==!1)return;const u=k.value,T=G(t.distance.x,0,u);if(t.isFinal===!0){T>=Math.min(75,u)===!0?w():(a.animate(),M(0),_(R.value*u)),F.value=!1;return}_((c.lang.rtl===!0?P.value!==!0:P.value)?Math.max(u-T,0):Math.min(0,T-u)),M(G(T/u,0,1)),t.isFirst===!0&&(F.value=!0)}function ge(t){if(v.value!==!0)return;const u=k.value,T=t.direction===e.side,j=(c.lang.rtl===!0?T!==!0:T)?G(t.distance.x,0,u):0;if(t.isFinal===!0){Math.abs(j)<Math.min(75,u)===!0?(a.animate(),M(1),_(0)):L(),F.value=!1;return}_(R.value*j),M(G(1-j/u,0,1)),t.isFirst===!0&&(F.value=!0)}function ne(){q(!1),oe(!0)}function O(t,u){a.update(e.side,t,u)}function Ae(t,u){t.value!==u&&(t.value=u)}function ie(t,u){O("size",t===!0?e.miniWidth:u)}return a.instances[e.side]=H,ie(e.miniToOverlay,k.value),O("space",A.value),O("offset",te.value),e.showIfAbove===!0&&e.modelValue!==!0&&v.value===!0&&e["onUpdate:modelValue"]!==void 0&&o("update:modelValue",!0),Te(()=>{o("onLayout",A.value),o("miniState",Q.value),z=e.showIfAbove===!0;const t=()=>{(v.value===!0?C:s)(!1,!0)};if(a.totalWidth.value!==0){ye(t);return}d=h(a.totalWidth,()=>{d(),d=void 0,v.value===!1&&e.showIfAbove===!0&&f.value===!1?w(!1):t()})}),de(()=>{d!==void 0&&d(),clearTimeout(B),v.value===!0&&ne(),a.instances[e.side]===H&&(a.instances[e.side]=void 0,O("size",0),O("offset",0),O("space",!1))}),()=>{const t=[];f.value===!0&&(e.noSwipeOpen===!1&&t.push(Ne(p("div",{key:"open",class:`q-drawer__opener fixed-${e.side}`,"aria-hidden":"true"}),He.value)),t.push(be("div",{ref:"backdrop",class:_e.value,style:Qe.value,"aria-hidden":"true",onClick:L},void 0,"backdrop",e.noSwipeBackdrop!==!0&&v.value===!0,()=>Re.value)));const u=Q.value===!0&&m.mini!==void 0,T=[p("div",{...r,key:""+u,class:[Oe.value,r.class]},u===!0?m.mini():Y(m.default))];return e.elevated===!0&&v.value===!0&&T.push(p("div",{class:"q-layout__shadow absolute-full overflow-hidden no-pointer-events"})),t.push(be("aside",{ref:"content",class:Ve.value,style:Me.value},T,"contentclose",e.noSwipeClose!==!0&&f.value===!0,()=>We.value)),p("div",{class:"q-drawer-container"},t)}}}),qt=W({name:"QPageContainer",setup(e,{slots:m}){const{proxy:{$q:o}}=N(),r=fe(Z,D);if(r===D)return console.error("QPageContainer needs to be child of QLayout"),D;Le(Ue,!0);const l=i(()=>{const c={};return r.header.space===!0&&(c.paddingTop=`${r.header.size}px`),r.right.space===!0&&(c[`padding${o.lang.rtl===!0?"Left":"Right"}`]=`${r.right.size}px`),r.footer.space===!0&&(c.paddingBottom=`${r.footer.size}px`),r.left.space===!0&&(c[`padding${o.lang.rtl===!0?"Right":"Left"}`]=`${r.left.size}px`),c});return()=>p("div",{class:"q-page-container",style:l.value},Y(m.default))}});const{passive:Ce}=Ke,$t=["both","horizontal","vertical"];var Ct=W({name:"QScrollObserver",props:{axis:{type:String,validator:e=>$t.includes(e),default:"vertical"},debounce:[String,Number],scrollTarget:{default:void 0}},emits:["scroll"],setup(e,{emit:m}){const o={position:{top:0,left:0},direction:"down",directionChanged:!1,delta:{top:0,left:0},inflectionPoint:{top:0,left:0}};let r=null,l,c;h(()=>e.scrollTarget,()=>{y(),q()});function g(){r!==null&&r();const z=Math.max(0,ft(l)),B=vt(l),d={top:z-o.position.top,left:B-o.position.left};if(e.axis==="vertical"&&d.top===0||e.axis==="horizontal"&&d.left===0)return;const f=Math.abs(d.top)>=Math.abs(d.left)?d.top<0?"up":"down":d.left<0?"left":"right";o.position={top:z,left:B},o.directionChanged=o.direction!==f,o.delta=d,o.directionChanged===!0&&(o.direction=f,o.inflectionPoint=o.position),m("scroll",{...o})}function q(){l=dt(c,e.scrollTarget),l.addEventListener("scroll",b,Ce),b(!0)}function y(){l!==void 0&&(l.removeEventListener("scroll",b,Ce),l=void 0)}function b(z){if(z===!0||e.debounce===0||e.debounce==="0")g();else if(r===null){const[B,d]=e.debounce?[setTimeout(g,e.debounce),clearTimeout]:[requestAnimationFrame(g),cancelAnimationFrame];r=()=>{d(B),r=null}}}const{proxy:a}=N();return h(()=>a.$q.lang.rtl,g),Te(()=>{c=a.$el.parentNode,q()}),de(()=>{r!==null&&r(),y()}),Object.assign(a,{trigger:b,getPosition:()=>o}),je}}),Tt=W({name:"QLayout",props:{container:Boolean,view:{type:String,default:"hhh lpr fff",validator:e=>/^(h|l)h(h|r) lpr (f|l)f(f|r)$/.test(e.toLowerCase())},onScroll:Function,onScrollHeight:Function,onResize:Function},setup(e,{slots:m,emit:o}){const{proxy:{$q:r}}=N(),l=S(null),c=S(r.screen.height),g=S(e.container===!0?0:r.screen.width),q=S({position:0,direction:"down",inflectionPoint:0}),y=S(0),b=S(Ge.value===!0?0:ue()),a=i(()=>"q-layout q-layout--"+(e.container===!0?"containerized":"standard")),z=i(()=>e.container===!1?{minHeight:r.screen.height+"px"}:null),B=i(()=>b.value!==0?{[r.lang.rtl===!0?"left":"right"]:`${b.value}px`}:null),d=i(()=>b.value!==0?{[r.lang.rtl===!0?"right":"left"]:0,[r.lang.rtl===!0?"left":"right"]:`-${b.value}px`,width:`calc(100% + ${b.value}px)`}:null);function f(s){if(e.container===!0||document.qScrollPrevented!==!0){const w={position:s.position.top,direction:s.direction,directionChanged:s.directionChanged,inflectionPoint:s.inflectionPoint.top,delta:s.delta.top};q.value=w,e.onScroll!==void 0&&o("scroll",w)}}function Q(s){const{height:w,width:L}=s;let V=!1;c.value!==w&&(V=!0,c.value=w,e.onScrollHeight!==void 0&&o("scrollHeight",w),v()),g.value!==L&&(V=!0,g.value=L),V===!0&&e.onResize!==void 0&&o("resize",s)}function k({height:s}){y.value!==s&&(y.value=s,v())}function v(){if(e.container===!0){const s=c.value>y.value?ue():0;b.value!==s&&(b.value=s)}}let n;const C={instances:{},view:i(()=>e.view),isContainer:i(()=>e.container),rootRef:l,height:c,containerHeight:y,scrollbarWidth:b,totalWidth:i(()=>g.value+b.value),rows:i(()=>{const s=e.view.toLowerCase().split(" ");return{top:s[0].split(""),middle:s[1].split(""),bottom:s[2].split("")}}),header:K({size:0,offset:0,space:!1}),right:K({size:300,offset:0,space:!1}),footer:K({size:0,offset:0,space:!1}),left:K({size:300,offset:0,space:!1}),scroll:q,animate(){n!==void 0?clearTimeout(n):document.body.classList.add("q-body--layout-animate"),n=setTimeout(()=>{document.body.classList.remove("q-body--layout-animate"),n=void 0},155)},update(s,w,L){C[s][w]=L}};if(Le(Z,C),ue()>0){let L=function(){s=null,w.classList.remove("hide-scrollbar")},V=function(){if(s===null){if(w.scrollHeight>r.screen.height)return;w.classList.add("hide-scrollbar")}else clearTimeout(s);s=setTimeout(L,300)},I=function(H){s!==null&&H==="remove"&&(clearTimeout(s),L()),window[`${H}EventListener`]("resize",V)},s=null;const w=document.body;h(()=>e.container!==!0?"add":"remove",I),e.container!==!0&&I("add"),Je(()=>{I("remove")})}return()=>{const s=Xe(m.default,[p(Ct,{onScroll:f}),p(se,{onResize:Q})]),w=p("div",{class:a.value,style:z.value,ref:e.container===!0?void 0:l,tabindex:-1},s);return e.container===!0?p("div",{class:"q-layout-container overflow-hidden",ref:l},[p(se,{onResize:k}),p("div",{class:"absolute-full",style:B.value},[p("div",{class:"scroll",style:d.value},[w])])]):w}}});const Lt=xe({name:"EssentialLink",props:{title:{type:String,required:!0},caption:{type:String,default:""},link:{type:String,default:void 0},href:{type:String,default:void 0},icon:{type:String,default:""},target:{type:String,default:""}}});function xt(e,m,o,r,l,c){return E(),J(yt,{clickable:"",tag:"a",to:e.link,href:e.href,target:e.target,exact:""},{default:x(()=>[e.icon?(E(),J(qe,{key:0,avatar:""},{default:x(()=>[$(Ye,{name:e.icon},null,8,["name"])]),_:1})):Ze("",!0),$(qe,null,{default:x(()=>[$(ce,null,{default:x(()=>[X(we(e.title),1)]),_:1}),$(ce,{caption:""},{default:x(()=>[X(we(e.caption),1)]),_:1})]),_:1})]),_:1},8,["to","href","target"])}var zt=ze(Lt,[["render",xt]]);const Bt=[{title:"Home",icon:"home",link:"/"},{title:"Replay Importer",caption:"Parse & import Pokemon Showdown replays",icon:"video_library",link:"/replays"},{title:"Battles",caption:"Manage & analyze saved battles",icon:"view_list",link:"/battles"},{title:"Damage Calculator",icon:"calculate",link:"/damagecalc"},{title:"Settings",icon:"settings",link:"/settings"},{title:"Source Code",caption:"https://github.com/sunoru/vgc",icon:"code",href:"https://github.com/sunoru/vgc",target:"_blank"}],_t=xe({name:"MainLayout",components:{EssentialLink:zt},setup(){const e=S(!1),m=bt(),o=S(pe.useDarkMode);return m.dark.set(o.value),h(()=>o.value,r=>{pe.useDarkMode=r,m.dark.set(r)}),{essentialLinks:Bt,leftDrawerOpen:e,toggleLeftDrawer(){e.value=!e.value},inDarkMode:o}}});function Qt(e,m,o,r,l,c){const g=ke("essential-link"),q=ke("router-view");return E(),J(Tt,{view:"hHh Lpr lff"},{default:x(()=>[$(kt,{elevated:""},{default:x(()=>[$(pt,null,{default:x(()=>[$(Se,{flat:"",dense:"",round:"",icon:"menu","aria-label":"Menu",onClick:e.toggleLeftDrawer},null,8,["onClick"]),$(wt,null,{default:x(()=>[X(" VGC Tools ")]),_:1}),$(ot,{label:"Dark Mode",modelValue:e.inDarkMode,"onUpdate:modelValue":m[0]||(m[0]=y=>e.inDarkMode=y),color:"black"},null,8,["modelValue"]),$(Se,{flat:"",stretch:"",disable:"",icon:"login",label:"Sign in"})]),_:1})]),_:1}),$(St,{modelValue:e.leftDrawerOpen,"onUpdate:modelValue":m[1]||(m[1]=y=>e.leftDrawerOpen=y),"show-if-above":"",elevated:""},{default:x(()=>[$(mt,null,{default:x(()=>[$(ce,{header:""},{default:x(()=>[X(" Pages ")]),_:1}),(E(!0),et(at,null,tt(e.essentialLinks,y=>(E(),J(g,lt({key:y.title},y),null,16))),128))]),_:1})]),_:1},8,["modelValue"]),$(qt,null,{default:x(()=>[$(q)]),_:1})]),_:1})}var At=ze(_t,[["render",Qt]]);export{At as default};
