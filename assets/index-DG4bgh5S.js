const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-CackSNiH.js","assets/vendor-CyP8QNv9.js","assets/vendor-C6q9dLkW.css","assets/Login-CVT9rrHz.css","assets/Layout-CmKyymS_.js","assets/Layout-9nNrgtTE.css","assets/DishList-BSlH_DUK.js","assets/request-DTHdL8ze.js","assets/DishList-CMn488Jo.css","assets/OrderList-C1uxmxLh.js","assets/OrderList-CP1Xdebr.css","assets/UserProfile-rYtRR76y.js","assets/UserProfile-BhP9JQgn.css","assets/TransactionList-Cm1JWbOc.js","assets/TransactionList-T11630z4.css","assets/FavoriteList-RWgA65Y2.js","assets/BackHeader-zRZW6SrF.js","assets/BackHeader-qV3Es8Eq.css","assets/FavoriteList-ChP5qNaO.css","assets/ReviewList-BEwGwTwn.js","assets/ReviewList-zdz5AUww.css","assets/NotificationSettings-DaVbvg1g.js","assets/NotificationSettings-DidV7U0o.css","assets/Preferences--wm7m52g.js","assets/Preferences-Dlypzyp7.css","assets/FeedbackList-C4Npsjmv.js","assets/FeedbackList-CRW2tU85.css","assets/WalletPage-CpdoYIOL.js","assets/WalletPage-D3Q2Wqf4.css","assets/RecommendationSquare-sqyiaPYl.js","assets/RecommendationSquare-YtQfW3zk.css","assets/DishDetail-BP7MfzyH.js","assets/DishDetail-D3cwZPp6.css","assets/OrderHistory-DnYHo7Us.js","assets/OrderHistory-Bs7hUmhr.css","assets/OrderDetail-Coi6XkN9.js","assets/OrderDetail-C8gbPNQc.css","assets/CartPage-DcDZ4nBS.js","assets/CartPage-DTiWPkRo.css","assets/PointsHistory-C6uY8EL9.js","assets/PointsHistory-DYf7KVdg.css","assets/PointsRules-CE6h-wkG.js","assets/PointsRules-CWVTiT2r.css","assets/PointsExchange-R3ED2gjA.js","assets/PointsExchange-CJ2JOrVs.css","assets/CurrentOrderDetail-D3kNfVIb.js","assets/CurrentOrderDetail-DEDagRr1.css"])))=>i.map(i=>d[i]);
import{o as F,S as O,A as P,a as C,b as c,c as v,w as h,d as E,K as U,r as D,e as R,T as b,n as B,f as A,g,h as u,i as d,F as w,j as L,k,t as f,l as H,u as x,m as W,p as q,q as z,_ as a,E as y,s as j,v as K,x as M,y as J,z as $,B as Y}from"./vendor-CyP8QNv9.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const Z={__name:"App",setup(e){F(async()=>{if(window.Capacitor&&window.Capacitor.isNative){try{await O.setBackgroundColor({color:"#FFFFFF"}),await O.setStyle({style:"dark"})}catch(s){console.warn("Status bar not available",s)}P.addListener("backButton",({canGoBack:s})=>{s?window.history.back():P.exitApp()}),await C.hide()}});const t=o=>{o._scrollPosition=window.scrollY},n=o=>{o._scrollPosition&&B(()=>{window.scrollTo(0,o._scrollPosition)})},r=()=>{window.scrollTo(0,0)};return(o,s)=>{const l=A("router-view");return c(),v(l,null,{default:h(({Component:p})=>[E(b,{name:"fade",mode:"out-in",onBeforeLeave:t,onEnter:n,onAfterEnter:r},{default:h(()=>[(c(),v(U,null,[o.$route.meta.keepAlive?(c(),v(D(p),{key:0})):R("",!0)],1024))]),_:2},1024),E(b,{name:"fade",mode:"out-in"},{default:h(()=>[o.$route.meta.keepAlive?R("",!0):(c(),v(D(p),{key:0}))]),_:2},1024)]),_:1})}}},G=(e,t)=>{const n=e.__vccOpts||e;for(const[r,o]of t)n[r]=o;return n},Q={name:"FloorDetail",setup(){const e=x(),t=W("getFloorWindows"),n=e.params.canteen,r=e.params.floor,o=g(t(n,r)),s=g(null),l=g([{id:1,name:"宫保鸡丁",price:15,image:"https://example.com/dish1.jpg"},{id:2,name:"回锅肉",price:16,image:"https://example.com/dish2.jpg"},{id:3,name:"青椒肉丝",price:14,image:"https://example.com/dish3.jpg"}]);return{windows:o,activeWindow:s,selectWindow:i=>{s.value=i},testDishes:l}}},X={class:"floor-detail"},ee={class:"window-list"},te=["onClick"],oe={class:"window-info"},re={class:"window-name"},ne={class:"window-hours"},se={class:"dishes-list"},ae={key:0},ie={class:"dish-info"},ce={class:"dish-name"},le={class:"dish-price"},de={key:1,class:"window-closed"},ue={key:1,class:"no-window-selected"};function _e(e,t,n,r,o,s){const l=A("el-image"),p=A("el-button");return c(),u("div",X,[d("div",ee,[(c(!0),u(w,null,L(r.windows,i=>{var T;return c(),u("div",{key:i.id,class:k(["window-item",{active:((T=r.activeWindow)==null?void 0:T.id)===i.id}]),onClick:ge=>r.selectWindow(i)},[d("div",oe,[d("div",re,f(i.name),1),d("div",{class:k(["window-status",{closed:!i.status}])},f(i.status?"营业中":"已打烊"),3),d("div",ne,f(i.operatingHours),1)])],10,te)}),128))]),d("div",se,[r.activeWindow?(c(),u(w,{key:0},[r.activeWindow.status?(c(),u("div",ae,[(c(!0),u(w,null,L(r.testDishes,i=>(c(),u("div",{key:i.id,class:"dish-item"},[E(l,{src:i.image,class:"dish-image",fit:"cover"},{error:h(()=>t[0]||(t[0]=[d("div",{class:"image-placeholder"},"暂无图片",-1)])),_:2},1032,["src"]),d("div",ie,[d("div",ce,f(i.name),1),d("div",le,"¥"+f(i.price),1),E(p,{type:"primary",size:"small",class:"add-button"},{default:h(()=>t[1]||(t[1]=[H(" 加入购物车 ")])),_:1})])]))),128))])):(c(),u("div",de," 该窗口已打烊，请选择其他窗口 "))],64)):(c(),u("div",ue," 请选择左侧窗口查看菜品 "))])])}const me=G(Q,[["render",_e],["__scopeId","data-v-47a2d44d"]]),pe=[{path:"/",redirect:"/login",meta:{requiresAuth:!1}},{path:"/login",name:"Login",component:()=>a(()=>import("./Login-CackSNiH.js"),__vite__mapDeps([0,1,2,3])),meta:{requiresAuth:!1,title:"登录"}},{path:"/student",component:()=>a(()=>import("./Layout-CmKyymS_.js"),__vite__mapDeps([4,1,2,5])),meta:{requiresAuth:!0,role:"student",title:"学生端"},children:[{path:"",redirect:"home"},{path:"home",name:"StudentHome",component:()=>a(()=>import("./DishList-BSlH_DUK.js"),__vite__mapDeps([6,1,2,7,8])),meta:{title:"首页",keepAlive:!0}},{path:"orders",name:"StudentOrders",component:()=>a(()=>import("./OrderList-C1uxmxLh.js"),__vite__mapDeps([9,1,2,10])),meta:{title:"订单列表",keepAlive:!0}},{path:"profile",name:"StudentProfile",component:()=>a(()=>import("./UserProfile-rYtRR76y.js"),__vite__mapDeps([11,1,2,12])),meta:{title:"个人中心"}},{path:"transactions",name:"StudentTransactions",component:()=>a(()=>import("./TransactionList-Cm1JWbOc.js"),__vite__mapDeps([13,1,2,14]))},{path:"favorites",name:"StudentFavorites",component:()=>a(()=>import("./FavoriteList-RWgA65Y2.js"),__vite__mapDeps([15,1,2,16,17,18]))},{path:"reviews",name:"StudentReviews",component:()=>a(()=>import("./ReviewList-BEwGwTwn.js"),__vite__mapDeps([19,16,1,2,17,20]))},{path:"notification-settings",name:"StudentNotificationSettings",component:()=>a(()=>import("./NotificationSettings-DaVbvg1g.js"),__vite__mapDeps([21,16,1,2,17,22]))},{path:"preferences",name:"StudentPreferences",component:()=>a(()=>import("./Preferences--wm7m52g.js"),__vite__mapDeps([23,16,1,2,17,24]))},{path:"feedback-list",name:"StudentFeedbacks",component:()=>a(()=>import("./FeedbackList-C4Npsjmv.js"),__vite__mapDeps([25,16,1,2,17,26]))},{path:"wallet",name:"StudentWallet",component:()=>a(()=>import("./WalletPage-CpdoYIOL.js"),__vite__mapDeps([27,1,2,28]))},{path:"recommendations",name:"RecommendationSquare",component:()=>a(()=>import("./RecommendationSquare-sqyiaPYl.js"),__vite__mapDeps([29,1,2,30]))},{path:"/student/canteen/:canteen/floor/:floor",name:"FloorDetail",component:me},{path:"dishes/:id",name:"DishDetail",component:()=>a(()=>import("./DishDetail-BP7MfzyH.js"),__vite__mapDeps([31,1,2,7,32]))},{path:"order-history",name:"OrderHistory",component:()=>a(()=>import("./OrderHistory-DnYHo7Us.js"),__vite__mapDeps([33,1,2,7,34]))},{path:"orders/:id",name:"OrderDetail",component:()=>a(()=>import("./OrderDetail-Coi6XkN9.js"),__vite__mapDeps([35,1,2,7,36]))},{path:"cart",name:"StudentCart",component:()=>a(()=>import("./CartPage-DcDZ4nBS.js"),__vite__mapDeps([37,1,2,38]))},{path:"points-history",name:"PointsHistory",component:()=>a(()=>import("./PointsHistory-C6uY8EL9.js"),__vite__mapDeps([39,1,2,40])),meta:{title:"积分记录",requiresAuth:!0}},{path:"points-rules",component:()=>a(()=>import("./PointsRules-CE6h-wkG.js"),__vite__mapDeps([41,16,1,2,17,42]))},{path:"points-exchange",component:()=>a(()=>import("./PointsExchange-R3ED2gjA.js"),__vite__mapDeps([43,1,2,16,17,44]))},{path:"/student/current-orders/:id",name:"CurrentOrderDetail",component:()=>a(()=>import("./CurrentOrderDetail-D3kNfVIb.js"),__vite__mapDeps([45,1,2,46])),meta:{title:"订单详情",requiresAuth:!0,role:"student"}}]}],I=q({history:z("/Smart-canteen-student/"),routes:pe});I.beforeEach((e,t,n)=>{var l;const r=localStorage.getItem("token"),o=localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):null,s=(l=o==null?void 0:o.verifiedInfo)==null?void 0:l.role;if(e.meta.title&&(document.title=`${e.meta.title} - GUET智慧食堂`),e.path==="/"){n("/login");return}if(e.meta.requiresAuth&&(!r||!o)){n({path:"/login",query:{redirect:e.fullPath}});return}if(e.path==="/login"&&r&&o){s==="student"?n("/student/home"):(localStorage.removeItem("token"),localStorage.removeItem("user"),n("/login"));return}if(e.meta.role&&e.meta.role!==s){n("/login");return}n()});I.onError(e=>{console.error("路由错误:",e)});const _={handle(e,t,n){var r;console.error("Error:",e),console.error("Component:",t),console.error("Info:",n);try{e.name==="NetworkError"?y.error("网络连接失败，请检查网络设置"):((r=e.response)==null?void 0:r.status)===401?(y.error("登录已过期，请重新登录"),I.push("/login")):y.error(e.message||"操作失败，请重试")}catch(o){console.error("Error in error handler:",o)}}},V={userInfo:{name:"张三",studentId:"2021001001",avatar:"",balance:99.5,points:100,favorites:12,feedbacks:0,pointsHistory:[],phone:"13800138000",email:"zhangsan@example.com"}},fe={userInfo:e=>e.userInfo,userBalance:e=>e.userInfo.balance},he={SET_USER_INFO(e,t){e.userInfo=t},UPDATE_USER_INFO(e,t){e.userInfo={...e.userInfo,...t}},UPDATE_BALANCE(e,t){e.userInfo.balance=t},UPDATE_POINTS(e,t){e.userInfo.points=t},ADD_POINTS_HISTORY(e,t){e.userInfo.pointsHistory.unshift(t)},UPDATE_FEEDBACKS_COUNT(e,t){e.userInfo.feedbacks=t}},ve={async updateUserInfo({commit:e},t){try{return await new Promise(n=>setTimeout(n,500)),e("UPDATE_USER_INFO",t),t}catch(n){throw _.handle(n),n}},async fetchUserInfo({commit:e}){try{const t=localStorage.getItem("userInfo"),n=t?JSON.parse(t):V.userInfo;return e("SET_USER_INFO",n),n}catch(t){throw _.handle(t),t}},async updateBalance({commit:e,state:t},n){try{const r=t.userInfo.balance+n;return e("UPDATE_BALANCE",r),r}catch(r){throw _.handle(r),r}},async exchangePoints({commit:e,state:t},{itemId:n,points:r}){try{if(t.userInfo.points<r)throw new Error("积分不足");const o=t.userInfo.points-r;return e("UPDATE_POINTS",o),e("ADD_POINTS_HISTORY",{id:Date.now(),type:"exchange",points:-r,description:"积分兑换",createTime:new Date().toISOString()}),!0}catch(o){throw _.handle(o),o}},async getPointsHistory({state:e}){try{return e.userInfo.pointsHistory||[{id:1,type:"earn",points:2,description:"完成订单",createTime:"2024-03-20T10:00:00Z"},{id:2,type:"earn",points:3,description:"评价订单",createTime:"2024-03-19T15:30:00Z"}]}catch(t){throw _.handle(t),t}},updateFeedbacksCount({commit:e},t){e("UPDATE_FEEDBACKS_COUNT",t)},async logout({commit:e}){try{return localStorage.removeItem("userInfo"),localStorage.removeItem("token"),e("SET_USER_INFO",{name:"",studentId:"",avatar:"",balance:0,points:0,favorites:0,feedbacks:0,pointsHistory:[],phone:"",email:""}),!0}catch(t){throw _.handle(t),t}}},Ee={namespaced:!0,state:V,getters:fe,mutations:he,actions:ve},S=j({strict:!1,modules:{user:Ee},plugins:[e=>{e.subscribeAction({error:(t,n,r)=>{console.error(`Error in action ${t.type}:`,r)}})}]});S.subscribe((e,t)=>{localStorage.setItem("vuex-state",JSON.stringify(t))});const N=localStorage.getItem("vuex-state");N&&S.replaceState(JSON.parse(N));const m=K(Z),Ie=M();for(const[e,t]of Object.entries(J))m.component(e,t);m.use($,{locale:Y});m.config.errorHandler=(e,t,n)=>{var r;(r=e.message)!=null&&r.includes("ResizeObserver")||_.handle(e,t,n)};window.onerror=(e,t,n,r,o)=>(e.includes("ResizeObserver")||_.handle(o||new Error(e)),!0);m.use(S);m.use(Ie);m.use(I);m.mount("#app");export{G as _,I as r};
