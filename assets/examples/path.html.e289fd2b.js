import"../modulepreload-polyfill.b7f2da20.js";/* empty css                */import{T as m,a as I,C as s}from"../terminal.0c0b58ef.js";import{c as E}from"../path.ee3991af.js";const a=80,l=45,h=new Array(l);for(let e=0;e<l;e++){h[e]=new Array(a);for(let o=0;o<a;o++)h[e][o]=Math.random()<.4?"#":"."}const g=15;function f(e,o){return h[o][e]}function d(e,o){return f(e,o)!=="."}const c=new m(document.querySelector("canvas"),a,l),t={x:Math.floor(a/2),y:Math.floor(l/2),path:null,pathIndex:0};function u(){p.computeFov(t.x,t.y,g),p.updateExplored()}const p=new I(a,l,d);for(let e=0;e<l;e++)for(let o=0;o<a;o++)p.getCell(o,e).explored=!0;u();function x(e,o){const n=t.x+e,r=t.y+o;n<0||n>=a||r<0||r>=l||d(n,r)||(t.x=n,t.y=r,u())}c.update=function(){const e=c.getMovementKey();if(e&&x(e.x,e.y),t.path){for(;t.pathIndex<t.path.length&&t.x===t.path[t.pathIndex].x&&t.y===t.path[t.pathIndex].y;)t.pathIndex++;t.pathIndex<t.path.length&&x(t.path[t.pathIndex].x-t.x,t.path[t.pathIndex].y-t.y)}c.clear(),p.fillRect(0,0,a,l,0,s.WHITE,s.BLACK);for(let n=0;n<l;n++)for(let r=0;r<a;r++){const i=f(r,n),y=p.isVisible(r,n)?s.WHITE:s.DARK_GRAY;p.drawString(r,n,i,y)}const o=E(p,t,c.mouse,1e3);if(o){for(let n=1;n<o.length;n++){const r=o[n],i=p.getCell(r.x,r.y);i&&i.setBackground(s.DARK_RED)}c.mouse.buttons[0].upCount===1&&(t.path=o,t.pathIndex=0)}c.drawConsole(0,0,p,0,0,a,l),c.drawString(t.x,t.y,"@"),c.drawString(1,1,"Hello world!",s.WHITE),c.drawString(1,3,"Use arrow keys to move",s.WHITE)};
