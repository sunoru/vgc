var V=Object.defineProperty;var A=Object.getOwnPropertySymbols;var E=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var C=(t,e,s)=>e in t?V(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s,F=(t,e)=>{for(var s in e||(e={}))E.call(e,s)&&C(t,s,e[s]);if(A)for(var s of A(e))L.call(e,s)&&C(t,s,e[s]);return t};import{c as H,r as $,a as j,e as D,o as G,h as J,g as X,_ as K,x as Y,G as Z,y as tt,z as et,A as N,aa as q,B,a9 as O,H as st,ab as at,ac as ot,ad as R,ae as nt,af as rt}from"./index.d77b2db0.js";import{b as it}from"./format.c9b0072a.js";import{_ as lt,Q as ct,a as ut}from"./PageBase.44641574.js";import"./QPage.054434d8.js";const z=XMLHttpRequest,Q=z.prototype.open,pt=["top","right","bottom","left"];let T=[],S=0;function mt({p:t,pos:e,active:s,horiz:n,reverse:a,dir:r}){let o=1,i=1;return n===!0?(a===!0&&(o=-1),e==="bottom"&&(i=-1),{transform:`translate3d(${o*(t-100)}%,${s?0:i*-200}%,0)`}):(a===!0&&(i=-1),e==="right"&&(o=-1),{transform:`translate3d(${s?0:r*o*-200}%,${i*(t-100)}%,0)`})}function ft(t,e){return typeof e!="number"&&(t<25?e=Math.random()*3+3:t<65?e=Math.random()*3:t<85?e=Math.random()*2:t<99?e=.6:e=0),it(t+e,0,100)}function dt(t){S++,T.push(t),!(S>1)&&(z.prototype.open=function(e,s){const n=[],a=()=>{T.forEach(o=>{(o.hijackFilter.value===null||o.hijackFilter.value(s)===!0)&&(o.start(),n.push(o.stop))})},r=()=>{n.forEach(o=>{o()})};this.addEventListener("loadstart",a,{once:!0}),this.addEventListener("loadend",r,{once:!0}),Q.apply(this,arguments)})}function ht(t){T=T.filter(e=>e.start!==t),S=Math.max(0,S-1),S===0&&(z.prototype.open=Q)}var vt=H({name:"QAjaxBar",props:{position:{type:String,default:"top",validator:t=>pt.includes(t)},size:{type:String,default:"2px"},color:String,skipHijack:Boolean,reverse:Boolean,hijackFilter:Function},emits:["start","stop"],setup(t,{emit:e}){const{proxy:s}=X(),n=$(0),a=$(!1),r=$(!0);let o=0,i,p;const g=j(()=>`q-loading-bar q-loading-bar--${t.position}`+(t.color!==void 0?` bg-${t.color}`:"")+(r.value===!0?"":" no-transition")),m=j(()=>t.position==="top"||t.position==="bottom"),I=j(()=>m.value===!0?"height":"width"),k=j(()=>{const c=a.value,d=mt({p:n.value,pos:t.position,active:c,horiz:m.value,reverse:s.$q.lang.rtl===!0&&["top","bottom"].includes(t.position)?t.reverse===!1:t.reverse,dir:s.$q.lang.rtl===!0?-1:1});return d[I.value]=t.size,d.opacity=c?1:0,d}),u=j(()=>a.value===!0?{role:"progressbar","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":n.value}:{"aria-hidden":"true"});function b(c=300){const d=p;return p=Math.max(0,c)||0,o++,o>1?(d===0&&c>0?w():d>0&&c<=0&&clearTimeout(i),o):(clearTimeout(i),e("start"),n.value=0,i=setTimeout(()=>{r.value=!0,c>0&&w()},a.value===!0?500:1),a.value!==!0&&(a.value=!0,r.value=!1),o)}function _(c){return o>0&&(n.value=ft(n.value,c)),o}function P(){if(o=Math.max(0,o-1),o>0)return o;clearTimeout(i),e("stop");const c=()=>{r.value=!0,n.value=100,i=setTimeout(()=>{a.value=!1},1e3)};return n.value===0?i=setTimeout(c,1):c(),o}function w(){n.value<100&&(i=setTimeout(()=>{_(),w()},p))}let f;return D(()=>{t.skipHijack!==!0&&(f=!0,dt({start:b,stop:P,hijackFilter:j(()=>t.hijackFilter||null)}))}),G(()=>{clearTimeout(i),f===!0&&ht(b)}),Object.assign(s,{start:b,stop:P,increment:_}),()=>J("div",F({class:g.value,style:k.value},u.value))}});const gt=(t,e)=>{for(const n of t)if(n.id==e)return n;const s={id:e,sentOutNumber:t.length,moves:[]};return t.push(s),s},U=(t,e,s)=>{e.startsWith("[from]")&&(e=e.slice(6)),s.startsWith("[of]")&&(s=s.slice(4));const n=s.split(":")[0].trim();if(!(n in t))return;const a=t[n],[r,o]=e.split(":");switch(r.trim()){case"item":a.item=o.trim();break;case"ability":a.ability=o.trim();break}},yt=async(t,e,s)=>{var r;const n=(r=s==null?void 0:s.myUsernames)!=null?r:[];if(n.includes(t))return R.Player1;if(n.includes(e))return R.Player2;const a=await nt("Which is your username?","Neither",t,e);return a!==0&&s!==void 0&&(n.push(a===1?t:e),await rt(s)),a},kt=async(t,e)=>{const s=await ot(),n=`https://replay.pokemonshowdown.com/${t}${e?`-${e}`:""}`,a=await fetch(n+".json");console.log(a);const r=await a.json(),{uploadtime:o,p1:i,p2:p,format:g,log:m,rating:I}=r,k=m.split(`
`);let u=!1;const b=[],_=[],P=[],w=[],f={};let c=o;for(const d of k){const l=d.split("|"),y=l.length;if(y<2||l[1]==="")continue;switch(l[1]){case"t:":{c=parseInt(l[2]);break}case"poke":{const h=l[2]==="p1"?b:_,v=l[3].split(",")[0];h.push(v);break}case"switch":{const h=l[2].split(":")[0],v=l[3].split(",")[0],x=h.slice(0,2)==="p1"?P:w;f[h]=gt(x,v);break}case"move":{const h=l[2].split(":")[0],v=f[h],x=l[3],M=v.moves||[];M.includes(x)||(M.push(x),v.moves=M);break}case"-ability":{const h=l[2].split(":")[0],v=f[h],x=l[3];v.ability=x;break}case"win":{u=l[2]===i;break}default:{l[y-2].startsWith("[from]")&&l[y-1].startsWith("[of]")?U(f,l[y-2],l[y-1]):l[y-1].startsWith("[from]")&&U(f,l[y-1],l[2]);break}}}return{time:c,platform:"Showdown",id:t,url:n,p1:i,p2:p,format:g,rating:I,timeParsed:Math.floor(Date.now()/1e3),winner:u?R.Player1:R.Player2,team1:b,team2:_,team1SentOut:P,team2SentOut:w,remarks:"",tags:[],userPlayer:await yt(i,p,s),log:m}},bt=/^https:\/\/replay.pokemonshowdown.com\/(?<id>\w+?-\w+)(-(?<password>\w+))?(?<remarks>\s+.*)?$/,W=(t,e)=>{const s=e.join(`
`);return t.remarks!==s?(t.remarks+=s,0):1},wt=async(t,e)=>{const s=t.split(`
`),n=100/s.length;let a=null,r=[],o=0;const i={};for(const p of s){const g=bt.exec(p);if(g===null||g.groups===void 0){if(a!==null){const u=p.trim();u!==""&&r.push(u)}continue}a!==null&&(o+=W(a,r),r=[]);const{id:m,password:I,remarks:k}=g.groups;if(console.log(`Importing ${m}...`),a=null,a===null&&(a=await kt(m,I)),k!==void 0){const u=k.trim();u!==""&&r.push(u)}i[m]=a,e.increment(n)}return a!==null&&(o+=W(a,r)),console.log("Finished!"),await at(i),console.log("Saved"),{battles:i,skipped:o}},xt=Y({name:"ReplayImporterPage",components:{PageBase:lt},setup:()=>{const t=$(""),e=$(),s=$(!1);return{textInput:t,bar:e,parse:async()=>{const a=e.value;if(!!a){a.start(0),s.value=!0;try{const r=t.value.trim();if(r===""){q("Invalid input.","negative");return}const o=await wt(r,a),i=Object.keys(o.battles).length;q(`${i-o.skipped}/${i} Imported.`),t.value=""}catch(r){console.error(r),q("Something went wrong.","negative")}finally{a.stop(),s.value=!1}}},isImporting:s}}}),jt={class:"q-pa-md col",style:{"max-width":"720px"}},$t=O("div",{class:"text-h3"},"Replay Importer",-1);function It(t,e,s,n,a,r){const o=Z("page-base");return tt(),et(o,{class:"row items-center justify-evenly",title:"Replay Importer"},{default:N(()=>[B(vt,{ref:"bar",position:"top",color:"accent",size:"10px","skip-hijack":""},null,512),O("div",jt,[$t,B(ut,{onSubmit:t.parse,class:"q-mt-md"},{default:N(()=>[B(ct,{outlined:"",modelValue:t.textInput,"onUpdate:modelValue":e[0]||(e[0]=i=>t.textInput=i),label:"Replay URLs",autogrow:"",type:"textarea"},null,8,["modelValue"]),B(st,{class:"q-mt-sm",color:"primary",label:"Import All",type:"submit",loading:t.isImporting},null,8,["loading"])]),_:1},8,["onSubmit"])])]),_:1})}var Mt=K(xt,[["render",It]]);export{Mt as default};
