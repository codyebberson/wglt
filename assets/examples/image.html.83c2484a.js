import"../modulepreload-polyfill.b7f2da20.js";/* empty css                */import{T as n,C as t,g as i}from"../terminal.724854b9.js";const e=new n(document.querySelector("canvas"),80,45);e.fillRect(0,0,80,45,0,t.YELLOW,t.DARK_BLUE);let a=10,l=10,o=null;i("../starry.png",r=>o=r);e.update=function(){const r=e.getMovementKey();r&&(a+=r.x,l+=r.y),e.clear(),o&&e.drawConsole(0,0,o,0,0,80,45),e.drawString(1,1,"Hello world!"),e.drawString(1,3,"Use arrow keys to move"),e.drawString(a,l,"@")};