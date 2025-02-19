import{b2 as D,g as d,aC as L,o as B,h as v,i as e,d as o,w as u,t as i,F as V,j as S,e as N,f as m,b as _,l as C,c as z,k as A}from"./vendor-3y-Tr9ie.js";import{_ as F}from"./index-Cpc2chc0.js";const R={name:"TransactionList",components:{ArrowLeft:D},setup(){const b=d("month"),s=d(""),p=d([]),a=d(!1),T=d(!0),w=d(99.5),k=d(245.5),f=[{id:1,title:"中央食堂-特色炒菜",amount:15,type:"expense",status:"completed",time:"2024-01-20 12:30:00"},{id:2,title:"余额充值",amount:100,type:"recharge",status:"completed",time:"2024-01-20 10:00:00"},{id:3,title:"沁园餐厅-面食",amount:12,type:"expense",status:"completed",time:"2024-01-19 18:30:00"}],g=L(()=>{const t={};return p.value.forEach(n=>{const c=n.time.split(" ")[0];t[c]||(t[c]=[]),t[c].push(n)}),t}),r=t=>{const n=new Date(t),c=String(n.getMonth()+1).padStart(2,"0"),M=String(n.getDate()).padStart(2,"0");return`${c}月${M}日`},h=t=>t.split(" ")[1].substring(0,5),x=t=>({completed:"交易成功",pending:"处理中",failed:"交易失败"})[t]||t,l=t=>t.filter(n=>n.type==="expense").reduce((n,c)=>n+c.amount,0).toFixed(2),y=async()=>{a.value=!0;try{await new Promise(t=>setTimeout(t,1e3)),p.value.push(...f),T.value=p.value.length<20}finally{a.value=!1}};return B(()=>{p.value=f}),{timeRange:b,transactionType:s,groupedTransactions:g,loading:a,hasMore:T,balance:w,monthlySpent:k,formatDate:r,formatTime:h,getStatusText:x,getDailyTotal:l,loadMore:y}}},E={class:"transaction-list"},U={class:"page-header"},j={class:"stats-card"},q={class:"stat-item"},I={class:"value"},P={class:"stat-item"},G={class:"value"},H={class:"filter-bar"},J={class:"transaction-items"},K={class:"date-header"},O={class:"date"},Q={class:"daily-total"},W={class:"transaction-content"},X={class:"left"},Y={class:"title"},Z={class:"time"},$={class:"right"},tt={class:"status"},et={key:0,class:"load-more"};function st(b,s,p,a,T,w){const k=m("ArrowLeft"),f=m("el-icon"),g=m("el-button"),r=m("el-option"),h=m("el-select"),x=m("el-card");return _(),v("div",E,[e("div",U,[o(g,{class:"back-btn",link:"",onClick:s[0]||(s[0]=l=>b.$router.back())},{default:u(()=>[o(f,null,{default:u(()=>[o(k)]),_:1}),s[3]||(s[3]=C(" 返回 "))]),_:1}),s[4]||(s[4]=e("h2",{class:"page-title"},"消费记录",-1))]),e("div",j,[e("div",q,[s[5]||(s[5]=e("div",{class:"label"},"本月消费",-1)),e("div",I,"¥"+i(a.monthlySpent),1)]),e("div",P,[s[6]||(s[6]=e("div",{class:"label"},"剩余余额",-1)),e("div",G,"¥"+i(a.balance),1)])]),e("div",H,[o(h,{modelValue:a.timeRange,"onUpdate:modelValue":s[1]||(s[1]=l=>a.timeRange=l),placeholder:"时间范围",size:"large"},{default:u(()=>[o(r,{label:"最近一周",value:"week"}),o(r,{label:"最近一月",value:"month"}),o(r,{label:"最近三月",value:"quarter"})]),_:1},8,["modelValue"]),o(h,{modelValue:a.transactionType,"onUpdate:modelValue":s[2]||(s[2]=l=>a.transactionType=l),placeholder:"交易类型",size:"large"},{default:u(()=>[o(r,{label:"全部",value:""}),o(r,{label:"消费",value:"expense"}),o(r,{label:"充值",value:"recharge"})]),_:1},8,["modelValue"])]),e("div",J,[(_(!0),v(V,null,S(a.groupedTransactions,(l,y)=>(_(),v("div",{key:y,class:"date-group"},[e("div",K,[e("span",O,i(a.formatDate(y)),1),e("span",Q,"支出 ¥"+i(a.getDailyTotal(l)),1)]),(_(!0),v(V,null,S(l,t=>(_(),z(x,{key:t.id,class:"transaction-item"},{default:u(()=>[e("div",W,[e("div",X,[e("div",Y,i(t.title),1),e("div",Z,i(a.formatTime(t.time)),1)]),e("div",$,[e("div",{class:A(["amount",t.type])},i(t.type==="expense"?"-":"+")+"¥"+i(t.amount),3),e("div",tt,i(a.getStatusText(t.status)),1)])])]),_:2},1024))),128))]))),128))]),a.hasMore?(_(),v("div",et,[o(g,{loading:a.loading,onClick:a.loadMore},{default:u(()=>s[7]||(s[7]=[C("加载更多")])),_:1},8,["loading","onClick"])])):N("",!0)])}const nt=F(R,[["render",st],["__scopeId","data-v-6949a5dc"]]);export{nt as default};
