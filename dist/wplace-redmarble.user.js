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

	const d$1=new Set;const i = async e=>{d$1.has(e)||(d$1.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

	i(" .B3b7N{position:fixed;background-color:#7d3839;color:#fff;padding:10px;border-radius:8px;z-index:9000;max-width:300px;width:auto;will-change:transform;backface-visibility:hidden;-webkit-backface-visibility:hidden;transform-style:preserve-3d;-webkit-transform-style:preserve-3d} ");

	var d=0;function t(r,e,u,v,c,f){e||(e={});var _,n,o=e;if("ref"in o)for(n in o={},e)n=="ref"?_=e[n]:o[n]=e[n];var i={type:r,props:o,key:u,ref:_,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--d,__i:-1,__u:0,__source:c,__self:f};if(typeof r=="function"&&(_=r.defaultProps))for(n in _)o[n]===void 0&&(o[n]=_[n]);return preact.options.vnode&&preact.options.vnode(i),i}const p="B3b7N";function s(){return t("div",{className:p,style:{top:10,right:50},children:"asdas"})}preact.render(t(s,{}),(()=>{const r=document.createElement("div");return document.body.append(r),r})());

})(preact);