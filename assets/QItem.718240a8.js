var S=Object.defineProperty,w=Object.defineProperties;var D=Object.getOwnPropertyDescriptors;var f=Object.getOwnPropertySymbols;var I=Object.prototype.hasOwnProperty,Q=Object.prototype.propertyIsEnumerable;var m=(e,a,u)=>a in e?S(e,a,{enumerable:!0,configurable:!0,writable:!0,value:u}):e[a]=u,r=(e,a)=>{for(var u in a||(a={}))I.call(a,u)&&m(e,u,a[u]);if(f)for(var u of f(a))Q.call(a,u)&&m(e,u,a[u]);return e},k=(e,a)=>w(e,D(a));import{u as T,a as $}from"./use-dark.66607f07.js";import{c as A,a6 as F,a7 as N,r as b,a as s,h as q,g as j,a8 as M,S as O,d as U}from"./index.e5b2123a.js";var J=A({name:"QItem",props:k(r(r({},T),F),{tag:{type:String,default:"div"},active:{type:Boolean,default:null},clickable:Boolean,dense:Boolean,insetLevel:Number,tabindex:[String,Number],focused:Boolean,manualFocus:Boolean}),emits:["click","keyup"],setup(e,{slots:a,emit:u}){const{proxy:{$q:c}}=j(),g=$(e,c),{hasRouterLink:y,hasLink:o,linkProps:h,linkClass:C,linkTag:L,navigateToRouterLink:x}=N(),n=b(null),i=b(null),v=s(()=>e.clickable===!0||o.value===!0||e.tag==="label"),l=s(()=>e.disable!==!0&&v.value===!0),E=s(()=>"q-item q-item-type row no-wrap"+(e.dense===!0?" q-item--dense":"")+(g.value===!0?" q-item--dark":"")+(o.value===!0&&e.active===null?C.value:e.active===!0?`${e.activeClass!==void 0?` ${e.activeClass}`:""} q-item--active`:"")+(e.disable===!0?" disabled":"")+(l.value===!0?" q-item--clickable q-link cursor-pointer "+(e.manualFocus===!0?"q-manual-focusable":"q-focusable q-hoverable")+(e.focused===!0?" q-manual-focusable--focused":""):"")),R=s(()=>{if(e.insetLevel===void 0)return null;const t=c.lang.rtl===!0?"Right":"Left";return{["padding"+t]:16+e.insetLevel*56+"px"}});function B(t){l.value===!0&&(i.value!==null&&(t.qKeyEvent!==!0&&document.activeElement===n.value?i.value.focus():document.activeElement===i.value&&n.value.focus()),y.value===!0&&x(t),u("click",t))}function K(t){if(l.value===!0&&M(t,13)===!0){O(t),t.qKeyEvent=!0;const d=new MouseEvent("click",t);d.qKeyEvent=!0,n.value.dispatchEvent(d)}u("keyup",t)}function P(){const t=U(a.default,[]);return l.value===!0&&t.unshift(q("div",{class:"q-focus-helper",tabindex:-1,ref:i})),t}return()=>{const t={ref:n,class:E.value,style:R.value,onClick:B,onKeyup:K};return l.value===!0?(t.tabindex=e.tabindex||"0",Object.assign(t,h.value)):v.value===!0&&(t["aria-disabled"]="true"),q(L.value,t,P())}}});export{J as Q};
