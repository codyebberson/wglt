import{T as _,a as w,b as c,C as d}from"../terminal-M0kbsYI0.js";const u=[[1,0,1,0],[1,0,1,1],[1,0,1,2],[2,0,2,1],[0,0,2,1],[0,0,1,2],[2,0,2,2],[2,0,2,0],[0,0,2,2],[2,0,0,2],[2,0,0,1],[1,0,0,2],[0,0,1,1],[1,1,0,0],[1,1,0,1],[0,1,1,1],[1,1,1,0],[0,1,0,1],[1,1,1,1],[1,2,1,0],[2,1,2,0],[2,2,0,0],[0,2,2,0],[2,2,0,2],[0,2,2,2],[2,2,2,0],[0,2,0,2],[2,2,2,2],[1,2,0,2],[2,1,0,1],[0,2,1,2],[0,1,2,1],[2,1,0,0],[1,2,0,0],[0,2,1,0],[0,1,2,0],[2,1,2,1],[1,2,1,2],[1,0,0,1],[0,1,1,0]];function g(t,r,l){const o=t.getCharCode(r,l);return o!==void 0&&o>=179&&o<=218}function n(t,r,l,o){if(r<0||l<0||r>=t.width||l>=t.height)return 0;const e=t.getCharCode(r,l);return e===void 0||e<179||e>218?0:u[e-179][o]}function I(t,r,l,o){for(let e=0;e<u.length;e++){const a=u[e];if(a[0]===t&&a[1]===r&&a[2]===l&&a[3]===o)return 179+e}return 0}function T(t){for(let r=0;r<t.height;r++)for(let l=0;l<t.width;l++)if(g(t,l,r)){let o=n(t,l,r-1,2),e=n(t,l+1,r,3),a=n(t,l,r+1,0),i=n(t,l-1,r,1);o>0&&e===0&&a===0&&i===0?a=o:o===0&&e>0&&a===0&&i===0?i=e:o===0&&e===0&&a>0&&i===0?o=a:o===0&&e===0&&a===0&&i>0&&(e=i),i>0&&e>0&&(i=e=Math.max(i,e)),o>0&&a>0&&(o=a=Math.max(o,a));const h=I(o,e,a,i);if((o||e||a||i)&&!(h>=179&&h<=218))throw new Error("invalid char code! (up="+o+", right="+e+", down="+a+", left="+i+")");t.drawChar(l,r,h)}}const s=80,C=45,f=new _(document.querySelector("canvas"),s,C),E=new w(s,C);for(let t=0;t<C;t++)for(let r=0;r<s;r++)if(Math.random()<.5){const l=Math.random()<.5?c.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL:c.BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL;E.getCell(r,t).setValue(l,d.WHITE,d.DARK_BLUE)}T(E);f.update=()=>{f.clear(),f.drawConsole(0,0,E,0,0,s,C),f.drawString(1,1,"Hello world!",d.WHITE)};
