import{T as s,f as l}from"../terminal.fe5b05f3.js";import{R as m}from"../rng.cc89da0e.js";const o=80,e=45,n=new Array(e);for(let r=0;r<e;r++){n[r]=new Array(o);for(let t=0;t<o;t++)n[r][t]=0}const f=new s(document.querySelector("canvas"),o,e),i=new m;f.update=function(){for(let r=0;r<o;r++)n[e-1][r]=i.nextRange(64,255);for(let r=0;r<e-1;r++)for(let t=0;t<o;t++)n[r][t]=Math.floor((n[(r+1)%e][(t-1+o)%o]+n[(r+1)%e][t%o]+n[(r+1)%e][(t+1)%o]+n[(r+2)%e][t%o])*.24);for(let r=0;r<e;r++)for(let t=0;t<o;t++){const a=n[r][t]/256,c=l(a/6,1,Math.min(1,a*2));f.drawChar(t,r,0,0,c)}};
