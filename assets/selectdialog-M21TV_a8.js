import{R as d,P as u,C as r,M as l,K as c}from"./terminal-aeKGVIYa.js";class x{constructor(t,e,s){this.dialog=t,this.rect=e,this.contentsOffset=s,this.open=!1,this.count=0}}class w{getState(t,e){const s=e.contentsRect.width+4,i=e.contentsRect.height+4,n=(t.width-s)/2|0,h=(t.height-i)/2|0;return new x(e,new d(n,h,s,i),new u(n+2,h+2))}draw(t,e){const s=e.dialog,{x:i,y:n,width:h,height:o}=e.rect;t.fillRect(i,n,h,o,0,r.WHITE,r.BLACK),t.drawSingleBox(i,n,h,o),t.drawCenteredString(i+h/2|0,n," "+s.title+" "),s.drawContents(t,e.contentsOffset)}}class C{constructor(t,e=new w,s=[]){this.terminal=t,this.renderer=e,this.dialogs=s}add(t){this.dialogs.push(this.renderer.getState(this.terminal,t))}handleInput(){if(this.dialogs.length===0)return!1;const t=this.dialogs.length-1,e=this.dialogs[this.dialogs.length-1];return e.dialog.handleInput(this.terminal,e.contentsOffset)&&this.dialogs.splice(t,1),!0}draw(){for(let t=0;t<this.dialogs.length;t++)this.renderer.draw(this.terminal,this.dialogs[t])}}class g{constructor(t,e){this.contentsRect=t,this.title=e}}class I extends g{constructor(t,e){let s;e instanceof l?s=new d(0,0,e.getWidth(),e.getHeight()):s=new d(0,0,e.length,1),super(s,t),this.message=e}drawContents(t,e){this.message instanceof l?t.drawMessage(e.x,e.y,this.message,this.message.getWidth()):t.drawString(e.x,e.y,this.message)}handleInput(t){return t.isKeyPressed(c.VK_ESCAPE)}}class K extends g{constructor(t,e,s){let i=t.length;for(let o=0;o<e.length;o++)i=Math.max(i,e[o].length+4);const n=e.length,h=new d(0,0,i,n);super(h,t),this.options=e,this.callback=s,this.hoverIndex=-1}drawContents(t,e){for(let s=0;s<this.options.length;s++){const i=String.fromCharCode(65+s)+" - "+this.options[s];s===this.hoverIndex?t.drawString(e.x,e.y+s,i,r.BLACK,r.WHITE):t.drawString(e.x,e.y+s,i,r.WHITE,r.BLACK)}}handleInput(t,e){const s=t.getMovementKey();if(s&&s.y!==0&&(this.hoverIndex=(this.hoverIndex+this.options.length+s.y)%this.options.length),this.hoverIndex>=0&&(t.isKeyPressed(c.VK_ENTER)||t.isKeyPressed(c.VK_NUMPAD_ENTER)))return this.callback(this.hoverIndex),!0;if(t.mouse.x>=e.x&&t.mouse.x<e.x+this.contentsRect.width&&t.mouse.y>=e.y&&t.mouse.y<e.y+this.contentsRect.height&&(this.hoverIndex=t.mouse.y-e.y,t.mouse.buttons.get(0).isClicked()))return t.mouse.buttons.clear(),this.callback(this.hoverIndex),!0;const i=65;for(let n=0;n<this.options.length;n++)if(t.isKeyPressed("Key"+String.fromCharCode(i+n)))return this.callback(n),!0;return t.isKeyPressed(c.VK_ESCAPE)}isMouseOverOption(t,e,s){return t.mouse.x>=e.x&&t.mouse.x<e.x+this.contentsRect.width&&t.mouse.y===e.y+s}}export{g as D,C as G,I as M,K as S,x as a};
