import{T as H,f as M,K as L,C as s}from"../terminal-5027974d.js";import{R as b}from"../rng-cbb834a5.js";const T=80,c=45,p=180,R=10,A=15,o=new H(document.querySelector("canvas"),T,c),l=new b,n={x:T/2,y:c-5,cooldown:0},g=[],E=[];for(let y=0;y<100;y++){const f=l.nextRange(64,192);E.push({x:l.nextRange(0,T),y:l.nextRange(0,c),color:M(f,f,f),dy:l.nextRange(1,4)})}const r=[],h=[{x:60,y:40},{x:70,y:30},{x:60,y:20},{x:40,y:40},{x:20,y:20},{x:10,y:30},{x:20,y:40}],w=[],d={count:0,startTime:0,endTime:0};let m=0;function G(){d.count++,d.startTime=m+p,d.endTime=d.startTime+A*R}G();o.update=function(){const y=m-d.startTime,f=o.getMovementKey();f&&(n.x=Math.max(0,Math.min(T-2,n.x+f.x)),n.y=Math.max(0,Math.min(c-2,n.y+f.y))),n.cooldown>0&&n.cooldown--,n.cooldown===0&&o.isKeyDown(L.VK_Z)&&(g.push({x:n.x,y:n.y}),n.cooldown=15),m>=d.startTime&&m<d.endTime&&y%R===0&&r.push({id:y/R,x:10,y:2,state:0});for(let e=r.length-1;e>=0;e--){const t=r[e];let i=0,a=0;if(t.state<0)i=n.x,a=n.y;else if(t.state<h.length)i=h[t.state].x,a=h[t.state].y;else{const x=Math.round(m%800/8),I=x<45?5+x:5+100-x,S=t.id%5,_=t.id/5|0,u=5;i=I+u*S,a=5+u*_}if(t.x===i&&t.y===a?t.state++:(t.x<i?t.x++:t.x>i&&t.x--,t.y<a?t.y++:t.y>a&&t.y--),y>=240&&(y-240)%60===0){const x=r.length-1-(y-240)/60;x>=0&&(r[x].state=-1)}}for(let e=g.length-1;e>=0;e--){const t=g[e];for(let i=r.length-1;i>=0;i--){const a=r[i];if(Math.abs(t.x-a.x)<=1&&Math.abs(t.y-a.y)<=1){r.splice(i,1);for(let x=0;x<10;x++)w.push({x:a.x,y:a.y,dx:l.nextRange(-5,5)/10,dy:l.nextRange(-5,5)/10,state:l.nextRange(10,20)});r.length===0&&G();break}}}o.clear();for(let e=0;e<E.length;e++){const t=E[e];o.drawString(t.x,t.y,".",t.color),t.y+=t.dy,t.y>=c&&(t.y-=c,t.x=l.nextRange(0,T))}for(let e=g.length-1;e>=0;e--){const t=g[e];o.drawString(t.x,t.y,"*",s.YELLOW),t.y-=2,t.y<0&&g.splice(e,1)}for(let e=w.length-1;e>=0;e--){const t=w[e];o.drawString(Math.round(t.x),Math.round(t.y),"%",s.ORANGE),t.x+=t.dx,t.y+=t.dy,t.dx*=.9,t.dy*=.9,t.state--,t.state<=0&&w.splice(e,1)}for(let e=r.length-1;e>=0;e--){const t=r[e];o.drawString(t.x,t.y,"#",s.LIGHT_GREEN),o.drawString(t.x-1,t.y-1,"@",s.LIGHT_RED),o.drawString(t.x+1,t.y-1,"@",s.LIGHT_RED),o.drawString(t.x-1,t.y+1,"@",s.LIGHT_RED),o.drawString(t.x+1,t.y+1,"@",s.LIGHT_RED)}o.drawString(n.x,n.y,"^",s.LIGHT_GRAY),o.drawString(n.x-1,n.y+1,"/",s.LIGHT_GRAY),o.drawString(n.x+1,n.y+1,"\\",s.LIGHT_GRAY),o.drawString(n.x,n.y+1,"|",s.LIGHT_RED),y<0&&y>-p+60&&o.drawCenteredString(T/2,c/2,"WAVE "+d.count,s.WHITE),o.drawString(1,c-2,"Z - SHOOT",s.WHITE),m++};
