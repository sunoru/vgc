import{an as e}from"./index.51b85b29.js";const m=(a,s="primary",o={})=>(o.message=a,o.color=s,e.create(o)),n=(a,...s)=>new Promise(o=>{const t={message:a,timeout:0,actions:s.map((c,i)=>({label:c,handler:()=>{r(),o(i)},color:"info",noCaps:!0}))},r=e.create(t)}),f=async(a,s="Yes",o="No")=>await n(a,s,o)===0;export{n as a,f as c,m as s};