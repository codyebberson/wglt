!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?i(exports):"function"==typeof define&&define.amd?define(["exports"],i):i(t.wglt={})}(this,function(t){function i(t,i,e){return(t<<24)+(i<<16)+(e<<8)}class e{}e.BLACK=i(0,0,0),e.WHITE=i(255,255,255),e.LIGHT_GRAY=i(170,170,170),e.DARK_GRAY=i(85,85,85),e.YELLOW=i(255,255,85),e.BROWN=i(170,85,0),e.LIGHT_RED=i(255,85,85),e.DARK_RED=i(170,0,0),e.LIGHT_GREEN=i(85,255,85),e.DARK_GREEN=i(0,170,0),e.LIGHT_CYAN=i(85,255,255),e.DARK_CYAN=i(0,170,170),e.LIGHT_BLUE=i(85,85,255),e.DARK_BLUE=i(0,0,170),e.LIGHT_MAGENTA=i(255,85,255),e.DARK_MAGENTA=i(170,0,170),e.ORANGE=i(255,136,0);class r{constructor(t,i,e,r){this.url=t,this.charWidth=i,this.charHeight=e,this.graphical=!!r}}const s=new r("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAEtElEQVRIx2WTsYsUMRTGPxTOJniWgRMFsbR4oJyDBE+s/AdsrIJKtEixIKwPHOc8tbCwsdNKLCy0tlBQGBCnel55CK5y1dqIbKVbhBlfZkYP8UsI2d98ed+bMAtUVTxUHELn3Krb2HwCbHVtUSo4f/5AOHnlEvD8c1sWhf229WQ1bGy63tG2pXu/9e52oCvfgHfvy7JtMxDXgyffimKnzEfETq71Rw6pclGpFvNLORYoihzLdrd+gjv7bNisYK3FoN2DLnx+D+esJRy3HZZnq/CZ9aA1vg6uQ9vacEvykbatu6pShw1rooYqOzqnNSqsceWss9Qe76ymuLD2sNpLAXS3RIe/4hgJhbceWSs9SE30RIEUmAzaWoraW0fDeUZMdgpvu4QEhYTW0AyjI1dSRxDkGhNQnR2RmilyCoHuYE+jn4n5cCoSc47wDFmIuNqLSH9EMCNj4rI2IkQ+WYNERSFmabkkjTAW38mb1giJAdRB0K2o34ulCYEATokNs+cJkabQf22gpORS2zrhI/NF0xRoOIR4+XIQMsH/mEd8lVCH69drBdG3PxsFZR2Y60SG/c5XBal3bGt8vNxsN6gl1/BaQzdNE8GSUxZnhXne5pT/lFiHSNNIyzUfAoIEedUD8d4WPdglBVEee7IRKKUsFOwUTN7aBvAzPqygjXTZGwsFHIWEfzTU+JUMFofnzImahlvex/hPHQi7OIwCu2R3JxkRPAyiruP96f2zYT+NEw70fcmACVLKQqbaFbUiQBlqSV4CWaadDCSI1L4M2dFkMH3LU16YOX+acyOMUUtggr86hF6H7e502NIAyNKswGz6qSz7C0oKEBEk1uMF5XdoMuD+goTUoaAsvTkl3Mby6gC8WSztlGJjkqagxeLIXie9GLYS76CLlF4IIvQeFFgXNEQXUIMdsxNdJsWECbXIijErdRDRFGGIpLNleVaqlDIQsOSHgX1dK0gJVPFGVW2Q1tBi6vB73+ggi7MMzx6NoDiDgyBEEdIBIEasIW3KYC2lvLotFt60zCwijWwvdrgCb4qqBzt+TuoYf6dG5vPIVmtsM3NVmZLL9Fo+Af9exwTWGjOdOkcO83lGRNbOZjHgkrZhTwp4knEM9BzMCAGGWJbfzzr/JlU3rJxESTkTqF+YK9esOiSDWVVJMNsfndaotAkRgB0eP3X4R0f3WwDHLn7RVrh26+tYtwI8eHnTWnvfnx/A6CCiNz/X258Vjw5mfrayvrJSp8Gx1GR1/GxrWg6OlJLWWEeV7FBDHS4DS3ZwQPUH6C8d0+k6hjGC2WwEd0fAdHrjV3e6+9WOwDARoDPiaNfpLGVDH+uMGKpIygV0tiOoZAR3RwCMAPiUWLzGiEUH6ztM4n1QTffRA+rwKeibnWPmHnAH89N7v0tEGUAdLjAzFCy1HZtbi+rIAHYARVJBXT1g7CkDqLpusdphsaoJvm9xa2sEdJ+IEmHr3gikH8DWhz9A1YMXAFZXVxei4gwe7YFEGWyNgJkN97Ej+PutEuabFaEAipIHcOLze0IU8EGTQQJ/ZiAC1hUuO9LJW5JQKDjoFWjUtzWBylZlqUDRxzUmDMog4enaQ1Kyp/1Y7v1vfwPx3em+Z+50IgAAAABJRU5ErkJggg==",8,8);function h(t,i){const e=new Array(i);for(let r=0;r<i;r++)e[r]=new Array(t);return e}const o=256;class _{constructor(){this.down=!1,this.downCount=0}}class a{constructor(t){this.keys=new Array(o);for(let t=0;t<o;t++)this.keys[t]=new _;t.addEventListener("keydown",t=>this.setKey(t,!0)),t.addEventListener("keyup",t=>this.setKey(t,!1))}setKey(t,i){t.stopPropagation(),t.preventDefault();const e=t.keyCode;e>=0&&e<o&&(this.keys[e].down=i)}updateKeys(){for(let t=0;t<o;t++)this.keys[t].down?this.keys[t].downCount++:this.keys[t].downCount=0}getKey(t){return t>=0&&t<o?this.keys[t]:null}}class n{constructor(t,i,r,s){this.charCode=void 0!==t?function(t){return"string"==typeof t&&t.length>0?t.charCodeAt(0):t}(t):" ".charCodeAt(0),this.fg=void 0!==i?i:e.WHITE,this.bg=void 0!==r?r:e.BLACK,void 0!==s&&(this.meta=s),this.dirty=!0}setCharCode(t){this.charCode!==t&&(this.charCode=t,this.dirty=!0)}setForeground(t){null!=t&&t!==this.fg&&(this.fg=t,this.dirty=!0)}setBackground(t){null!=t&&t!==this.bg&&(this.bg=t,this.dirty=!0)}setMeta(t){void 0!==t&&(this.meta=t,this.dirty=!0)}setValue(t,i,e,r){return this.setCharCode(t),this.setForeground(i),this.setBackground(e),this.setMeta(r),this.dirty}copy(t){return this.setValue(t.charCode,t.fg,t.bg,t.meta)}}class A{}A.SMILEY=1,A.INVERSE_SMILEY=2,A.HEART=3,A.DIAMOND=4,A.CLUB=5,A.SPADE=6,A.BULLET=7,A.INVERSE_BULLET=8,A.LIGHT_SHADE=176,A.MEDIUM_SHADE=177,A.DARK_SHADE=178,A.BOX_SINGLE_VERTICAL=179,A.BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT=180,A.BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT=185,A.BOX_DOUBLE_VERTICAL=186,A.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT=187,A.BOX_DOUBLE_UP_AND_DOUBLE_LEFT=188,A.BOX_SINGLE_DOWN_AND_SINGLE_LEFT=191,A.BOX_SINGLE_UP_AND_SINGLE_RIGHT=192,A.BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP=193,A.BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN=194,A.BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT=195,A.BOX_SINGLE_HORIZONTAL=196,A.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL=197,A.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT=200,A.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT=201,A.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP=202,A.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN=203,A.BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT=204,A.BOX_DOUBLE_HORIZONTAL=205,A.BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL=206,A.BOX_SINGLE_UP_AND_SINGLE_LEFT=217,A.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT=218,A.CHECKER=230;class E{constructor(t,i){this.width=t,this.height=i,this.grid=new Array;for(let e=0;e<i;e++){const i=new Array;for(let e=0;e<t;e++)i.push(new n);this.grid.push(i)}this.clear()}clear(){for(let t=0;t<this.height;t++)for(let i=0;i<this.width;i++)this.drawChar(i,t,0)}getCell(t,i){if(!(t<0||i<0||t>=this.width||i>=this.height))return this.grid[i][t]}drawChar(t,i,e,r,s){t>=0&&t<this.width&&i>=0&&i<this.height&&this.grid[i][t].setValue(e,r,s)}drawString(t,i,e,r,s){for(let h=0;h<e.length;h++)this.drawChar(t+h,i,e.charCodeAt(h),r,s)}drawCenteredString(t,i,e,r,s){this.drawString(t-Math.floor(e.length/2),i,e,r,s)}drawHLine(t,i,e,r,s,h){for(let o=t;o<t+e;o++)this.drawChar(o,i,r,s,h)}drawVLine(t,i,e,r,s,h){for(let o=i;o<i+e;o++)this.drawChar(t,o,r,s,h)}drawRect(t,i,e,r,s,h,o){this.drawHLine(t,i,e,s,h,o),this.drawHLine(t,i+r-1,e,s,h,o),this.drawVLine(t,i,r,s,h,o),this.drawVLine(t+e-1,i,r,s,h,o)}drawDoubleBox(t,i,e,r,s,h){this.fillRect(t,i,e,r,0,s,h),this.drawHLine(t,i,e,A.BOX_DOUBLE_HORIZONTAL),this.drawHLine(t,i+r-1,e,A.BOX_DOUBLE_HORIZONTAL),this.drawVLine(t,i,r,A.BOX_DOUBLE_VERTICAL),this.drawVLine(t+e-1,i,r,A.BOX_DOUBLE_VERTICAL),this.drawChar(t,i,A.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT),this.drawChar(t+e-1,i,A.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT),this.drawChar(t,i+r-1,A.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT),this.drawChar(t+e-1,i+r-1,A.BOX_DOUBLE_UP_AND_DOUBLE_LEFT)}fillRect(t,i,e,r,s,h,o){for(let _=i;_<i+r;_++)this.drawHLine(t,_,e,s,h,o)}drawConsole(t,i,e,r,s,h,o){for(let _=0;_<o;_++)for(let o=0;o<h;o++)this.drawCell(t+o,i+_,e.getCell(r+o,s+_))}drawCell(t,i,e){e&&t>=0&&t<this.width&&i>=0&&i<this.height&&this.grid[i][t].copy(e)}}class d{constructor(t,i){this.font=i,this.x=0,this.y=0,this.buttons=[!1,!1,!1],t.addEventListener("mousedown",t=>this.update(t)),t.addEventListener("mouseup",t=>this.update(t)),t.addEventListener("mousemove",t=>this.update(t))}update(t){this.x=t.offsetX/this.font.charWidth|0,this.y=t.offsetY/this.font.charHeight|0,"mousedown"===t.type&&(this.buttons[t.button]=!0),"mouseup"===t.type&&(this.buttons[t.button]=!1)}}const L="attribute vec2 a;attribute vec2 b;attribute vec3 c;attribute vec3 d;varying highp vec2 e;varying highp vec4 f;varying highp vec4 g;void main(void){gl_Position=vec4(a.x,a.y,0,1);e=b/16.0;f=vec4(c.r,c.g,c.b,1);g=vec4(d.r,d.g,d.b,1);}",c="varying highp vec2 e;varying highp vec4 f;varying highp vec4 g;uniform bool h;uniform sampler2D s;void main(void){gl_FragColor=texture2D(s,e);if(!h){if(gl_FragColor.r<0.1) {gl_FragColor=g;} else {gl_FragColor=f;}}}";function K(t,i){return t/i*2-1}t.fromRgb=i,t.fromHsv=function(t,e,r){let s,h,o,_,a,n,A,E;switch(n=r*(1-e),A=r*(1-(a=6*t-(_=6*t|0))*e),E=r*(1-(1-a)*e),_%6){case 0:s=r,h=E,o=n;break;case 1:s=A,h=r,o=n;break;case 2:s=n,h=r,o=E;break;case 3:s=n,h=A,o=r;break;case 4:s=E,h=n,o=r;break;case 5:s=r,h=n,o=A;break;default:s=0,h=0,o=0}return i(255*s|0,255*h|0,255*o|0)},t.Colors=e,t.Font=r,t.DEFAULT_FONT=s,t.FovMap=class{constructor(t,i,e){if(this.width=t,this.height=i,this.blocked=h(t,i),this.visible=h(t,i),this.originX=0,this.originY=0,this.minX=0,this.maxX=0,this.minY=0,this.maxY=0,this.radius=0,e)for(let r=0;r<i;r++)for(let i=0;i<t;i++)this.blocked[r][i]=e(i,r)}setBlocked(t,i,e){t>=0&&t<this.width&&i>=0&&i<this.height&&(this.blocked[i][t]=e)}isVisible(t,i){return!(t<0||t>=this.width||i<0||i>=this.height)&&this.visible[i][t]}computeOctantY(t,i){const e=[],r=[];let s,h,o,_,a,n,A,E,d,L,c=1,K=0,V=0,u=0;for(h=this.originY+i;h>=this.minY&&h<=this.maxY;h+=i,V=K,++c)for(o=.5/c,L=-1,_=Math.floor(u*c+.5),s=this.originX+_*t;_<=c&&s>=this.minX&&s<=this.maxX;s+=t,++_,L=d){if(a=!0,n=!1,E=L,d=(A=_/c)+o,V>0)if(this.visible[h-i][s]&&!this.blocked[h-i][s]||this.visible[h-i][s-t]&&!this.blocked[h-i][s-t]){for(let t=0;t<V&&a;++t)if(E<=r[t]&&d>=e[t])if(this.blocked[h][s]){if(E>=e[t]&&d<=r[t]){a=!1;break}e[t]=Math.min(e[t],E),r[t]=Math.max(r[t],d),n=!0}else if(A>e[t]&&A<r[t]){a=!1;break}}else a=!1;a&&(this.visible[h][s]=!0,this.blocked[h][s]&&(u>=E?u=d:n||(e[K]=E,r[K++]=d)))}}computeOctantX(t,i){const e=[],r=[];let s,h,o,_,a,n,A,E,d,L,c=1,K=0,V=0,u=0;for(s=this.originX+t;s>=this.minX&&s<=this.maxX;s+=t,V=K,++c)for(o=.5/c,L=-1,_=Math.floor(u*c+.5),h=this.originY+_*i;_<=c&&h>=this.minY&&h<=this.maxY;h+=i,++_,L=d){if(a=!0,n=!1,E=L,d=(A=_/c)+o,V>0)if(this.visible[h][s-t]&&!this.blocked[h][s-t]||this.visible[h-i][s-t]&&!this.blocked[h-i][s-t]){for(let t=0;t<V&&a;++t)if(E<=r[t]&&d>=e[t])if(this.blocked[h][s]){if(E>=e[t]&&d<=r[t]){a=!1;break}e[t]=Math.min(e[t],E),r[t]=Math.max(r[t],d),n=!0}else if(A>e[t]&&A<r[t]){a=!1;break}}else a=!1;a&&(this.visible[h][s]=!0,this.blocked[h][s]&&(u>=E?u=d:n||(e[K]=E,r[K++]=d)))}}computeFov(t,i,e){for(let t=0;t<this.height;t++)for(let i=0;i<this.width;i++)this.visible[t][i]=!1;this.visible[i][t]=!0,this.originX=t,this.originY=i,this.radius=e,this.minX=Math.max(0,t-e),this.minY=Math.max(0,i-e),this.maxX=Math.min(this.width-1,t+e),this.maxY=Math.min(this.height-1,i+e),this.computeOctantY(1,1),this.computeOctantX(1,1),this.computeOctantY(1,-1),this.computeOctantX(1,-1),this.computeOctantY(-1,1),this.computeOctantX(-1,1),this.computeOctantY(-1,-1),this.computeOctantX(-1,-1)}},t.Key=_,t.Keys=a,t.VK_CANCEL=3,t.VK_HELP=6,t.VK_BACK_SPACE=8,t.VK_TAB=9,t.VK_CLEAR=12,t.VK_RETURN=13,t.VK_ENTER=14,t.VK_SHIFT=16,t.VK_CONTROL=17,t.VK_ALT=18,t.VK_PAUSE=19,t.VK_CAPS_LOCK=20,t.VK_ESCAPE=27,t.VK_SPACE=32,t.VK_PAGE_UP=33,t.VK_PAGE_DOWN=34,t.VK_END=35,t.VK_HOME=36,t.VK_LEFT=37,t.VK_UP=38,t.VK_RIGHT=39,t.VK_DOWN=40,t.VK_PRINTSCREEN=44,t.VK_INSERT=45,t.VK_DELETE=46,t.VK_0=48,t.VK_1=49,t.VK_2=50,t.VK_3=51,t.VK_4=52,t.VK_5=53,t.VK_6=54,t.VK_7=55,t.VK_8=56,t.VK_9=57,t.VK_COLON=58,t.VK_SEMICOLON=59,t.VK_LESS_THAN=60,t.VK_EQUALS=61,t.VK_GREATER_THAN=62,t.VK_QUESTION_MARK=63,t.VK_AT=64,t.VK_A=65,t.VK_B=66,t.VK_C=67,t.VK_D=68,t.VK_E=69,t.VK_F=70,t.VK_G=71,t.VK_H=72,t.VK_I=73,t.VK_J=74,t.VK_K=75,t.VK_L=76,t.VK_M=77,t.VK_N=78,t.VK_O=79,t.VK_P=80,t.VK_Q=81,t.VK_R=82,t.VK_S=83,t.VK_T=84,t.VK_U=85,t.VK_V=86,t.VK_W=87,t.VK_X=88,t.VK_Y=89,t.VK_Z=90,t.VK_CONTEXT_MENU=93,t.VK_NUMPAD0=96,t.VK_NUMPAD1=97,t.VK_NUMPAD2=98,t.VK_NUMPAD3=99,t.VK_NUMPAD4=100,t.VK_NUMPAD5=101,t.VK_NUMPAD6=102,t.VK_NUMPAD7=103,t.VK_NUMPAD8=104,t.VK_NUMPAD9=105,t.VK_MULTIPLY=106,t.VK_ADD=107,t.VK_SEPARATOR=108,t.VK_SUBTRACT=109,t.VK_DECIMAL=110,t.VK_DIVIDE=111,t.VK_F1=112,t.VK_F2=113,t.VK_F3=114,t.VK_F4=115,t.VK_F5=116,t.VK_F6=117,t.VK_F7=118,t.VK_F8=119,t.VK_F9=120,t.VK_F10=121,t.VK_F11=122,t.VK_F12=123,t.VK_F13=124,t.VK_F14=125,t.VK_F15=126,t.VK_F16=127,t.VK_F17=128,t.VK_F18=129,t.VK_F19=130,t.VK_F20=131,t.VK_F21=132,t.VK_F22=133,t.VK_F23=134,t.VK_F24=135,t.VK_NUM_LOCK=144,t.VK_SCROLL_LOCK=145,t.VK_CIRCUMFLEX=160,t.VK_EXCLAMATION=161,t.VK_DOUBLE_QUOTE=162,t.VK_HASH=163,t.VK_DOLLAR=164,t.VK_PERCENT=165,t.VK_AMPERSAND=166,t.VK_UNDERSCORE=167,t.VK_OPEN_PAREN=168,t.VK_CLOSE_PAREN=169,t.VK_ASTERISK=170,t.VK_PLUS=171,t.VK_PIPE=172,t.VK_HYPHEN_MINUS=173,t.VK_OPEN_CURLY_BRACKET=174,t.VK_CLOSE_CURLY_BRACKET=175,t.VK_TILDE=176,t.VK_COMMA=188,t.VK_PERIOD=190,t.VK_SLASH=191,t.VK_BACK_QUOTE=192,t.VK_OPEN_BRACKET=219,t.VK_BACK_SLASH=220,t.VK_CLOSE_BRACKET=221,t.VK_QUOTE=222,t.VK_META=224,t.VK_ALTGR=225,t.VK_WIN=91,t.VK_KANA=21,t.VK_HANGUL=21,t.VK_EISU=22,t.VK_JUNJA=23,t.VK_FINAL=24,t.VK_HANJA=25,t.VK_KANJI=25,t.VK_CONVERT=28,t.VK_NONCONVERT=29,t.VK_ACCEPT=30,t.VK_MODECHANGE=31,t.VK_SELECT=41,t.VK_PRINT=42,t.VK_EXECUTE=43,t.VK_SLEEP=95,t.RNG=class{constructor(t){this.m=2147483648,this.a=1103515245,this.c=12345,this.state=t||1}nextInt(){return this.state=(this.a*this.state+this.c)%this.m,this.state}nextFloat(){return this.nextInt()/(this.m-1)}nextRange(t,i){const e=i-t;return t+(this.nextInt()/this.m*e|0)}},t.Terminal=class extends E{constructor(t,i,e,r,h){super(i,e),this.canvas=t,this.font=r||s,this.scale=h||1,this.pixelWidth=i*this.font.charWidth,this.pixelHeight=e*this.font.charHeight,t.width=this.pixelWidth,t.height=this.pixelHeight,t.style.width=this.scale*this.pixelWidth+"px",t.style.height=this.scale*this.pixelHeight+"px",t.style.outline="none",t.tabIndex=0,this.keys=new a(t),this.mouse=new d(t,this.font);const o=t.getContext("webgl",{antialias:!1});if(!o)throw new Error("Unable to initialize WebGL. Your browser may not support it.");const _=o.createProgram();if(!_)throw new Error("Unable to initialize WebGL. Your browser may not support it.");this.gl=o,this.program=_,o.attachShader(_,this.buildShader(o.VERTEX_SHADER,L)),o.attachShader(_,this.buildShader(o.FRAGMENT_SHADER,c)),o.linkProgram(_),o.useProgram(_),this.font.graphical&&o.uniform1i(o.getUniformLocation(_,"h"),1),this.positionAttribLocation=this.getAttribLocation("a"),this.textureAttribLocation=this.getAttribLocation("b"),this.fgColorAttribLocation=this.getAttribLocation("c"),this.bgColorAttribLocation=this.getAttribLocation("d");const n=i*e;this.positionsArray=new Float32Array(3*n*4),this.indexArray=new Uint16Array(6*n),this.textureArray=new Float32Array(2*n*4),this.foregroundUint8Array=new Uint8Array(4*n*4),this.foregroundDataView=new DataView(this.foregroundUint8Array.buffer),this.backgroundUint8Array=new Uint8Array(4*n*4),this.backgroundDataView=new DataView(this.backgroundUint8Array.buffer);let A=0,E=0,V=0;for(let t=0;t<e;t++)for(let r=0;r<i;r++)this.positionsArray[A++]=K(r,i),this.positionsArray[A++]=-K(t,e),this.positionsArray[A++]=K(r+1,i),this.positionsArray[A++]=-K(t,e),this.positionsArray[A++]=K(r+1,i),this.positionsArray[A++]=-K(t+1,e),this.positionsArray[A++]=K(r,i),this.positionsArray[A++]=-K(t+1,e),this.indexArray[E++]=V+0,this.indexArray[E++]=V+1,this.indexArray[E++]=V+2,this.indexArray[E++]=V+0,this.indexArray[E++]=V+2,this.indexArray[E++]=V+3,V+=4;this.positionBuffer=o.createBuffer(),this.indexBuffer=o.createBuffer(),this.textureBuffer=o.createBuffer(),this.foregroundBuffer=o.createBuffer(),this.backgroundBuffer=o.createBuffer(),o.bindBuffer(o.ARRAY_BUFFER,this.positionBuffer),o.bufferData(o.ARRAY_BUFFER,this.positionsArray,o.STATIC_DRAW),o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,this.indexBuffer),o.bufferData(o.ELEMENT_ARRAY_BUFFER,this.indexArray,o.STATIC_DRAW),this.texture=this.loadTexture(this.font.url),this.renderLoop()}getAttribLocation(t){const i=this.gl.getAttribLocation(this.program,t);return this.gl.enableVertexAttribArray(i),i}flush(){let t=0,i=0;for(let e=0;e<this.height;e++)for(let r=0;r<this.width;r++){const s=this.getCell(r,e);if(!s.dirty){t+=8,i+=16;continue}const h=s.charCode%16+.5/256,o=(s.charCode/16|0)+.5/256;this.textureArray[t++]=h,this.textureArray[t++]=o,this.textureArray[t++]=h+1,this.textureArray[t++]=o,this.textureArray[t++]=h+1,this.textureArray[t++]=o+1,this.textureArray[t++]=h,this.textureArray[t++]=o+1;for(let t=0;t<4;t++)this.foregroundDataView.setUint32(i,s.fg,!1),this.backgroundDataView.setUint32(i,s.bg,!1),i+=4;s.dirty=!1}}isKeyDown(t){const i=this.keys.getKey(t);return i&&i.down}isKeyPressed(t){const i=this.keys.getKey(t),e=i?i.downCount:0;return 1===e||e>30&&e%3==0}getKeyDownCount(t){const i=this.keys.getKey(t);return i?i.downCount:0}getMouse(){return this.mouse}buildShader(t,i){const e=this.gl,r=e.createShader(t);if(!r)throw new Error("An error occurred compiling the shader: ");if(e.shaderSource(r,i),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw new Error("An error occurred compiling the shader: "+e.getShaderInfoLog(r));return r}loadTexture(t){const i=this.gl,e=i.createTexture();i.bindTexture(i.TEXTURE_2D,e);const r=i.RGBA,s=i.RGBA,h=i.UNSIGNED_BYTE,o=new Uint8Array([0,0,0,255]);i.texImage2D(i.TEXTURE_2D,0,r,1,1,0,s,h,o);const _=new Image;return _.onload=(()=>{i.bindTexture(i.TEXTURE_2D,e),i.texImage2D(i.TEXTURE_2D,0,r,s,h,_),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR)}),_.src=t,e}render(){const t=this.gl;t.clearColor(0,0,0,1),t.clearDepth(1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.viewport(0,0,this.pixelWidth,this.pixelHeight);{const i=2,e=t.FLOAT,r=!1,s=0,h=0;t.bindBuffer(t.ARRAY_BUFFER,this.positionBuffer),t.vertexAttribPointer(this.positionAttribLocation,i,e,r,s,h)}{const i=2,e=t.FLOAT,r=!1,s=0,h=0;t.bindBuffer(t.ARRAY_BUFFER,this.textureBuffer),t.bufferData(t.ARRAY_BUFFER,this.textureArray,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.textureAttribLocation,i,e,r,s,h)}{const i=4,e=t.UNSIGNED_BYTE,r=!0,s=0,h=0;t.bindBuffer(t.ARRAY_BUFFER,this.foregroundBuffer),t.bufferData(t.ARRAY_BUFFER,this.foregroundUint8Array,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.fgColorAttribLocation,i,e,r,s,h)}{const i=4,e=t.UNSIGNED_BYTE,r=!0,s=0,h=0;t.bindBuffer(t.ARRAY_BUFFER,this.backgroundBuffer),t.bufferData(t.ARRAY_BUFFER,this.backgroundUint8Array,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.bgColorAttribLocation,i,e,r,s,h)}t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.useProgram(this.program),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture),t.drawElements(t.TRIANGLES,this.width*this.height*6,t.UNSIGNED_SHORT,0)}renderLoop(){this.keys.updateKeys(),this.update&&this.update(),this.flush(),this.render(),requestAnimationFrame(this.renderLoop.bind(this))}}});
//# sourceMappingURL=index.umd.js.map
