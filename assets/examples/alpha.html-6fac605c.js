import{T as E,C as a,B as S,a as A,d as u}from"../terminal-5027974d.js";import{R as L}from"../rng-cbb834a5.js";const y=80,x=45,c=30,r=1+2*c,d=c,M=.35;function C(e,n,o){const m=new A(r,r);for(let l=0;l<r;l++)for(let i=0;i<r;i++){const R=Math.hypot(i-d,l-d),g=Math.max(0,Math.min(1,1-R/c)),p=M*g*g,w=u(e,n,o,p);m.drawChar(i,l,0,0,w)}return m.drawChar(d,d,"*".charCodeAt(0),u(e,n,o)),m}const t=new E(document.querySelector("canvas"),y,x),h=new L,s=[{x:10,y:10,console:C(0,0,1)}];for(let e=0;e<6;e++)s.push({x:15+e*10,y:22,console:C(e/6,1,1)});const f=[];for(let e=0;e<500;e++)f.push({x:h.nextRange(0,y*2),y:h.nextRange(-x,x),speed:h.nextRange(5,10)/5});t.update=function(){const e=t.getMovementKey();e&&(s[0].x+=e.x,s[0].y+=e.y),(t.mouse.dx!==0||t.mouse.dy!==0)&&(s[0].x=t.mouse.x,s[0].y=t.mouse.y),t.fillRect(0,0,80,45,0,a.BLACK,a.BLACK);for(let n=0;n<f.length;n++){const o=f[n];t.drawString(Math.round(o.x),Math.round(o.y),"/",a.DARK_GRAY),o.x-=o.speed,o.y+=o.speed,(o.x<0||o.y>x)&&(o.x+=y,o.y-=y)}for(let n=s.length-1;n>=0;n--){const o=s[n];t.drawConsole(o.x-c,o.y-c,o.console,0,0,r,r,S.Add)}t.drawString(1,1,"Hello world!",a.YELLOW),t.drawString(1,3,"Use arrow keys to move",a.YELLOW)};
