!function(t,i){"object"===typeof exports&&"object"===typeof module?module.exports=i():"function"===typeof define&&define.amd?define([],i):"object"===typeof exports?exports.wglt=i():t.wglt=i()}(globalThis,(function(){return(()=>{"use strict";var t={345:(t,i,e)=>{let r;e.r(i),e.d(i,{BlendMode:()=>r,Cell:()=>E,Chars:()=>c,Colors:()=>l,Console:()=>K,DEFAULT_FONT:()=>V,DefaultDialogRenderer:()=>I,Dialog:()=>p,DialogState:()=>v,Font:()=>O,FovOctants:()=>L,FovQuadrants:()=>T,GUI:()=>S,Keyboard:()=>m,Keys:()=>P,MessageDialog:()=>F,Mouse:()=>Z,Point:()=>R,RNG:()=>ot,Rect:()=>C,SelectDialog:()=>M,Terminal:()=>at,computePath:()=>it,fixBoxCells:()=>_,fromHsv:()=>d,fromRgb:()=>a,getFovQuadrant:()=>f,loadImage:()=>X,loadImage2x:()=>Y}),function(t){t[t.None=0]="None",t[t.Blend=1]="Blend",t[t.Add=2]="Add"}(r||(r={}));const s=[[1,0,1,0],[1,0,1,1],[1,0,1,2],[2,0,2,1],[0,0,2,1],[0,0,1,2],[2,0,2,2],[2,0,2,0],[0,0,2,2],[2,0,0,2],[2,0,0,1],[1,0,0,2],[0,0,1,1],[1,1,0,0],[1,1,0,1],[0,1,1,1],[1,1,1,0],[0,1,0,1],[1,1,1,1],[1,2,1,0],[2,1,2,0],[2,2,0,0],[0,2,2,0],[2,2,0,2],[0,2,2,2],[2,2,2,0],[0,2,0,2],[2,2,2,2],[1,2,0,2],[2,1,0,1],[0,2,1,2],[0,1,2,1],[2,1,0,0],[1,2,0,0],[0,2,1,0],[0,1,2,0],[2,1,2,1],[1,2,1,2],[1,0,0,1],[0,1,1,0]];function o(t,i,e){const r=t.getCell(i,e).charCode;return r>=179&&r<=218}function h(t,i,e,r){if(i<0||e<0||i>=t.width||e>=t.height)return 0;const o=t.getCell(i,e).charCode;return o<179||o>218?0:s[o-179][r]}function n(t,i,e,r){for(let o=0;o<s.length;o++){const h=s[o];if(h[0]===t&&h[1]===i&&h[2]===e&&h[3]===r)return 179+o}return 0}function _(t){for(let i=0;i<t.height;i++)for(let e=0;e<t.width;e++)if(o(t,e,i)){let r=h(t,e,i-1,2),s=h(t,e+1,i,3),o=h(t,e,i+1,0),_=h(t,e-1,i,1);r>0&&0===s&&0===o&&0===_?o=r:0===r&&s>0&&0===o&&0===_?_=s:0===r&&0===s&&o>0&&0===_?r=o:0===r&&0===s&&0===o&&_>0&&(s=_),_>0&&s>0&&(_=s=Math.max(_,s)),r>0&&o>0&&(r=o=Math.max(r,o));const a=n(r,s,o,_);if((r||s||o||_)&&!(a>=179&&a<=218))throw new Error("invalid char code! (up="+r+", right="+s+", down="+o+", left="+_+")");t.getCell(e,i).setCharCode(a)}}function a(t,i,e,r){return void 0===r&&(r=255),(t<<24)+(i<<16)+(e<<8)+r}function d(t,i,e,r){const s=6*t|0,o=6*t-s,h=e*(1-i),n=e*(1-o*i),_=e*(1-(1-o)*i);let d,l,A;switch(s%6){case 0:d=e,l=_,A=h;break;case 1:d=n,l=e,A=h;break;case 2:d=h,l=e,A=_;break;case 3:d=h,l=n,A=e;break;case 4:d=_,l=h,A=e;break;case 5:d=e,l=h,A=n;break;default:d=0,l=0,A=0}return void 0===r&&(r=1),a(255*d|0,255*l|0,255*A|0,255*r|0)}const l={BLACK:a(0,0,0),WHITE:a(255,255,255),LIGHT_GRAY:a(170,170,170),DARK_GRAY:a(85,85,85),YELLOW:a(255,255,85),BROWN:a(170,85,0),LIGHT_RED:a(255,85,85),DARK_RED:a(170,0,0),LIGHT_GREEN:a(85,255,85),DARK_GREEN:a(0,170,0),LIGHT_CYAN:a(85,255,255),DARK_CYAN:a(0,170,170),LIGHT_BLUE:a(85,85,255),DARK_BLUE:a(0,0,170),LIGHT_MAGENTA:a(255,85,255),DARK_MAGENTA:a(170,0,170),ORANGE:a(255,136,0)};function A(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}class E{constructor(t,i,e,r,s,o){A(this,"x",void 0),A(this,"y",void 0),A(this,"charCode",void 0),A(this,"fg",void 0),A(this,"bg",void 0),A(this,"meta",void 0),A(this,"dirty",void 0),A(this,"blocked",void 0),A(this,"blockedSight",void 0),A(this,"explored",void 0),A(this,"visible",void 0),A(this,"pathId",void 0),A(this,"g",void 0),A(this,"h",void 0),A(this,"prev",void 0),this.x=t,this.y=i,this.charCode=void 0!==e?function(t){return"string"===typeof t&&t.length>0?t.charCodeAt(0):t}(e):" ".charCodeAt(0),this.fg=void 0!==r?r:l.WHITE,this.bg=void 0!==s?s:l.BLACK,void 0!==o&&(this.meta=o),this.dirty=!0,this.blocked=!1,this.blockedSight=!1,this.explored=!1,this.visible=!1,this.pathId=-1,this.g=0,this.h=0,this.prev=null}setCharCode(t){this.charCode!==t&&(this.charCode=t,this.dirty=!0)}setForeground(t){void 0!==t&&null!==t&&t!==this.fg&&(this.fg=t,this.dirty=!0)}setBackground(t){void 0!==t&&null!==t&&t!==this.bg&&(this.bg=t,this.dirty=!0)}setMeta(t){void 0!==t&&(this.meta=t,this.dirty=!0)}setValue(t,i,e,s){return"string"===typeof t&&(t=t.charCodeAt(0)),"number"===typeof t?(this.setCharCode(t),void 0!==i&&this.setForeground(i),void 0!==e&&this.setBackground(e),this.setMeta(s)):this.drawCell(t,r.None),this.dirty}drawCell(t,i){const e=255&t.bg;i===r.None||t.charCode>0?(this.setCharCode(t.charCode),this.setForeground(t.fg)):e>0&&e<255&&this.setForeground(this.blendColors(this.fg,t.bg,i)),i===r.None||255===e?this.setBackground(t.bg):e>0&&this.setBackground(this.blendColors(this.bg,t.bg,i)),this.setMeta(t.meta)}blendColors(t,i,e){const s=(255-(255&i))/255,o=1-s,h=t>>24&255,n=t>>16&255,_=t>>8&255,d=i>>24&255,l=i>>16&255,A=i>>8&255;switch(e){case r.Blend:return a(s*h+o*d|0,s*n+o*l|0,s*_+o*A|0);case r.Add:return a(this.clamp(h+o*d|0),this.clamp(n+o*l|0),this.clamp(_+o*A|0));default:return i}}clamp(t){return Math.min(255,t)}}let c;function u(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}!function(t){t[t.SMILEY=1]="SMILEY",t[t.INVERSE_SMILEY=2]="INVERSE_SMILEY",t[t.HEART=3]="HEART",t[t.DIAMOND=4]="DIAMOND",t[t.CLUB=5]="CLUB",t[t.SPADE=6]="SPADE",t[t.BULLET=7]="BULLET",t[t.INVERSE_BULLET=8]="INVERSE_BULLET",t[t.LIGHT_SHADE=176]="LIGHT_SHADE",t[t.MEDIUM_SHADE=177]="MEDIUM_SHADE",t[t.DARK_SHADE=178]="DARK_SHADE",t[t.BOX_SINGLE_VERTICAL=179]="BOX_SINGLE_VERTICAL",t[t.BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT=180]="BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT",t[t.BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT=185]="BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT",t[t.BOX_DOUBLE_VERTICAL=186]="BOX_DOUBLE_VERTICAL",t[t.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT=187]="BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT",t[t.BOX_DOUBLE_UP_AND_DOUBLE_LEFT=188]="BOX_DOUBLE_UP_AND_DOUBLE_LEFT",t[t.BOX_SINGLE_DOWN_AND_SINGLE_LEFT=191]="BOX_SINGLE_DOWN_AND_SINGLE_LEFT",t[t.BOX_SINGLE_UP_AND_SINGLE_RIGHT=192]="BOX_SINGLE_UP_AND_SINGLE_RIGHT",t[t.BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP=193]="BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP",t[t.BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN=194]="BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN",t[t.BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT=195]="BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT",t[t.BOX_SINGLE_HORIZONTAL=196]="BOX_SINGLE_HORIZONTAL",t[t.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL=197]="BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL",t[t.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT=200]="BOX_DOUBLE_UP_AND_DOUBLE_RIGHT",t[t.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT=201]="BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT",t[t.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP=202]="BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP",t[t.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN=203]="BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN",t[t.BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT=204]="BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT",t[t.BOX_DOUBLE_HORIZONTAL=205]="BOX_DOUBLE_HORIZONTAL",t[t.BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL=206]="BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL",t[t.BOX_SINGLE_UP_AND_SINGLE_LEFT=217]="BOX_SINGLE_UP_AND_SINGLE_LEFT",t[t.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT=218]="BOX_SINGLE_DOWN_AND_SINGLE_RIGHT",t[t.BLOCK_FULL=219]="BLOCK_FULL",t[t.BLOCK_BOTTOM_HALF=220]="BLOCK_BOTTOM_HALF",t[t.BLOCK_LEFT_HALF=221]="BLOCK_LEFT_HALF",t[t.BLOCK_RIGHT_HALF=222]="BLOCK_RIGHT_HALF",t[t.BLOCK_TOP_HALF=223]="BLOCK_TOP_HALF"}(c||(c={}));class K{constructor(t,i,e){u(this,"width",void 0),u(this,"height",void 0),u(this,"grid",void 0),u(this,"originX",void 0),u(this,"originY",void 0),u(this,"minX",void 0),u(this,"maxX",void 0),u(this,"minY",void 0),u(this,"maxY",void 0),u(this,"radius",void 0),this.width=t,this.height=i,this.grid=new Array,this.originX=0,this.originY=0,this.minX=0,this.maxX=0,this.minY=0,this.maxY=0,this.radius=0;for(let e=0;e<i;e++){const i=new Array;for(let r=0;r<t;r++)i.push(new E(r,e));this.grid.push(i)}if(this.clear(),e)for(let r=0;r<i;r++)for(let i=0;i<t;i++)this.grid[r][i].blocked=this.grid[r][i].blockedSight=e(i,r)}clear(){for(let t=0;t<this.height;t++)for(let i=0;i<this.width;i++)this.drawChar(i,t,0)}getCell(t,i){if(!(t<0||i<0||t>=this.width||i>=this.height))return this.grid[i][t]}getCharCode(t,i){if(!(t<0||i<0||t>=this.width||i>=this.height))return this.grid[i][t].charCode}drawChar(t,i,e,r,s){t>=0&&t<this.width&&i>=0&&i<this.height&&this.grid[0|i][0|t].setValue(e,r,s)}drawString(t,i,e,r,s){const o=e.split("\n");for(let e=0;e<o.length;e++){const h=o[e];for(let o=0;o<h.length;o++)this.drawChar(t+o,i+e,h.charCodeAt(o),r,s)}}drawCenteredString(t,i,e,r,s){this.drawString(t-Math.floor(e.length/2),i,e,r,s)}drawHLine(t,i,e,r,s,o){for(let h=t;h<t+e;h++)this.drawChar(h,i,r,s,o)}drawVLine(t,i,e,r,s,o){for(let h=i;h<i+e;h++)this.drawChar(t,h,r,s,o)}drawRect(t,i,e,r,s,o,h){this.drawHLine(t,i,e,s,o,h),this.drawHLine(t,i+r-1,e,s,o,h),this.drawVLine(t,i,r,s,o,h),this.drawVLine(t+e-1,i,r,s,o,h)}drawBox(t,i,e,r,s,o,h,n,_,a,d,l,A,E){this.fillRect(t,i,e,r,0,A,E),this.drawHLine(t,i,e,s),this.drawHLine(t,i+r-1,e,h),this.drawVLine(t,i,r,n),this.drawVLine(t+e-1,i,r,o),this.drawChar(t,i,_),this.drawChar(t+e-1,i,a),this.drawChar(t,i+r-1,l),this.drawChar(t+e-1,i+r-1,d)}drawSingleBox(t,i,e,r,s,o){this.drawBox(t,i,e,r,c.BOX_SINGLE_HORIZONTAL,c.BOX_SINGLE_VERTICAL,c.BOX_SINGLE_HORIZONTAL,c.BOX_SINGLE_VERTICAL,c.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT,c.BOX_SINGLE_DOWN_AND_SINGLE_LEFT,c.BOX_SINGLE_UP_AND_SINGLE_LEFT,c.BOX_SINGLE_UP_AND_SINGLE_RIGHT,s,o)}drawDoubleBox(t,i,e,r,s,o){this.drawBox(t,i,e,r,c.BOX_DOUBLE_HORIZONTAL,c.BOX_DOUBLE_VERTICAL,c.BOX_DOUBLE_HORIZONTAL,c.BOX_DOUBLE_VERTICAL,c.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT,c.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT,c.BOX_DOUBLE_UP_AND_DOUBLE_LEFT,c.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT,s,o)}fillRect(t,i,e,r,s,o,h){for(let n=i;n<i+r;n++)this.drawHLine(t,n,e,s,o,h)}drawConsole(t,i,e,s,o,h,n,_){_=_||r.None;for(let r=0;r<n;r++)for(let n=0;n<h;n++){const h=e.getCell(s+n,o+r);h&&this.drawCell(t+n,i+r,h,_)}}drawCell(t,i,e,r){t>=0&&t<this.width&&i>=0&&i<this.height&&this.grid[i][t].drawCell(e,r)}setBlocked(t,i,e){t>=0&&t<this.width&&i>=0&&i<this.height&&(this.grid[i][t].blocked=e)}setblockedSight(t,i,e){t>=0&&t<this.width&&i>=0&&i<this.height&&(this.grid[i][t].blockedSight=e)}isVisible(t,i){return!(t<this.minX||t>this.maxX||i<this.minY||i>this.maxY)&&this.grid[i][t].visible}computeOctantY(t,i){const e=[],r=[];let s,o,h,n,_,a,d,l,A,E,c=1,u=0,K=0,g=0;for(o=this.originY+i;o>=this.minY&&o<=this.maxY;o+=i,K=u,++c)for(h=.5/c,E=-1,n=Math.floor(g*c+.5),s=this.originX+n*t;n<=c&&s>=this.minX&&s<=this.maxX;s+=t,++n,E=A){if(_=!0,a=!1,d=n/c,l=E,A=d+h,K>0)if(this.grid[o-i][s].visible&&!this.grid[o-i][s].blockedSight||this.grid[o-i][s-t].visible&&!this.grid[o-i][s-t].blockedSight){for(let t=0;t<K&&_;++t)if(l<=r[t]&&A>=e[t])if(this.grid[o][s].blockedSight){if(l>=e[t]&&A<=r[t]){_=!1;break}e[t]=Math.min(e[t],l),r[t]=Math.max(r[t],A),a=!0}else if(d>e[t]&&d<r[t]){_=!1;break}}else _=!1;_&&(this.grid[o][s].visible=!0,this.grid[o][s].blockedSight&&(g>=l?g=A:a||(e[u]=l,r[u++]=A)))}}computeOctantX(t,i){const e=[],r=[];let s,o,h,n,_,a,d,l,A,E,c=1,u=0,K=0,g=0;for(s=this.originX+t;s>=this.minX&&s<=this.maxX;s+=t,K=u,++c)for(h=.5/c,E=-1,n=Math.floor(g*c+.5),o=this.originY+n*i;n<=c&&o>=this.minY&&o<=this.maxY;o+=i,++n,E=A){if(_=!0,a=!1,d=n/c,l=E,A=d+h,K>0)if(this.grid[o][s-t].visible&&!this.grid[o][s-t].blockedSight||this.grid[o-i][s-t].visible&&!this.grid[o-i][s-t].blockedSight){for(let t=0;t<K&&_;++t)if(l<=r[t]&&A>=e[t])if(this.grid[o][s].blockedSight){if(l>=e[t]&&A<=r[t]){_=!1;break}e[t]=Math.min(e[t],l),r[t]=Math.max(r[t],A),a=!0}else if(d>e[t]&&d<r[t]){_=!1;break}}else _=!1;_&&(this.grid[o][s].visible=!0,this.grid[o][s].blockedSight&&(g>=l?g=A:a||(e[u]=l,r[u++]=A)))}}computeFov(t,i,e,r,s){if(this.originX=t,this.originY=i,this.radius=e,r)this.minX=Math.min(this.minX,Math.max(0,t-e)),this.minY=Math.min(this.minY,Math.max(0,i-e)),this.maxX=Math.max(this.maxX,Math.min(this.width-1,t+e)),this.maxY=Math.max(this.maxY,Math.min(this.height-1,i+e));else{this.minX=Math.max(0,t-e),this.minY=Math.max(0,i-e),this.maxX=Math.min(this.width-1,t+e),this.maxY=Math.min(this.height-1,i+e);for(let t=this.minY;t<=this.maxY;t++)for(let i=this.minX;i<=this.maxX;i++)this.grid[t][i].visible=!1}this.grid[i][t].visible=!0,void 0===s?(this.computeOctantY(1,1),this.computeOctantX(1,1),this.computeOctantX(1,-1),this.computeOctantY(1,-1),this.computeOctantY(-1,-1),this.computeOctantX(-1,-1),this.computeOctantX(-1,1),this.computeOctantY(-1,1)):(1&s&&this.computeOctantY(1,1),2&s&&this.computeOctantX(1,1),4&s&&this.computeOctantX(1,-1),8&s&&this.computeOctantY(1,-1),16&s&&this.computeOctantY(-1,-1),32&s&&this.computeOctantX(-1,-1),64&s&&this.computeOctantX(-1,1),128&s&&this.computeOctantY(-1,1))}updateExplored(){for(let t=this.minY;t<=this.maxY;t++)for(let i=this.minX;i<=this.maxX;i++){const e=this.grid[t][i];e.explored=e.explored||e.visible}}}function g(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}class O{constructor(t,i,e,r,s){g(this,"url",void 0),g(this,"charWidth",void 0),g(this,"charHeight",void 0),g(this,"scale",void 0),g(this,"graphical",void 0),this.url=t,this.charWidth=i,this.charHeight=e,this.scale=r||1,this.graphical=!!s}}const V=new O("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAEhklEQVRIx42Sv4oUQRDGC4UzadSwwMUD8QEKlbWD4Q58B/NGpTVocKO1wXHUzMAH0AcwMTYVGg5ag0IzEXaRjdZEZKNzkKbHqtnzHypY09M9+5uvqr7pbYCuC6ftaRhgONXs30eAh0O1rYDm4IS/eH0B8GxRW2vxo396yu/fb0ZFrW1zcOXlPU/XPwK8PGjbWhVwM4KnH61912oK4+zmmHJaQotyt1kvtC2Atdo24iohPDiG/v4eICJsY3Wy8Yvr0DSIBOdxgH6v8wsriWhc8s0AtaK/GzSl1jR0nSjQnwki6FQxNFKjgzO2a7BBqucH7dL4M9z96CIhT1Fs/AgKgcA6dKCxI29DaHNwRJ4EGAU1sU0OG9rmE4SIc3A4FChACqqhJRwpxkqh9wxag4DSmEJ5DtpFwAP4GUf6lmKcFFti1BYuQp4xN8kxM2kNhjdkTOiTUeAKGvhA1rLpMbYACQzCITlTDRMbLYoEa2JWPSMRFZIupcSzMVKcEUkX+sOG+ChNX2vD8ex6k7OFHL0P1655JuPd53WAD+yTv3UrCQiuHmYBbfIxpkImuvpBQBkVb5g4XHv3JkNireG8AO9zDhBZu2z2OMZ11S5/RIlyMefMNaZ4GsCz5xcjyM6hHYEjAYEfO8Ig1rklAe9sRIeYAdwyoIBq6YIzCAKiWoifA3m3o2AzWcdYKOdY47EIf8QABCuYgIUVmdVMEYEDA0Hmo/3D6KKJbh5mxhP3UsWIE97wnEygyizOfOLi2JOJW8CeOblW9IHeKZgv4zxuzDryOmb+4aQH+MXV6e0ywdUcxqCjBWl5GpbzZduOG1QEiGXP86T7EfiJfkMQ4OO4H0yqyNC2zlziWEN7Ywuc2fQ4p5BNkS5QYXP2h5NtRJh0vCKQidtVJmCGAwDSSQpYggSxiRIyzewsgCh4xxiTPDMh5aj//l7btqkr6rQyIOtLji4lVRQwXdzvus40Y53M33fh50GZwF4ExQeMlvuTggLzSi4ElKczUO7zVtpwdyMKdqZKOWb2nDblawPxPmuMwFEWBW+jlZR1eYtS442kiBGMWCi/h1/+GAR6NYOJWiqNJXFygFtrkx5C0O3IeFGs67HhEEhmBu/BUOT+0551pXxYIF+Elpi5AKRkLl5GUbCCZddyMv621ujEBPP4vSy2fotTx3U+d3WBiFOA6VSGSB49v/M7GBX9FPrDaT2c9qr4PCpwZ7qz813R94dVFIe19v33GlMZUghQFb8BrfE7QBmgBMbrn2B3enn/y3B5+DL8UBAdnejdYdBxeV9ejwoYNTgW0Ok/gA7UG2GAzanhL0DG7q4svynwF8UwDPu7u/vD0IudzSltMtVbP+J/gUbR29oJ7Fg9s6Uy+DnpiTCOYc4cXOeXMWfsusSw7FOg9x655nax6BlecwpOQQ68WBwp+H2LMQTuOq2RUigzh2Q/R3CWARJIJG199EwOTyKBlQMznshCRGeQ5gHABAQl6M4gLEdAzVaBWMCiANdsayDCHBA/hagKYfielrJIlipKKQIA9Nf3wBloTHT6BuAx15zRNa1nAAAAAElFTkSuQmCC",8,8),L={OCTANT_SOUTH_SOUTHEAST:1,OCTANT_EAST_SOUTHEAST:2,OCTANT_EAST_NORTHTHEAST:4,OCTANT_NORTH_NORTHEAST:8,OCTANT_NORTH_NORTHWEST:16,OCTANT_WEST_NORTHEAST:32,OCTANT_WEST_SOUTHWEST:64,OCTANT_SOUTH_SOUTHWEST:128},T={QUADRANT_SOUTHEAST:3,QUADRANT_EAST:6,QUADRANT_NORTHEAST:12,QUADRANT_NORTH:24,QUADRANT_NORTHWEST:48,QUADRANT_WEST:96,QUADRANT_SOUTHWEST:192,QUADRANT_SOUTH:129};function f(t,i){return t>0?i>0?T.QUADRANT_SOUTHEAST:0===i?T.QUADRANT_EAST:T.QUADRANT_NORTHEAST:t<0?i>0?T.QUADRANT_SOUTHWEST:0===i?T.QUADRANT_WEST:T.QUADRANT_NORTHWEST:i>0?T.QUADRANT_SOUTH:T.QUADRANT_NORTH}function N(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}class R{constructor(t,i){N(this,"x",void 0),N(this,"y",void 0),this.x=t,this.y=i}}function D(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}class C{constructor(t,i,e,r){D(this,"x",void 0),D(this,"y",void 0),D(this,"width",void 0),D(this,"height",void 0),D(this,"left",void 0),D(this,"top",void 0),D(this,"x2",void 0),D(this,"y2",void 0),this.x=this.left=t,this.y=this.top=i,this.width=e,this.height=r,this.x2=t+e,this.y2=i+r}getCenter(){return new R(this.x+this.width/2|0,this.y+this.height/2|0)}intersects(t){return this.x<=t.x2&&this.x2>=t.x&&this.y<=t.y2&&this.y2>=t.y}contains(t){return t.x>=this.x&&t.y<this.x2&&t.y>=this.y&&t.y<this.y2}}function B(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}class v{constructor(t,i,e){B(this,"dialog",void 0),B(this,"rect",void 0),B(this,"contentsOffset",void 0),B(this,"open",void 0),B(this,"count",void 0),B(this,"buffer",void 0),this.dialog=t,this.rect=i,this.contentsOffset=e,this.open=!1,this.count=0}}class I{getState(t,i){const e=i.contentsRect.width+4,r=i.contentsRect.height+4,s=(t.width-e)/2|0,o=(t.height-r)/2|0;return new v(i,new C(s,o,e,r),new R(s+2,o+2))}draw(t,i){const e=i.dialog,{x:r,y:s,width:o,height:h}=i.rect;t.fillRect(r,s,o,h,0,l.WHITE,l.BLACK),t.drawSingleBox(r,s,o,h),t.drawCenteredString(r+o/2|0,s," "+e.title+" "),e.drawContents(t,i.contentsOffset)}}function U(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}class S{constructor(t,i){U(this,"terminal",void 0),U(this,"renderer",void 0),U(this,"dialogs",void 0),this.terminal=t,this.renderer=i||new I,this.dialogs=[]}add(t){this.dialogs.push(this.renderer.getState(this.terminal,t))}handleInput(){if(0===this.dialogs.length)return!1;const t=this.dialogs.length-1,i=this.dialogs[this.dialogs.length-1];return i.dialog.handleInput(this.terminal,i.contentsOffset)&&this.dialogs.splice(t,1),!0}draw(){for(let t=0;t<this.dialogs.length;t++)this.renderer.draw(this.terminal,this.dialogs[t])}}function b(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}class p{constructor(t,i){b(this,"contentsRect",void 0),b(this,"title",void 0),this.contentsRect=t,this.title=i}}function w(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}class y{constructor(){w(this,"down",void 0),w(this,"downCount",void 0),w(this,"upCount",void 0),this.down=!1,this.downCount=0,this.upCount=0}update(){this.down?(this.downCount++,this.upCount=0):(this.downCount=0,this.upCount++)}isPressed(){const t=this.downCount;return 1===t||t>6&&t%1===0}isClicked(){return 1===this.upCount}}const x=256;class m{constructor(t){var i,e,r;r=void 0,(e="keys")in(i=this)?Object.defineProperty(i,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):i[e]=r,this.keys=new Array(x);for(let t=0;t<x;t++)this.keys[t]=new y;t.addEventListener("keydown",(t=>this.setKey(t,!0))),t.addEventListener("keyup",(t=>this.setKey(t,!1)))}setKey(t,i){const e=t.keyCode;e!==P.VK_F11&&(t.stopPropagation(),t.preventDefault(),e>=0&&e<x&&(this.keys[e].down=i))}updateKeys(){for(let t=0;t<x;t++)this.keys[t].update()}getKey(t){return t>=0&&t<x?this.keys[t]:null}}let P;!function(t){t[t.VK_CANCEL=3]="VK_CANCEL",t[t.VK_HELP=6]="VK_HELP",t[t.VK_BACK_SPACE=8]="VK_BACK_SPACE",t[t.VK_TAB=9]="VK_TAB",t[t.VK_CLEAR=12]="VK_CLEAR",t[t.VK_ENTER=13]="VK_ENTER",t[t.VK_SHIFT=16]="VK_SHIFT",t[t.VK_CONTROL=17]="VK_CONTROL",t[t.VK_ALT=18]="VK_ALT",t[t.VK_PAUSE=19]="VK_PAUSE",t[t.VK_CAPS_LOCK=20]="VK_CAPS_LOCK",t[t.VK_ESCAPE=27]="VK_ESCAPE",t[t.VK_SPACE=32]="VK_SPACE",t[t.VK_PAGE_UP=33]="VK_PAGE_UP",t[t.VK_PAGE_DOWN=34]="VK_PAGE_DOWN",t[t.VK_END=35]="VK_END",t[t.VK_HOME=36]="VK_HOME",t[t.VK_LEFT=37]="VK_LEFT",t[t.VK_UP=38]="VK_UP",t[t.VK_RIGHT=39]="VK_RIGHT",t[t.VK_DOWN=40]="VK_DOWN",t[t.VK_PRINTSCREEN=44]="VK_PRINTSCREEN",t[t.VK_INSERT=45]="VK_INSERT",t[t.VK_DELETE=46]="VK_DELETE",t[t.VK_0=48]="VK_0",t[t.VK_1=49]="VK_1",t[t.VK_2=50]="VK_2",t[t.VK_3=51]="VK_3",t[t.VK_4=52]="VK_4",t[t.VK_5=53]="VK_5",t[t.VK_6=54]="VK_6",t[t.VK_7=55]="VK_7",t[t.VK_8=56]="VK_8",t[t.VK_9=57]="VK_9",t[t.VK_COLON=58]="VK_COLON",t[t.VK_SEMICOLON=59]="VK_SEMICOLON",t[t.VK_LESS_THAN=60]="VK_LESS_THAN",t[t.VK_EQUALS=61]="VK_EQUALS",t[t.VK_GREATER_THAN=62]="VK_GREATER_THAN",t[t.VK_QUESTION_MARK=63]="VK_QUESTION_MARK",t[t.VK_AT=64]="VK_AT",t[t.VK_A=65]="VK_A",t[t.VK_B=66]="VK_B",t[t.VK_C=67]="VK_C",t[t.VK_D=68]="VK_D",t[t.VK_E=69]="VK_E",t[t.VK_F=70]="VK_F",t[t.VK_G=71]="VK_G",t[t.VK_H=72]="VK_H",t[t.VK_I=73]="VK_I",t[t.VK_J=74]="VK_J",t[t.VK_K=75]="VK_K",t[t.VK_L=76]="VK_L",t[t.VK_M=77]="VK_M",t[t.VK_N=78]="VK_N",t[t.VK_O=79]="VK_O",t[t.VK_P=80]="VK_P",t[t.VK_Q=81]="VK_Q",t[t.VK_R=82]="VK_R",t[t.VK_S=83]="VK_S",t[t.VK_T=84]="VK_T",t[t.VK_U=85]="VK_U",t[t.VK_V=86]="VK_V",t[t.VK_W=87]="VK_W",t[t.VK_X=88]="VK_X",t[t.VK_Y=89]="VK_Y",t[t.VK_Z=90]="VK_Z",t[t.VK_CONTEXT_MENU=93]="VK_CONTEXT_MENU",t[t.VK_NUMPAD0=96]="VK_NUMPAD0",t[t.VK_NUMPAD1=97]="VK_NUMPAD1",t[t.VK_NUMPAD2=98]="VK_NUMPAD2",t[t.VK_NUMPAD3=99]="VK_NUMPAD3",t[t.VK_NUMPAD4=100]="VK_NUMPAD4",t[t.VK_NUMPAD5=101]="VK_NUMPAD5",t[t.VK_NUMPAD6=102]="VK_NUMPAD6",t[t.VK_NUMPAD7=103]="VK_NUMPAD7",t[t.VK_NUMPAD8=104]="VK_NUMPAD8",t[t.VK_NUMPAD9=105]="VK_NUMPAD9",t[t.VK_MULTIPLY=106]="VK_MULTIPLY",t[t.VK_ADD=107]="VK_ADD",t[t.VK_SEPARATOR=108]="VK_SEPARATOR",t[t.VK_SUBTRACT=109]="VK_SUBTRACT",t[t.VK_DECIMAL=110]="VK_DECIMAL",t[t.VK_DIVIDE=111]="VK_DIVIDE",t[t.VK_F1=112]="VK_F1",t[t.VK_F2=113]="VK_F2",t[t.VK_F3=114]="VK_F3",t[t.VK_F4=115]="VK_F4",t[t.VK_F5=116]="VK_F5",t[t.VK_F6=117]="VK_F6",t[t.VK_F7=118]="VK_F7",t[t.VK_F8=119]="VK_F8",t[t.VK_F9=120]="VK_F9",t[t.VK_F10=121]="VK_F10",t[t.VK_F11=122]="VK_F11",t[t.VK_F12=123]="VK_F12",t[t.VK_F13=124]="VK_F13",t[t.VK_F14=125]="VK_F14",t[t.VK_F15=126]="VK_F15",t[t.VK_F16=127]="VK_F16",t[t.VK_F17=128]="VK_F17",t[t.VK_F18=129]="VK_F18",t[t.VK_F19=130]="VK_F19",t[t.VK_F20=131]="VK_F20",t[t.VK_F21=132]="VK_F21",t[t.VK_F22=133]="VK_F22",t[t.VK_F23=134]="VK_F23",t[t.VK_F24=135]="VK_F24",t[t.VK_NUM_LOCK=144]="VK_NUM_LOCK",t[t.VK_SCROLL_LOCK=145]="VK_SCROLL_LOCK",t[t.VK_CIRCUMFLEX=160]="VK_CIRCUMFLEX",t[t.VK_EXCLAMATION=161]="VK_EXCLAMATION",t[t.VK_DOUBLE_QUOTE=162]="VK_DOUBLE_QUOTE",t[t.VK_HASH=163]="VK_HASH",t[t.VK_DOLLAR=164]="VK_DOLLAR",t[t.VK_PERCENT=165]="VK_PERCENT",t[t.VK_AMPERSAND=166]="VK_AMPERSAND",t[t.VK_UNDERSCORE=167]="VK_UNDERSCORE",t[t.VK_OPEN_PAREN=168]="VK_OPEN_PAREN",t[t.VK_CLOSE_PAREN=169]="VK_CLOSE_PAREN",t[t.VK_ASTERISK=170]="VK_ASTERISK",t[t.VK_PLUS=171]="VK_PLUS",t[t.VK_PIPE=172]="VK_PIPE",t[t.VK_HYPHEN_MINUS=173]="VK_HYPHEN_MINUS",t[t.VK_OPEN_CURLY_BRACKET=174]="VK_OPEN_CURLY_BRACKET",t[t.VK_CLOSE_CURLY_BRACKET=175]="VK_CLOSE_CURLY_BRACKET",t[t.VK_TILDE=176]="VK_TILDE",t[t.VK_COMMA=188]="VK_COMMA",t[t.VK_PERIOD=190]="VK_PERIOD",t[t.VK_SLASH=191]="VK_SLASH",t[t.VK_BACK_QUOTE=192]="VK_BACK_QUOTE",t[t.VK_OPEN_BRACKET=219]="VK_OPEN_BRACKET",t[t.VK_BACK_SLASH=220]="VK_BACK_SLASH",t[t.VK_CLOSE_BRACKET=221]="VK_CLOSE_BRACKET",t[t.VK_QUOTE=222]="VK_QUOTE",t[t.VK_META=224]="VK_META",t[t.VK_ALTGR=225]="VK_ALTGR",t[t.VK_WIN=91]="VK_WIN",t[t.VK_KANA=21]="VK_KANA",t[t.VK_HANGUL=21]="VK_HANGUL",t[t.VK_EISU=22]="VK_EISU",t[t.VK_JUNJA=23]="VK_JUNJA",t[t.VK_FINAL=24]="VK_FINAL",t[t.VK_HANJA=25]="VK_HANJA",t[t.VK_KANJI=25]="VK_KANJI",t[t.VK_CONVERT=28]="VK_CONVERT",t[t.VK_NONCONVERT=29]="VK_NONCONVERT",t[t.VK_ACCEPT=30]="VK_ACCEPT",t[t.VK_MODECHANGE=31]="VK_MODECHANGE",t[t.VK_SELECT=41]="VK_SELECT",t[t.VK_PRINT=42]="VK_PRINT",t[t.VK_EXECUTE=43]="VK_EXECUTE",t[t.VK_SLEEP=95]="VK_SLEEP"}(P||(P={}));class F extends p{constructor(t,i){const e=i.split("\n");let r=t.length;for(let t=0;t<e.length;t++)r=Math.max(r,e[t].length);const s=e.length;var o,h,n;super(new C(0,0,r,s),t),n=void 0,(h="lines")in(o=this)?Object.defineProperty(o,h,{value:n,enumerable:!0,configurable:!0,writable:!0}):o[h]=n,this.lines=e}drawContents(t,i){for(let e=0;e<this.lines.length;e++)t.drawString(i.x,i.y+e,this.lines[e])}handleInput(t,i){return t.isKeyPressed(P.VK_ESCAPE)}}function H(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}class M extends p{constructor(t,i,e){let r=t.length;for(let t=0;t<i.length;t++)r=Math.max(r,i[t].length+4);const s=i.length;super(new C(0,0,r,s),t),H(this,"options",void 0),H(this,"callback",void 0),this.options=i,this.callback=e}drawContents(t,i){for(let e=0;e<this.options.length;e++){const r=String.fromCharCode(65+e)+" - "+this.options[e];t.drawString(i.x,i.y+e,r)}}handleInput(t,i){for(let i=0;i<this.options.length;i++)if(t.isKeyPressed(P.VK_A+i))return this.callback(i),!0;return t.isKeyPressed(P.VK_ESCAPE)}}const G=[{charCode:c.BLOCK_TOP_HALF,active:[1,1,0,0]},{charCode:c.BLOCK_RIGHT_HALF,active:[0,1,0,1]}];function X(t,i){const e=new Image;e.onload=()=>{const t=e.width,r=e.height,s=k(e),o=new K(t,r);let h=0;for(let i=0;i<r;i++)for(let e=0;e<t;e++){o.getCell(e,i).setBackground(a(s[h++],s[h++],s[h++],s[h++]))}i(o)},e.src=t}function Y(t,i){const e=new Image;e.onload=()=>{const t=e.width,r=e.height,s=k(e),o=new K(t/2,r/2);for(let i=0;i<r;i+=2)for(let e=0;e<t;e+=2)W(o,s,e,i,t);i(o)},e.src=t}function k(t){const i=document.createElement("canvas");i.width=t.width,i.height=t.height;const e=i.getContext("2d");return e.drawImage(t,0,0),e.getImageData(0,0,t.width,t.height).data}function W(t,i,e,r,s){const o=4*(r*s+e),h=4*(r*s+e+1),n=4*((r+1)*s+e),_=4*((r+1)*s+e+1),a=[[i[o],i[o+1],i[o+2]],[i[h],i[h+1],i[h+2]],[i[n],i[n+1],i[n+2]],[i[_],i[_+1],i[_+2]]];let d=Number.MAX_VALUE,l=0,A=null,E=null;for(let t=0;t<G.length;t++){const i=G[t],e=Q(i.active,a);e.error<d&&(d=e.error,l=i.charCode,A=e.bg,E=e.fg)}t.drawChar(e/2,r/2,l,z(E),z(A))}function Q(t,i){const e=[[0,0,0],[0,0,0]],r=[[0,0,0],[0,0,0]],s=[0,0];for(let r=0;r<4;r++){for(let s=0;s<3;s++)e[t[r]][s]+=i[r][s];s[t[r]]++}for(let t=0;t<2;t++)for(let i=0;i<3;i++)r[t][i]=e[t][i]/s[t];let o=0;for(let e=0;e<4;e++){let s=0;for(let o=0;o<3;o++){const h=i[e][o]-r[t[e]][o];s+=h*h}o+=Math.sqrt(s)}return{bg:r[0],fg:r[1],error:o}}function z(t){return a(t[0],t[1],t[2])}function j(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}class Z{constructor(t,i){j(this,"el",void 0),j(this,"width",void 0),j(this,"height",void 0),j(this,"options",void 0),j(this,"prevX",void 0),j(this,"prevY",void 0),j(this,"x",void 0),j(this,"y",void 0),j(this,"dx",void 0),j(this,"dy",void 0),j(this,"buttons",void 0),this.el=t.canvas,this.width=t.width,this.height=t.height,this.options=i,this.prevX=0,this.prevY=0,this.x=0,this.y=0,this.dx=0,this.dy=0,this.buttons=[new y,new y,new y];const e=this.el;e.addEventListener("mousedown",(t=>this.handleEvent(t))),e.addEventListener("mouseup",(t=>this.handleEvent(t))),e.addEventListener("mousemove",(t=>this.handleEvent(t))),e.addEventListener("contextmenu",(t=>this.handleEvent(t)));const r=this.handleTouchEvent.bind(this);e.addEventListener("touchstart",r),e.addEventListener("touchend",r),e.addEventListener("touchcancel",r),e.addEventListener("touchmove",r)}handleTouchEvent(t){if(t.stopPropagation(),t.preventDefault(),"touchend"===t.type&&this.options.requestFullscreen&&this.requestFullscreen(),t.touches.length>0){const i=t.touches[0];this.updatePosition(i.clientX,i.clientY),this.buttons[0].down=!0}else this.buttons[0].down=!1}handleEvent(t){t.stopPropagation(),t.preventDefault(),this.updatePosition(t.clientX,t.clientY),"mousedown"===t.type&&(this.buttons[t.button].down=!0,this.el.focus(),this.options.requestFullscreen&&this.requestFullscreen()),"mouseup"===t.type&&(this.buttons[t.button].down=!1)}updatePosition(t,i){let e=this.el.getBoundingClientRect();const r=this.width/this.height,s=e.width/e.height;if(s-r>.01){const t=r*e.height,i=e.width-t;e=new C(Math.floor(i/2),0,t,e.height)}if(s-r<-.01){const t=e.width/r,i=e.height-t;e=new C(0,Math.floor(i/2),e.width,t)}this.x=this.width*(t-e.left)/e.width|0,this.y=this.height*(i-e.top)/e.height|0}requestFullscreen(){const t=this.el;t.requestFullscreen&&t.requestFullscreen()}update(){this.dx=this.x-this.prevX,this.dy=this.y-this.prevY,this.prevX=this.x,this.prevY=this.y;for(let t=0;t<this.buttons.length;t++)this.buttons[t].update()}}const J=[-1,0,1,-1,1,-1,0,1],q=[-1,-1,-1,0,0,1,1,1],$=[1.4,1,1.4,1,1,1.4,1,1.4];let tt=0;function it(t,i,e,r){tt++;const s=t.grid[i.y][i.x];s.pathId=tt,s.g=0,s.h=Math.hypot(i.x-e.x,i.y-e.y),s.prev=null;const o=new rt([s]);for(;o.size()>0;){const i=o.pop();if(i.x===e.x&&i.y===e.y)return et(i);for(let s=0;s<J.length;s++){const h=i.x+J[s],n=i.y+q[s];if(h>=0&&h<t.width&&n>=0&&n<t.height){const _=t.grid[n][h];if(_.blocked&&_.explored&&(h!==e.x||n!==e.y))continue;_.pathId!==tt&&(_.pathId=tt,_.g=1/0,_.h=Math.hypot(h-e.x,n-e.y),_.prev=null);const a=i.g+$[s];a<_.g&&a<=r&&(_.g=a,_.prev=i,o.insert(_))}}}return null}function et(t){const i=[];let e=t;for(;e;)i.push(e),e=e.prev;return i.reverse(),i}class rt{constructor(t){var i,e,r;r=void 0,(e="values")in(i=this)?Object.defineProperty(i,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):i[e]=r,this.values=t}insert(t){const i=this.values;let e=0,r=i.length,s=0;for(;e<r;){const o=e+r>>>1,h=i[o];h.g+h.h>t.g+t.h?(e=o+1,s=e):(r=o,s=r)}i.splice(s,0,t)}pop(){return this.values.pop()}size(){return this.values.length}}function st(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}class ot{constructor(t){st(this,"m",void 0),st(this,"a",void 0),st(this,"c",void 0),st(this,"state",void 0),this.m=2147483648,this.a=1103515245,this.c=12345,this.state=t||1}nextInt(){return this.state=(this.a*this.state+this.c)%this.m,this.state}nextFloat(){return this.nextInt()/(this.m-1)}nextRange(t,i){const e=i-t,r=t+(this.nextInt()/this.m*e|0);if(isNaN(r))throw new Error("rand nan");return r}chooseIndex(t){const i=t.reduce(((t,i)=>t+i)),e=this.nextRange(1,i+1);let r=0;for(let i=0;i<t.length;i++)if(r+=t[i],e<=r)return i;return t.length-1}chooseKey(t){const i=[],e=[];for(const r in t)t.hasOwnProperty(r)&&(i.push(r),e.push(t[r]));return i[this.chooseIndex(e)]}}function ht(t,i,e){return i in t?Object.defineProperty(t,i,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[i]=e,t}function nt(t,i){return t/i*2-1}const _t={font:V,requestFullscreen:!1};class at extends K{constructor(t,i,e,r){super(i,e),ht(this,"canvas",void 0),ht(this,"font",void 0),ht(this,"pixelWidth",void 0),ht(this,"pixelHeight",void 0),ht(this,"keys",void 0),ht(this,"mouse",void 0),ht(this,"gl",void 0),ht(this,"program",void 0),ht(this,"positionAttribLocation",void 0),ht(this,"textureAttribLocation",void 0),ht(this,"fgColorAttribLocation",void 0),ht(this,"bgColorAttribLocation",void 0),ht(this,"positionsArray",void 0),ht(this,"indexArray",void 0),ht(this,"textureArray",void 0),ht(this,"foregroundUint8Array",void 0),ht(this,"foregroundDataView",void 0),ht(this,"backgroundUint8Array",void 0),ht(this,"backgroundDataView",void 0),ht(this,"positionBuffer",void 0),ht(this,"indexBuffer",void 0),ht(this,"textureBuffer",void 0),ht(this,"foregroundBuffer",void 0),ht(this,"backgroundBuffer",void 0),ht(this,"texture",void 0),ht(this,"update",void 0),r=r||_t,this.canvas=t,this.font=r.font||V,this.pixelWidth=i*this.font.charWidth,this.pixelHeight=e*this.font.charHeight,t.width=this.pixelWidth,t.height=this.pixelHeight,t.style.imageRendering="pixelated",t.style.outline="none",t.tabIndex=0,this.handleResize(),window.addEventListener("resize",(()=>this.handleResize())),this.keys=new m(t),this.mouse=new Z(this,r);const s=t.getContext("webgl",{antialias:!1});if(!s)throw new Error("Unable to initialize WebGL. Your browser may not support it.");const o=s.createProgram();if(!o)throw new Error("Unable to initialize WebGL. Your browser may not support it.");this.gl=s,this.program=o,s.attachShader(o,this.buildShader(s.VERTEX_SHADER,"attribute vec2 a;attribute vec2 b;attribute vec3 c;attribute vec3 d;varying highp vec2 e;varying highp vec4 f;varying highp vec4 g;void main(void){gl_Position=vec4(a.x,a.y,0,1);e=b/16.0;f=vec4(c.r,c.g,c.b,1);g=vec4(d.r,d.g,d.b,1);}")),s.attachShader(o,this.buildShader(s.FRAGMENT_SHADER,"varying highp vec2 e;varying highp vec4 f;varying highp vec4 g;uniform bool h;uniform sampler2D s;void main(void){gl_FragColor=texture2D(s,e);if(h){if(gl_FragColor.a<0.1){gl_FragColor=texture2D(s,g.rg*16.0+fract(e*16.0)/16.0);}}else{if(gl_FragColor.r<0.1) {gl_FragColor=g;} else {gl_FragColor=f;}}}")),s.linkProgram(o),s.useProgram(o),this.font.graphical&&s.uniform1i(s.getUniformLocation(o,"h"),1),this.positionAttribLocation=this.getAttribLocation("a"),this.textureAttribLocation=this.getAttribLocation("b"),this.fgColorAttribLocation=this.getAttribLocation("c"),this.bgColorAttribLocation=this.getAttribLocation("d");const h=i*e;this.positionsArray=new Float32Array(3*h*4),this.indexArray=new Uint16Array(6*h),this.textureArray=new Float32Array(2*h*4),this.foregroundUint8Array=new Uint8Array(4*h*4),this.foregroundDataView=new DataView(this.foregroundUint8Array.buffer),this.backgroundUint8Array=new Uint8Array(4*h*4),this.backgroundDataView=new DataView(this.backgroundUint8Array.buffer);let n=0,_=0,a=0;for(let t=0;t<e;t++)for(let r=0;r<i;r++)this.positionsArray[n++]=nt(r,i),this.positionsArray[n++]=-nt(t,e),this.positionsArray[n++]=nt(r+1,i),this.positionsArray[n++]=-nt(t,e),this.positionsArray[n++]=nt(r+1,i),this.positionsArray[n++]=-nt(t+1,e),this.positionsArray[n++]=nt(r,i),this.positionsArray[n++]=-nt(t+1,e),this.indexArray[_++]=a+0,this.indexArray[_++]=a+1,this.indexArray[_++]=a+2,this.indexArray[_++]=a+0,this.indexArray[_++]=a+2,this.indexArray[_++]=a+3,a+=4;this.positionBuffer=s.createBuffer(),this.indexBuffer=s.createBuffer(),this.textureBuffer=s.createBuffer(),this.foregroundBuffer=s.createBuffer(),this.backgroundBuffer=s.createBuffer(),s.bindBuffer(s.ARRAY_BUFFER,this.positionBuffer),s.bufferData(s.ARRAY_BUFFER,this.positionsArray,s.STATIC_DRAW),s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,this.indexBuffer),s.bufferData(s.ELEMENT_ARRAY_BUFFER,this.indexArray,s.STATIC_DRAW),this.texture=this.loadTexture(this.font.url);const d=r.frameRate||15;window.setInterval((()=>this.renderLoop()),1e3/d)}handleResize(){const t=this.canvas.parentElement;if(!t)return;const i=t.offsetWidth/this.pixelWidth,e=t.offsetHeight/this.pixelHeight,r=Math.min(i,e),s=r*this.pixelWidth|0,o=r*this.pixelHeight|0;this.canvas.style.width=s+"px",this.canvas.style.height=o+"px"}getAttribLocation(t){const i=this.gl.getAttribLocation(this.program,t);return this.gl.enableVertexAttribArray(i),i}flush(){let t=0,i=0;for(let e=0;e<this.height;e++)for(let r=0;r<this.width;r++){const s=this.getCell(r,e);if(!s.dirty){t+=8,i+=16;continue}const o=s.charCode%16,h=s.charCode/16|0;this.textureArray[t++]=o,this.textureArray[t++]=h,this.textureArray[t++]=o+1,this.textureArray[t++]=h,this.textureArray[t++]=o+1,this.textureArray[t++]=h+1,this.textureArray[t++]=o,this.textureArray[t++]=h+1;for(let t=0;t<4;t++)this.foregroundDataView.setUint32(i,s.fg,!1),this.backgroundDataView.setUint32(i,s.bg,!1),i+=4;s.dirty=!1}}isKeyDown(t){const i=this.keys.getKey(t);return!!i&&i.down}isKeyPressed(t){const i=this.keys.getKey(t);return!!i&&i.isPressed()}getKeyDownCount(t){const i=this.keys.getKey(t);return i?i.downCount:0}buildShader(t,i){const e=this.gl,r=e.createShader(t);if(!r)throw new Error("An error occurred compiling the shader: ");if(e.shaderSource(r,i),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw new Error("An error occurred compiling the shader: "+e.getShaderInfoLog(r));return r}loadTexture(t){const i=this.gl,e=i.createTexture();i.bindTexture(i.TEXTURE_2D,e);const r=i.RGBA,s=i.RGBA,o=i.UNSIGNED_BYTE,h=new Uint8Array([0,0,0,255]);i.texImage2D(i.TEXTURE_2D,0,r,1,1,0,s,o,h);const n=new Image;return n.onload=()=>{i.bindTexture(i.TEXTURE_2D,e),i.texImage2D(i.TEXTURE_2D,0,r,s,o,n),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR)},n.src=t,e}render(){const t=this.gl;t.clearColor(0,0,0,1),t.clearDepth(1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.viewport(0,0,this.pixelWidth,this.pixelHeight);{const i=2,e=t.FLOAT,r=!1,s=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.positionBuffer),t.vertexAttribPointer(this.positionAttribLocation,i,e,r,s,o)}{const i=2,e=t.FLOAT,r=!1,s=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.textureBuffer),t.bufferData(t.ARRAY_BUFFER,this.textureArray,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.textureAttribLocation,i,e,r,s,o)}{const i=4,e=t.UNSIGNED_BYTE,r=!0,s=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.foregroundBuffer),t.bufferData(t.ARRAY_BUFFER,this.foregroundUint8Array,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.fgColorAttribLocation,i,e,r,s,o)}{const i=4,e=t.UNSIGNED_BYTE,r=!0,s=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.backgroundBuffer),t.bufferData(t.ARRAY_BUFFER,this.backgroundUint8Array,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.bgColorAttribLocation,i,e,r,s,o)}t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.useProgram(this.program),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture);{const i=this.width*this.height*6,e=t.UNSIGNED_SHORT,r=0;t.drawElements(t.TRIANGLES,i,e,r)}}renderLoop(){this.keys.updateKeys(),this.mouse.update(),this.update&&this.update(),this.flush(),this.render()}}}},i={};function e(r){if(i[r])return i[r].exports;var s=i[r]={exports:{}};return t[r](s,s.exports,e),s.exports}return e.d=(t,i)=>{for(var r in i)e.o(i,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:i[r]})},e.o=(t,i)=>Object.prototype.hasOwnProperty.call(t,i),e.r=t=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e(345)})()}));