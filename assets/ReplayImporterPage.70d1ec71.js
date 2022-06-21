import{c as Q,r as $,a as j,e as V,o as E,h as L,g as N,a8 as U,x as D,F as H,y as G,z as J,A as q,B as R,a7 as W,G as X}from"./index.89ae4b1a.js";import{b as K}from"./format.21e99ead.js";import{Q as Y,a as Z}from"./QForm.6dedc1cd.js";import{s as tt}from"./storage.c47e46fa.js";import{g as et,s as st}from"./config.a4ef94ab.js";import{_ as ot}from"./PageBase.cdc040c7.js";import{_ as at}from"./plugin-vue_export-helper.21dcd24c.js";import"./QPage.32a40dda.js";const M=XMLHttpRequest,O=M.prototype.open,nt=["top","right","bottom","left"];let T=[],P=0;function rt({p:t,pos:e,active:s,horiz:n,reverse:o,dir:r}){let a=1,i=1;return n===!0?(o===!0&&(a=-1),e==="bottom"&&(i=-1),{transform:`translate3d(${a*(t-100)}%,${s?0:i*-200}%,0)`}):(o===!0&&(i=-1),e==="right"&&(a=-1),{transform:`translate3d(${s?0:r*a*-200}%,${i*(t-100)}%,0)`})}function it(t,e){return typeof e!="number"&&(t<25?e=Math.random()*3+3:t<65?e=Math.random()*3:t<85?e=Math.random()*2:t<99?e=.6:e=0),K(t+e,0,100)}function lt(t){P++,T.push(t),!(P>1)&&(M.prototype.open=function(e,s){const n=[],o=()=>{T.forEach(a=>{(a.hijackFilter.value===null||a.hijackFilter.value(s)===!0)&&(a.start(),n.push(a.stop))})},r=()=>{n.forEach(a=>{a()})};this.addEventListener("loadstart",o,{once:!0}),this.addEventListener("loadend",r,{once:!0}),O.apply(this,arguments)})}function ct(t){T=T.filter(e=>e.start!==t),P=Math.max(0,P-1),P===0&&(M.prototype.open=O)}var ut=Q({name:"QAjaxBar",props:{position:{type:String,default:"top",validator:t=>nt.includes(t)},size:{type:String,default:"2px"},color:String,skipHijack:Boolean,reverse:Boolean,hijackFilter:Function},emits:["start","stop"],setup(t,{emit:e}){const{proxy:s}=N(),n=$(0),o=$(!1),r=$(!0);let a=0,i,p;const g=j(()=>`q-loading-bar q-loading-bar--${t.position}`+(t.color!==void 0?` bg-${t.color}`:"")+(r.value===!0?"":" no-transition")),m=j(()=>t.position==="top"||t.position==="bottom"),I=j(()=>m.value===!0?"height":"width"),k=j(()=>{const c=o.value,d=rt({p:n.value,pos:t.position,active:c,horiz:m.value,reverse:s.$q.lang.rtl===!0&&["top","bottom"].includes(t.position)?t.reverse===!1:t.reverse,dir:s.$q.lang.rtl===!0?-1:1});return d[I.value]=t.size,d.opacity=c?1:0,d}),u=j(()=>o.value===!0?{role:"progressbar","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":n.value}:{"aria-hidden":"true"});function b(c=300){const d=p;return p=Math.max(0,c)||0,a++,a>1?(d===0&&c>0?w():d>0&&c<=0&&clearTimeout(i),a):(clearTimeout(i),e("start"),n.value=0,i=setTimeout(()=>{r.value=!0,c>0&&w()},o.value===!0?500:1),o.value!==!0&&(o.value=!0,r.value=!1),a)}function _(c){return a>0&&(n.value=it(n.value,c)),a}function S(){if(a=Math.max(0,a-1),a>0)return a;clearTimeout(i),e("stop");const c=()=>{r.value=!0,n.value=100,i=setTimeout(()=>{o.value=!1},1e3)};return n.value===0?i=setTimeout(c,1):c(),a}function w(){n.value<100&&(i=setTimeout(()=>{_(),w()},p))}let f;return V(()=>{t.skipHijack!==!0&&(f=!0,lt({start:b,stop:S,hijackFilter:j(()=>t.hijackFilter||null)}))}),E(()=>{clearTimeout(i),f===!0&&ct(b)}),Object.assign(s,{start:b,stop:S,increment:_}),()=>L("div",{class:g.value,style:k.value,...u.value})}});const F=(t,e="primary",s={})=>(s.message=t,s.color=e,U.create(s)),pt=(t,...e)=>new Promise(s=>{const n={message:t,timeout:0,actions:e.map((r,a)=>({label:r,handler:()=>{o(),s(a)},color:"info",noCaps:!0}))},o=U.create(n)});var B=(t=>(t[t.None=0]="None",t[t.Player1=1]="Player1",t[t.Player2=2]="Player2",t))(B||{});const mt=(t,e)=>{for(const n of t)if(n.id==e)return n;const s={id:e,sentOutNumber:t.length,moves:[]};return t.push(s),s},z=(t,e,s)=>{e.startsWith("[from]")&&(e=e.slice(6)),s.startsWith("[of]")&&(s=s.slice(4));const n=s.split(":")[0].trim();if(!(n in t))return;const o=t[n],[r,a]=e.split(":");switch(r.trim()){case"item":o.item=a.trim();break;case"ability":o.ability=a.trim();break}},ft=async(t,e,s)=>{var r;const n=(r=s==null?void 0:s.myUsernames)!=null?r:[];if(n.includes(t))return B.Player1;if(n.includes(e))return B.Player2;const o=await pt("Which is your username?","Neither",t,e);return o!==0&&s!==void 0&&(n.push(o===1?t:e),await st(s)),o},dt=async(t,e)=>{const s=await et(),n=`https://replay.pokemonshowdown.com/${t}${e?`-${e}`:""}`,o=await fetch(n+".json");console.log(o);const r=await o.json(),{uploadtime:a,p1:i,p2:p,format:g,log:m,rating:I}=r,k=m.split(`
`);let u=!1;const b=[],_=[],S=[],w=[],f={};let c=a;for(const d of k){const l=d.split("|"),y=l.length;if(y<2||l[1]==="")continue;switch(l[1]){case"t:":{c=parseInt(l[2]);break}case"poke":{const h=l[2]==="p1"?b:_,v=l[3].split(",")[0];h.push(v);break}case"switch":{const h=l[2].split(":")[0],v=l[3].split(",")[0],x=h.slice(0,2)==="p1"?S:w;f[h]=mt(x,v);break}case"move":{const h=l[2].split(":")[0],v=f[h],x=l[3],C=v.moves||[];C.includes(x)||(C.push(x),v.moves=C);break}case"-ability":{const h=l[2].split(":")[0],v=f[h],x=l[3];v.ability=x;break}case"win":{u=l[2]===i;break}default:{l[y-2].startsWith("[from]")&&l[y-1].startsWith("[of]")?z(f,l[y-2],l[y-1]):l[y-1].startsWith("[from]")&&z(f,l[y-1],l[2]);break}}}return{time:c,platform:"Showdown",id:t,url:n,p1:i,p2:p,format:g,rating:I,timeParsed:Math.floor(Date.now()/1e3),winner:u?B.Player1:B.Player2,team1:b,team2:_,team1SentOut:S,team2SentOut:w,remarks:"",tags:[],userPlayer:await ft(i,p,s),log:m}},ht=/^https:\/\/replay.pokemonshowdown.com\/(?<id>\w+?-\w+)(-(?<password>\w+))?(?<remarks>\s+.*)?$/,A=(t,e)=>{const s=e.join(`
`);return t.remarks!==s?(t.remarks+=s,0):1},vt=async(t,e)=>{const s=t.split(`
`),n=100/s.length;let o=null,r=[],a=0;const i={};for(const p of s){const g=ht.exec(p);if(g===null||g.groups===void 0){if(o!==null){const u=p.trim();u!==""&&r.push(u)}continue}o!==null&&(a+=A(o,r),r=[]);const{id:m,password:I,remarks:k}=g.groups;if(console.log(`Importing ${m}...`),o=null,o===null&&(o=await dt(m,I)),k!==void 0){const u=k.trim();u!==""&&r.push(u)}i[m]=o,e.increment(n)}return o!==null&&(a+=A(o,r)),console.log("Finished!"),await tt(i),console.log("Saved"),{battles:i,skipped:a}},gt=D({name:"ReplayImporterPage",components:{PageBase:ot},setup:()=>{const t=$(""),e=$(),s=$(!1);return{textInput:t,bar:e,parse:async()=>{const o=e.value;if(!!o){o.start(0),s.value=!0;try{const r=t.value.trim();if(r===""){F("Invalid input.","negative");return}const a=await vt(r,o),i=Object.keys(a.battles).length;F(`${i-a.skipped}/${i} Imported.`),t.value=""}catch(r){console.error(r),F("Something went wrong.","negative")}finally{o.stop(),s.value=!1}}},isImporting:s}}}),yt={class:"q-pa-md col",style:{"max-width":"720px"}},kt=W("div",{class:"text-h3"},"Replay Importer",-1);function bt(t,e,s,n,o,r){const a=H("page-base");return G(),J(a,{class:"row items-center justify-evenly",title:"Replay Importer"},{default:q(()=>[R(ut,{ref:"bar",position:"top",color:"accent",size:"10px","skip-hijack":""},null,512),W("div",yt,[kt,R(Z,{onSubmit:t.parse,class:"q-mt-md"},{default:q(()=>[R(Y,{outlined:"",modelValue:t.textInput,"onUpdate:modelValue":e[0]||(e[0]=i=>t.textInput=i),label:"Replay URLs",autogrow:"",type:"textarea"},null,8,["modelValue"]),R(X,{class:"q-mt-sm",color:"primary",label:"Import All",type:"submit",loading:t.isImporting},null,8,["loading"])]),_:1},8,["onSubmit"])])]),_:1})}var Rt=at(gt,[["render",bt]]);export{Rt as default};
