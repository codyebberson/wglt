import"../modulepreload-polyfill.b7f2da20.js";/* empty css                */var B;(function(i){i[i.None=0]="None",i[i.Blend=1]="Blend",i[i.Add=2]="Add"})(B||(B={}));function U(i,t,e,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,e):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(i,t,e,r);else for(var _=i.length-1;_>=0;_--)(s=i[_])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o}function h(i,t,e,r){return r===void 0&&(r=255),(i<<24)+(t<<16)+(e<<8)+r}const I={BLACK:h(0,0,0),WHITE:h(255,255,255),LIGHT_GRAY:h(170,170,170),DARK_GRAY:h(85,85,85),YELLOW:h(255,255,85),BROWN:h(170,85,0),LIGHT_RED:h(255,85,85),DARK_RED:h(170,0,0),LIGHT_GREEN:h(85,255,85),DARK_GREEN:h(0,170,0),LIGHT_CYAN:h(85,255,255),DARK_CYAN:h(0,170,170),LIGHT_BLUE:h(85,85,255),DARK_BLUE:h(0,0,170),LIGHT_MAGENTA:h(255,85,255),DARK_MAGENTA:h(170,0,170),ORANGE:h(255,136,0)},X=new Map;function S(i){X.set(i.name,i)}function M(i){return typeof i=="string"&&i.length>0?i.charCodeAt(0):i}let w=class{constructor(t,e,r,n,o){this.x=t,this.y=e,r!==void 0?this.charCode=M(r):this.charCode=" ".charCodeAt(0),n!==void 0?this.fg=n:this.fg=I.WHITE,o!==void 0?this.bg=o:this.bg=I.BLACK,this.dirty=!0,this.blocked=!1,this.blockedSight=!1,this.explored=!1,this.visible=!1,this.pathId=-1,this.g=0,this.h=0,this.prev=null}setCharCode(t){this.charCode!==t&&(this.charCode=t,this.dirty=!0)}setForeground(t){t!=null&&t!==this.fg&&(this.fg=t,this.dirty=!0)}setBackground(t){t!=null&&t!==this.bg&&(this.bg=t,this.dirty=!0)}setValue(t,e,r){return typeof t=="string"&&(t=t.charCodeAt(0)),typeof t=="number"?(this.setCharCode(t),e!==void 0&&this.setForeground(e),r!==void 0&&this.setBackground(r)):this.drawCell(t,B.None),this.dirty}drawCell(t,e){const r=t.bg&255;e===B.None||t.charCode>0?(this.setCharCode(t.charCode),this.setForeground(t.fg)):r>0&&r<255&&this.setForeground(this.blendColors(this.fg,t.bg,e)),e===B.None||r===255?this.setBackground(t.bg):r>0&&this.setBackground(this.blendColors(this.bg,t.bg,e))}blendColors(t,e,r){const n=e&255,o=(255-n)/255,s=1-o,_=t>>24&255,l=t>>16&255,a=t>>8&255,u=e>>24&255,d=e>>16&255,A=e>>8&255;switch(r){case B.Blend:return h(o*_+s*u|0,o*l+s*d|0,o*a+s*A|0);case B.Add:return h(this.clamp(_+s*u|0),this.clamp(l+s*d|0),this.clamp(a+s*A|0));default:return e}}clamp(t){return Math.min(255,t)}};w=U([S],w);var T;(function(i){i[i.SMILEY=1]="SMILEY",i[i.INVERSE_SMILEY=2]="INVERSE_SMILEY",i[i.HEART=3]="HEART",i[i.DIAMOND=4]="DIAMOND",i[i.CLUB=5]="CLUB",i[i.SPADE=6]="SPADE",i[i.BULLET=7]="BULLET",i[i.INVERSE_BULLET=8]="INVERSE_BULLET",i[i.LIGHT_SHADE=176]="LIGHT_SHADE",i[i.MEDIUM_SHADE=177]="MEDIUM_SHADE",i[i.DARK_SHADE=178]="DARK_SHADE",i[i.BOX_SINGLE_VERTICAL=179]="BOX_SINGLE_VERTICAL",i[i.BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT=180]="BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT",i[i.BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT=185]="BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT",i[i.BOX_DOUBLE_VERTICAL=186]="BOX_DOUBLE_VERTICAL",i[i.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT=187]="BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT",i[i.BOX_DOUBLE_UP_AND_DOUBLE_LEFT=188]="BOX_DOUBLE_UP_AND_DOUBLE_LEFT",i[i.BOX_SINGLE_DOWN_AND_SINGLE_LEFT=191]="BOX_SINGLE_DOWN_AND_SINGLE_LEFT",i[i.BOX_SINGLE_UP_AND_SINGLE_RIGHT=192]="BOX_SINGLE_UP_AND_SINGLE_RIGHT",i[i.BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP=193]="BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP",i[i.BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN=194]="BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN",i[i.BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT=195]="BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT",i[i.BOX_SINGLE_HORIZONTAL=196]="BOX_SINGLE_HORIZONTAL",i[i.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL=197]="BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL",i[i.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT=200]="BOX_DOUBLE_UP_AND_DOUBLE_RIGHT",i[i.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT=201]="BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT",i[i.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP=202]="BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP",i[i.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN=203]="BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN",i[i.BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT=204]="BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT",i[i.BOX_DOUBLE_HORIZONTAL=205]="BOX_DOUBLE_HORIZONTAL",i[i.BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL=206]="BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL",i[i.BOX_SINGLE_UP_AND_SINGLE_LEFT=217]="BOX_SINGLE_UP_AND_SINGLE_LEFT",i[i.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT=218]="BOX_SINGLE_DOWN_AND_SINGLE_RIGHT",i[i.BLOCK_FULL=219]="BLOCK_FULL",i[i.BLOCK_BOTTOM_HALF=220]="BLOCK_BOTTOM_HALF",i[i.BLOCK_LEFT_HALF=221]="BLOCK_LEFT_HALF",i[i.BLOCK_RIGHT_HALF=222]="BLOCK_RIGHT_HALF",i[i.BLOCK_TOP_HALF=223]="BLOCK_TOP_HALF"})(T||(T={}));function W(i,t){const e=new RegExp("(\\S(.{0,"+t+"}\\S)?)\\s+","g");return(i+" ").replace(e,`$1
`).trim().split(`
`).map(r=>r.trim())}let v=class{constructor(t,e,r){this.width=t,this.height=e,this.grid=[],this.originX=0,this.originY=0,this.minX=0,this.maxX=0,this.minY=0,this.maxY=0,this.radius=0;for(let n=0;n<e;n++){const o=[];for(let s=0;s<t;s++)o.push(new w(s,n));this.grid.push(o)}if(this.clear(),r)for(let n=0;n<e;n++)for(let o=0;o<t;o++)this.grid[n][o].blocked=this.grid[n][o].blockedSight=r(o,n)}clear(){for(let t=0;t<this.height;t++)for(let e=0;e<this.width;e++)this.drawChar(e,t,0)}getCell(t,e){if(!(t<0||e<0||t>=this.width||e>=this.height))return this.grid[e][t]}getCharCode(t,e){if(!(t<0||e<0||t>=this.width||e>=this.height))return this.grid[e][t].charCode}drawChar(t,e,r,n,o){this.clip&&!this.clip.contains({x:t,y:e})||t>=0&&t<this.width&&e>=0&&e<this.height&&this.grid[e|0][t|0].setValue(r,n,o)}drawString(t,e,r,n,o){const s=r.split(`
`);for(let _=0;_<s.length;_++)this.drawStringLine(t,e+_,s[_],n,o)}drawStringLine(t,e,r,n,o){for(let s=0;s<r.length;s++)this.drawChar(t+s,e,r.charCodeAt(s),n,o)}drawCenteredString(t,e,r,n,o){this.drawString(t-Math.floor(r.length/2),e,r,n,o)}drawMessage(t,e,r,n){if(r.text){const o=W(r.text,n||this.width-t);for(const s of o)this.drawStringLine(t,e,s,r.fg,r.bg),e++}if(r.children)for(const o of r.children)e=this.drawMessage(t,e,o,n);return e}drawHLine(t,e,r,n,o,s){for(let _=t;_<t+r;_++)this.drawChar(_,e,n,o,s)}drawVLine(t,e,r,n,o,s){for(let _=e;_<e+r;_++)this.drawChar(t,_,n,o,s)}drawRect(t,e,r,n,o,s,_){this.drawHLine(t,e,r,o,s,_),this.drawHLine(t,e+n-1,r,o,s,_),this.drawVLine(t,e,n,o,s,_),this.drawVLine(t+r-1,e,n,o,s,_)}drawBox(t,e,r,n,o,s,_,l,a,u,d,A,c,L){this.drawHLine(t,e,r,o,c,L),this.drawHLine(t,e+n-1,r,_,c,L),this.drawVLine(t,e,n,l,c,L),this.drawVLine(t+r-1,e,n,s,c,L),this.drawChar(t,e,a,c,L),this.drawChar(t+r-1,e,u,c,L),this.drawChar(t,e+n-1,A,c,L),this.drawChar(t+r-1,e+n-1,d,c,L)}drawSingleBox(t,e,r,n,o,s){this.drawBox(t,e,r,n,T.BOX_SINGLE_HORIZONTAL,T.BOX_SINGLE_VERTICAL,T.BOX_SINGLE_HORIZONTAL,T.BOX_SINGLE_VERTICAL,T.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT,T.BOX_SINGLE_DOWN_AND_SINGLE_LEFT,T.BOX_SINGLE_UP_AND_SINGLE_LEFT,T.BOX_SINGLE_UP_AND_SINGLE_RIGHT,o,s)}drawDoubleBox(t,e,r,n,o,s){this.drawBox(t,e,r,n,T.BOX_DOUBLE_HORIZONTAL,T.BOX_DOUBLE_VERTICAL,T.BOX_DOUBLE_HORIZONTAL,T.BOX_DOUBLE_VERTICAL,T.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT,T.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT,T.BOX_DOUBLE_UP_AND_DOUBLE_LEFT,T.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT,o,s)}fillRect(t,e,r,n,o,s,_){for(let l=e;l<e+n;l++)this.drawHLine(t,l,r,o,s,_)}drawConsole(t,e,r,n,o,s,_,l){l=l||B.None;for(let a=0;a<_;a++)for(let u=0;u<s;u++){const d=r.getCell(n+u,o+a);d&&this.drawCell(t+u,e+a,d,l)}}drawCell(t,e,r,n){t>=0&&t<this.width&&e>=0&&e<this.height&&this.grid[e][t].drawCell(r,n)}setBlocked(t,e,r){t>=0&&t<this.width&&e>=0&&e<this.height&&(this.grid[e][t].blocked=r)}setBlockedSight(t,e,r){t>=0&&t<this.width&&e>=0&&e<this.height&&(this.grid[e][t].blockedSight=r)}isVisible(t,e){return t<this.minX||t>this.maxX||e<this.minY||e>this.maxY?!1:this.grid[e][t].visible}isBlocked(t,e){return t<0||t>this.width||e<0||e>this.height?!0:this.grid[e][t].blocked}isBlockedSight(t,e){return t<0||t>this.width||e<0||e>this.height?!0:this.grid[e][t].blockedSight}computeOctantY(t,e){const r=[],n=[];let o=1,s=0,_=0,l=0,a,u,d,A,c,L,N,O,R,g;for(u=this.originY+e;u>=this.minY&&u<=this.maxY;u+=e,_=s,++o)for(d=.5/o,g=-1,A=Math.floor(l*o+.5),a=this.originX+A*t;A<=o&&a>=this.minX&&a<=this.maxX;a+=t,++A,g=R){if(c=!0,L=!1,N=A/o,O=g,R=N+d,_>0){if(!(this.grid[u-e][a].visible&&!this.grid[u-e][a].blockedSight)&&!(this.grid[u-e][a-t].visible&&!this.grid[u-e][a-t].blockedSight))c=!1;else for(let f=0;f<_&&c;++f)if(O<=n[f]&&R>=r[f]){if(this.grid[u][a].blockedSight)if(O>=r[f]&&R<=n[f]){c=!1;break}else r[f]=Math.min(r[f],O),n[f]=Math.max(n[f],R),L=!0;else if(N>r[f]&&N<n[f]){c=!1;break}}}c&&(this.grid[u][a].visible=!0,this.grid[u][a].blockedSight&&(l>=O?l=R:L||(r[s]=O,n[s++]=R)))}}computeOctantX(t,e){const r=[],n=[];let o=1,s=0,_=0,l=0,a,u,d,A,c,L,N,O,R,g;for(a=this.originX+t;a>=this.minX&&a<=this.maxX;a+=t,_=s,++o)for(d=.5/o,g=-1,A=Math.floor(l*o+.5),u=this.originY+A*e;A<=o&&u>=this.minY&&u<=this.maxY;u+=e,++A,g=R){if(c=!0,L=!1,N=A/o,O=g,R=N+d,_>0){if(!(this.grid[u][a-t].visible&&!this.grid[u][a-t].blockedSight)&&!(this.grid[u-e][a-t].visible&&!this.grid[u-e][a-t].blockedSight))c=!1;else for(let f=0;f<_&&c;++f)if(O<=n[f]&&R>=r[f]){if(this.grid[u][a].blockedSight)if(O>=r[f]&&R<=n[f]){c=!1;break}else r[f]=Math.min(r[f],O),n[f]=Math.max(n[f],R),L=!0;else if(N>r[f]&&N<n[f]){c=!1;break}}}c&&(this.grid[u][a].visible=!0,this.grid[u][a].blockedSight&&(l>=O?l=R:L||(r[s]=O,n[s++]=R)))}}computeFov(t,e,r,n,o){if(this.originX=t,this.originY=e,this.radius=r,n)this.minX=Math.min(this.minX,Math.max(0,t-r)),this.minY=Math.min(this.minY,Math.max(0,e-r)),this.maxX=Math.max(this.maxX,Math.min(this.width-1,t+r)),this.maxY=Math.max(this.maxY,Math.min(this.height-1,e+r));else{this.minX=Math.max(0,t-r),this.minY=Math.max(0,e-r),this.maxX=Math.min(this.width-1,t+r),this.maxY=Math.min(this.height-1,e+r);for(let s=this.minY;s<=this.maxY;s++)for(let _=this.minX;_<=this.maxX;_++)this.grid[s][_].visible=!1}this.grid[e][t].visible=!0,o===void 0?(this.computeOctantY(1,1),this.computeOctantX(1,1),this.computeOctantX(1,-1),this.computeOctantY(1,-1),this.computeOctantY(-1,-1),this.computeOctantX(-1,-1),this.computeOctantX(-1,1),this.computeOctantY(-1,1)):(o&1&&this.computeOctantY(1,1),o&2&&this.computeOctantX(1,1),o&4&&this.computeOctantX(1,-1),o&8&&this.computeOctantY(1,-1),o&16&&this.computeOctantY(-1,-1),o&32&&this.computeOctantX(-1,-1),o&64&&this.computeOctantX(-1,1),o&128&&this.computeOctantY(-1,1))}updateExplored(){for(let t=this.minY;t<=this.maxY;t++)for(let e=this.minX;e<=this.maxX;e++){const r=this.grid[t][e];r.explored=r.explored||r.visible}}};v=U([S],v);class Y{constructor(t,e,r,n,o){this.url=t,this.charWidth=e,this.charHeight=r,this.scale=n||1,this.graphical=!!o}}const y="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAEhklEQVRIx42Sv4oUQRDGC4UzadSwwMUD8QEKlbWD4Q58B/NGpTVocKO1wXHUzMAH0AcwMTYVGg5ag0IzEXaRjdZEZKNzkKbHqtnzHypY09M9+5uvqr7pbYCuC6ftaRhgONXs30eAh0O1rYDm4IS/eH0B8GxRW2vxo396yu/fb0ZFrW1zcOXlPU/XPwK8PGjbWhVwM4KnH61912oK4+zmmHJaQotyt1kvtC2Atdo24iohPDiG/v4eICJsY3Wy8Yvr0DSIBOdxgH6v8wsriWhc8s0AtaK/GzSl1jR0nSjQnwki6FQxNFKjgzO2a7BBqucH7dL4M9z96CIhT1Fs/AgKgcA6dKCxI29DaHNwRJ4EGAU1sU0OG9rmE4SIc3A4FChACqqhJRwpxkqh9wxag4DSmEJ5DtpFwAP4GUf6lmKcFFti1BYuQp4xN8kxM2kNhjdkTOiTUeAKGvhA1rLpMbYACQzCITlTDRMbLYoEa2JWPSMRFZIupcSzMVKcEUkX+sOG+ChNX2vD8ex6k7OFHL0P1655JuPd53WAD+yTv3UrCQiuHmYBbfIxpkImuvpBQBkVb5g4XHv3JkNireG8AO9zDhBZu2z2OMZ11S5/RIlyMefMNaZ4GsCz5xcjyM6hHYEjAYEfO8Ig1rklAe9sRIeYAdwyoIBq6YIzCAKiWoifA3m3o2AzWcdYKOdY47EIf8QABCuYgIUVmdVMEYEDA0Hmo/3D6KKJbh5mxhP3UsWIE97wnEygyizOfOLi2JOJW8CeOblW9IHeKZgv4zxuzDryOmb+4aQH+MXV6e0ywdUcxqCjBWl5GpbzZduOG1QEiGXP86T7EfiJfkMQ4OO4H0yqyNC2zlziWEN7Ywuc2fQ4p5BNkS5QYXP2h5NtRJh0vCKQidtVJmCGAwDSSQpYggSxiRIyzewsgCh4xxiTPDMh5aj//l7btqkr6rQyIOtLji4lVRQwXdzvus40Y53M33fh50GZwF4ExQeMlvuTggLzSi4ElKczUO7zVtpwdyMKdqZKOWb2nDblawPxPmuMwFEWBW+jlZR1eYtS442kiBGMWCi/h1/+GAR6NYOJWiqNJXFygFtrkx5C0O3IeFGs67HhEEhmBu/BUOT+0551pXxYIF+Elpi5AKRkLl5GUbCCZddyMv621ujEBPP4vSy2fotTx3U+d3WBiFOA6VSGSB49v/M7GBX9FPrDaT2c9qr4PCpwZ7qz813R94dVFIe19v33GlMZUghQFb8BrfE7QBmgBMbrn2B3enn/y3B5+DL8UBAdnejdYdBxeV9ejwoYNTgW0Ok/gA7UG2GAzanhL0DG7q4svynwF8UwDPu7u/vD0IudzSltMtVbP+J/gUbR29oJ7Fg9s6Uy+DnpiTCOYc4cXOeXMWfsusSw7FOg9x655nax6BlecwpOQQ68WBwp+H2LMQTuOq2RUigzh2Q/R3CWARJIJG199EwOTyKBlQMznshCRGeQ5gHABAQl6M4gLEdAzVaBWMCiANdsayDCHBA/hagKYfielrJIlipKKQIA9Nf3wBloTHT6BuAx15zRNa1nAAAAAElFTkSuQmCC",K=new Y(y,8,8);var P;(function(i){i[i.OCTANT_SOUTH_SOUTHEAST=1]="OCTANT_SOUTH_SOUTHEAST",i[i.OCTANT_EAST_SOUTHEAST=2]="OCTANT_EAST_SOUTHEAST",i[i.OCTANT_EAST_NORTHTHEAST=4]="OCTANT_EAST_NORTHTHEAST",i[i.OCTANT_NORTH_NORTHEAST=8]="OCTANT_NORTH_NORTHEAST",i[i.OCTANT_NORTH_NORTHWEST=16]="OCTANT_NORTH_NORTHWEST",i[i.OCTANT_WEST_NORTHEAST=32]="OCTANT_WEST_NORTHEAST",i[i.OCTANT_WEST_SOUTHWEST=64]="OCTANT_WEST_SOUTHWEST",i[i.OCTANT_SOUTH_SOUTHWEST=128]="OCTANT_SOUTH_SOUTHWEST"})(P||(P={}));var H;(function(i){i[i.QUADRANT_SOUTHEAST=3]="QUADRANT_SOUTHEAST",i[i.QUADRANT_EAST=6]="QUADRANT_EAST",i[i.QUADRANT_NORTHEAST=12]="QUADRANT_NORTHEAST",i[i.QUADRANT_NORTH=24]="QUADRANT_NORTH",i[i.QUADRANT_NORTHWEST=48]="QUADRANT_NORTHWEST",i[i.QUADRANT_WEST=96]="QUADRANT_WEST",i[i.QUADRANT_SOUTHWEST=192]="QUADRANT_SOUTHWEST",i[i.QUADRANT_SOUTH=129]="QUADRANT_SOUTH"})(H||(H={}));let D=class{constructor(t,e){this.x=t,this.y=e}};D=U([S],D);let V=class{constructor(t,e,r,n){this.x=this.left=t,this.y=this.top=e,this.width=r,this.height=n,this.x2=t+r,this.y2=e+n}getCenter(){return new D(this.x+this.width/2|0,this.y+this.height/2|0)}intersects(t){return this.x<=t.x2&&this.x2>=t.x&&this.y<=t.y2&&this.y2>=t.y}contains(t){return t.x>=this.x&&t.x<this.x2&&t.y>=this.y&&t.y<this.y2}};V=U([S],V);let b=class{constructor(t,e,r,n){this.text=t,this.fg=e,this.bg=r,this.children=n}getWidth(){let t=0;if(this.text)for(const e of this.text.split(`
`))t=Math.max(t,e.length);if(this.children)for(const e of this.children)t=Math.max(t,e.getWidth());return t}getHeight(){let t=0;if(this.text&&(t+=this.text.split(`
`).length),this.children)for(const e of this.children)t+=e.getHeight();return t}};b=U([S],b);const k=200,z=1e3/15;class p{constructor(){this.down=!1,this.downTime=0,this.repeat=!1,this.repeatTime=0,this.downCount=0,this.upCount=100}setDown(t){this.down!==t&&(this.down=t,this.repeat=!1,this.downTime=this.repeatTime=performance.now())}update(t){this.repeat=!1,this.down?(this.downCount++,this.upCount=0,t-this.downTime>=k&&t-this.repeatTime>=z&&(this.repeat=!0,this.repeatTime=t)):(this.downCount=0,this.upCount++)}isPressed(){return this.downCount===1||this.repeat}isClicked(){return this.upCount===1}}class Q{constructor(t){this.keys=new Map,Object.keys(E).forEach(e=>this.keys.set(e,new p)),t.addEventListener("keydown",e=>this.setKey(e,!0)),t.addEventListener("keyup",e=>this.setKey(e,!1))}setKey(t,e){const r=t.code;r!==E.VK_F11&&(t.stopPropagation(),t.preventDefault(),this.getKey(r).setDown(e))}updateKeys(t){this.keys.forEach(e=>e.update(t))}getKey(t){let e=this.keys.get(t);return e||(e=new p,this.keys.set(t,e)),e}}var E;(function(i){i.VK_CANCEL="Pause",i.VK_BACKSPACE="Backspace",i.VK_TAB="Tab",i.VK_ENTER="Enter",i.VK_SHIFT_LEFT="ShiftLeft",i.VK_SHIFT_RIGHT="ShiftLeft",i.VK_CONTROL_LEFT="ControlLeft",i.VK_CONTROL_RIGHT="ControlRight",i.VK_ALT_LEFT="AltLeft",i.VK_ALT_RIGHT="AltRight",i.VK_PAUSE="Pause",i.VK_CAPS_LOCK="CapsLock",i.VK_ESCAPE="Escape",i.VK_SPACE="Space",i.VK_PAGE_UP="PageUp",i.VK_PAGE_DOWN="PageDown",i.VK_END="End",i.VK_HOME="Home",i.VK_LEFT="ArrowLeft",i.VK_UP="ArrowUp",i.VK_RIGHT="ArrowRight",i.VK_DOWN="ArrowDown",i.VK_INSERT="Insert",i.VK_DELETE="Delete",i.VK_0="Digit0",i.VK_1="Digit1",i.VK_2="Digit2",i.VK_3="Digit3",i.VK_4="Digit4",i.VK_5="Digit5",i.VK_6="Digit6",i.VK_7="Digit7",i.VK_8="Digit8",i.VK_9="Digit9",i.VK_SEMICOLON="Semicolon",i.VK_EQUALS="Equal",i.VK_A="KeyA",i.VK_B="KeyB",i.VK_C="KeyC",i.VK_D="KeyD",i.VK_E="KeyE",i.VK_F="KeyF",i.VK_G="KeyG",i.VK_H="KeyH",i.VK_I="KeyI",i.VK_J="KeyJ",i.VK_K="KeyK",i.VK_L="KeyL",i.VK_M="KeyM",i.VK_N="KeyN",i.VK_O="KeyO",i.VK_P="KeyP",i.VK_Q="KeyQ",i.VK_R="KeyR",i.VK_S="KeyS",i.VK_T="KeyT",i.VK_U="KeyU",i.VK_V="KeyV",i.VK_W="KeyW",i.VK_X="KeyX",i.VK_Y="KeyY",i.VK_Z="KeyZ",i.VK_CONTEXT_MENU="ContextMenu",i.VK_NUMPAD0="Numpad0",i.VK_NUMPAD1="Numpad1",i.VK_NUMPAD2="Numpad2",i.VK_NUMPAD3="Numpad3",i.VK_NUMPAD4="Numpad4",i.VK_NUMPAD5="Numpad5",i.VK_NUMPAD6="Numpad6",i.VK_NUMPAD7="Numpad7",i.VK_NUMPAD8="Numpad8",i.VK_NUMPAD9="Numpad9",i.VK_NUMPAD_ENTER="NumpadEnter",i.VK_MULTIPLY="NumpadMultiply",i.VK_ADD="NumpadAdd",i.VK_SEPARATOR="NumpadDecimal",i.VK_SUBTRACT="NumpadSubtract",i.VK_DECIMAL="NumpadDecimal",i.VK_DIVIDE="NumpadDivide",i.VK_F1="F1",i.VK_F2="F2",i.VK_F3="F3",i.VK_F4="F4",i.VK_F5="F5",i.VK_F6="F6",i.VK_F7="F7",i.VK_F8="F8",i.VK_F9="F9",i.VK_F10="F10",i.VK_F11="F11",i.VK_F12="F12",i.VK_F13="F13",i.VK_F14="F14",i.VK_F15="F15",i.VK_F16="F16",i.VK_F17="F17",i.VK_F18="F18",i.VK_F19="F19",i.VK_F20="F20",i.VK_F21="F21",i.VK_F22="F22",i.VK_F23="F23",i.VK_F24="F24",i.VK_NUM_LOCK="NumLock",i.VK_SCROLL_LOCK="ScrollLock",i.VK_COMMA="Comma",i.VK_PERIOD="Period",i.VK_SLASH="Slash",i.VK_BACKQUOTE="Backquote",i.VK_OPEN_BRACKET="BracketLeft",i.VK_BACK_SLASH="Backslash",i.VK_CLOSE_BRACKET="BracketRight",i.VK_QUOTE="Quote",i.VK_META="OSLeft"})(E||(E={}));T.BLOCK_TOP_HALF,T.BLOCK_RIGHT_HALF;class Z{constructor(t){this.el=t.canvas,this.width=t.width,this.height=t.height,this.prevX=0,this.prevY=0,this.x=0,this.y=0,this.dx=0,this.dy=0,this.wheelDeltaX=0,this.wheelDeltaY=0,this.buttons=[new p,new p,new p];const e=this.el;e.addEventListener("mousedown",r=>this.handleEvent(r)),e.addEventListener("mouseup",r=>this.handleEvent(r)),e.addEventListener("mousemove",r=>this.handleEvent(r)),e.addEventListener("contextmenu",r=>this.handleEvent(r)),e.addEventListener("touchstart",r=>this.handleTouchEvent(r)),e.addEventListener("touchend",r=>this.handleTouchEvent(r)),e.addEventListener("touchcancel",r=>this.handleTouchEvent(r)),e.addEventListener("touchmove",r=>this.handleTouchEvent(r)),e.addEventListener("wheel",r=>this.handleWheelEvent(r))}handleTouchEvent(t){if(t.stopPropagation(),t.preventDefault(),t.touches.length>0){const e=t.touches[0];this.updatePosition(e.clientX,e.clientY),this.buttons[0].setDown(!0)}else this.buttons[0].setDown(!1)}handleEvent(t){t.stopPropagation(),t.preventDefault(),this.updatePosition(t.clientX,t.clientY),t.type==="mousedown"&&(this.buttons[t.button].setDown(!0),this.el.focus()),t.type==="mouseup"&&this.buttons[t.button].setDown(!1)}handleWheelEvent(t){t.stopPropagation(),t.preventDefault(),this.wheelDeltaX=t.deltaX,this.wheelDeltaY=t.deltaY}updatePosition(t,e){let r=this.el.getBoundingClientRect();const n=this.width/this.height,o=r.width/r.height;if(o-n>.01){const s=n*r.height,_=r.width-s;r=new V(Math.floor(_/2),0,s,r.height)}if(o-n<-.01){const s=r.width/n,_=r.height-s;r=new V(0,Math.floor(_/2),r.width,s)}this.x=this.width*(t-r.left)/r.width|0,this.y=this.height*(e-r.top)/r.height|0}update(t){this.dx=this.x-this.prevX,this.dy=this.y-this.prevY,this.prevX=this.x,this.prevY=this.y;for(let e=0;e<this.buttons.length;e++)this.buttons[e].update(t)}}h(0,0,0),h(255,255,255),h(136,0,0),h(170,255,238),h(204,68,204),h(0,204,85),h(0,0,170),h(238,238,119),h(221,136,85),h(102,68,0),h(255,119,119),h(51,51,51),h(119,119,119),h(170,255,102),h(0,136,255),h(187,187,187);h(0,0,0),h(255,255,255),h(136,0,0),h(170,255,238),h(204,68,204),h(0,204,85),h(0,0,170),h(238,238,119),h(221,136,85),h(102,68,0),h(255,119,119),h(51,51,51),h(119,119,119),h(170,255,102),h(0,136,255),h(187,187,187);h(0,0,0),h(29,43,83),h(126,37,83),h(0,135,81),h(171,82,54),h(95,87,79),h(194,195,199),h(255,241,232),h(255,0,77),h(255,163,0),h(255,236,39),h(0,228,54),h(41,173,255),h(131,118,156),h(255,119,168),h(255,204,170);let F=class{constructor(t){this.m=2147483648,this.a=1103515245,this.c=12345,this.state=t||1}nextInt(){return this.state=(this.a*this.state+this.c)%this.m,this.state}nextFloat(){return this.nextInt()/(this.m-1)}nextRange(t,e){const r=e-t,n=this.nextInt()/this.m,o=t+(n*r|0);if(isNaN(o))throw new Error("rand nan");return o}chooseIndex(t){const e=t.reduce((o,s)=>o+s),r=this.nextRange(1,e+1);let n=0;for(let o=0;o<t.length;o++)if(n+=t[o],r<=n)return o;return t.length-1}chooseKey(t){const e=Object.keys(t),r=e.map(n=>t[n]);return e[this.chooseIndex(r)]}};F=U([S],F);const q=`#version 300 es
precision highp float;in vec2 a;in vec2 b;in vec3 c;in vec3 d;out vec2 e;out vec4 f;out vec4 g;void main(void){gl_Position=vec4(a.x,a.y,0,1);e=b/16.0;f=vec4(c.r,c.g,c.b,1);g=vec4(d.r,d.g,d.b,1);}`,J=`#version 300 es
precision highp float;in vec2 e;in vec4 f;in vec4 g;uniform bool h;uniform sampler2D s;out vec4 o;void main(void){o=texture(s,e);if(h){if(o.a<0.1){o=texture(s,g.rg*16.0+fract(e*16.0)/16.0);}}else{if(o.r<0.1) {o=g;} else {o=f;}}}`,j=`#version 300 es
precision highp float;
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;
void main(void) {
  gl_Position=vec4(a_position.x, a_position.y, 0.0, 1.0);
  v_texCoord = a_texCoord;
}`,$=`#version 300 es
#define PI 3.1415926535897932384626433832795
precision highp float;
in vec2 v_texCoord;
uniform sampler2D u_texture;
uniform float u_blur;
uniform float u_curvature;
uniform float u_chroma;
uniform float u_scanlineWidth;
uniform float u_scanlineIntensity;
uniform float u_vignette;
out vec4 outputColor;

vec2 curve(vec2 uv) {
  uv = (uv - 0.5) * 2.0;
  uv *= 1.1;
  uv.x *= 1.0 + pow((abs(uv.y) * u_curvature), 2.0);
  uv.y *= 1.0 + pow((abs(uv.x) * u_curvature), 2.0);
  uv /= 1.1;
  uv = (uv / 2.0) + 0.5;
  return uv;
}

void main() {
  vec2 iResolution = vec2(640.0, 360.0);
  vec2 q = v_texCoord;
  vec2 fragCoord = v_texCoord;
  vec2 uv = q;
  uv = curve(uv);

  // Outside of range is black
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    outputColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  vec4 col;

  // Chromatic aberration
  // col = texture(u_texture, uv.xy);
  col.r = 0.7 * texture(u_texture, vec2(uv.x + 0.001 * u_chroma, uv.y + 0.001 * u_chroma)).r;
  col.g = 0.7 * texture(u_texture, vec2(uv.x + 0.000 * u_chroma, uv.y - 0.002 * u_chroma)).g;
  col.b = 0.7 * texture(u_texture, vec2(uv.x - 0.002 * u_chroma, uv.y + 0.000 * u_chroma)).b;
  
  // Blur
  col += 0.05 * texture(u_texture, vec2(uv.x - 2.0 * u_blur / iResolution.x, uv.y));
  col += 0.10 * texture(u_texture, vec2(uv.x - 1.0 * u_blur / iResolution.x, uv.y));
  col += 0.10 * texture(u_texture, vec2(uv.x + 1.0 * u_blur / iResolution.x, uv.y));
  col += 0.05 * texture(u_texture, vec2(uv.x + 2.0 * u_blur / iResolution.x, uv.y));

  // Vignette
  col *= pow(16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y), u_vignette);

  // Scanlines
  col *= clamp(1.0 + u_scanlineWidth * sin(uv.y * iResolution.y * 2.0 * PI), 1.0 - u_scanlineIntensity, 1.0);

  outputColor = vec4(col.rgb, 1.0);
}`;function x(i,t){return-1+2*(i/t)}const tt={font:K};class et extends v{constructor(t,e,r,n){var o;super(e,r),n=n||tt,this.canvas=t,this.font=n.font||K,this.crt=n.crt,this.pixelWidth=e*this.font.charWidth,this.pixelHeight=r*this.font.charHeight,this.pixelScale=((o=n==null?void 0:n.crt)===null||o===void 0?void 0:o.scale)||1,t.width=this.pixelWidth*this.pixelScale,t.height=this.pixelHeight*this.pixelScale,t.style.imageRendering="pixelated",t.style.outline="none",t.tabIndex=0,this.handleResize(),window.addEventListener("resize",()=>this.handleResize()),this.keys=new Q(t),this.mouse=new Z(this);const s=t.getContext("webgl2",{antialias:!1});if(!s)throw new Error("Unable to initialize WebGL. Your browser may not support it.");const _=s.createProgram();if(!_)throw new Error("Unable to initialize WebGL. Your browser may not support it.");this.gl=s,this.program=_,s.attachShader(_,this.buildShader(s.VERTEX_SHADER,q)),s.attachShader(_,this.buildShader(s.FRAGMENT_SHADER,J)),s.linkProgram(_),s.useProgram(_),this.crtProgram=s.createProgram(),s.attachShader(this.crtProgram,this.buildShader(s.VERTEX_SHADER,j)),s.attachShader(this.crtProgram,this.buildShader(s.FRAGMENT_SHADER,$)),s.linkProgram(this.crtProgram),s.useProgram(this.crtProgram),this.crtBlurLocation=s.getUniformLocation(this.crtProgram,"u_blur"),this.crtCurvatureLocation=s.getUniformLocation(this.crtProgram,"u_curvature"),this.crtChromaLocation=s.getUniformLocation(this.crtProgram,"u_chroma"),this.crtScanlineWidthLocation=s.getUniformLocation(this.crtProgram,"u_scanlineWidth"),this.crtScanlineIntensityLocation=s.getUniformLocation(this.crtProgram,"u_scanlineIntensity"),this.crtVignetteLocation=s.getUniformLocation(this.crtProgram,"u_vignette"),this.crtPositionLocation=s.getAttribLocation(this.crtProgram,"a_position"),this.crtPositionBuffer=s.createBuffer(),s.bindBuffer(s.ARRAY_BUFFER,this.crtPositionBuffer),s.bufferData(s.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),s.STATIC_DRAW),s.enableVertexAttribArray(this.crtPositionLocation),s.vertexAttribPointer(this.crtPositionLocation,2,s.FLOAT,!1,0,0),this.crtTexCoordLocation=s.getAttribLocation(this.crtProgram,"a_texCoord"),this.crtTexCoordBuffer=s.createBuffer(),s.bindBuffer(s.ARRAY_BUFFER,this.crtTexCoordBuffer),s.bufferData(s.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),s.STATIC_DRAW),s.enableVertexAttribArray(this.crtTexCoordLocation),s.vertexAttribPointer(this.crtTexCoordLocation,2,s.FLOAT,!1,0,0),this.font.graphical&&s.uniform1i(s.getUniformLocation(_,"h"),1),this.positionAttribLocation=this.getAttribLocation("a"),this.textureAttribLocation=this.getAttribLocation("b"),this.fgColorAttribLocation=this.getAttribLocation("c"),this.bgColorAttribLocation=this.getAttribLocation("d");const l=e*r;this.positionsArray=new Float32Array(l*3*4),this.indexArray=new Uint16Array(l*6),this.textureArray=new Float32Array(l*2*4),this.foregroundUint8Array=new Uint8Array(l*4*4),this.foregroundDataView=new DataView(this.foregroundUint8Array.buffer),this.backgroundUint8Array=new Uint8Array(l*4*4),this.backgroundDataView=new DataView(this.backgroundUint8Array.buffer),this.frameBufferTexture=s.createTexture(),s.bindTexture(s.TEXTURE_2D,this.frameBufferTexture),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,this.pixelWidth,this.pixelHeight,0,s.RGBA,s.UNSIGNED_BYTE,null),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),this.frameBuffer=s.createFramebuffer(),s.bindFramebuffer(s.FRAMEBUFFER,this.frameBuffer),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,this.frameBufferTexture,0);let a=0,u=0,d=0;for(let A=0;A<r;A++)for(let c=0;c<e;c++)this.positionsArray[a++]=x(c,e),this.positionsArray[a++]=-x(A,r),this.positionsArray[a++]=x(c+1,e),this.positionsArray[a++]=-x(A,r),this.positionsArray[a++]=x(c+1,e),this.positionsArray[a++]=-x(A+1,r),this.positionsArray[a++]=x(c,e),this.positionsArray[a++]=-x(A+1,r),this.indexArray[u++]=d+0,this.indexArray[u++]=d+1,this.indexArray[u++]=d+2,this.indexArray[u++]=d+0,this.indexArray[u++]=d+2,this.indexArray[u++]=d+3,d+=4;this.positionBuffer=s.createBuffer(),this.indexBuffer=s.createBuffer(),this.textureBuffer=s.createBuffer(),this.foregroundBuffer=s.createBuffer(),this.backgroundBuffer=s.createBuffer(),s.bindBuffer(s.ARRAY_BUFFER,this.positionBuffer),s.bufferData(s.ARRAY_BUFFER,this.positionsArray,s.STATIC_DRAW),s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,this.indexBuffer),s.bufferData(s.ELEMENT_ARRAY_BUFFER,this.indexArray,s.STATIC_DRAW),this.texture=this.loadTexture(this.font.url),this.lastRenderTime=0,this.renderDelta=0,this.fps=0,this.averageFps=0,this.requestAnimationFrame()}handleResize(){const t=this.canvas.parentElement;if(!t)return;const e=t.offsetWidth/this.pixelWidth,r=t.offsetHeight/this.pixelHeight,n=Math.min(e,r),o=n*this.pixelWidth|0,s=n*this.pixelHeight|0;this.canvas.style.width=o+"px",this.canvas.style.height=s+"px"}getAttribLocation(t){const e=this.gl.getAttribLocation(this.program,t);return this.gl.enableVertexAttribArray(e),e}flush(){let t=0,e=0;for(let r=0;r<this.height;r++)for(let n=0;n<this.width;n++){const o=this.getCell(n,r);if(!o.dirty){t+=8,e+=16;continue}const s=o.charCode%16,_=o.charCode/16|0;this.textureArray[t++]=s,this.textureArray[t++]=_,this.textureArray[t++]=s+1,this.textureArray[t++]=_,this.textureArray[t++]=s+1,this.textureArray[t++]=_+1,this.textureArray[t++]=s,this.textureArray[t++]=_+1;for(let l=0;l<4;l++)this.foregroundDataView.setUint32(e,o.fg,!1),this.backgroundDataView.setUint32(e,o.bg,!1),e+=4;o.dirty=!1}}isKeyDown(t){return this.keys.getKey(t).down}isKeyPressed(t){return this.keys.getKey(t).isPressed()}getKeyDownCount(t){return this.keys.getKey(t).downCount}getMovementKey(){if(this.isKeyPressed(E.VK_NUMPAD1)||this.isKeyPressed(E.VK_B))return new D(-1,1);if(this.isKeyPressed(E.VK_NUMPAD2)||this.isKeyPressed(E.VK_J)||this.isKeyPressed(E.VK_DOWN))return new D(0,1);if(this.isKeyPressed(E.VK_NUMPAD3)||this.isKeyPressed(E.VK_N))return new D(1,1);if(this.isKeyPressed(E.VK_NUMPAD4)||this.isKeyPressed(E.VK_H)||this.isKeyPressed(E.VK_LEFT))return new D(-1,0);if(this.isKeyPressed(E.VK_NUMPAD5)||this.isKeyPressed(E.VK_PERIOD))return new D(0,0);if(this.isKeyPressed(E.VK_NUMPAD6)||this.isKeyPressed(E.VK_L)||this.isKeyPressed(E.VK_RIGHT))return new D(1,0);if(this.isKeyPressed(E.VK_NUMPAD7)||this.isKeyPressed(E.VK_Y))return new D(-1,-1);if(this.isKeyPressed(E.VK_NUMPAD8)||this.isKeyPressed(E.VK_K)||this.isKeyPressed(E.VK_UP))return new D(0,-1);if(this.isKeyPressed(E.VK_NUMPAD9)||this.isKeyPressed(E.VK_U))return new D(1,-1)}buildShader(t,e){const r=this.gl,n=r.createShader(t);if(!n)throw new Error("An error occurred compiling the shader: ");if(r.shaderSource(n,e),r.compileShader(n),!r.getShaderParameter(n,r.COMPILE_STATUS))throw new Error("An error occurred compiling the shader: "+r.getShaderInfoLog(n));return n}loadTexture(t){const e=this.gl,r=e.createTexture();e.bindTexture(e.TEXTURE_2D,r);const n=0,o=e.RGBA,s=1,_=1,l=0,a=e.RGBA,u=e.UNSIGNED_BYTE,d=new Uint8Array([0,0,0,255]);e.texImage2D(e.TEXTURE_2D,n,o,s,_,l,a,u,d);const A=new Image;return A.onload=()=>{e.bindTexture(e.TEXTURE_2D,r),e.texImage2D(e.TEXTURE_2D,n,o,a,u,A),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR)},A.src=t,r}render(){const t=this.gl;t.clearColor(0,0,0,1),t.clearDepth(1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),this.crt?t.bindFramebuffer(t.FRAMEBUFFER,this.frameBuffer):t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,this.pixelWidth,this.pixelHeight);{const r=t.FLOAT,n=!1,o=0,s=0;t.bindBuffer(t.ARRAY_BUFFER,this.positionBuffer),t.vertexAttribPointer(this.positionAttribLocation,2,r,n,o,s)}{const r=t.FLOAT,n=!1,o=0,s=0;t.bindBuffer(t.ARRAY_BUFFER,this.textureBuffer),t.bufferData(t.ARRAY_BUFFER,this.textureArray,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.textureAttribLocation,2,r,n,o,s)}{const r=t.UNSIGNED_BYTE,n=!0,o=0,s=0;t.bindBuffer(t.ARRAY_BUFFER,this.foregroundBuffer),t.bufferData(t.ARRAY_BUFFER,this.foregroundUint8Array,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.fgColorAttribLocation,4,r,n,o,s)}{const r=t.UNSIGNED_BYTE,n=!0,o=0,s=0;t.bindBuffer(t.ARRAY_BUFFER,this.backgroundBuffer),t.bufferData(t.ARRAY_BUFFER,this.backgroundUint8Array,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.bgColorAttribLocation,4,r,n,o,s)}t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.useProgram(this.program),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture);{const e=this.width*this.height*6,r=t.UNSIGNED_SHORT,n=0;t.drawElements(t.TRIANGLES,e,r,n)}}renderCrt(){const t=this.crt;if(!t)return;const e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,this.pixelWidth*this.pixelScale,this.pixelHeight*this.pixelScale),e.useProgram(this.crtProgram),e.uniform1f(this.crtBlurLocation,t.blur),e.uniform1f(this.crtCurvatureLocation,t.curvature),e.uniform1f(this.crtChromaLocation,t.chroma),e.uniform1f(this.crtVignetteLocation,t.vignette),e.uniform1f(this.crtScanlineWidthLocation,t.scanlineWidth),e.uniform1f(this.crtScanlineIntensityLocation,t.scanlineIntensity),e.bindBuffer(e.ARRAY_BUFFER,this.crtPositionBuffer),e.vertexAttribPointer(this.crtPositionLocation,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.crtTexCoordBuffer),e.vertexAttribPointer(this.crtTexCoordLocation,2,e.FLOAT,!1,0,0),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.frameBufferTexture),e.drawArrays(e.TRIANGLES,0,6)}requestAnimationFrame(){window.requestAnimationFrame(t=>this.renderLoop(t))}renderLoop(t){this.lastRenderTime===0?(this.lastRenderTime=t,this.fps=0):(this.renderDelta=t-this.lastRenderTime,this.lastRenderTime=t,this.fps=1e3/this.renderDelta,this.averageFps=.95*this.averageFps+.05*this.fps),this.keys.updateKeys(t),this.mouse.update(t),this.update&&this.update(),this.flush(),this.render(),this.crt&&this.renderCrt(),this.requestAnimationFrame()}}const m=new et(document.querySelector("canvas"),80,45);m.fillRect(0,0,80,45,0,I.YELLOW,I.DARK_BLUE);let G=10,C=10;m.update=function(){const i=m.getMovementKey();i&&(G+=i.x,C+=i.y),m.clear(),m.drawString(1,1,"Hello world!"),m.drawString(1,3,"Use arrow keys to move"),m.drawString(G,C,"@")};
