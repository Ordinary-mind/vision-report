import{S as v,l as h}from"./localforage-7c0fd1ff.js";import{L as o,N as m,T as w,ak as u,al as p,V as g,au as x}from"./index-d4f23ccb.js";const y=Object.assign({name:"qReportView"},{__name:"index",props:{propData:{type:Object,default:()=>({})}},setup(i){const l=i,e=o(),t=o(null),n=o(null),f=()=>{const a=()=>{const{rows:s}=n.value;if(!s)return;let r=0;Object.values(s).forEach(_=>{r=Math.max(r,Object.keys(_.cells).length)});const d=Object.keys(s).length;n.value.rows.len=d,n.value.cols.len=r,t.value.loadData(n.value),t.value.reRender()};t.value?a():g(()=>{c(),a()})},c=()=>{if(t.value)return;const a={mode:"read",showToolbar:!1,showBottomBar:!1,showGrid:!1,showContextmenu:!1,view:{height:()=>e.value.clientHeight,width:()=>e.value.clientWidth},row:{len:0,height:25},col:{len:0,width:100,indexWidth:60,minWidth:60},style:{bgcolor:"#ffffff",align:"left",valign:"middle",textwrap:!1,strike:!1,underline:!1,color:"#0a0a0a",font:{name:"Helvetica",size:10,bold:!1,italic:!1}}};t.value=new v(e.value,a)};return m(()=>l.propData,a=>{n.value=JSON.parse(JSON.stringify(a)),f()},{immediate:!0}),w(()=>{c()}),(a,s)=>(u(),p("div",{ref_key:"container",ref:e,class:"q-report-view"},null,512))}});const D={class:"preview-wrapper"},k=Object.assign({name:"preview"},{__name:"index",setup(i){const l=o({});return h.getItem("previewData").then(e=>{l.value=JSON.parse(e)}),(e,t)=>(u(),p("div",D,[x(y,{propData:l.value},null,8,["propData"])]))}});export{k as default};