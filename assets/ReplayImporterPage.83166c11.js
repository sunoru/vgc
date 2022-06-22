import{c as U,r as $,a as j,e as W,o as Q,h as V,g as E,x as L,F as D,y as H,z as J,A as q,B as R,a8 as C,G,a9 as X,aa as K,ab as Y,ac as B,ad as Z}from"./index.54d40874.js";import{b as tt}from"./format.62b12d0f.js";import{Q as et,a as st}from"./QForm.1a5e6ae3.js";import{s as M,a as at}from"./dialog.28fb2936.js";import{_ as ot}from"./PageBase.173173d1.js";import{_ as nt}from"./plugin-vue_export-helper.21dcd24c.js";import"./use-dark.67ab37e7.js";import"./QPage.0b9ac273.js";const O=XMLHttpRequest,N=O.prototype.open,rt=["top","right","bottom","left"];let T=[],P=0;function it({p:t,pos:e,active:a,horiz:n,reverse:o,dir:i}){let s=1,r=1;return n===!0?(o===!0&&(s=-1),e==="bottom"&&(r=-1),{transform:`translate3d(${s*(t-100)}%,${a?0:r*-200}%,0)`}):(o===!0&&(r=-1),e==="right"&&(s=-1),{transform:`translate3d(${a?0:i*s*-200}%,${r*(t-100)}%,0)`})}function lt(t,e){return typeof e!="number"&&(t<25?e=Math.random()*3+3:t<65?e=Math.random()*3:t<85?e=Math.random()*2:t<99?e=.6:e=0),tt(t+e,0,100)}function ct(t){P++,T.push(t),!(P>1)&&(O.prototype.open=function(e,a){const n=[],o=()=>{T.forEach(s=>{(s.hijackFilter.value===null||s.hijackFilter.value(a)===!0)&&(s.start(),n.push(s.stop))})},i=()=>{n.forEach(s=>{s()})};this.addEventListener("loadstart",o,{once:!0}),this.addEventListener("loadend",i,{once:!0}),N.apply(this,arguments)})}function ut(t){T=T.filter(e=>e.start!==t),P=Math.max(0,P-1),P===0&&(O.prototype.open=N)}var pt=U({name:"QAjaxBar",props:{position:{type:String,default:"top",validator:t=>rt.includes(t)},size:{type:String,default:"2px"},color:String,skipHijack:Boolean,reverse:Boolean,hijackFilter:Function},emits:["start","stop"],setup(t,{emit:e}){const{proxy:a}=E(),n=$(0),o=$(!1),i=$(!0);let s=0,r,m;const g=j(()=>`q-loading-bar q-loading-bar--${t.position}`+(t.color!==void 0?` bg-${t.color}`:"")+(i.value===!0?"":" no-transition")),u=j(()=>t.position==="top"||t.position==="bottom"),I=j(()=>u.value===!0?"height":"width"),b=j(()=>{const c=o.value,d=it({p:n.value,pos:t.position,active:c,horiz:u.value,reverse:a.$q.lang.rtl===!0&&["top","bottom"].includes(t.position)?t.reverse===!1:t.reverse,dir:a.$q.lang.rtl===!0?-1:1});return d[I.value]=t.size,d.opacity=c?1:0,d}),p=j(()=>o.value===!0?{role:"progressbar","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":n.value}:{"aria-hidden":"true"});function k(c=300){const d=m;return m=Math.max(0,c)||0,s++,s>1?(d===0&&c>0?w():d>0&&c<=0&&clearTimeout(r),s):(clearTimeout(r),e("start"),n.value=0,r=setTimeout(()=>{i.value=!0,c>0&&w()},o.value===!0?500:1),o.value!==!0&&(o.value=!0,i.value=!1),s)}function S(c){return s>0&&(n.value=lt(n.value,c)),s}function _(){if(s=Math.max(0,s-1),s>0)return s;clearTimeout(r),e("stop");const c=()=>{i.value=!0,n.value=100,r=setTimeout(()=>{o.value=!1},1e3)};return n.value===0?r=setTimeout(c,1):c(),s}function w(){n.value<100&&(r=setTimeout(()=>{S(),w()},m))}let f;return W(()=>{t.skipHijack!==!0&&(f=!0,ct({start:k,stop:_,hijackFilter:j(()=>t.hijackFilter||null)}))}),Q(()=>{clearTimeout(r),f===!0&&ut(k)}),Object.assign(a,{start:k,stop:_,increment:S}),()=>V("div",{class:g.value,style:b.value,...p.value})}});const mt=(t,e)=>{for(const n of t)if(n.id==e)return n;const a={id:e,sentOutNumber:t.length,moves:[]};return t.push(a),a},z=(t,e,a)=>{e.startsWith("[from]")&&(e=e.slice(6)),a.startsWith("[of]")&&(a=a.slice(4));const n=a.split(":")[0].trim();if(!(n in t))return;const o=t[n],[i,s]=e.split(":");switch(i.trim()){case"item":o.item=s.trim();break;case"ability":o.ability=s.trim();break}},ft=async(t,e,a)=>{var i;const n=(i=a==null?void 0:a.myUsernames)!=null?i:[];if(n.includes(t))return B.Player1;if(n.includes(e))return B.Player2;const o=await at("Which is your username?","Neither",t,e);return o!==0&&a!==void 0&&(n.push(o===1?t:e),await Z(a)),o},dt=async(t,e)=>{const a=await Y(),n=`https://replay.pokemonshowdown.com/${t}${e?`-${e}`:""}`,i=await(await fetch(n+".json")).json(),{uploadtime:s,p1:r,p2:m,format:g,log:u,rating:I}=i,b=u.split(`
`);let p=!1;const k=[],S=[],_=[],w=[],f={};let c=s;for(const d of b){const l=d.split("|"),y=l.length;if(y<2||l[1]==="")continue;switch(l[1]){case"t:":{c=parseInt(l[2]);break}case"poke":{const h=l[2]==="p1"?k:S,v=l[3].split(",")[0];h.push(v);break}case"switch":{const h=l[2].split(":")[0],v=l[3].split(",")[0],x=h.slice(0,2)==="p1"?_:w;f[h]=mt(x,v);break}case"move":{const h=l[2].split(":")[0],v=f[h],x=l[3],F=v.moves||[];F.includes(x)||(F.push(x),v.moves=F);break}case"-ability":{const h=l[2].split(":")[0],v=f[h],x=l[3];v.ability=x;break}case"win":{p=l[2]===r;break}default:{l[y-2].startsWith("[from]")&&l[y-1].startsWith("[of]")?z(f,l[y-2],l[y-1]):l[y-1].startsWith("[from]")&&z(f,l[y-1],l[2]);break}}}return{time:c,platform:"Showdown",id:t,url:n,p1:r,p2:m,format:g,rating:I,timeParsed:Math.floor(Date.now()/1e3),winner:p?B.Player1:B.Player2,team1:k,team2:S,team1SentOut:_,team2SentOut:w,remarks:"",tags:[],userPlayer:await ft(r,m,a),log:u}},ht=/^https:\/\/replay.pokemonshowdown.com\/(?<id>\w+?-\w+)(-(?<password>\w+))?(?<remarks>\s+.*)?$/,A=(t,e)=>{const a=e.join(`
`);return t.remarks!==a?(t.remarks+=a,0):1},vt=async(t,e)=>{const a=t.split(`
`),n=100/a.length;let o=null,i=[],s=0;const r={};for(const m of a){const g=ht.exec(m);if(g===null||g.groups===void 0){if(o!==null){const p=m.trim();p!==""&&i.push(p)}continue}o!==null&&(s+=A(o,i),i=[]);const{id:u,password:I,remarks:b}=g.groups;if(console.log(`Importing ${u}...`),o=u in r?r[u]:await X("battles",u),o===null&&(o=await dt(u,I)),b!==void 0){const p=b.trim();p!==""&&i.push(p)}r[u]=o,e.increment(n)}return o!==null&&(s+=A(o,i)),console.log("Finished!"),await K("battles",r),console.log("Saved"),{battles:r,skipped:s}},gt=L({name:"ReplayImporterPage",components:{PageBase:ot},setup:()=>{const t=$(""),e=$(),a=$(!1);return{textInput:t,bar:e,parse:async()=>{const o=e.value;if(!!o){o.start(0),a.value=!0;try{const i=t.value.trim();if(i===""){M("Invalid input.","negative");return}const s=await vt(i,o),r=Object.keys(s.battles).length;M(`${r-s.skipped}/${r} Imported.`),t.value=""}catch(i){console.error(i),M("Something went wrong.","negative")}finally{o.stop(),a.value=!1}}},isImporting:a}}}),yt={class:"q-pa-md col",style:{"max-width":"720px"}},bt=C("div",{class:"text-h3"},"Replay Importer",-1);function kt(t,e,a,n,o,i){const s=D("page-base");return H(),J(s,{class:"row items-center justify-evenly",title:"Replay Importer"},{default:q(()=>[R(pt,{ref:"bar",position:"top",color:"accent",size:"10px","skip-hijack":""},null,512),C("div",yt,[bt,R(st,{onSubmit:t.parse,class:"q-mt-md"},{default:q(()=>[R(et,{outlined:"",modelValue:t.textInput,"onUpdate:modelValue":e[0]||(e[0]=r=>t.textInput=r),label:"Replay URLs",autogrow:"",type:"textarea"},null,8,["modelValue"]),R(G,{class:"q-mt-sm",color:"primary",label:"Import All",type:"submit",loading:t.isImporting},null,8,["loading"])]),_:1},8,["onSubmit"])])]),_:1})}var Bt=nt(gt,[["render",kt]]);export{Bt as default};