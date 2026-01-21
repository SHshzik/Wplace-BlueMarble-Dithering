// ==UserScript==
// @name         Red Marble New
// @namespace    https://github.com/SHshzik/
// @version      0.86.10
// @author       SHshzik
// @description  A userscript to automate and/or enhance the user experience on Wplace.live. Make sure to comply with the site's Terms of Service, and rules! This script is not affiliated with Wplace.live in any way, use at your own risk. This script is not affiliated with TamperMonkey. The author of this userscript is not responsible for any damages, issues, loss of data, or punishment that may occur as a result of using this script. This script is provided "as is" under the MPL-2.0 license. The "Blue Marble" icon is licensed under CC0 1.0 Universal (CC0 1.0) Public Domain Dedication. The image is owned by NASA.
// @license      MPL-2.0
// @icon         https://raw.githubusercontent.com/SHshzik/Wplace-BlueMarble-Dithering/refs/heads/main/dist/assets/Favicon.png
// @homepageURL  https://github.com/SHshzik/Wplace-BlueMarble-Dithering
// @source       https://github.com/SHshzik/Wplace-BlueMarble-Dithering
// @downloadURL  https://github.com/SHshzik/Wplace-BlueMarble-Dithering/blob/main/dist/RedMarble.user.js
// @updateURL    https://github.com/SHshzik/Wplace-BlueMarble-Dithering/blob/main/dist/RedMarble.user.js
// @match        https://wplace.live/*
// @require      https://cdn.jsdelivr.net/npm/preact@10.28.2/dist/preact.min.js
// @resource     CSS-BM-File  https://raw.githubusercontent.com/SHshzik/Wplace-BlueMarble-Dithering/refs/heads/feature/global/dist/styles.css
// @grant        GM.setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// ==/UserScript==

(function (preact) {
	'use strict';

	const d=new Set;const r = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

	r(` .B3b7N{position:fixed;background-color:#7d3839;color:#fff;padding:10px;border-radius:8px;z-index:9000;max-width:300px;width:auto;will-change:transform;backface-visibility:hidden;-webkit-backface-visibility:hidden;transform-style:preserve-3d;-webkit-transform-style:preserve-3d}.PGLO4{margin-bottom:.5em}.DuQrC{margin-bottom:.5em;background:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="5" height="5"><circle cx="3" cy="3" r="1.5" fill="CornflowerBlue" /></svg>') repeat;cursor:grab;width:100%;height:1em}.TvxEg{margin-top:.5em} `);

	var h=0;function t(n,e,c,r,l,a){e||(e={});var i,o,s=e;if("ref"in s)for(o in s={},e)o=="ref"?i=e[o]:s[o]=e[o];var d={type:n,props:s,key:c,ref:i,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--h,__i:-1,__u:0,__source:l,__self:a};if(typeof n=="function"&&(i=n.defaultProps))for(o in i)s[o]===void 0&&(s[o]=i[o]);return preact.options.vnode&&preact.options.vnode(d),d}const f="B3b7N",v="PGLO4",_="DuQrC";class x extends preact.Component{render(){return t("div",{class:v,children:[t("div",{class:_}),t("h1",{children:"Red Marble New"})]})}}const w="TvxEg";class b extends preact.Component{state={username:"",droplets:0,nextLevelPixels:0};constructor(){super();}componentDidMount(){window.addEventListener("message",async e=>{if(e.data.endpoint.split("?")[0].split("/").filter(r=>r&&isNaN(Number(r))).filter(r=>r&&!r.includes(".")).pop()==="me"){const{data:{data:{name:r,droplets:l,level:a,pixelsPainted:i}}}=e,o=Math.ceil(Math.pow(Math.floor(a)*Math.pow(30,.65),1/.65)-i);this.setState({username:r,droplets:l,nextLevelPixels:o});}});}test(){}render(){return t("div",{class:w,children:[t("p",{children:["Username: ",t("b",{children:this.state.username})]}),t("p",{children:["Droplets: ",t("b",{children:new Intl.NumberFormat().format(this.state.droplets)})]}),t("p",{children:["Next level in... ",t("b",{children:new Intl.NumberFormat().format(this.state.nextLevelPixels)})," pixel",this.state.nextLevelPixels==1?"":"s"]}),t("div",{children:t("p",{children:"Full Charge in... "})})]})}}function y(){return t("div",{className:f,style:{top:10,right:50},children:[t(x,{}),t("hr",{}),t(b,{})]})}const N=function(){const n=window.fetch;window.fetch=async(...e)=>{const c=await n(...e),r=(e[0]instanceof Request?e[0]?.url:e[0])||"ignore";try{const a=await c.clone().json();window.postMessage({source:"tm-fetch-hook",url:e[0],endpoint:r,data:a},"*");}catch{}return c};};function C(n){const e=document.createElement("script");e.textContent=`(${n.toString()})();`,document.documentElement.appendChild(e),e.remove();}C(N);preact.render(t(y,{}),(()=>{const n=document.createElement("div");return document.body.append(n),n})());

})(preact);