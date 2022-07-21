const y=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function i(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerpolicy&&(n.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?n.credentials="include":r.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=i(r);fetch(r.href,n)}};y();var B=(t=>(t[t.None=0]="None",t[t.Blend=1]="Blend",t[t.Add=2]="Add",t))(B||{});function E(t,e,i,s){return s===void 0&&(s=255),(t<<24)+(e<<16)+(i<<8)+s}function Nt(t,e,i,s){const r=t*6|0,n=t*6-r,o=i*(1-e),_=i*(1-n*e),h=i*(1-(1-n)*e);let a,l,c;switch(r%6){case 0:a=i,l=h,c=o;break;case 1:a=_,l=i,c=o;break;case 2:a=o,l=i,c=h;break;case 3:a=o,l=_,c=i;break;case 4:a=h,l=o,c=i;break;case 5:a=i,l=o,c=_;break;default:a=0,l=0,c=0}return s===void 0&&(s=1),E(a*255|0,l*255|0,c*255|0,s*255|0)}const K={BLACK:E(0,0,0),WHITE:E(255,255,255),LIGHT_GRAY:E(170,170,170),DARK_GRAY:E(85,85,85),YELLOW:E(255,255,85),BROWN:E(170,85,0),LIGHT_RED:E(255,85,85),DARK_RED:E(170,0,0),LIGHT_GREEN:E(85,255,85),DARK_GREEN:E(0,170,0),LIGHT_CYAN:E(85,255,255),DARK_CYAN:E(0,170,170),LIGHT_BLUE:E(85,85,255),DARK_BLUE:E(0,0,170),LIGHT_MAGENTA:E(255,85,255),DARK_MAGENTA:E(170,0,170),ORANGE:E(255,136,0)},z=new Map;function I(t){z.set(t.name,t)}var Q=Object.defineProperty,Z=Object.getOwnPropertyDescriptor,j=(t,e,i,s)=>{for(var r=s>1?void 0:s?Z(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&Q(e,i,r),r};function q(t){return typeof t=="string"&&t.length>0?t.charCodeAt(0):t}let S=class{constructor(t,e,i,s,r){this.x=t,this.y=e,i!==void 0?this.charCode=q(i):this.charCode=" ".charCodeAt(0),s!==void 0?this.fg=s:this.fg=K.WHITE,r!==void 0?this.bg=r:this.bg=K.BLACK,this.dirty=!0,this.blocked=!1,this.blockedSight=!1,this.explored=!1,this.visible=!1,this.pathId=-1,this.g=0,this.h=0,this.prev=null}setCharCode(t){this.charCode!==t&&(this.charCode=t,this.dirty=!0)}setForeground(t){t!=null&&t!==this.fg&&(this.fg=t,this.dirty=!0)}setBackground(t){t!=null&&t!==this.bg&&(this.bg=t,this.dirty=!0)}setValue(t,e,i){return typeof t=="string"&&(t=t.charCodeAt(0)),typeof t=="number"?(this.setCharCode(t),e!==void 0&&this.setForeground(e),i!==void 0&&this.setBackground(i)):this.drawCell(t,B.None),this.dirty}drawCell(t,e){const i=t.bg&255;e===B.None||t.charCode>0?(this.setCharCode(t.charCode),this.setForeground(t.fg)):i>0&&i<255&&this.setForeground(this.blendColors(this.fg,t.bg,e)),e===B.None||i===255?this.setBackground(t.bg):i>0&&this.setBackground(this.blendColors(this.bg,t.bg,e))}blendColors(t,e,i){const s=e&255,r=(255-s)/255,n=1-r,o=t>>24&255,_=t>>16&255,h=t>>8&255,a=e>>24&255,l=e>>16&255,c=e>>8&255;switch(i){case B.Blend:return E(r*o+n*a|0,r*_+n*l|0,r*h+n*c|0);case B.Add:return E(this.clamp(o+n*a|0),this.clamp(_+n*l|0),this.clamp(h+n*c|0));default:return e}}clamp(t){return Math.min(255,t)}};S=j([I],S);var A=(t=>(t[t.SMILEY=1]="SMILEY",t[t.INVERSE_SMILEY=2]="INVERSE_SMILEY",t[t.HEART=3]="HEART",t[t.DIAMOND=4]="DIAMOND",t[t.CLUB=5]="CLUB",t[t.SPADE=6]="SPADE",t[t.BULLET=7]="BULLET",t[t.INVERSE_BULLET=8]="INVERSE_BULLET",t[t.LIGHT_SHADE=176]="LIGHT_SHADE",t[t.MEDIUM_SHADE=177]="MEDIUM_SHADE",t[t.DARK_SHADE=178]="DARK_SHADE",t[t.BOX_SINGLE_VERTICAL=179]="BOX_SINGLE_VERTICAL",t[t.BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT=180]="BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT",t[t.BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT=185]="BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT",t[t.BOX_DOUBLE_VERTICAL=186]="BOX_DOUBLE_VERTICAL",t[t.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT=187]="BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT",t[t.BOX_DOUBLE_UP_AND_DOUBLE_LEFT=188]="BOX_DOUBLE_UP_AND_DOUBLE_LEFT",t[t.BOX_SINGLE_DOWN_AND_SINGLE_LEFT=191]="BOX_SINGLE_DOWN_AND_SINGLE_LEFT",t[t.BOX_SINGLE_UP_AND_SINGLE_RIGHT=192]="BOX_SINGLE_UP_AND_SINGLE_RIGHT",t[t.BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP=193]="BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP",t[t.BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN=194]="BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN",t[t.BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT=195]="BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT",t[t.BOX_SINGLE_HORIZONTAL=196]="BOX_SINGLE_HORIZONTAL",t[t.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL=197]="BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL",t[t.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT=200]="BOX_DOUBLE_UP_AND_DOUBLE_RIGHT",t[t.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT=201]="BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT",t[t.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP=202]="BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP",t[t.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN=203]="BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN",t[t.BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT=204]="BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT",t[t.BOX_DOUBLE_HORIZONTAL=205]="BOX_DOUBLE_HORIZONTAL",t[t.BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL=206]="BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL",t[t.BOX_SINGLE_UP_AND_SINGLE_LEFT=217]="BOX_SINGLE_UP_AND_SINGLE_LEFT",t[t.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT=218]="BOX_SINGLE_DOWN_AND_SINGLE_RIGHT",t[t.BLOCK_FULL=219]="BLOCK_FULL",t[t.BLOCK_BOTTOM_HALF=220]="BLOCK_BOTTOM_HALF",t[t.BLOCK_LEFT_HALF=221]="BLOCK_LEFT_HALF",t[t.BLOCK_RIGHT_HALF=222]="BLOCK_RIGHT_HALF",t[t.BLOCK_TOP_HALF=223]="BLOCK_TOP_HALF",t))(A||{});function J(t,e){const i=new RegExp("(\\S(.{0,"+e+"}\\S)?)\\s+","g");return(t+" ").replace(i,`$1
`).trim().split(`
`).map(s=>s.trim())}var $=Object.defineProperty,tt=Object.getOwnPropertyDescriptor,et=(t,e,i,s)=>{for(var r=s>1?void 0:s?tt(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&$(e,i,r),r};let m=class{constructor(t,e,i){this.width=t,this.height=e,this.grid=[],this.originX=0,this.originY=0,this.minX=0,this.maxX=0,this.minY=0,this.maxY=0,this.radius=0;for(let s=0;s<e;s++){const r=[];for(let n=0;n<t;n++)r.push(new S(n,s));this.grid.push(r)}if(this.clear(),i)for(let s=0;s<e;s++)for(let r=0;r<t;r++)this.grid[s][r].blocked=this.grid[s][r].blockedSight=i(r,s)}clear(){for(let t=0;t<this.height;t++)for(let e=0;e<this.width;e++)this.drawChar(e,t,0)}getCell(t,e){if(!(t<0||e<0||t>=this.width||e>=this.height))return this.grid[e][t]}getCharCode(t,e){if(!(t<0||e<0||t>=this.width||e>=this.height))return this.grid[e][t].charCode}drawChar(t,e,i,s,r){this.clip&&!this.clip.contains({x:t,y:e})||t>=0&&t<this.width&&e>=0&&e<this.height&&this.grid[e|0][t|0].setValue(i,s,r)}drawString(t,e,i,s,r){const n=i.split(`
`);for(let o=0;o<n.length;o++)this.drawStringLine(t,e+o,n[o],s,r)}drawStringLine(t,e,i,s,r){for(let n=0;n<i.length;n++)this.drawChar(t+n,e,i.charCodeAt(n),s,r)}drawCenteredString(t,e,i,s,r){this.drawString(t-Math.floor(i.length/2),e,i,s,r)}drawMessage(t,e,i,s){if(i.text){const r=J(i.text,s||this.width-t);for(const n of r)this.drawStringLine(t,e,n,i.fg,i.bg),e++}if(i.children)for(const r of i.children)e=this.drawMessage(t,e,r,s);return e}drawHLine(t,e,i,s,r,n){for(let o=t;o<t+i;o++)this.drawChar(o,e,s,r,n)}drawVLine(t,e,i,s,r,n){for(let o=e;o<e+i;o++)this.drawChar(t,o,s,r,n)}drawRect(t,e,i,s,r,n,o){this.drawHLine(t,e,i,r,n,o),this.drawHLine(t,e+s-1,i,r,n,o),this.drawVLine(t,e,s,r,n,o),this.drawVLine(t+i-1,e,s,r,n,o)}drawBox(t,e,i,s,r,n,o,_,h,a,l,c,d,D){this.fillRect(t,e,i,s,0,d,D),this.drawHLine(t,e,i,r),this.drawHLine(t,e+s-1,i,o),this.drawVLine(t,e,s,_),this.drawVLine(t+i-1,e,s,n),this.drawChar(t,e,h),this.drawChar(t+i-1,e,a),this.drawChar(t,e+s-1,c),this.drawChar(t+i-1,e+s-1,l)}drawSingleBox(t,e,i,s,r,n){this.drawBox(t,e,i,s,A.BOX_SINGLE_HORIZONTAL,A.BOX_SINGLE_VERTICAL,A.BOX_SINGLE_HORIZONTAL,A.BOX_SINGLE_VERTICAL,A.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT,A.BOX_SINGLE_DOWN_AND_SINGLE_LEFT,A.BOX_SINGLE_UP_AND_SINGLE_LEFT,A.BOX_SINGLE_UP_AND_SINGLE_RIGHT,r,n)}drawDoubleBox(t,e,i,s,r,n){this.drawBox(t,e,i,s,A.BOX_DOUBLE_HORIZONTAL,A.BOX_DOUBLE_VERTICAL,A.BOX_DOUBLE_HORIZONTAL,A.BOX_DOUBLE_VERTICAL,A.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT,A.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT,A.BOX_DOUBLE_UP_AND_DOUBLE_LEFT,A.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT,r,n)}fillRect(t,e,i,s,r,n,o){for(let _=e;_<e+s;_++)this.drawHLine(t,_,i,r,n,o)}drawConsole(t,e,i,s,r,n,o,_){_=_||B.None;for(let h=0;h<o;h++)for(let a=0;a<n;a++){const l=i.getCell(s+a,r+h);l&&this.drawCell(t+a,e+h,l,_)}}drawCell(t,e,i,s){t>=0&&t<this.width&&e>=0&&e<this.height&&this.grid[e][t].drawCell(i,s)}setBlocked(t,e,i){t>=0&&t<this.width&&e>=0&&e<this.height&&(this.grid[e][t].blocked=i)}setBlockedSight(t,e,i){t>=0&&t<this.width&&e>=0&&e<this.height&&(this.grid[e][t].blockedSight=i)}isVisible(t,e){return t<this.minX||t>this.maxX||e<this.minY||e>this.maxY?!1:this.grid[e][t].visible}isBlocked(t,e){return t<0||t>this.width||e<0||e>this.height?!0:this.grid[e][t].blocked}isBlockedSight(t,e){return t<0||t>this.width||e<0||e>this.height?!0:this.grid[e][t].blockedSight}computeOctantY(t,e){const i=[],s=[];let r=1,n=0,o=0,_=0,h,a,l,c,d,D,p,O,L,N;for(a=this.originY+e;a>=this.minY&&a<=this.maxY;a+=e,o=n,++r)for(l=.5/r,N=-1,c=Math.floor(_*r+.5),h=this.originX+c*t;c<=r&&h>=this.minX&&h<=this.maxX;h+=t,++c,N=L){if(d=!0,D=!1,p=c/r,O=N,L=p+l,o>0){if(!(this.grid[a-e][h].visible&&!this.grid[a-e][h].blockedSight)&&!(this.grid[a-e][h-t].visible&&!this.grid[a-e][h-t].blockedSight))d=!1;else for(let u=0;u<o&&d;++u)if(O<=s[u]&&L>=i[u]){if(this.grid[a][h].blockedSight)if(O>=i[u]&&L<=s[u]){d=!1;break}else i[u]=Math.min(i[u],O),s[u]=Math.max(s[u],L),D=!0;else if(p>i[u]&&p<s[u]){d=!1;break}}}d&&(this.grid[a][h].visible=!0,this.grid[a][h].blockedSight&&(_>=O?_=L:D||(i[n]=O,s[n++]=L)))}}computeOctantX(t,e){const i=[],s=[];let r=1,n=0,o=0,_=0,h,a,l,c,d,D,p,O,L,N;for(h=this.originX+t;h>=this.minX&&h<=this.maxX;h+=t,o=n,++r)for(l=.5/r,N=-1,c=Math.floor(_*r+.5),a=this.originY+c*e;c<=r&&a>=this.minY&&a<=this.maxY;a+=e,++c,N=L){if(d=!0,D=!1,p=c/r,O=N,L=p+l,o>0){if(!(this.grid[a][h-t].visible&&!this.grid[a][h-t].blockedSight)&&!(this.grid[a-e][h-t].visible&&!this.grid[a-e][h-t].blockedSight))d=!1;else for(let u=0;u<o&&d;++u)if(O<=s[u]&&L>=i[u]){if(this.grid[a][h].blockedSight)if(O>=i[u]&&L<=s[u]){d=!1;break}else i[u]=Math.min(i[u],O),s[u]=Math.max(s[u],L),D=!0;else if(p>i[u]&&p<s[u]){d=!1;break}}}d&&(this.grid[a][h].visible=!0,this.grid[a][h].blockedSight&&(_>=O?_=L:D||(i[n]=O,s[n++]=L)))}}computeFov(t,e,i,s,r){if(this.originX=t,this.originY=e,this.radius=i,s)this.minX=Math.min(this.minX,Math.max(0,t-i)),this.minY=Math.min(this.minY,Math.max(0,e-i)),this.maxX=Math.max(this.maxX,Math.min(this.width-1,t+i)),this.maxY=Math.max(this.maxY,Math.min(this.height-1,e+i));else{this.minX=Math.max(0,t-i),this.minY=Math.max(0,e-i),this.maxX=Math.min(this.width-1,t+i),this.maxY=Math.min(this.height-1,e+i);for(let n=this.minY;n<=this.maxY;n++)for(let o=this.minX;o<=this.maxX;o++)this.grid[n][o].visible=!1}this.grid[e][t].visible=!0,r===void 0?(this.computeOctantY(1,1),this.computeOctantX(1,1),this.computeOctantX(1,-1),this.computeOctantY(1,-1),this.computeOctantY(-1,-1),this.computeOctantX(-1,-1),this.computeOctantX(-1,1),this.computeOctantY(-1,1)):(r&1&&this.computeOctantY(1,1),r&2&&this.computeOctantX(1,1),r&4&&this.computeOctantX(1,-1),r&8&&this.computeOctantY(1,-1),r&16&&this.computeOctantY(-1,-1),r&32&&this.computeOctantX(-1,-1),r&64&&this.computeOctantX(-1,1),r&128&&this.computeOctantY(-1,1))}updateExplored(){for(let t=this.minY;t<=this.maxY;t++)for(let e=this.minX;e<=this.maxX;e++){const i=this.grid[t][e];i.explored=i.explored||i.visible}}};m=et([I],m);class it{constructor(e,i,s,r,n){this.url=e,this.charWidth=i,this.charHeight=s,this.scale=r||1,this.graphical=!!n}}const st="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAEhklEQVRIx42Sv4oUQRDGC4UzadSwwMUD8QEKlbWD4Q58B/NGpTVocKO1wXHUzMAH0AcwMTYVGg5ag0IzEXaRjdZEZKNzkKbHqtnzHypY09M9+5uvqr7pbYCuC6ftaRhgONXs30eAh0O1rYDm4IS/eH0B8GxRW2vxo396yu/fb0ZFrW1zcOXlPU/XPwK8PGjbWhVwM4KnH61912oK4+zmmHJaQotyt1kvtC2Atdo24iohPDiG/v4eICJsY3Wy8Yvr0DSIBOdxgH6v8wsriWhc8s0AtaK/GzSl1jR0nSjQnwki6FQxNFKjgzO2a7BBqucH7dL4M9z96CIhT1Fs/AgKgcA6dKCxI29DaHNwRJ4EGAU1sU0OG9rmE4SIc3A4FChACqqhJRwpxkqh9wxag4DSmEJ5DtpFwAP4GUf6lmKcFFti1BYuQp4xN8kxM2kNhjdkTOiTUeAKGvhA1rLpMbYACQzCITlTDRMbLYoEa2JWPSMRFZIupcSzMVKcEUkX+sOG+ChNX2vD8ex6k7OFHL0P1655JuPd53WAD+yTv3UrCQiuHmYBbfIxpkImuvpBQBkVb5g4XHv3JkNireG8AO9zDhBZu2z2OMZ11S5/RIlyMefMNaZ4GsCz5xcjyM6hHYEjAYEfO8Ig1rklAe9sRIeYAdwyoIBq6YIzCAKiWoifA3m3o2AzWcdYKOdY47EIf8QABCuYgIUVmdVMEYEDA0Hmo/3D6KKJbh5mxhP3UsWIE97wnEygyizOfOLi2JOJW8CeOblW9IHeKZgv4zxuzDryOmb+4aQH+MXV6e0ywdUcxqCjBWl5GpbzZduOG1QEiGXP86T7EfiJfkMQ4OO4H0yqyNC2zlziWEN7Ywuc2fQ4p5BNkS5QYXP2h5NtRJh0vCKQidtVJmCGAwDSSQpYggSxiRIyzewsgCh4xxiTPDMh5aj//l7btqkr6rQyIOtLji4lVRQwXdzvus40Y53M33fh50GZwF4ExQeMlvuTggLzSi4ElKczUO7zVtpwdyMKdqZKOWb2nDblawPxPmuMwFEWBW+jlZR1eYtS442kiBGMWCi/h1/+GAR6NYOJWiqNJXFygFtrkx5C0O3IeFGs67HhEEhmBu/BUOT+0551pXxYIF+Elpi5AKRkLl5GUbCCZddyMv621ujEBPP4vSy2fotTx3U+d3WBiFOA6VSGSB49v/M7GBX9FPrDaT2c9qr4PCpwZ7qz813R94dVFIe19v33GlMZUghQFb8BrfE7QBmgBMbrn2B3enn/y3B5+DL8UBAdnejdYdBxeV9ejwoYNTgW0Ok/gA7UG2GAzanhL0DG7q4svynwF8UwDPu7u/vD0IudzSltMtVbP+J/gUbR29oJ7Fg9s6Uy+DnpiTCOYc4cXOeXMWfsusSw7FOg9x655nax6BlecwpOQQ68WBwp+H2LMQTuOq2RUigzh2Q/R3CWARJIJG199EwOTyKBlQMznshCRGeQ5gHABAQl6M4gLEdAzVaBWMCiANdsayDCHBA/hagKYfielrJIlipKKQIA9Nf3wBloTHT6BuAx15zRNa1nAAAAAElFTkSuQmCC",M=new it(st,8,8);var rt=Object.defineProperty,nt=Object.getOwnPropertyDescriptor,ot=(t,e,i,s)=>{for(var r=s>1?void 0:s?nt(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&rt(e,i,r),r};let g=class{constructor(t,e){this.x=t,this.y=e}};g=ot([I],g);var ht=Object.defineProperty,_t=Object.getOwnPropertyDescriptor,at=(t,e,i,s)=>{for(var r=s>1?void 0:s?_t(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&ht(e,i,r),r};let V=class{constructor(t,e,i,s){this.x=this.left=t,this.y=this.top=e,this.width=i,this.height=s,this.x2=t+i,this.y2=e+s}getCenter(){return new g(this.x+this.width/2|0,this.y+this.height/2|0)}intersects(t){return this.x<=t.x2&&this.x2>=t.x&&this.y<=t.y2&&this.y2>=t.y}contains(t){return t.x>=this.x&&t.x<this.x2&&t.y>=this.y&&t.y<this.y2}};V=at([I],V);var lt=Object.defineProperty,ct=Object.getOwnPropertyDescriptor,dt=(t,e,i,s)=>{for(var r=s>1?void 0:s?ct(e,i):e,n=t.length-1,o;n>=0;n--)(o=t[n])&&(r=(s?o(e,i,r):o(r))||r);return s&&r&&lt(e,i,r),r};let G=class{constructor(t,e,i,s){this.text=t,this.fg=e,this.bg=i,this.children=s}getWidth(){let t=0;if(this.text)for(const e of this.text.split(`
`))t=Math.max(t,e.length);if(this.children)for(const e of this.children)t=Math.max(t,e.getWidth());return t}getHeight(){let t=0;if(this.text&&(t+=this.text.split(`
`).length),this.children)for(const e of this.children)t+=e.getHeight();return t}};G=dt([I],G);const ut=200,ft=1e3/15;class R{constructor(){this.down=!1,this.downTime=0,this.repeat=!1,this.repeatTime=0,this.downCount=0,this.upCount=100}setDown(e){this.down!==e&&(this.down=e,this.repeat=!1,this.downTime=this.repeatTime=performance.now())}update(e){this.repeat=!1,this.down?(this.downCount++,this.upCount=0,e-this.downTime>=ut&&e-this.repeatTime>=ft&&(this.repeat=!0,this.repeatTime=e)):(this.downCount=0,this.upCount++)}isPressed(){return this.downCount===1||this.repeat}isClicked(){return this.upCount===1}}class Et{constructor(e){this.keys=new Map,Object.keys(f).forEach(i=>this.keys.set(i,new R)),e.addEventListener("keydown",i=>this.setKey(i,!0)),e.addEventListener("keyup",i=>this.setKey(i,!1))}setKey(e,i){const s=e.code;s!==f.VK_F11&&(e.stopPropagation(),e.preventDefault(),this.getKey(s).setDown(i))}updateKeys(e){this.keys.forEach(i=>i.update(e))}getKey(e){let i=this.keys.get(e);return i||(i=new R,this.keys.set(e,i)),i}}var f=(t=>(t.VK_CANCEL="Pause",t.VK_BACKSPACE="Backspace",t.VK_TAB="Tab",t.VK_ENTER="Enter",t.VK_SHIFT_LEFT="ShiftLeft",t.VK_SHIFT_RIGHT="ShiftLeft",t.VK_CONTROL_LEFT="ControlLeft",t.VK_CONTROL_RIGHT="ControlRight",t.VK_ALT_LEFT="AltLeft",t.VK_ALT_RIGHT="AltRight",t.VK_PAUSE="Pause",t.VK_CAPS_LOCK="CapsLock",t.VK_ESCAPE="Escape",t.VK_SPACE="Space",t.VK_PAGE_UP="PageUp",t.VK_PAGE_DOWN="PageDown",t.VK_END="End",t.VK_HOME="Home",t.VK_LEFT="ArrowLeft",t.VK_UP="ArrowUp",t.VK_RIGHT="ArrowRight",t.VK_DOWN="ArrowDown",t.VK_INSERT="Insert",t.VK_DELETE="Delete",t.VK_0="Digit0",t.VK_1="Digit1",t.VK_2="Digit2",t.VK_3="Digit3",t.VK_4="Digit4",t.VK_5="Digit5",t.VK_6="Digit6",t.VK_7="Digit7",t.VK_8="Digit8",t.VK_9="Digit9",t.VK_SEMICOLON="Semicolon",t.VK_EQUALS="Equal",t.VK_A="KeyA",t.VK_B="KeyB",t.VK_C="KeyC",t.VK_D="KeyD",t.VK_E="KeyE",t.VK_F="KeyF",t.VK_G="KeyG",t.VK_H="KeyH",t.VK_I="KeyI",t.VK_J="KeyJ",t.VK_K="KeyK",t.VK_L="KeyL",t.VK_M="KeyM",t.VK_N="KeyN",t.VK_O="KeyO",t.VK_P="KeyP",t.VK_Q="KeyQ",t.VK_R="KeyR",t.VK_S="KeyS",t.VK_T="KeyT",t.VK_U="KeyU",t.VK_V="KeyV",t.VK_W="KeyW",t.VK_X="KeyX",t.VK_Y="KeyY",t.VK_Z="KeyZ",t.VK_CONTEXT_MENU="ContextMenu",t.VK_NUMPAD0="Numpad0",t.VK_NUMPAD1="Numpad1",t.VK_NUMPAD2="Numpad2",t.VK_NUMPAD3="Numpad3",t.VK_NUMPAD4="Numpad4",t.VK_NUMPAD5="Numpad5",t.VK_NUMPAD6="Numpad6",t.VK_NUMPAD7="Numpad7",t.VK_NUMPAD8="Numpad8",t.VK_NUMPAD9="Numpad9",t.VK_MULTIPLY="NumpadMultiply",t.VK_ADD="NumpadAdd",t.VK_SEPARATOR="NumpadDecimal",t.VK_SUBTRACT="NumpadSubtract",t.VK_DECIMAL="NumpadDecimal",t.VK_DIVIDE="NumpadDivide",t.VK_F1="F1",t.VK_F2="F2",t.VK_F3="F3",t.VK_F4="F4",t.VK_F5="F5",t.VK_F6="F6",t.VK_F7="F7",t.VK_F8="F8",t.VK_F9="F9",t.VK_F10="F10",t.VK_F11="F11",t.VK_F12="F12",t.VK_F13="F13",t.VK_F14="F14",t.VK_F15="F15",t.VK_F16="F16",t.VK_F17="F17",t.VK_F18="F18",t.VK_F19="F19",t.VK_F20="F20",t.VK_F21="F21",t.VK_F22="F22",t.VK_F23="F23",t.VK_F24="F24",t.VK_NUM_LOCK="NumLock",t.VK_SCROLL_LOCK="ScrollLock",t.VK_COMMA="Comma",t.VK_PERIOD="Period",t.VK_SLASH="Slash",t.VK_BACKQUOTE="Backquote",t.VK_OPEN_BRACKET="BracketLeft",t.VK_BACK_SLASH="Backslash",t.VK_CLOSE_BRACKET="BracketRight",t.VK_QUOTE="Quote",t.VK_META="OSLeft",t))(f||{});const H=[{charCode:A.BLOCK_TOP_HALF,active:[1,1,0,0]},{charCode:A.BLOCK_RIGHT_HALF,active:[0,1,0,1]}];function Tt(t,e){const i=new Image;i.onload=()=>{const s=i.width,r=i.height,n=C(i),o=new m(s,r);let _=0;for(let h=0;h<r;h++)for(let a=0;a<s;a++)o.getCell(a,h).setBackground(E(n[_++],n[_++],n[_++],n[_++]));e(o)},i.src=t}function Bt(t,e){const i=new Image;i.onload=()=>{const s=i.width,r=i.height,n=C(i),o=new m(s/2,r/2);for(let _=0;_<r;_+=2)for(let h=0;h<s;h+=2)At(o,n,h,_,s);e(o)},i.src=t}function C(t){const e=document.createElement("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");return i.drawImage(t,0,0),i.getImageData(0,0,t.width,t.height).data}function At(t,e,i,s,r){const n=4*(s*r+i),o=e[n],_=e[n+1],h=e[n+2],a=4*(s*r+i+1),l=e[a],c=e[a+1],d=e[a+2],D=4*((s+1)*r+i),p=e[D],O=e[D+1],L=e[D+2],N=4*((s+1)*r+i+1),u=e[N],Y=e[N+1],W=e[N+2],k=[[o,_,h],[l,c,d],[p,O,L],[u,Y,W]];let b=Number.MAX_VALUE,F=0,P=null,v=null;for(let U=0;U<H.length;U++){const x=H[U],w=Lt(x.active,k);w.error<b&&(b=w.error,F=x.charCode,P=w.bg,v=w.fg)}t.drawChar(i/2,s/2,F,X(v),X(P))}function Lt(t,e){const i=[[0,0,0],[0,0,0]],s=[[0,0,0],[0,0,0]],r=[0,0];for(let o=0;o<4;o++){for(let _=0;_<3;_++)i[t[o]][_]+=e[o][_];r[t[o]]++}for(let o=0;o<2;o++)for(let _=0;_<3;_++)s[o][_]=i[o][_]/r[o];let n=0;for(let o=0;o<4;o++){let _=0;for(let h=0;h<3;h++){const a=e[o][h]-s[t[o]][h];_+=a*a}n+=Math.sqrt(_)}return{bg:s[0],fg:s[1],error:n}}function X(t){return E(t[0],t[1],t[2])}class Ot{constructor(e){this.el=e.canvas,this.width=e.width,this.height=e.height,this.prevX=0,this.prevY=0,this.x=0,this.y=0,this.dx=0,this.dy=0,this.wheelDeltaX=0,this.wheelDeltaY=0,this.buttons=[new R,new R,new R];const i=this.el;i.addEventListener("mousedown",s=>this.handleEvent(s)),i.addEventListener("mouseup",s=>this.handleEvent(s)),i.addEventListener("mousemove",s=>this.handleEvent(s)),i.addEventListener("contextmenu",s=>this.handleEvent(s)),i.addEventListener("touchstart",s=>this.handleTouchEvent(s)),i.addEventListener("touchend",s=>this.handleTouchEvent(s)),i.addEventListener("touchcancel",s=>this.handleTouchEvent(s)),i.addEventListener("touchmove",s=>this.handleTouchEvent(s)),i.addEventListener("wheel",s=>this.handleWheelEvent(s))}handleTouchEvent(e){if(e.stopPropagation(),e.preventDefault(),e.touches.length>0){const i=e.touches[0];this.updatePosition(i.clientX,i.clientY),this.buttons[0].setDown(!0)}else this.buttons[0].setDown(!1)}handleEvent(e){e.stopPropagation(),e.preventDefault(),this.updatePosition(e.clientX,e.clientY),e.type==="mousedown"&&(this.buttons[e.button].setDown(!0),this.el.focus()),e.type==="mouseup"&&this.buttons[e.button].setDown(!1)}handleWheelEvent(e){e.stopPropagation(),e.preventDefault(),this.wheelDeltaX=e.deltaX,this.wheelDeltaY=e.deltaY}updatePosition(e,i){let s=this.el.getBoundingClientRect();const r=this.width/this.height,n=s.width/s.height;if(n-r>.01){const o=r*s.height,_=s.width-o;s=new V(Math.floor(_/2),0,o,s.height)}if(n-r<-.01){const o=s.width/r,_=s.height-o;s=new V(0,Math.floor(_/2),s.width,o)}this.x=this.width*(e-s.left)/s.width|0,this.y=this.height*(i-s.top)/s.height|0}update(e){this.dx=this.x-this.prevX,this.dy=this.y-this.prevY,this.prevX=this.x,this.prevY=this.y;for(let i=0;i<this.buttons.length;i++)this.buttons[i].update(e)}}const Dt=`#version 300 es
precision highp float;in vec2 a;in vec2 b;in vec3 c;in vec3 d;out vec2 e;out vec4 f;out vec4 g;void main(void){gl_Position=vec4(a.x,a.y,0,1);e=b/16.0;f=vec4(c.r,c.g,c.b,1);g=vec4(d.r,d.g,d.b,1);}`,gt=`#version 300 es
precision highp float;in vec2 e;in vec4 f;in vec4 g;uniform bool h;uniform sampler2D s;out vec4 o;void main(void){o=texture(s,e);if(h){if(o.a<0.1){o=texture(s,g.rg*16.0+fract(e*16.0)/16.0);}}else{if(o.r<0.1) {o=g;} else {o=f;}}}`;function T(t,e){return-1+2*(t/e)}const pt={font:M};class Rt extends m{constructor(e,i,s,r){super(i,s),r=r||pt,this.canvas=e,this.font=r.font||M,this.pixelWidth=i*this.font.charWidth,this.pixelHeight=s*this.font.charHeight,e.width=this.pixelWidth,e.height=this.pixelHeight,e.style.imageRendering="pixelated",e.style.outline="none",e.tabIndex=0,this.handleResize(),window.addEventListener("resize",()=>this.handleResize()),this.keys=new Et(e),this.mouse=new Ot(this);const n=e.getContext("webgl2",{antialias:!1});if(!n)throw new Error("Unable to initialize WebGL. Your browser may not support it.");const o=n.createProgram();if(!o)throw new Error("Unable to initialize WebGL. Your browser may not support it.");this.gl=n,this.program=o,n.attachShader(o,this.buildShader(n.VERTEX_SHADER,Dt)),n.attachShader(o,this.buildShader(n.FRAGMENT_SHADER,gt)),n.linkProgram(o),n.useProgram(o),this.font.graphical&&n.uniform1i(n.getUniformLocation(o,"h"),1),this.positionAttribLocation=this.getAttribLocation("a"),this.textureAttribLocation=this.getAttribLocation("b"),this.fgColorAttribLocation=this.getAttribLocation("c"),this.bgColorAttribLocation=this.getAttribLocation("d");const _=i*s;this.positionsArray=new Float32Array(_*3*4),this.indexArray=new Uint16Array(_*6),this.textureArray=new Float32Array(_*2*4),this.foregroundUint8Array=new Uint8Array(_*4*4),this.foregroundDataView=new DataView(this.foregroundUint8Array.buffer),this.backgroundUint8Array=new Uint8Array(_*4*4),this.backgroundDataView=new DataView(this.backgroundUint8Array.buffer);let h=0,a=0,l=0;for(let c=0;c<s;c++)for(let d=0;d<i;d++)this.positionsArray[h++]=T(d,i),this.positionsArray[h++]=-T(c,s),this.positionsArray[h++]=T(d+1,i),this.positionsArray[h++]=-T(c,s),this.positionsArray[h++]=T(d+1,i),this.positionsArray[h++]=-T(c+1,s),this.positionsArray[h++]=T(d,i),this.positionsArray[h++]=-T(c+1,s),this.indexArray[a++]=l+0,this.indexArray[a++]=l+1,this.indexArray[a++]=l+2,this.indexArray[a++]=l+0,this.indexArray[a++]=l+2,this.indexArray[a++]=l+3,l+=4;this.positionBuffer=n.createBuffer(),this.indexBuffer=n.createBuffer(),this.textureBuffer=n.createBuffer(),this.foregroundBuffer=n.createBuffer(),this.backgroundBuffer=n.createBuffer(),n.bindBuffer(n.ARRAY_BUFFER,this.positionBuffer),n.bufferData(n.ARRAY_BUFFER,this.positionsArray,n.STATIC_DRAW),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,this.indexBuffer),n.bufferData(n.ELEMENT_ARRAY_BUFFER,this.indexArray,n.STATIC_DRAW),this.texture=this.loadTexture(this.font.url),this.lastRenderTime=0,this.renderDelta=0,this.fps=0,this.averageFps=0,this.requestAnimationFrame()}handleResize(){const e=this.canvas.parentElement;if(!e)return;const i=e.offsetWidth/this.pixelWidth,s=e.offsetHeight/this.pixelHeight,r=Math.min(i,s),n=r*this.pixelWidth|0,o=r*this.pixelHeight|0;this.canvas.style.width=n+"px",this.canvas.style.height=o+"px"}getAttribLocation(e){const i=this.gl.getAttribLocation(this.program,e);return this.gl.enableVertexAttribArray(i),i}flush(){let e=0,i=0;for(let s=0;s<this.height;s++)for(let r=0;r<this.width;r++){const n=this.getCell(r,s);if(!n.dirty){e+=8,i+=16;continue}const o=n.charCode%16,_=n.charCode/16|0;this.textureArray[e++]=o,this.textureArray[e++]=_,this.textureArray[e++]=o+1,this.textureArray[e++]=_,this.textureArray[e++]=o+1,this.textureArray[e++]=_+1,this.textureArray[e++]=o,this.textureArray[e++]=_+1;for(let h=0;h<4;h++)this.foregroundDataView.setUint32(i,n.fg,!1),this.backgroundDataView.setUint32(i,n.bg,!1),i+=4;n.dirty=!1}}isKeyDown(e){return this.keys.getKey(e).down}isKeyPressed(e){return this.keys.getKey(e).isPressed()}getKeyDownCount(e){return this.keys.getKey(e).downCount}getMovementKey(){if(this.isKeyPressed(f.VK_NUMPAD1)||this.isKeyPressed(f.VK_B))return new g(-1,1);if(this.isKeyPressed(f.VK_NUMPAD2)||this.isKeyPressed(f.VK_J)||this.isKeyPressed(f.VK_DOWN))return new g(0,1);if(this.isKeyPressed(f.VK_NUMPAD3)||this.isKeyPressed(f.VK_N))return new g(1,1);if(this.isKeyPressed(f.VK_NUMPAD4)||this.isKeyPressed(f.VK_H)||this.isKeyPressed(f.VK_LEFT))return new g(-1,0);if(this.isKeyPressed(f.VK_NUMPAD5)||this.isKeyPressed(f.VK_PERIOD))return new g(0,0);if(this.isKeyPressed(f.VK_NUMPAD6)||this.isKeyPressed(f.VK_L)||this.isKeyPressed(f.VK_RIGHT))return new g(1,0);if(this.isKeyPressed(f.VK_NUMPAD7)||this.isKeyPressed(f.VK_Y))return new g(-1,-1);if(this.isKeyPressed(f.VK_NUMPAD8)||this.isKeyPressed(f.VK_K)||this.isKeyPressed(f.VK_UP))return new g(0,-1);if(this.isKeyPressed(f.VK_NUMPAD9)||this.isKeyPressed(f.VK_U))return new g(1,-1)}buildShader(e,i){const s=this.gl,r=s.createShader(e);if(!r)throw new Error("An error occurred compiling the shader: ");if(s.shaderSource(r,i),s.compileShader(r),!s.getShaderParameter(r,s.COMPILE_STATUS))throw new Error("An error occurred compiling the shader: "+s.getShaderInfoLog(r));return r}loadTexture(e){const i=this.gl,s=i.createTexture();i.bindTexture(i.TEXTURE_2D,s);const r=0,n=i.RGBA,o=1,_=1,h=0,a=i.RGBA,l=i.UNSIGNED_BYTE,c=new Uint8Array([0,0,0,255]);i.texImage2D(i.TEXTURE_2D,r,n,o,_,h,a,l,c);const d=new Image;return d.onload=()=>{i.bindTexture(i.TEXTURE_2D,s),i.texImage2D(i.TEXTURE_2D,r,n,a,l,d),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR)},d.src=e,s}render(){const e=this.gl;e.clearColor(0,0,0,1),e.clearDepth(1),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.viewport(0,0,this.pixelWidth,this.pixelHeight);{const s=e.FLOAT,r=!1,n=0,o=0;e.bindBuffer(e.ARRAY_BUFFER,this.positionBuffer),e.vertexAttribPointer(this.positionAttribLocation,2,s,r,n,o)}{const s=e.FLOAT,r=!1,n=0,o=0;e.bindBuffer(e.ARRAY_BUFFER,this.textureBuffer),e.bufferData(e.ARRAY_BUFFER,this.textureArray,e.DYNAMIC_DRAW),e.vertexAttribPointer(this.textureAttribLocation,2,s,r,n,o)}{const s=e.UNSIGNED_BYTE,r=!0,n=0,o=0;e.bindBuffer(e.ARRAY_BUFFER,this.foregroundBuffer),e.bufferData(e.ARRAY_BUFFER,this.foregroundUint8Array,e.DYNAMIC_DRAW),e.vertexAttribPointer(this.fgColorAttribLocation,4,s,r,n,o)}{const s=e.UNSIGNED_BYTE,r=!0,n=0,o=0;e.bindBuffer(e.ARRAY_BUFFER,this.backgroundBuffer),e.bufferData(e.ARRAY_BUFFER,this.backgroundUint8Array,e.DYNAMIC_DRAW),e.vertexAttribPointer(this.bgColorAttribLocation,4,s,r,n,o)}e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.indexBuffer),e.useProgram(this.program),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.texture);{const i=this.width*this.height*6,s=e.UNSIGNED_SHORT,r=0;e.drawElements(e.TRIANGLES,i,s,r)}}requestAnimationFrame(){window.requestAnimationFrame(e=>this.renderLoop(e))}renderLoop(e){this.lastRenderTime===0?(this.lastRenderTime=e,this.fps=0):(this.renderDelta=e-this.lastRenderTime,this.lastRenderTime=e,this.fps=1e3/this.renderDelta,this.averageFps=.95*this.averageFps+.05*this.fps),this.keys.updateKeys(e),this.mouse.update(e),this.update&&this.update(),this.flush(),this.render(),this.requestAnimationFrame()}}export{B,K as C,it as F,f as K,G as M,g as P,V as R,Rt as T,m as a,A as b,E as c,Bt as d,Nt as f,Tt as l};
