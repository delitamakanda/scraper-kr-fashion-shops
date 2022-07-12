var O=Object.defineProperty,R=Object.defineProperties;var C=Object.getOwnPropertyDescriptors;var _=Object.getOwnPropertySymbols;var D=Object.prototype.hasOwnProperty,F=Object.prototype.propertyIsEnumerable;var f=(l,t,s)=>t in l?O(l,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):l[t]=s,x=(l,t)=>{for(var s in t||(t={}))D.call(t,s)&&f(l,s,t[s]);if(_)for(var s of _(t))F.call(t,s)&&f(l,s,t[s]);return l},b=(l,t)=>R(l,C(t));var c=(l,t,s)=>(f(l,typeof t!="symbol"?t+"":t,s),s);import{j as e,r as i,a,F as T,m as y,b as m,I as $,L as v,u as B,T as E,B as U,R as A,c as L,d as q,e as J}from"./vendor.1a9017ff.js";const K=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function s(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerpolicy&&(n.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?n.credentials="include":r.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(r){if(r.ep)return;r.ep=!0;const n=s(r);fetch(r.href,n)}};K();const Y="/api",N=`${Y}`,H=`${N}/signup/`,W=`${N}/products/`,z=l=>`${N}/products/${l}/`,w=()=>e("div",{className:"flex items-center justify-center",children:e("div",{className:"spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full",role:"status",children:e("span",{className:"visually-hidden"})})}),G=()=>{let[l,t]=i.exports.useState(!0),[s,o]=i.exports.useState(!1),[r,n]=i.exports.useState(!1),[d,S]=i.exports.useState(""),[k,P]=i.exports.useState("");i.exports.useEffect(()=>{const u=document.querySelector("body");l&&!s?u.style.overflow="hidden":u.style.overflow="";const h=sessionStorage.getItem("subscription");o(!!h)},[l,s]);function j(){sessionStorage.setItem("subscription","true"),t(!1)}function M(){t(!0)}const I=u=>{u.preventDefault(),n(!0);const h={email:k};m.post(H,h).then(()=>{j()}).catch(p=>{const g=p&&p.response&&p.response.data;g&&g.email&&S(g.email[0])}),setTimeout(()=>{n(!1),S("")},1500)};return a(T,{children:[s?e("div",{}):e("div",{className:`fixed inset-0 flex items-center justify-center ${l?"":"hidden"}`,children:e("button",{type:"button",onClick:M,className:"rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hidden",children:"Open dialog"})}),s?null:e(y,{appear:!0,show:l,as:i.exports.Fragment,children:a("div",{children:[e(y.Child,{as:i.exports.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e("div",{className:"fixed inset-0 bg-black bg-opacity-25"})}),e("div",{className:"fixed inset-0 overflow-y-hidden",children:e("div",{className:"flex min-h-full items-center justify-center p-4 text-center",children:e(y.Child,{as:i.exports.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"ease-in duration-200",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:a("div",{className:"w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all",children:[e("h3",{className:"text-lg font-medium leading-6 text-gray-900",children:"Stay in touch"}),e("div",{className:"mt-2",children:e("p",{className:"text-sm text-gray-500",children:"Receive new fashion trends in your mailbox. You can unsubscribe at any moment."})}),a("form",{onSubmit:I,children:[e("div",{className:"mt-2",children:e("input",{className:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",id:"username",type:"text",name:"username",value:k,onChange:u=>P(u.target.value),placeholder:"Enter an email"})}),d?e("p",{className:"mt-2 text-sm text-red-500",children:d}):null,a("div",{className:"mt-4",children:[e("button",{type:"button",className:"inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",onClick:j,children:"No thanks !"}),r?e(w,{}):e("button",{type:"submit",className:"inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 ml-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",children:"Subscribe"})]})]})]})})})})]})})]})};class Q extends i.exports.Component{constructor(t){super(t);c(this,"_isMounted",!1);c(this,"fetchProducts",()=>{m.get(this.state.next_url).then(t=>{let s=!1;t.data.next&&(s=!0),this.setState({next_url:t.data.next,data:this.state.data.concat(t.data.results),loading:!1,more_exist:s},()=>{this.handleScrollPosition()})}).catch(t=>{this.setState({error:t,loading:!1})})});c(this,"handleScrollPosition",()=>{const t=sessionStorage.getItem("scrollPosition");t&&(window.scrollTo(0,+t),sessionStorage.removeItem("scrollPosition"))});c(this,"handleClick",()=>{sessionStorage.setItem("scrollPosition",window.pageYOffset)});this.state={loading:!1,error:null,data:[],next_url:W,count:null,more_exist:!1}}componentDidMount(){this._isMounted=!0,m.get(this.state.next_url).then(t=>{let s=!1;t.data.next&&(s=!0),this.setState({next_url:t.data.next,data:t.data.results,loading:!1,count:t.data.count,more_exist:s},()=>{this.handleScrollPosition()})}).catch(t=>{this.setState({error:t,loading:!1})})}componentWillUnmount(){this._isMounted=!1}render(){const{data:t,error:s,more_exist:o}=this.state;return a("div",{className:"bg-white",children:[a("div",{className:"max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8",children:[e("h2",{className:"text-2xl font-extrabold tracking-tight text-gray-900",children:"Products List"}),s&&e("div",{className:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative",role:"alert",children:e("span",{className:"block sm:inline",children:JSON.stringify(s)})}),e($,{dataLength:t.length,next:this.fetchProducts,hasMore:o,loader:e(w,{}),style:{height:"100%",overflow:"inherit"},pullDownToRefreshContent:e("div",{children:"\u2193 Pull down to refresh"}),releaseToRefreshContent:e("div",{children:"\u2191 Release to refresh"}),children:e("div",{className:"mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8",children:t.map(r=>a("div",{className:"group relative",children:[r.image_url?e("div",{className:"w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none",children:e("img",{src:r.image_url,alt:r.name,className:"w-full h-full object-center object-cover lg:w-full lg:h-full"})}):e("div",{className:"w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none",children:e("img",{src:r.image,alt:r.name,className:"w-full h-full object-center object-cover lg:w-full lg:h-full"})}),a("div",{className:"mt-4 flex justify-between",children:[e("div",{children:e("h3",{className:"text-sm text-gray-700",children:a(v,{to:`/products/${r.id}`,onClick:this.handleClick,children:[e("span",{"aria-hidden":"true",className:"absolute inset-0"}),r.name," ",r.available?"":e("span",{className:"inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full",children:"Out of stock"})]})})}),a("p",{className:"text-sm font-medium text-gray-900",children:["$",r.price]})]})]},r.id))})})]}),e(G,{})]})}}class V extends i.exports.Component{constructor(){super(...arguments);c(this,"state",{loading:!1,error:null,data:[]});c(this,"handleFetchItem",()=>{const{productID:t}=this.props.params;this.setState({loading:!0}),m.get(z(t)).then(s=>{this.setState({data:s.data,loading:!1})}).catch(s=>{this.setState({error:s,loading:!1})})})}componentDidMount(){this.handleFetchItem()}render(){const{data:t,loading:s,error:o}=this.state;return e("div",{className:"bg-white",children:a("div",{className:"pt-6",children:[e("nav",{"aria-label":"Breadcrumb",children:e("ol",{className:"max-w-2xl mx-auto px-4 flex items-center space-x-2 sm:px-6 lg:max-w-7xl lg:px-8",children:e("li",{children:e("div",{className:"flex items-center",children:e(v,{to:"/",className:"mr-2 text-sm font-medium text-gray-900",children:"\xAB Back to products"})})})})}),o&&e("div",{className:"bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative",role:"alert",children:e("span",{className:"block sm:inline",children:JSON.stringify(o)})}),s&&e(w,{}),e("div",{className:"mt-6 max-w-2xl mx-auto px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8",children:e("div",{className:"aspect-w-3 aspect-h-4 rounded-lg overflow-hidden lg:block",children:e("img",{src:t==null?void 0:t.image_url,alt:t.name,className:"w-full h-full object-center object-cover"})})}),a("div",{className:"max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8",children:[e("div",{className:"lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8",children:e("h1",{className:"text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl",children:t==null?void 0:t.name})}),a("div",{className:"mt-4 lg:mt-0 lg:row-span-3",children:[e("h2",{className:"sr-only",children:"Product information"}),a("p",{className:"text-3xl text-gray-900",children:["$",t==null?void 0:t.price]}),e("a",{type:"button",target:"_blank",rel:"noreferrer",className:"mt-10 w-full bg-pink-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500",href:t==null?void 0:t.external_link,children:"See the product"})]}),e("div",{className:"py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8",children:a("div",{children:[e("h3",{className:"sr-only",children:"Description"}),a("div",{className:"space-y-6",children:[e("p",{className:"text-base text-gray-900",children:t==null?void 0:t.description}),!(t!=null&&t.available)&&e("p",{className:"text-base text-gray-900",children:"Out Of Stock"})]})]})})]})]})})}}var X=l=>e(V,b(x({},l),{params:B()}));const Z=l=>l.children,ee=l=>a("div",{children:[e(E,{className:"relative bg-white",children:e("div",{className:"max-w-7xl mx-auto px-4 sm:px-6",children:e("div",{className:"flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10",children:e("div",{className:"flex justify-start lg:w-0 lg:flex-1",children:a(v,{to:"/",children:[e("span",{className:"sr-only",children:"Korean fashion"}),e("img",{className:"h-8 w-auto sm:h-10",src:"/static/icon-48x48.png",alt:""})]})})})})}),l.children]}),te=l=>e(U,{children:e("div",{className:"app",children:e(Z,{children:e(ee,b(x({},l),{children:a(A,{children:[e(L,{exact:!0,path:"/",element:e(Q,{})}),e(L,{path:"/products/:productID",element:e(X,{})})]})}))})})});q.render(e(J.StrictMode,{children:e(te,{})}),document.getElementById("root"));
