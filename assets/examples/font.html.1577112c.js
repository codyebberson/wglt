import"../modulepreload-polyfill.b7f2da20.js";/* empty css                */import{T as a,F as l,C as o}from"../terminal.0c0b58ef.js";const e=new a(document.querySelector("canvas"),80,25,{font:new l("../terminal8x14_gs_ro.png",8,14)});e.fillRect(0,0,80,25,0,o.YELLOW,o.DARK_BLUE);let r=10,n=10;e.update=function(){const t=e.getMovementKey();t&&(r+=t.x,n+=t.y),e.clear(),e.drawString(1,1,"Hello world!"),e.drawString(1,3,"Use arrow keys to move"),e.drawString(r,n,"@")};
