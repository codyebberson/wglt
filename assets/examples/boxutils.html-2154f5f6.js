import{T as _,a as w,b as E,C as d}from"../terminal-5027974d.js";const u=[[1,0,1,0],[1,0,1,1],[1,0,1,2],[2,0,2,1],[0,0,2,1],[0,0,1,2],[2,0,2,2],[2,0,2,0],[0,0,2,2],[2,0,0,2],[2,0,0,1],[1,0,0,2],[0,0,1,1],[1,1,0,0],[1,1,0,1],[0,1,1,1],[1,1,1,0],[0,1,0,1],[1,1,1,1],[1,2,1,0],[2,1,2,0],[2,2,0,0],[0,2,2,0],[2,2,0,2],[0,2,2,2],[2,2,2,0],[0,2,0,2],[2,2,2,2],[1,2,0,2],[2,1,0,1],[0,2,1,2],[0,1,2,1],[2,1,0,0],[1,2,0,0],[0,2,1,0],[0,1,2,0],[2,1,2,1],[1,2,1,2],[1,0,0,1],[0,1,1,0]];function g(t,r,l){const o=t.getCharCode(r,l);return o!==void 0&&o>=179&&o<=218}function a(t,r,l,o){if(r<0||l<0||r>=t.width||l>=t.height)return 0;const e=t.getCharCode(r,l);return e===void 0||e<179||e>218?0:u[e-179][o]}function I(t,r,l,o){for(let e=0;e<u.length;e++){const i=u[e];if(i[0]===t&&i[1]===r&&i[2]===l&&i[3]===o)return 179+e}return 0}function T(t){for(let r=0;r<t.height;r++)for(let l=0;l<t.width;l++)if(g(t,l,r)){let o=a(t,l,r-1,2),e=a(t,l+1,r,3),i=a(t,l,r+1,0),n=a(t,l-1,r,1);o>0&&e===0&&i===0&&n===0?i=o:o===0&&e>0&&i===0&&n===0?n=e:o===0&&e===0&&i>0&&n===0?o=i:o===0&&e===0&&i===0&&n>0&&(e=n),n>0&&e>0&&(n=e=Math.max(n,e)),o>0&&i>0&&(o=i=Math.max(o,i));const h=I(o,e,i,n);if((o||e||i||n)&&!(h>=179&&h<=218))throw new Error("invalid char code! (up="+o+", right="+e+", down="+i+", left="+n+")");t.drawChar(l,r,h)}}const s=80,C=45,f=new _(document.querySelector("canvas"),s,C),c=new w(s,C);for(let t=0;t<C;t++)for(let r=0;r<s;r++)if(Math.random()<.5){const l=Math.random()<.5?E.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL:E.BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL;c.getCell(r,t).setValue(l,d.WHITE,d.DARK_BLUE)}T(c);f.update=function(){f.clear(),f.drawConsole(0,0,c,0,0,s,C),f.drawString(1,1,"Hello world!",d.WHITE)};
