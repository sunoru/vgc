import{a as P,u as j}from"./use-dark.07293c8a.js";import{r as I,c as l,h as f,Z as z,A as R,l as D,_ as N,g as K,$ as i,V as x}from"./index.59160731.js";function L(a,c){const e=I(null),s=l(()=>a.disable===!0?null:f("span",{ref:e,class:"no-outline",tabindex:-1}));function m(u){const r=c.value;u!==void 0&&u.type.indexOf("key")===0?r!==null&&document.activeElement!==r&&r.contains(document.activeElement)===!0&&r.focus():e.value!==null&&(u===void 0||r!==null&&r.contains(u.target)===!0)&&e.value.focus()}return{refocusTargetEl:s,refocusTarget:m}}const M={name:String};function Z(a={}){return(c,e,s)=>{c[e](f("input",{class:"hidden"+(s||""),...a.value}))}}function Q(a){return l(()=>a.name||a.for)}var G={xs:30,sm:35,md:40,lg:50,xl:60};const U={...j,...N,...M,modelValue:{required:!0,default:null},val:{},trueValue:{default:!0},falseValue:{default:!1},indeterminateValue:{default:null},checkedIcon:String,uncheckedIcon:String,indeterminateIcon:String,toggleOrder:{type:String,validator:a=>a==="tf"||a==="ft"},toggleIndeterminate:Boolean,label:String,leftLabel:Boolean,color:String,keepColor:Boolean,dense:Boolean,disable:Boolean,tabindex:[String,Number]},W=["update:modelValue"];function X(a,c){const{props:e,slots:s,emit:m,proxy:u}=K(),{$q:r}=u,S=P(e,r),p=I(null),{refocusTargetEl:k,refocusTarget:C}=L(e,p),q=z(e,G),d=l(()=>e.val!==void 0&&Array.isArray(e.modelValue)),g=l(()=>{const t=i(e.val);return d.value===!0?e.modelValue.findIndex(o=>i(o)===t):-1}),n=l(()=>d.value===!0?g.value>-1:i(e.modelValue)===i(e.trueValue)),v=l(()=>d.value===!0?g.value===-1:i(e.modelValue)===i(e.falseValue)),h=l(()=>n.value===!1&&v.value===!1),$=l(()=>e.disable===!0?-1:e.tabindex||0),y=l(()=>`q-${a} cursor-pointer no-outline row inline no-wrap items-center`+(e.disable===!0?" disabled":"")+(S.value===!0?` q-${a}--dark`:"")+(e.dense===!0?` q-${a}--dense`:"")+(e.leftLabel===!0?" reverse":"")),_=l(()=>{const t=n.value===!0?"truthy":v.value===!0?"falsy":"indet",o=e.color!==void 0&&(e.keepColor===!0||(a==="toggle"?n.value===!0:v.value!==!0))?` text-${e.color}`:"";return`q-${a}__inner relative-position non-selectable q-${a}__inner--${t}${o}`}),A=l(()=>{const t={type:"checkbox"};return e.name!==void 0&&Object.assign(t,{".checked":n.value,"^checked":n.value===!0?"checked":void 0,name:e.name,value:d.value===!0?e.val:e.trueValue}),t}),O=Z(A),T=l(()=>{const t={tabindex:$.value,role:a==="toggle"?"switch":"checkbox","aria-label":e.label,"aria-checked":h.value===!0?"mixed":n.value===!0?"true":"false"};return e.disable===!0&&(t["aria-disabled"]="true"),t});function b(t){t!==void 0&&(x(t),C(t)),e.disable!==!0&&m("update:modelValue",w(),t)}function w(){if(d.value===!0){if(n.value===!0){const t=e.modelValue.slice();return t.splice(g.value,1),t}return e.modelValue.concat([e.val])}if(n.value===!0){if(e.toggleOrder!=="ft"||e.toggleIndeterminate===!1)return e.falseValue}else if(v.value===!0){if(e.toggleOrder==="ft"||e.toggleIndeterminate===!1)return e.trueValue}else return e.toggleOrder!=="ft"?e.trueValue:e.falseValue;return e.indeterminateValue}function B(t){(t.keyCode===13||t.keyCode===32)&&x(t)}function E(t){(t.keyCode===13||t.keyCode===32)&&b(t)}const F=c(n,h);return Object.assign(u,{toggle:b}),()=>{const t=F();e.disable!==!0&&O(t,"unshift",` q-${a}__native absolute q-ma-none q-pa-none`);const o=[f("div",{class:_.value,style:q.value,"aria-hidden":"true"},t)];k.value!==null&&o.push(k.value);const V=e.label!==void 0?R(s.default,[e.label]):D(s.default);return V!==void 0&&o.push(f("div",{class:`q-${a}__label q-anchor--skip`},V)),f("div",{ref:p,class:y.value,...T.value,onClick:b,onKeydown:B,onKeyup:E},o)}}export{W as a,X as b,M as c,Q as d,U as u};