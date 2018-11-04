const t=0,i=4294967040,e=2863311360,r=1431655680,s=4294923520,o=2857697280,h=4283782400,n=2852126720,a=1442796800,c=11141120,A=1442840320,d=11184640,u=1431699200,l=43520,f=4283825920,g=2852170240,b=4287102976;function E(t,i,e){return(t<<24)+(i<<16)+(e<<8)}function R(t,i,e){let r,s,o,h,n,a,c,A;switch(a=e*(1-i),c=e*(1-(n=6*t-(h=6*t|0))*i),A=e*(1-(1-n)*i),h%6){case 0:r=e,s=A,o=a;break;case 1:r=c,s=e,o=a;break;case 2:r=a,s=e,o=A;break;case 3:r=a,s=c,o=e;break;case 4:r=A,s=a,o=e;break;case 5:r=e,s=a,o=c;break;default:r=0,s=0,o=0}return E(255*r|0,255*s|0,255*o|0)}function y(t,i){const e=new Array(i);for(let r=0;r<i;r++)e[r]=new Array(t);return e}class x{constructor(t,i,e){if(this.width=t,this.height=i,this.blocked=y(t,i),this.visible=y(t,i),this.originX=0,this.originY=0,this.minX=0,this.maxX=0,this.minY=0,this.maxY=0,this.radius=0,e)for(let r=0;r<i;r++)for(let i=0;i<t;i++)this.blocked[r][i]=e(i,r)}setBlocked(t,i,e){this.blocked[i][t]=e}isVisible(t,i){return this.visible[i][t]}computeOctantY(t,i){const e=[],r=[];let s,o,h,n,a,c,A,d,u,l,f=1,g=0,b=0,E=0;for(o=this.originY+i;o>=this.minY&&o<=this.maxY;o+=i,b=g,++f)for(h=.5/f,l=-1,n=Math.floor(E*f+.5),s=this.originX+n*t;n<=f&&s>=this.minX&&s<=this.maxX;s+=t,++n,l=u){if(a=!0,c=!1,d=l,u=(A=n/f)+h,b>0)if(this.visible[o-i][s]&&!this.blocked[o-i][s]||this.visible[o-i][s-t]&&!this.blocked[o-i][s-t]){for(let t=0;t<b&&a;++t)if(d<=r[t]&&u>=e[t])if(this.blocked[o][s]){if(d>=e[t]&&u<=r[t]){a=!1;break}e[t]=Math.min(e[t],d),r[t]=Math.max(r[t],u),c=!0}else if(A>e[t]&&A<r[t]){a=!1;break}}else a=!1;a&&(this.visible[o][s]=!0,this.blocked[o][s]&&(E>=d?E=u:c||(e[g]=d,r[g++]=u)))}}computeOctantX(t,i){const e=[],r=[];let s,o,h,n,a,c,A,d,u,l,f=1,g=0,b=0,E=0;for(s=this.originX+t;s>=this.minX&&s<=this.maxX;s+=t,b=g,++f)for(h=.5/f,l=-1,n=Math.floor(E*f+.5),o=this.originY+n*i;n<=f&&o>=this.minY&&o<=this.maxY;o+=i,++n,l=u){if(a=!0,c=!1,d=l,u=(A=n/f)+h,b>0)if(this.visible[o][s-t]&&!this.blocked[o][s-t]||this.visible[o-i][s-t]&&!this.blocked[o-i][s-t]){for(let t=0;t<b&&a;++t)if(d<=r[t]&&u>=e[t])if(this.blocked[o][s]){if(d>=e[t]&&u<=r[t]){a=!1;break}e[t]=Math.min(e[t],d),r[t]=Math.max(r[t],u),c=!0}else if(A>e[t]&&A<r[t]){a=!1;break}}else a=!1;a&&(this.visible[o][s]=!0,this.blocked[o][s]&&(E>=d?E=u:c||(e[g]=d,r[g++]=u)))}}computeFov(t,i,e){for(let t=0;t<this.height;t++)for(let i=0;i<this.width;i++)this.visible[t][i]=!1;this.visible[i][t]=!0,this.originX=t,this.originY=i,this.radius=e,this.minX=Math.max(0,t-e),this.minY=Math.max(0,i-e),this.maxX=Math.min(this.width-1,t+e),this.maxY=Math.min(this.height-1,i+e),this.computeOctantY(1,1),this.computeOctantX(1,1),this.computeOctantY(1,-1),this.computeOctantX(1,-1),this.computeOctantY(-1,1),this.computeOctantX(-1,1),this.computeOctantY(-1,-1),this.computeOctantX(-1,-1)}}const w=256;class p{constructor(){this.down=!1,this.downCount=0}}class m{constructor(t){this.keys=new Array(w);for(let t=0;t<w;t++)this.keys[t]=new p;t.addEventListener("keydown",t=>this.setKey(t,!0)),t.addEventListener("keyup",t=>this.setKey(t,!1))}setKey(t,i){t.stopPropagation(),t.preventDefault();const e=t.keyCode;e>=0&&e<w&&(this.keys[e].down=i)}updateKeys(){for(let t=0;t<w;t++)this.keys[t].down?this.keys[t].downCount++:this.keys[t].downCount=0}getKey(t){return t>=0&&t<w?this.keys[t]:null}}const T=27,U=32,B=37,F=38,k=39,D=40,C=65,v=68,I=77,L=81,Y=83,N=87,S=90;class M{constructor(t){this.m=2147483648,this.a=1103515245,this.c=12345,this.state=t||1}nextInt(){return this.state=(this.a*this.state+this.c)%this.m,this.state}nextFloat(){return this.nextInt()/(this.m-1)}nextRange(t,i){const e=i-t;return t+(this.nextInt()/this.m*e|0)}}const O=8,X=8,_="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAEtElEQVRIx2WTsYsUMRTGPxTOJniWgRMFsbR4oJyDBE+s/AdsrIJKtEixIKwPHOc8tbCwsdNKLCy0tlBQGBCnel55CK5y1dqIbKVbhBlfZkYP8UsI2d98ed+bMAtUVTxUHELn3Krb2HwCbHVtUSo4f/5AOHnlEvD8c1sWhf229WQ1bGy63tG2pXu/9e52oCvfgHfvy7JtMxDXgyffimKnzEfETq71Rw6pclGpFvNLORYoihzLdrd+gjv7bNisYK3FoN2DLnx+D+esJRy3HZZnq/CZ9aA1vg6uQ9vacEvykbatu6pShw1rooYqOzqnNSqsceWss9Qe76ymuLD2sNpLAXS3RIe/4hgJhbceWSs9SE30RIEUmAzaWoraW0fDeUZMdgpvu4QEhYTW0AyjI1dSRxDkGhNQnR2RmilyCoHuYE+jn4n5cCoSc47wDFmIuNqLSH9EMCNj4rI2IkQ+WYNERSFmabkkjTAW38mb1giJAdRB0K2o34ulCYEATokNs+cJkabQf22gpORS2zrhI/NF0xRoOIR4+XIQMsH/mEd8lVCH69drBdG3PxsFZR2Y60SG/c5XBal3bGt8vNxsN6gl1/BaQzdNE8GSUxZnhXne5pT/lFiHSNNIyzUfAoIEedUD8d4WPdglBVEee7IRKKUsFOwUTN7aBvAzPqygjXTZGwsFHIWEfzTU+JUMFofnzImahlvex/hPHQi7OIwCu2R3JxkRPAyiruP96f2zYT+NEw70fcmACVLKQqbaFbUiQBlqSV4CWaadDCSI1L4M2dFkMH3LU16YOX+acyOMUUtggr86hF6H7e502NIAyNKswGz6qSz7C0oKEBEk1uMF5XdoMuD+goTUoaAsvTkl3Mby6gC8WSztlGJjkqagxeLIXie9GLYS76CLlF4IIvQeFFgXNEQXUIMdsxNdJsWECbXIijErdRDRFGGIpLNleVaqlDIQsOSHgX1dK0gJVPFGVW2Q1tBi6vB73+ggi7MMzx6NoDiDgyBEEdIBIEasIW3KYC2lvLotFt60zCwijWwvdrgCb4qqBzt+TuoYf6dG5vPIVmtsM3NVmZLL9Fo+Af9exwTWGjOdOkcO83lGRNbOZjHgkrZhTwp4knEM9BzMCAGGWJbfzzr/JlU3rJxESTkTqF+YK9esOiSDWVVJMNsfndaotAkRgB0eP3X4R0f3WwDHLn7RVrh26+tYtwI8eHnTWnvfnx/A6CCiNz/X258Vjw5mfrayvrJSp8Gx1GR1/GxrWg6OlJLWWEeV7FBDHS4DS3ZwQPUH6C8d0+k6hjGC2WwEd0fAdHrjV3e6+9WOwDARoDPiaNfpLGVDH+uMGKpIygV0tiOoZAR3RwCMAPiUWLzGiEUH6ztM4n1QTffRA+rwKeibnWPmHnAH89N7v0tEGUAdLjAzFCy1HZtbi+rIAHYARVJBXT1g7CkDqLpusdphsaoJvm9xa2sEdJ+IEmHr3gikH8DWhz9A1YMXAFZXVxei4gwe7YFEGWyNgJkN97Ej+PutEuabFaEAipIHcOLze0IU8EGTQQJ/ZiAC1hUuO9LJW5JQKDjoFWjUtzWBylZlqUDRxzUmDMog4enaQ1Kyp/1Y7v1vfwPx3em+Z+50IgAAAABJRU5ErkJggg==",W="attribute vec2 a;attribute vec2 b;attribute vec3 c;attribute vec3 d;varying highp vec2 e;varying highp vec4 f;varying highp vec4 g;void main(void){gl_Position=vec4(a.x,a.y,0,1);e=b/16.0;f=vec4(c.r,c.g,c.b,1);g=vec4(d.r,d.g,d.b,1);}",G="varying highp vec2 e;varying highp vec4 f;varying highp vec4 g;uniform sampler2D s;void main(void){gl_FragColor=texture2D(s,e);if(gl_FragColor.r<0.1) {gl_FragColor=g;} else {gl_FragColor=f;}}";function H(t,i){return t/i*2-1}class P{constructor(t,i,e){this.canvas=t,this.width=i,this.height=e,this.pixelWidth=i*O,this.pixelHeight=e*X,t.width=this.pixelWidth,t.height=this.pixelHeight,t.style.width=this.pixelWidth+"px",t.style.height=this.pixelHeight+"px",t.style.outline="none",t.tabIndex=0,this.keys=new m(t);const r=t.getContext("webgl",{antialias:!1});if(!r)throw new Error("Unable to initialize WebGL. Your browser may not support it.");const s=r.createProgram();if(!s)throw new Error("Unable to initialize WebGL. Your browser may not support it.");this.gl=r,this.program=s,r.attachShader(s,this.buildShader(r.VERTEX_SHADER,W)),r.attachShader(s,this.buildShader(r.FRAGMENT_SHADER,G)),r.linkProgram(s),r.useProgram(s),this.positionAttribLocation=this.getAttribLocation("a"),this.textureAttribLocation=this.getAttribLocation("b"),this.fgColorAttribLocation=this.getAttribLocation("c"),this.bgColorAttribLocation=this.getAttribLocation("d");const o=i*e;this.positionsArray=new Float32Array(3*o*4),this.indexArray=new Uint16Array(6*o),this.textureArray=new Float32Array(2*o*4),this.foregroundUint8Array=new Uint8Array(4*o*4),this.foregroundDataView=new DataView(this.foregroundUint8Array.buffer),this.backgroundUint8Array=new Uint8Array(4*o*4),this.backgroundDataView=new DataView(this.backgroundUint8Array.buffer);let h=0,n=0,a=0;for(let t=0;t<e;t++)for(let r=0;r<i;r++)this.positionsArray[h++]=H(r,i),this.positionsArray[h++]=-H(t,e),this.positionsArray[h++]=H(r+1,i),this.positionsArray[h++]=-H(t,e),this.positionsArray[h++]=H(r+1,i),this.positionsArray[h++]=-H(t+1,e),this.positionsArray[h++]=H(r,i),this.positionsArray[h++]=-H(t+1,e),this.indexArray[n++]=a+0,this.indexArray[n++]=a+1,this.indexArray[n++]=a+2,this.indexArray[n++]=a+0,this.indexArray[n++]=a+2,this.indexArray[n++]=a+3,a+=4;this.positionBuffer=r.createBuffer(),this.indexBuffer=r.createBuffer(),this.textureBuffer=r.createBuffer(),this.foregroundBuffer=r.createBuffer(),this.backgroundBuffer=r.createBuffer(),r.bindBuffer(r.ARRAY_BUFFER,this.positionBuffer),r.bufferData(r.ARRAY_BUFFER,this.positionsArray,r.STATIC_DRAW),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,this.indexBuffer),r.bufferData(r.ELEMENT_ARRAY_BUFFER,this.indexArray,r.STATIC_DRAW),this.texture=this.loadTexture(_),this.renderLoop()}getAttribLocation(t){const i=this.gl.getAttribLocation(this.program,t);return this.gl.enableVertexAttribArray(i),i}isOutOfRange(t,i){return t<0||t>=this.width||i<0||i>=this.height}setCharCode(t,i,e){if(this.isOutOfRange(t,i))return;const r=e%16+.5/256,s=(e/16|0)+.5/256,o=8*(i*this.width+t);this.textureArray[o+0]=r,this.textureArray[o+1]=s,this.textureArray[o+2]=r+1,this.textureArray[o+3]=s,this.textureArray[o+4]=r+1,this.textureArray[o+5]=s+1,this.textureArray[o+6]=r,this.textureArray[o+7]=s+1}clear(){this.clearRect(0,0,this.width,this.height)}clearRect(t,i,e,r){const s=t+e,o=i+r;for(let e=i;e<o;e++)for(let i=t;i<s;i++)this.setCharCode(i,e,0)}setForegroundColor(t,i,e){if(this.isOutOfRange(t,i))return;let r=16*(i*this.width+t);for(let t=0;t<4;t++)this.foregroundDataView.setUint32(r,e,!1),r+=4}setBackgroundColor(t,i,e){if(this.isOutOfRange(t,i))return;let r=16*(i*this.width+t);for(let t=0;t<4;t++)this.backgroundDataView.setUint32(r,e,!1),r+=4}drawString(t,i,e,r,s){for(let r=0;r<e.length;r++)this.setCharCode(t+r,i,e.charCodeAt(r));r&&this.fillForegroundRect(t,i,e.length,1,r),s&&this.fillBackgroundRect(t,i,e.length,1,s)}drawCenteredString(t,i,e,r,s){this.drawString(t-e.length/2|0,i,e,r,s)}fillForegroundRect(t,i,e,r,s){for(let o=i;o<i+r;o++)for(let i=t;i<t+e;i++)this.setForegroundColor(i,o,s)}fillBackgroundRect(t,i,e,r,s){for(let o=i;o<i+r;o++)for(let i=t;i<t+e;i++)this.setBackgroundColor(i,o,s)}isKeyDown(t){const i=this.keys.getKey(t);return i&&i.down}isKeyPressed(t){const i=this.keys.getKey(t),e=i?i.downCount:0;return 1===e||e>30&&e%3==0}getKeyDownCount(t){const i=this.keys.getKey(t);return i?i.downCount:0}buildShader(t,i){const e=this.gl,r=e.createShader(t);if(!r)throw new Error("An error occurred compiling the shader: ");if(e.shaderSource(r,i),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw new Error("An error occurred compiling the shader: "+e.getShaderInfoLog(r));return r}loadTexture(t){const i=this.gl,e=i.createTexture();i.bindTexture(i.TEXTURE_2D,e);const r=i.RGBA,s=i.RGBA,o=i.UNSIGNED_BYTE,h=new Uint8Array([0,0,0,255]);i.texImage2D(i.TEXTURE_2D,0,r,1,1,0,s,o,h);const n=new Image;return n.onload=(()=>{i.bindTexture(i.TEXTURE_2D,e),i.texImage2D(i.TEXTURE_2D,0,r,s,o,n),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.generateMipmap(i.TEXTURE_2D)}),n.src=t,e}render(){const t=this.gl;t.clearColor(0,0,0,1),t.clearDepth(1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.viewport(0,0,640,400);{const i=2,e=t.FLOAT,r=!1,s=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.positionBuffer),t.vertexAttribPointer(this.positionAttribLocation,i,e,r,s,o)}{const i=2,e=t.FLOAT,r=!1,s=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.textureBuffer),t.bufferData(t.ARRAY_BUFFER,this.textureArray,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.textureAttribLocation,i,e,r,s,o)}{const i=4,e=t.UNSIGNED_BYTE,r=!0,s=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.foregroundBuffer),t.bufferData(t.ARRAY_BUFFER,this.foregroundUint8Array,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.fgColorAttribLocation,i,e,r,s,o)}{const i=4,e=t.UNSIGNED_BYTE,r=!0,s=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.backgroundBuffer),t.bufferData(t.ARRAY_BUFFER,this.backgroundUint8Array,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.bgColorAttribLocation,i,e,r,s,o)}t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.useProgram(this.program),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture);t.drawElements(t.TRIANGLES,this.width*this.height*6,t.UNSIGNED_SHORT,0)}renderLoop(){this.keys.updateKeys(),this.update&&this.update(),this.render(),requestAnimationFrame(this.renderLoop.bind(this))}}export{t as COLOR_BLACK,i as COLOR_WHITE,e as COLOR_LIGHT_GRAY,r as COLOR_DARK_GRAY,s as COLOR_YELLOW,o as COLOR_BROWN,h as COLOR_LIGHT_RED,n as COLOR_DARK_RED,a as COLOR_LIGHT_GREEN,c as COLOR_DARK_GREEN,A as COLOR_LIGHT_CYAN,d as COLOR_DARK_CYAN,u as COLOR_LIGHT_BLUE,l as COLOR_DARK_BLUE,f as COLOR_LIGHT_MAGENTA,g as COLOR_DARK_MAGENTA,b as COLOR_ORANGE,E as createColor,R as createHsvColor,x as FovMap,p as Key,m as Keys,T as VK_ESCAPE,U as VK_SPACE,B as VK_LEFT,F as VK_UP,k as VK_RIGHT,D as VK_DOWN,C as VK_A,v as VK_D,I as VK_M,L as VK_Q,Y as VK_S,N as VK_W,S as VK_Z,M as RNG,P as Terminal};
//# sourceMappingURL=index.mjs.map
