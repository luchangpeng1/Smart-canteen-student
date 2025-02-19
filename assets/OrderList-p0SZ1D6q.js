import{aI as Y,aJ as Z,aK as $,aL as ee,at as te,as as se,aM as oe,aN as ne,aO as ae,aP as ie,aQ as le,g as h,o as re,C as ce,aC as j,E as f,h as g,i as t,t as c,d as o,w as l,e as w,aR as de,f as r,b as m,l as _,c as I,F as G,j as W,k as X,G as ue}from"./vendor-3y-Tr9ie.js";import{_ as me}from"./index-Cpc2chc0.js";const pe={name:"OrderList",components:{Calendar:Y,Shop:Z,TakeawayBox:$,Check:ee,Refresh:te,Timer:se,ArrowRight:oe,Bell:ne,QrcodeVue:ae,Ticket:ie,Tools:le},setup(){const q=ue(),s=h("ongoing"),v=h([]),a=[{id:1,canteenName:"第一食堂",windowName:"特色炒菜",status:"preparing",dishes:[{id:1,name:"宫保鸡丁",quantity:1,price:15},{id:2,name:"青椒肉丝",quantity:1,price:12}],totalPrice:27,createTime:"2024-01-20 12:30:00",pickupLocation:"一楼3号窗口",estimatedTime:"5"},{id:2,canteenName:"第二食堂",windowName:"面食档口",status:"preparing",dishes:[{id:3,name:"牛肉面",quantity:1,price:18},{id:4,name:"煎蛋",quantity:1,price:2}],totalPrice:20,createTime:"2024-01-20 12:35:00",pickupLocation:"一楼1号窗口",estimatedTime:"10"},{id:3,canteenName:"第一食堂",windowName:"盖浇饭窗口",status:"ready",dishes:[{id:5,name:"红烧排骨饭",quantity:1,price:22}],totalPrice:22,createTime:"2024-01-20 12:25:00",pickupLocation:"一楼2号窗口",pickupCode:"B789"}],Q=e=>({ordered:"info",preparing:"primary",ready:"success",completed:"info",cancelled:"danger"})[e]||"info",K=e=>({ordered:"已接单",preparing:"制作中",ready:"待取餐",completed:"已完成",cancelled:"已取消"})[e]||"未知状态",B=()=>{q.push("/student/order-history")},P=async()=>{try{"Notification"in window&&await Notification.requestPermission()==="denied"&&f({message:"为了及时收到取餐通知，建议您允许通知权限",type:"warning",duration:5e3,showClose:!0})}catch(e){console.warn("通知权限请求失败:",e)}};re(()=>{v.value=a.filter(e=>["preparing","ready"].includes(e.status)),setInterval(S,3e4),document.addEventListener("test-notification",O),document.addEventListener("test-vibration",N),localStorage.getItem("notificationRequested")!=="true"&&(P(),localStorage.setItem("notificationRequested","true"))}),ce(()=>{clearInterval(S),document.removeEventListener("test-notification",O),document.removeEventListener("test-vibration",N)});const d=e=>({ordered:1,preparing:2,ready:3,completed:3})[e]||0,p=h("all"),b=h(""),C=h(null),D=j(()=>{let e=v.value;if(p.value!=="all"&&(e=e.filter(n=>n.status===p.value)),b.value){const n=b.value.toLowerCase();e=e.filter(u=>u.windowName.toLowerCase().includes(n)||u.dishes.some(y=>y.name.toLowerCase().includes(n)))}return e}),T=j(()=>v.value.some(e=>e.status==="ready")),E=async()=>{f.success("订单已更新")},F=()=>{C.value&&C.value.$el.scrollIntoView({behavior:"smooth",block:"center"})},M=()=>{q.push("/student/home")},U=e=>{if(!e)return"";const n={orderId:e.id,userId:localStorage.getItem("userId"),windowId:e.windowId,timestamp:new Date(e.createTime).getTime(),dishes:e.dishes.map(y=>({id:y.id,name:y.name,quantity:y.quantity}))},u=`${n.orderId}-${n.timestamp}-${n.userId}`;return n.sign=u,JSON.stringify(n)},k=h(!1),x=h(null),z=e=>{x.value=e,k.value=!0},V=async e=>{try{await new Promise(u=>setTimeout(u,1e3)),f.success("订单已取消");const n=v.value.findIndex(u=>u.id===e.id);n!==-1&&(v.value[n].status="cancelled",v.value.splice(n,1))}catch{f.error("取消订单失败，请重试")}},L=e=>{e.status==="ready"&&(R(e),A(),f({message:"您的餐品已准备就绪，请及时取餐！",type:"success",duration:5e3,showClose:!0,customClass:"ready-notification"}))},R=e=>{"Notification"in window&&Notification.requestPermission().then(n=>{n==="granted"&&new Notification("餐品已准备就绪",{body:`您在${e.windowName}的餐品已准备完成，请及时取餐`,icon:"/favicon.ico",tag:"food-ready",renotify:!0})})},A=()=>{"vibrate"in navigator&&navigator.vibrate([200,100,200])},S=()=>{const e=v.value.filter(n=>n.status==="preparing");if(e.length>0){const n=e[Math.floor(Math.random()*e.length)];n.status="ready",L(n)}},H=h(!1),O=()=>{"Notification"in window&&Notification.requestPermission().then(e=>{e==="granted"?f.success("测试：通知权限已获取"):f.warning("测试：请允许通知权限以接收提醒")})},N=()=>{"vibrate"in navigator?(navigator.vibrate([200,100,200]),f.success("测试：设备震动测试")):f.warning("测试：当前设备不支持震动功能")};return{activeTab:s,ongoingOrders:v,getStatusType:Q,getStatusText:K,goToHistory:B,getProgressStep:d,orderFilter:p,searchKeyword:b,filteredOngoingOrders:D,hasReadyOrder:T,refreshOrders:E,scrollToReadyOrder:F,goToHome:M,readyOrderRef:C,generateQRValue:U,qrDialogVisible:k,currentOrder:x,showQRCode:z,cancelOrder:V,testFeatures:()=>{const e=()=>{const n=v.value.find(u=>u.status==="preparing");n&&(n.status="ready",L(n),f.success("测试：订单状态已更新为待取餐"))};de.confirm(`请选择要测试的功能：

1. 测试订单状态变更和提醒
2. 测试通知权限
3. 测试设备震动
`,"功能测试",{confirmButtonText:"测试状态变更",cancelButtonText:"取消",distinguishCancelAndClose:!0,showClose:!0,closeOnClickModal:!1,customClass:"test-dialog"}).then(()=>{e()}).catch(n=>{}),f({message:"点击测试其他功能",type:"info",duration:5e3,showClose:!0,customClass:"test-message",dangerouslyUseHTMLString:!0,message:`
          <div class="test-buttons">
            <button onclick="document.dispatchEvent(new CustomEvent('test-notification'))">
              测试通知
            </button>
            <button onclick="document.dispatchEvent(new CustomEvent('test-vibration'))">
              测试震动
            </button>
          </div>
        `})},isDevelopment:H,testNotification:O,testVibration:N,viewOrderDetail:e=>{q.push({path:`/student/current-orders/${e.id}`,query:{status:e.status,createTime:e.createTime,canteenName:e.canteenName,windowName:e.windowName,pickupLocation:e.pickupLocation,totalAmount:e.totalAmount,dishes:JSON.stringify(e.dishes)}})}}}},_e={class:"order-list-container"},fe={class:"order-list"},ve={class:"page-header"},ge={class:"header-left"},ye={class:"order-stats"},he={class:"stat-card"},we={class:"stat-item"},ke={class:"header-actions"},be={key:0,class:"order-alert"},Ce={class:"alert-content"},Te={class:"filter-bar"},Oe={class:"order-grid"},Ne={class:"order-header"},qe={class:"window-info"},xe={class:"location-info"},Ve={class:"canteen-name"},Le={class:"window-name"},Re={class:"order-time"},Se={class:"order-content"},Ie={class:"dish-list"},Be={class:"dish-image"},Pe=["src","alt"],De={class:"dish-content"},Ee={class:"dish-info"},Fe={class:"dish-name-wrapper"},Me={class:"dish-name"},Ue={class:"dish-price-wrapper"},ze={class:"dish-quantity"},Ae={class:"dish-price"},He={key:0,class:"order-progress"},Qe={class:"order-footer"},Ke={class:"price-info"},Je={class:"total-price"},je={class:"actions"},Ge={key:0,class:"waiting-time"},We={key:1,class:"pickup-info"},Xe={class:"pickup-header"},Ye={class:"pickup-location"},Ze={class:"qr-dialog-content"},$e={class:"qr-header"},et={class:"window-info"},tt={class:"canteen-name"},st={class:"window-name"},ot={class:"pickup-location"},nt={class:"order-info"},at={class:"order-time"},it={class:"order-amount"},lt={class:"qr-code-wrapper"},rt={class:"qr-footer"},ct={class:"qr-tip"},dt={class:"validity-info"},ut={key:1,class:"test-button"};function mt(q,s,v,a,Q,K){const B=r("el-input"),P=r("Refresh"),d=r("el-icon"),p=r("el-button"),b=r("Calendar"),C=r("ArrowRight"),D=r("el-alert"),T=r("el-radio-button"),E=r("el-radio-group"),F=r("TakeawayBox"),M=r("el-empty"),U=r("Shop"),k=r("el-step"),x=r("el-steps"),z=r("el-popconfirm"),V=r("Timer"),L=r("Bell"),R=r("Ticket"),A=r("el-card"),S=r("el-tab-pane"),H=r("el-tabs"),O=r("qrcode-vue"),N=r("el-dialog"),J=r("Tools");return m(),g("div",_e,[t("div",fe,[t("div",ve,[t("div",ge,[s[6]||(s[6]=t("h2",{class:"page-title"},"我的订单",-1)),t("div",ye,[t("div",he,[t("span",we,[t("strong",null,c(a.ongoingOrders.length),1),s[4]||(s[4]=t("span",null,"进行中",-1)),s[5]||(s[5]=t("small",null,"预计15分钟内可取餐",-1))])])])]),t("div",ke,[o(B,{modelValue:a.searchKeyword,"onUpdate:modelValue":s[0]||(s[0]=i=>a.searchKeyword=i),placeholder:"搜索订单...","prefix-icon":"Search",clearable:"",class:"search-input"},null,8,["modelValue"]),o(p,{class:"refresh-btn",onClick:a.refreshOrders},{default:l(()=>[o(d,null,{default:l(()=>[o(P)]),_:1}),s[7]||(s[7]=_(" 刷新 "))]),_:1},8,["onClick"]),o(p,{type:"primary",class:"history-btn",onClick:a.goToHistory},{default:l(()=>[o(d,null,{default:l(()=>[o(b)]),_:1}),s[8]||(s[8]=_(" 历史订单 "))]),_:1},8,["onClick"])])]),a.hasReadyOrder?(m(),g("div",be,[o(D,{type:"success","show-icon":"",closable:!1},{title:l(()=>[t("span",Ce,[s[10]||(s[10]=_(" 您有订单可以取餐啦！请尽快前往取餐点取餐 ")),o(p,{type:"success",link:"",onClick:a.scrollToReadyOrder},{default:l(()=>[s[9]||(s[9]=_(" 查看订单 ")),o(d,null,{default:l(()=>[o(C)]),_:1})]),_:1},8,["onClick"])])]),_:1})])):w("",!0),o(H,{modelValue:a.activeTab,"onUpdate:modelValue":s[2]||(s[2]=i=>a.activeTab=i),class:"custom-tabs"},{default:l(()=>[o(S,{label:"进行中",name:"ongoing"},{default:l(()=>[t("div",Te,[o(E,{modelValue:a.orderFilter,"onUpdate:modelValue":s[1]||(s[1]=i=>a.orderFilter=i),size:"small"},{default:l(()=>[o(T,{value:"all"},{default:l(()=>s[11]||(s[11]=[_("全部")])),_:1}),o(T,{value:"preparing"},{default:l(()=>s[12]||(s[12]=[_("制作中")])),_:1}),o(T,{value:"ready"},{default:l(()=>s[13]||(s[13]=[_("待取餐")])),_:1})]),_:1},8,["modelValue"])]),a.filteredOngoingOrders.length===0?(m(),I(M,{key:0,description:"暂无进行中的订单","image-size":120},{image:l(()=>[o(d,{class:"empty-icon"},{default:l(()=>[o(F)]),_:1})]),description:l(()=>[s[15]||(s[15]=t("p",{class:"empty-text"},"暂无进行中的订单",-1)),o(p,{type:"primary",onClick:a.goToHome},{default:l(()=>s[14]||(s[14]=[_("去点餐")])),_:1},8,["onClick"])]),_:1})):w("",!0),t("div",Oe,[(m(!0),g(G,null,W(a.filteredOngoingOrders,i=>(m(),I(A,{key:i.id,class:X(["order-card",{"ready-status":i.status==="ready"}]),ref_for:!0,ref:i.status==="ready"?"readyOrder":null},{default:l(()=>[t("div",{class:X(["status-badge",i.status])},c(a.getStatusText(i.status)),3),t("div",Ne,[t("div",qe,[o(d,null,{default:l(()=>[o(U)]),_:1}),t("div",xe,[t("span",Ve,c(i.canteenName),1),t("span",Le,c(i.windowName),1)])]),t("span",Re,c(i.createTime),1)]),t("div",Se,[t("div",Ie,[(m(!0),g(G,null,W(i.dishes,e=>(m(),g("div",{class:"dish-item",key:e.id},[t("div",Be,[t("img",{src:e.image_url,alt:e.name},null,8,Pe)]),t("div",De,[t("div",Ee,[t("div",Fe,[t("span",Me,c(e.name),1)]),t("div",Ue,[t("span",ze,"x"+c(e.quantity),1),t("span",Ae,"¥"+c(e.price.toFixed(2)),1)])])])]))),128))]),i.status!=="cancelled"?(m(),g("div",He,[o(x,{active:a.getProgressStep(i.status),"finish-status":"success"},{default:l(()=>[o(k,{title:"已接单"}),o(k,{title:"制作中"}),o(k,{title:"待取餐"})]),_:2},1032,["active"])])):w("",!0),t("div",Qe,[t("div",Ke,[s[16]||(s[16]=t("span",{class:"total-label"},"合计",-1)),t("span",Je,"¥"+c(i.totalPrice.toFixed(2)),1)]),t("div",je,[i.status==="ordered"?(m(),I(z,{key:0,title:"确定要取消订单吗？","confirm-button-text":"确定","cancel-button-text":"再想想",onConfirm:e=>a.cancelOrder(i)},{reference:l(()=>[o(p,{type:"danger",plain:"",size:"small"},{default:l(()=>s[17]||(s[17]=[_(" 取消订单 ")])),_:1})]),_:2},1032,["onConfirm"])):w("",!0),o(p,{type:"primary",link:"",size:"small",onClick:e=>a.viewOrderDetail(i)},{default:l(()=>s[18]||(s[18]=[_(" 查看详情 ")])),_:2},1032,["onClick"])])])]),i.status==="preparing"?(m(),g("div",Ge,[o(d,null,{default:l(()=>[o(V)]),_:1}),_(" 预计等待时间："+c(i.estimatedTime||"15")+"分钟 ",1)])):w("",!0),i.status==="ready"?(m(),g("div",We,[t("div",Xe,[o(d,null,{default:l(()=>[o(L)]),_:1}),s[19]||(s[19]=t("span",null,"您的餐品已准备就绪",-1))]),t("div",Ye," 取餐点："+c(i.pickupLocation||"一楼取餐处"),1),o(p,{type:"success",class:"show-qr-btn",onClick:e=>a.showQRCode(i)},{default:l(()=>[o(d,null,{default:l(()=>[o(R)]),_:1}),s[20]||(s[20]=_(" 显示取餐码 "))]),_:2},1032,["onClick"]),s[21]||(s[21]=t("div",{class:"pickup-tips"},[t("p",null,"请在15分钟内完成取餐"),t("p",null,"为保证餐品品质，请尽快取餐")],-1))])):w("",!0)]),_:2},1032,["class"]))),128))])]),_:1})]),_:1},8,["modelValue"]),o(N,{modelValue:a.qrDialogVisible,"onUpdate:modelValue":s[3]||(s[3]=i=>a.qrDialogVisible=i),title:"取餐码",width:"300px",center:"",class:"qr-dialog","show-close":!0,"close-on-click-modal":!1,modal:!1},{default:l(()=>{var i,e,n,u,y;return[t("div",Ze,[t("div",$e,[t("div",et,[t("span",tt,c((i=a.currentOrder)==null?void 0:i.canteenName),1),t("span",st,c((e=a.currentOrder)==null?void 0:e.windowName),1),t("span",ot,c((n=a.currentOrder)==null?void 0:n.pickupLocation),1)]),t("div",nt,[t("span",at,c((u=a.currentOrder)==null?void 0:u.createTime),1),t("span",it,"¥"+c((y=a.currentOrder)==null?void 0:y.totalPrice.toFixed(2)),1)])]),t("div",lt,[a.currentOrder?(m(),I(O,{key:0,value:a.generateQRValue(a.currentOrder),size:200,level:"H",class:"pickup-qr","render-as":"svg"},null,8,["value"])):w("",!0),s[22]||(s[22]=t("div",{class:"qr-border"},null,-1))]),t("div",rt,[t("div",ct,[o(d,null,{default:l(()=>[o(R)]),_:1}),s[23]||(s[23]=t("span",null,"请向取餐人员出示此码",-1))]),t("div",dt,[o(d,null,{default:l(()=>[o(V)]),_:1}),s[24]||(s[24]=t("span",null,"有效期15分钟",-1))])])])]}),_:1},8,["modelValue"]),a.isDevelopment?(m(),g("div",ut,[o(p,{type:"warning",circle:"",onClick:a.testFeatures,class:"float-button test-float-button"},{default:l(()=>[o(d,null,{default:l(()=>[o(J)]),_:1})]),_:1},8,["onClick"])])):w("",!0)])])}const ft=me(pe,[["render",mt],["__scopeId","data-v-51479c47"]]);export{ft as default};
