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

	var f=0;function n(t,e,s,a,c,l){e||(e={});var r,o,i=e;if("ref"in i)for(o in i={},e)o=="ref"?r=e[o]:i[o]=e[o];var d={type:t,props:i,key:s,ref:r,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--f,__i:-1,__u:0,__source:c,__self:l};if(typeof t=="function"&&(r=t.defaultProps))for(o in r)i[o]===void 0&&(i[o]=r[o]);return preact.options.vnode&&preact.options.vnode(d),d}const h="B3b7N",v="PGLO4",_="DuQrC";class x extends preact.Component{render(){return n("div",{class:v,children:[n("div",{class:_}),n("h1",{children:"Red Marble New"})]})}}const b="ignore",w=t=>t.split("?")[0].split("/").filter(e=>e&&isNaN(Number(e))).filter(e=>e&&!e.includes(".")).pop()||b,y="TvxEg",N={bmContainUserInfo:y};class C extends preact.Component{state={username:"",droplets:0,nextLevelPixels:0};constructor(){super();}componentDidMount(){window.addEventListener("message",async e=>{if(w(e.data.endpoint)==="me"){const{data:{data:{name:a,droplets:c,level:l,pixelsPainted:r}}}=e,o=Math.ceil(Math.pow(Math.floor(l)*Math.pow(30,.65),1/.65)-r);this.setState({username:a,droplets:c,nextLevelPixels:o});}});}render(){return n("div",{class:N.bmContainUserInfo,children:[n("p",{children:["Username: ",n("b",{children:this.state.username})]}),n("p",{children:["Droplets: ",n("b",{children:new Intl.NumberFormat().format(this.state.droplets)})]}),n("p",{children:["Next level in... ",n("b",{children:new Intl.NumberFormat().format(this.state.nextLevelPixels)})," pixel",this.state.nextLevelPixels==1?"":"s"]}),n("div",{children:n("p",{children:"Full Charge in... "})})]})}}function E(){return n("div",{className:h,style:{top:10,right:50},children:[n(x,{}),n("hr",{}),n(C,{})]})}const I=function(){const t=window.fetch;window.fetch=async(...e)=>{const s=await t(...e),a=(e[0]instanceof Request?e[0]?.url:e[0])||"ignore";try{const l=await s.clone().json();window.postMessage({source:"tm-fetch-hook",url:e[0],endpoint:a,data:l},"*");}catch{}return s};};function M(t){const e=document.createElement("script");e.textContent=`(${t.toString()})();`,document.documentElement.appendChild(e),e.remove();}M(I);preact.render(n(E,{}),(()=>{const t=document.createElement("div");return document.body.append(t),t})());

})(preact);