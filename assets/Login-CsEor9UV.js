import{g as n,C as Q,o as Z,h as V,i as a,d as t,w as l,T as ee,f as _,b as k,D as c,l as v,t as L,e as N,G as te,u as le,E as m,H as se,I as F,J as B,L as G,M as oe}from"./vendor-3y-Tr9ie.js";import{_ as ae}from"./index-Cpc2chc0.js";const re=""+new URL("image-BwmisXlG.png",import.meta.url).href,ne={class:"login-container"},ue={class:"login-box"},de={class:"input-icon-wrapper"},ie={class:"input-icon-wrapper"},pe={class:"input-icon-wrapper"},ce={class:"code-input"},me={class:"input-icon-wrapper"},fe={class:"qr-container"},ve={class:"qr-wrapper"},ge=["src"],_e={key:0,class:"qr-overlay"},we={key:0,class:"login-footer"},ye={key:1,class:"login-footer"},be={key:0,class:"register-form-container"},he={class:"input-icon-wrapper"},Ve={class:"code-input"},ke={class:"input-icon-wrapper"},Ie={class:"input-icon-wrapper"},xe={class:"input-icon-wrapper"},qe={class:"login-footer"},Ce={__name:"Login",setup($e){const I=te(),M=le(),S=n("account"),w=n(!1),y=n(null),b=n(null),x=n("获取验证码"),q=n("获取验证码"),E=n(""),h=n(!1),C=n(!1),$=n(null),P=n(null),R=n(null),f=n({studentId:"",password:""}),g=n({phone:"",code:""}),d=n({phone:"",code:"",password:"",confirmPassword:""}),J={studentId:[{required:!0,message:"请输入学号",trigger:"blur"},{pattern:/^\d{10}$/,message:"请输入正确的学号",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{min:6,message:"密码长度不能小于6位",trigger:"blur"}]},W={phone:[{required:!0,message:"请输入手机号",trigger:"blur"},{pattern:/^1[3-9]\d{9}$/,message:"请输入正确的手机号",trigger:"blur"}],code:[{required:!0,message:"请输入验证码",trigger:"blur"},{pattern:/^\d{6}$/,message:"请输入6位验证码",trigger:"blur"}]},X={phone:[{required:!0,message:"请输入手机号",trigger:"blur"},{pattern:/^1[3-9]\d{9}$/,message:"请输入正确的手机号",trigger:"blur"}],code:[{required:!0,message:"请输入验证码",trigger:"blur"},{pattern:/^\d{6}$/,message:"请输入6位验证码",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{min:6,message:"密码长度不能小于6位",trigger:"blur"}],confirmPassword:[{required:!0,message:"请确认密码",trigger:"blur"},{validator:(o,e,s)=>{e!==d.value.password?s(new Error("两次输入的密码不一致")):s()},trigger:"blur"}]},D=async()=>{$.value&&await $.value.validate(async o=>{if(o){w.value=!0;try{if(f.value.studentId==="2200580121"&&f.value.password==="123456"){const e={studentId:f.value.studentId,verifiedInfo:{role:"student"}};localStorage.setItem("token","test-token"),localStorage.setItem("user",JSON.stringify(e)),m.success("登录成功");const s=M.query.redirect;s&&s.startsWith("/student/")?I.push(s):I.push("/student/home");return}await new Promise(e=>setTimeout(e,1e3)),m.error("账号或密码错误")}catch{m.error("登录失败")}finally{w.value=!1}}})},H=async()=>{P.value&&await P.value.validate(async o=>{if(o){w.value=!0;try{await new Promise(i=>setTimeout(i,1e3));const e={phone:g.value.phone,verifiedInfo:{role:"student"}};localStorage.setItem("token","test-token"),localStorage.setItem("user",JSON.stringify(e)),m.success("登录成功");const s=M.query.redirect;s&&s.startsWith("/student/")?I.push(s):I.push("/student/home")}catch{m.error("登录失败")}finally{w.value=!1}}})},O=async()=>{if(!g.value.phone){m.warning("请先输入手机号");return}let o=60;x.value=`${o}s后重新获取`,y.value=setInterval(()=>{o--,x.value=`${o}s后重新获取`,o===0&&(clearInterval(y.value),y.value=null,x.value="获取验证码")},1e3)},Y=async()=>{if(!d.value.phone){m.warning("请先输入手机号");return}let o=60;q.value=`${o}s后重新获取`,b.value=setInterval(()=>{o--,q.value=`${o}s后重新获取`,o===0&&(clearInterval(b.value),b.value=null,q.value="获取验证码")},1e3)},A=async()=>{R.value&&await R.value.validate(async o=>{if(o){C.value=!0;try{await new Promise(e=>setTimeout(e,1e3)),m.success("注册成功"),h.value=!1,d.value={phone:"",code:"",password:"",confirmPassword:""}}catch{m.error("注册失败")}finally{C.value=!1}}})};Q(()=>{y.value&&clearInterval(y.value),b.value&&clearInterval(b.value)});const j=()=>{const o=document.createElement("div");o.className="particle";const e=Math.random()*window.innerWidth,s=Math.random()*window.innerHeight,i=(Math.random()-.5)*200,u=(Math.random()-.5)*200;o.style.setProperty("--end-x",`${i}px`),o.style.setProperty("--end-y",`${u}px`),o.style.left=`${e}px`,o.style.top=`${s}px`;const p=3e3+Math.random()*4e3;return o.style.animation=`particle ${p}ms linear forwards`,o},z=()=>{const o=document.querySelector(".particles");if(!o)return;const e=()=>{const s=j();o.appendChild(s),s.addEventListener("animationend",()=>{s.remove()})};for(let s=0;s<50;s++)e();setInterval(e,200)};return Z(()=>{z()}),(o,e)=>{const s=_("el-icon"),i=_("el-input"),u=_("el-form-item"),p=_("el-button"),U=_("el-form"),T=_("el-tab-pane"),K=_("el-tabs");return k(),V("div",ne,[e[23]||(e[23]=a("div",{class:"particles"},null,-1)),e[24]||(e[24]=a("div",{class:"top-logo"},[a("img",{src:re,alt:"桂林电子科技大学",class:"school-logo"})],-1)),a("div",ue,[e[22]||(e[22]=a("div",{class:"login-header"},[a("h2",null,"GUET智慧食堂"),a("p",{class:"subtitle"},"桂林电子科技大学")],-1)),t(K,{modelValue:S.value,"onUpdate:modelValue":e[4]||(e[4]=r=>S.value=r),class:"login-tabs"},{default:l(()=>[t(T,{label:"学号密码登录",name:"account"},{default:l(()=>[t(U,{ref_key:"accountFormRef",ref:$,model:f.value,rules:J,class:"login-form"},{default:l(()=>[t(u,{prop:"studentId"},{default:l(()=>[t(i,{modelValue:f.value.studentId,"onUpdate:modelValue":e[0]||(e[0]=r=>f.value.studentId=r),placeholder:"请输入学号"},{prefix:l(()=>[a("div",de,[t(s,null,{default:l(()=>[t(c(se))]),_:1})])]),_:1},8,["modelValue"])]),_:1}),t(u,{prop:"password"},{default:l(()=>[t(i,{modelValue:f.value.password,"onUpdate:modelValue":e[1]||(e[1]=r=>f.value.password=r),type:"password",placeholder:"请输入密码","show-password":""},{prefix:l(()=>[a("div",ie,[t(s,null,{default:l(()=>[t(c(F))]),_:1})])]),_:1},8,["modelValue"])]),_:1}),e[13]||(e[13]=a("div",{class:"test-account-tip"}," 测试账号：2200580121 密码：123456 ",-1)),t(u,null,{default:l(()=>[t(p,{type:"primary",class:"login-button",loading:w.value,onClick:D},{default:l(()=>e[12]||(e[12]=[v(" 登录 ")])),_:1},8,["loading"])]),_:1})]),_:1},8,["model"])]),_:1}),t(T,{label:"手机号登录",name:"phone"},{default:l(()=>[t(U,{ref_key:"phoneFormRef",ref:P,model:g.value,rules:W,class:"login-form"},{default:l(()=>[t(u,{prop:"phone"},{default:l(()=>[t(i,{modelValue:g.value.phone,"onUpdate:modelValue":e[2]||(e[2]=r=>g.value.phone=r),placeholder:"请输入手机号"},{prefix:l(()=>[a("div",pe,[t(s,null,{default:l(()=>[t(c(B))]),_:1})])]),_:1},8,["modelValue"])]),_:1}),t(u,{prop:"code"},{default:l(()=>[a("div",ce,[t(i,{modelValue:g.value.code,"onUpdate:modelValue":e[3]||(e[3]=r=>g.value.code=r),placeholder:"请输入验证码"},{prefix:l(()=>[a("div",me,[t(s,null,{default:l(()=>[t(c(G))]),_:1})])]),_:1},8,["modelValue"]),t(p,{type:"primary",disabled:!!y.value,onClick:O,class:"verify-button"},{default:l(()=>[v(L(x.value),1)]),_:1},8,["disabled"])])]),_:1}),t(u,null,{default:l(()=>[t(p,{type:"primary",class:"login-button",loading:w.value,onClick:H},{default:l(()=>e[14]||(e[14]=[v(" 登录 ")])),_:1},8,["loading"])]),_:1})]),_:1},8,["model"])]),_:1}),t(T,{label:"微信扫码",name:"wechat"},{default:l(()=>[a("div",fe,[a("div",ve,[a("img",{src:E.value,alt:"微信扫码登录",class:"qr-code"},null,8,ge),E.value?N("",!0):(k(),V("div",_e,[t(s,null,{default:l(()=>[t(c(oe))]),_:1}),e[15]||(e[15]=a("span",null,"正在加载二维码...",-1))]))]),e[16]||(e[16]=a("p",{class:"qr-tip"},"请使用微信扫码登录",-1))])]),_:1})]),_:1},8,["modelValue"]),h.value?(k(),V("div",ye,[t(p,{link:"",type:"primary",onClick:e[6]||(e[6]=r=>h.value=!1),class:"register-link"},{default:l(()=>e[18]||(e[18]=[v(" 已有账号？立即登录 ")])),_:1})])):(k(),V("div",we,[t(p,{link:"",type:"primary",onClick:e[5]||(e[5]=r=>h.value=!0),class:"register-link"},{default:l(()=>e[17]||(e[17]=[v(" 还没有账号？立即注册 ")])),_:1})])),t(ee,{name:"fade",mode:"out-in"},{default:l(()=>[h.value?(k(),V("div",be,[e[21]||(e[21]=a("div",{class:"register-header"},[a("h3",null,"注册账号")],-1)),t(U,{ref_key:"registerFormRef",ref:R,model:d.value,rules:X,class:"login-form"},{default:l(()=>[t(u,{prop:"phone"},{default:l(()=>[t(i,{modelValue:d.value.phone,"onUpdate:modelValue":e[7]||(e[7]=r=>d.value.phone=r),placeholder:"请输入手机号"},{prefix:l(()=>[a("div",he,[t(s,null,{default:l(()=>[t(c(B))]),_:1})])]),_:1},8,["modelValue"])]),_:1}),t(u,{prop:"code"},{default:l(()=>[a("div",Ve,[t(i,{modelValue:d.value.code,"onUpdate:modelValue":e[8]||(e[8]=r=>d.value.code=r),placeholder:"请输入验证码"},{prefix:l(()=>[a("div",ke,[t(s,null,{default:l(()=>[t(c(G))]),_:1})])]),_:1},8,["modelValue"]),t(p,{type:"primary",disabled:!!b.value,onClick:Y,class:"verify-button"},{default:l(()=>[v(L(q.value),1)]),_:1},8,["disabled"])])]),_:1}),t(u,{prop:"password"},{default:l(()=>[t(i,{modelValue:d.value.password,"onUpdate:modelValue":e[9]||(e[9]=r=>d.value.password=r),type:"password",placeholder:"请设置密码","show-password":""},{prefix:l(()=>[a("div",Ie,[t(s,null,{default:l(()=>[t(c(F))]),_:1})])]),_:1},8,["modelValue"])]),_:1}),t(u,{prop:"confirmPassword"},{default:l(()=>[t(i,{modelValue:d.value.confirmPassword,"onUpdate:modelValue":e[10]||(e[10]=r=>d.value.confirmPassword=r),type:"password",placeholder:"请确认密码","show-password":""},{prefix:l(()=>[a("div",xe,[t(s,null,{default:l(()=>[t(c(F))]),_:1})])]),_:1},8,["modelValue"])]),_:1}),t(u,null,{default:l(()=>[t(p,{type:"primary",class:"login-button",loading:C.value,onClick:A},{default:l(()=>e[19]||(e[19]=[v(" 注册 ")])),_:1},8,["loading"])]),_:1})]),_:1},8,["model"]),a("div",qe,[t(p,{link:"",type:"primary",onClick:e[11]||(e[11]=r=>h.value=!1),class:"register-link"},{default:l(()=>e[20]||(e[20]=[v(" 已有账号？立即登录 ")])),_:1})])])):N("",!0)]),_:1})])])}}},Ue=ae(Ce,[["__scopeId","data-v-322c1fe7"]]);export{Ue as default};
