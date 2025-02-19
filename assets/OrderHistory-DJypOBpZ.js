import{b2 as Y,W as Z,g as c,aC as $,o as ee,h as k,i as o,d as l,w as r,aE as te,c as S,e as A,F as H,j as J,E as v,aR as ae,f as i,bi as ne,b as g,l as p,t as _,G as oe}from"./vendor-3y-Tr9ie.js";import"./request-0UL0hoVQ.js";import{_ as le}from"./index-Cpc2chc0.js";const se={name:"OrderHistory",components:{ArrowLeft:Y,Plus:Z},setup(){const x=oe(),e=c(!1),D=c("all"),a=c(null),h=c(1),T=c(10),V=c(0),y=c([]),u=c(!1),f=c(null),O=c(null),b=c(!1),w=c({rating:5,content:"",images:[]}),N={rating:[{required:!0,message:"请给出评分",trigger:"change"}],content:[{required:!0,message:"请填写评价内容",trigger:"blur"},{min:10,max:500,message:"评价内容需在10-500字之间",trigger:"blur"}]},z=[{text:"最近一周",value:()=>{const t=new Date,s=new Date;return s.setTime(s.getTime()-3600*1e3*24*7),[s,t]}},{text:"最近一个月",value:()=>{const t=new Date,s=new Date;return s.setTime(s.getTime()-3600*1e3*24*30),[s,t]}},{text:"最近三个月",value:()=>{const t=new Date,s=new Date;return s.setTime(s.getTime()-3600*1e3*24*90),[s,t]}}],j=$(()=>{let t=[...y.value];if(D.value!=="all"&&(t=t.filter(s=>s.status===D.value)),a.value){const[s,R]=a.value;t=t.filter(X=>{const G=new Date(X.createTime);return G>=s&&G<=R})}return t}),m=async()=>{e.value=!0;try{y.value=[{id:1,orderNumber:"ORD202403150001",createTime:"2024-03-15 12:30:00",status:"completed",totalAmount:45,canteenName:"第一食堂",stallName:"川湘小炒",dishes:[{id:1,name:"宫保鸡丁",price:15,quantity:2,image_url:"https://example.com/dish1.jpg"},{id:2,name:"麻婆豆腐",price:15,quantity:1,image_url:"https://example.com/dish2.jpg"}]},{id:2,orderNumber:"ORD202403150002",createTime:"2024-03-15 18:45:00",status:"cancelled",totalAmount:32,canteenName:"第二食堂",stallName:"粤式炖汤",dishes:[{id:3,name:"青椒肉丝",price:16,quantity:2,image_url:"https://example.com/dish3.jpg"}]}],V.value=2}catch(t){console.error("获取订单列表失败:",t),v.error("获取订单列表失败")}finally{e.value=!1}},F=t=>({completed:"已完成",cancelled:"已取消"})[t]||t,L=t=>({completed:"success",cancelled:"info"})[t]||"",C=()=>{h.value=1,m()},B=()=>{h.value=1,m()},M=t=>{h.value=t,m()},U=t=>{T.value=t,h.value=1,m()},P=t=>{x.push(`/student/orders/${t.id}`)},E=t=>{x.push(`/student/dishes/${t}`)},q=async t=>{try{await ae.confirm("确定要取消这个订单吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}),v.success("订单已取消"),m()}catch(s){s!=="cancel"&&(console.error("取消订单失败:",s),v.error("取消订单失败"))}},n=t=>{O.value=t,w.value={rating:5,content:"",images:[]},u.value=!0},d=t=>{if(!(t.size/1024/1024<5))return v.warning("图片大小不能超过 5MB!"),!1;if(!["image/jpeg","image/jpg","image/png"].includes(t.raw.type))return v.warning("只能上传 JPG/PNG 格式的图片!"),!1;t.url=URL.createObjectURL(t.raw),w.value.images.push(t)},I=()=>{v.warning("最多只能上传4张图片")},W=t=>{const s=w.value.images.findIndex(R=>R.uid===t.uid);s>-1&&(URL.revokeObjectURL(t.url),w.value.images.splice(s,1))},K=async()=>{if(f.value)try{await f.value.validate(),b.value=!0,await new Promise(t=>setTimeout(t,1e3)),v.success("评价提交成功"),u.value=!1,m()}catch(t){t!=="cancel"&&(console.error("提交评价失败:",t),v.error("提交评价失败"))}finally{b.value=!1}},Q=()=>{x.back()};return ee(()=>{m()}),{loading:e,filterStatus:D,dateRange:a,dateShortcuts:z,currentPage:h,pageSize:T,total:V,filteredOrders:j,reviewDialogVisible:u,reviewForm:w,reviewFormRef:f,reviewRules:N,handleFilterChange:C,handleDateChange:B,handleCurrentChange:M,handleSizeChange:U,getStatusLabel:F,getStatusType:L,viewOrderDetail:P,viewDishDetail:E,cancelOrder:q,writeReview:n,handleImageChange:d,handleImageRemove:W,submitReview:K,goBack:Q,submitting:b,handleExceed:I}}},re={class:"order-history"},ie={class:"back-button"},de={class:"back-content"},ce={class:"filter-section"},ue={class:"orders-list"},me={class:"order-header"},ge={class:"order-info"},pe={class:"order-number"},_e={class:"order-time"},ve={class:"order-location"},fe={class:"canteen-name"},we={class:"stall-name"},he={class:"order-content"},ye={class:"dish-list"},be={class:"dish-info"},Ce={class:"dish-name"},ke={class:"dish-price"},xe={class:"order-footer"},De={class:"order-total"},Ve={class:"total-amount"},Re={class:"order-actions"},Se={class:"pagination-container"},Te=["src"],Oe={class:"dialog-footer"};function Ne(x,e,D,a,h,T){const V=i("ArrowLeft"),y=i("el-icon"),u=i("el-button"),f=i("el-radio-button"),O=i("el-radio-group"),b=i("el-date-picker"),w=i("el-empty"),N=i("el-divider"),z=i("el-tag"),j=i("el-image"),m=i("el-card"),F=i("el-pagination"),L=i("el-rate"),C=i("el-form-item"),B=i("el-input"),M=i("Plus"),U=i("el-upload"),P=i("el-form"),E=i("el-dialog"),q=ne("loading");return g(),k("div",re,[o("div",ie,[l(u,{onClick:a.goBack,class:"custom-back-btn",link:""},{default:r(()=>[o("div",de,[l(y,{class:"back-icon"},{default:r(()=>[l(V)]),_:1}),e[8]||(e[8]=o("span",{class:"back-text"},"返回上一页",-1))])]),_:1},8,["onClick"])]),o("div",ce,[l(O,{modelValue:a.filterStatus,"onUpdate:modelValue":e[0]||(e[0]=n=>a.filterStatus=n),onChange:a.handleFilterChange},{default:r(()=>[l(f,{value:"all"},{default:r(()=>e[9]||(e[9]=[p("全部订单")])),_:1}),l(f,{value:"completed"},{default:r(()=>e[10]||(e[10]=[p("已完成")])),_:1}),l(f,{value:"cancelled"},{default:r(()=>e[11]||(e[11]=[p("已取消")])),_:1})]),_:1},8,["modelValue","onChange"]),l(b,{modelValue:a.dateRange,"onUpdate:modelValue":e[1]||(e[1]=n=>a.dateRange=n),type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",onChange:a.handleDateChange,shortcuts:a.dateShortcuts,class:"date-picker"},null,8,["modelValue","onChange","shortcuts"])]),te((g(),k("div",ue,[a.filteredOrders.length?A("",!0):(g(),S(w,{key:0,description:"暂无订单记录"})),(g(!0),k(H,null,J(a.filteredOrders,n=>(g(),S(m,{key:n.id,class:"order-card"},{default:r(()=>[o("div",me,[o("div",ge,[o("span",pe,"订单号："+_(n.orderNumber),1),o("span",_e,_(n.createTime),1)]),o("div",ve,[o("span",fe,_(n.canteenName),1),l(N,{direction:"vertical"}),o("span",we,_(n.stallName),1)]),l(z,{type:a.getStatusType(n.status),class:"status-tag"},{default:r(()=>[p(_(a.getStatusLabel(n.status)),1)]),_:2},1032,["type"])]),o("div",he,[o("div",ye,[(g(!0),k(H,null,J(n.dishes,d=>(g(),k("div",{key:d.id,class:"dish-item"},[l(j,{src:d.image_url,alt:d.name,class:"dish-image",onClick:I=>a.viewDishDetail(d.id)},{error:r(()=>e[12]||(e[12]=[o("div",{class:"image-placeholder"},"暂无图片",-1)])),_:2},1032,["src","alt","onClick"]),o("div",be,[o("h4",Ce,_(d.name),1),o("p",ke,[o("span",null,"¥"+_(d.price),1),e[13]||(e[13]=o("span",null,"×",-1)),o("span",null,_(d.quantity),1)])])]))),128))]),o("div",xe,[o("div",De,[e[14]||(e[14]=o("span",{class:"total-label"},"总计：",-1)),o("span",Ve,"¥"+_(n.totalAmount),1)]),o("div",Re,[n.status==="completed"?(g(),S(u,{key:0,type:"primary",link:"",onClick:d=>a.writeReview(n)},{default:r(()=>e[15]||(e[15]=[p(" 写评价 ")])),_:2},1032,["onClick"])):A("",!0),n.status==="pending"?(g(),S(u,{key:1,type:"danger",link:"",onClick:d=>a.cancelOrder(n)},{default:r(()=>e[16]||(e[16]=[p(" 取消订单 ")])),_:2},1032,["onClick"])):A("",!0),l(u,{type:"primary",link:"",onClick:d=>a.viewOrderDetail(n)},{default:r(()=>e[17]||(e[17]=[p(" 查看详情 ")])),_:2},1032,["onClick"])])])])]),_:2},1024))),128))])),[[q,a.loading]]),o("div",Se,[l(F,{"current-page":a.currentPage,"onUpdate:currentPage":e[2]||(e[2]=n=>a.currentPage=n),"page-size":a.pageSize,"onUpdate:pageSize":e[3]||(e[3]=n=>a.pageSize=n),total:a.total,"page-sizes":[10,20,30,50],layout:"total, sizes, prev, pager, next, jumper",onSizeChange:a.handleSizeChange,onCurrentChange:a.handleCurrentChange},null,8,["current-page","page-size","total","onSizeChange","onCurrentChange"])]),l(E,{modelValue:a.reviewDialogVisible,"onUpdate:modelValue":e[7]||(e[7]=n=>a.reviewDialogVisible=n),title:"写评价",width:"90%",class:"review-dialog"},{footer:r(()=>[o("div",Oe,[l(u,{onClick:e[6]||(e[6]=n=>a.reviewDialogVisible=!1)},{default:r(()=>e[20]||(e[20]=[p("取消")])),_:1}),l(u,{type:"primary",onClick:a.submitReview,loading:a.submitting},{default:r(()=>e[21]||(e[21]=[p(" 提交评价 ")])),_:1},8,["onClick","loading"])])]),default:r(()=>[l(P,{model:a.reviewForm,rules:a.reviewRules,ref:"reviewFormRef","label-position":"top"},{default:r(()=>[l(C,{label:"总体评分",prop:"rating"},{default:r(()=>[l(L,{modelValue:a.reviewForm.rating,"onUpdate:modelValue":e[4]||(e[4]=n=>a.reviewForm.rating=n),"show-score":"","score-template":"{value}分"},null,8,["modelValue"])]),_:1}),l(C,{label:"评价内容",prop:"content"},{default:r(()=>[l(B,{type:"textarea",modelValue:a.reviewForm.content,"onUpdate:modelValue":e[5]||(e[5]=n=>a.reviewForm.content=n),rows:4,maxlength:500,"show-word-limit":"",placeholder:"请分享您的用餐体验，例如菜品口感、服务态度等..."},null,8,["modelValue"])]),_:1}),l(C,{label:"上传图片（最多4张）"},{default:r(()=>[l(U,{action:"#","list-type":"picture-card","auto-upload":!1,"on-change":a.handleImageChange,"on-remove":a.handleImageRemove,limit:4,"on-exceed":a.handleExceed,accept:".jpg,.jpeg,.png"},{default:r(()=>[l(y,null,{default:r(()=>[l(M)]),_:1}),e[18]||(e[18]=o("div",{class:"upload-text"},"点击上传",-1))]),file:r(({file:n})=>[o("img",{class:"upload-preview",src:n.url,alt:"预览图"},null,8,Te)]),_:1},8,["on-change","on-remove","on-exceed"]),e[19]||(e[19]=o("div",{class:"upload-tip"},"支持 jpg/png 格式，单张不超过 5MB",-1))]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue"])])}const Le=le(se,[["render",Ne],["__scopeId","data-v-e0d57bf5"]]);export{Le as default};
