const g=[-1,0,1,-1,1,-1,0,1],y=[-1,-1,-1,0,0,1,1,1],x=[1.4,1,1.4,1,1,1.4,1,1.4];let p=0;function f(s,e,t,r){p++;const o=s.grid[e.y][e.x];o.pathId=p,o.g=0,o.h=Math.hypot(e.x-t.x,e.y-t.y),o.prev=null;const l=new d([o]);for(;l.size()>0;){const n=l.pop();if(n.x===t.x&&n.y===t.y)return v(n);for(let h=0;h<g.length;h++){const c=n.x+g[h],u=n.y+y[h];if(c>=0&&c<s.width&&u>=0&&u<s.height){const i=s.grid[u][c];if(i.blocked&&i.explored&&(c!==t.x||u!==t.y))continue;i.pathId!==p&&(i.pathId=p,i.g=1/0,i.h=Math.hypot(c-t.x,u-t.y),i.prev=null);const a=n.g+x[h];a<i.g&&a<=r&&(i.g=a,i.prev=n,l.insert(i))}}}}function v(s){const e=[];let t=s;for(;t;)e.push(t),t=t.prev;return e.reverse(),e}class d{constructor(e){this.values=e}insert(e){const t=this.values;let r=0,o=t.length,l=0;for(;r<o;){const n=r+o>>>1,h=t[n];h.g+h.h>e.g+e.h?(r=n+1,l=r):(o=n,l=o)}t.splice(l,0,e)}pop(){return this.values.pop()}size(){return this.values.length}}export{f as c};
