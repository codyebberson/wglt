import"../modulepreload-polyfill.b7f2da20.js";/* empty css                */import{T as _,a as w,b as E,C as d}from"../terminal.0c0b58ef.js";const u=[[1,0,1,0],[1,0,1,1],[1,0,1,2],[2,0,2,1],[0,0,2,1],[0,0,1,2],[2,0,2,2],[2,0,2,0],[0,0,2,2],[2,0,0,2],[2,0,0,1],[1,0,0,2],[0,0,1,1],[1,1,0,0],[1,1,0,1],[0,1,1,1],[1,1,1,0],[0,1,0,1],[1,1,1,1],[1,2,1,0],[2,1,2,0],[2,2,0,0],[0,2,2,0],[2,2,0,2],[0,2,2,2],[2,2,2,0],[0,2,0,2],[2,2,2,2],[1,2,0,2],[2,1,0,1],[0,2,1,2],[0,1,2,1],[2,1,0,0],[1,2,0,0],[0,2,1,0],[0,1,2,0],[2,1,2,1],[1,2,1,2],[1,0,0,1],[0,1,1,0]];function g(e,r,i){const o=e.getCharCode(r,i);return o!==void 0&&o>=179&&o<=218}function a(e,r,i,o){if(r<0||i<0||r>=e.width||i>=e.height)return 0;const t=e.getCharCode(r,i);return t===void 0||t<179||t>218?0:u[t-179][o]}function m(e,r,i,o){for(let t=0;t<u.length;t++){const l=u[t];if(l[0]===e&&l[1]===r&&l[2]===i&&l[3]===o)return 179+t}return 0}function I(e){for(let r=0;r<e.height;r++)for(let i=0;i<e.width;i++)if(g(e,i,r)){let o=a(e,i,r-1,2),t=a(e,i+1,r,3),l=a(e,i,r+1,0),n=a(e,i-1,r,1);o>0&&t===0&&l===0&&n===0?l=o:o===0&&t>0&&l===0&&n===0?n=t:o===0&&t===0&&l>0&&n===0?o=l:o===0&&t===0&&l===0&&n>0&&(t=n),n>0&&t>0&&(n=t=Math.max(n,t)),o>0&&l>0&&(o=l=Math.max(o,l));const h=m(o,t,l,n);if((o||t||l||n)&&!(h>=179&&h<=218))throw new Error("invalid char code! (up="+o+", right="+t+", down="+l+", left="+n+")");e.drawChar(i,r,h)}}const s=80,C=45,f=new _(document.querySelector("canvas"),s,C),c=new w(s,C);for(let e=0;e<C;e++)for(let r=0;r<s;r++)if(Math.random()<.5){const i=Math.random()<.5?E.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL:E.BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL;c.getCell(r,e).setValue(i,d.WHITE,d.DARK_BLUE)}I(c);f.update=function(){f.clear(),f.drawConsole(0,0,c,0,0,s,C),f.drawString(1,1,"Hello world!",d.WHITE)};
