var t;function e(t,e,r,s){return void 0===s&&(s=255),(t<<24)+(e<<16)+(r<<8)+s}(t=exports.BlendMode||(exports.BlendMode={}))[t.None=0]="None",t[t.Blend=1]="Blend",t[t.Add=2]="Add";class r{}r.BLACK=e(0,0,0),r.WHITE=e(255,255,255),r.LIGHT_GRAY=e(170,170,170),r.DARK_GRAY=e(85,85,85),r.YELLOW=e(255,255,85),r.BROWN=e(170,85,0),r.LIGHT_RED=e(255,85,85),r.DARK_RED=e(170,0,0),r.LIGHT_GREEN=e(85,255,85),r.DARK_GREEN=e(0,170,0),r.LIGHT_CYAN=e(85,255,255),r.DARK_CYAN=e(0,170,170),r.LIGHT_BLUE=e(85,85,255),r.DARK_BLUE=e(0,0,170),r.LIGHT_MAGENTA=e(255,85,255),r.DARK_MAGENTA=e(170,0,170),r.ORANGE=e(255,136,0);class s{constructor(t,e,s,i){this.charCode=void 0!==t?function(t){return"string"==typeof t&&t.length>0?t.charCodeAt(0):t}(t):" ".charCodeAt(0),this.fg=void 0!==e?e:r.WHITE,this.bg=void 0!==s?s:r.BLACK,void 0!==i&&(this.meta=i),this.dirty=!0}setCharCode(t){this.charCode!==t&&(this.charCode=t,this.dirty=!0)}setForeground(t){null!=t&&t!==this.fg&&(this.fg=t,this.dirty=!0)}setBackground(t){null!=t&&t!==this.bg&&(this.bg=t,this.dirty=!0)}setMeta(t){void 0!==t&&(this.meta=t,this.dirty=!0)}setValue(t,e,r,s){return this.setCharCode(t),this.setForeground(e),this.setBackground(r),this.setMeta(s),this.dirty}drawCell(t,e){const r=255&t.bg;e===exports.BlendMode.None||t.charCode>0?(this.setCharCode(t.charCode),this.setForeground(t.fg)):r>0&&r<255&&this.setForeground(this.blendColors(this.fg,t.bg,e)),e===exports.BlendMode.None||255===r?this.setBackground(t.bg):r>0&&this.setBackground(this.blendColors(this.bg,t.bg,e))}blendColors(t,r,s){const i=(255-(255&r))/255,o=1-i,h=t>>24&255,n=t>>16&255,a=t>>8&255,_=r>>24&255,A=r>>16&255,E=r>>8&255;switch(s){case exports.BlendMode.Blend:return e(i*h+o*_|0,i*n+o*A|0,i*a+o*E|0);case exports.BlendMode.Add:return e(this.clamp(h+o*_|0),this.clamp(n+o*A|0),this.clamp(a+o*E|0));default:return r}}clamp(t){return Math.min(255,t)}}class i{}i.SMILEY=1,i.INVERSE_SMILEY=2,i.HEART=3,i.DIAMOND=4,i.CLUB=5,i.SPADE=6,i.BULLET=7,i.INVERSE_BULLET=8,i.LIGHT_SHADE=176,i.MEDIUM_SHADE=177,i.DARK_SHADE=178,i.BOX_SINGLE_VERTICAL=179,i.BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT=180,i.BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT=185,i.BOX_DOUBLE_VERTICAL=186,i.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT=187,i.BOX_DOUBLE_UP_AND_DOUBLE_LEFT=188,i.BOX_SINGLE_DOWN_AND_SINGLE_LEFT=191,i.BOX_SINGLE_UP_AND_SINGLE_RIGHT=192,i.BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP=193,i.BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN=194,i.BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT=195,i.BOX_SINGLE_HORIZONTAL=196,i.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL=197,i.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT=200,i.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT=201,i.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP=202,i.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN=203,i.BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT=204,i.BOX_DOUBLE_HORIZONTAL=205,i.BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL=206,i.BOX_SINGLE_UP_AND_SINGLE_LEFT=217,i.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT=218,i.CHECKER=230;class o{constructor(t,e){this.width=t,this.height=e,this.grid=new Array;for(let r=0;r<e;r++){const e=new Array;for(let r=0;r<t;r++)e.push(new s);this.grid.push(e)}this.clear()}clear(){for(let t=0;t<this.height;t++)for(let e=0;e<this.width;e++)this.drawChar(e,t,0)}getCell(t,e){if(!(t<0||e<0||t>=this.width||e>=this.height))return this.grid[e][t]}drawChar(t,e,r,s,i){t>=0&&t<this.width&&e>=0&&e<this.height&&this.grid[e][t].setValue(r,s,i)}drawString(t,e,r,s,i){for(let o=0;o<r.length;o++)this.drawChar(t+o,e,r.charCodeAt(o),s,i)}drawCenteredString(t,e,r,s,i){this.drawString(t-Math.floor(r.length/2),e,r,s,i)}drawHLine(t,e,r,s,i,o){for(let h=t;h<t+r;h++)this.drawChar(h,e,s,i,o)}drawVLine(t,e,r,s,i,o){for(let h=e;h<e+r;h++)this.drawChar(t,h,s,i,o)}drawRect(t,e,r,s,i,o,h){this.drawHLine(t,e,r,i,o,h),this.drawHLine(t,e+s-1,r,i,o,h),this.drawVLine(t,e,s,i,o,h),this.drawVLine(t+r-1,e,s,i,o,h)}drawDoubleBox(t,e,r,s,o,h){this.fillRect(t,e,r,s,0,o,h),this.drawHLine(t,e,r,i.BOX_DOUBLE_HORIZONTAL),this.drawHLine(t,e+s-1,r,i.BOX_DOUBLE_HORIZONTAL),this.drawVLine(t,e,s,i.BOX_DOUBLE_VERTICAL),this.drawVLine(t+r-1,e,s,i.BOX_DOUBLE_VERTICAL),this.drawChar(t,e,i.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT),this.drawChar(t+r-1,e,i.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT),this.drawChar(t,e+s-1,i.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT),this.drawChar(t+r-1,e+s-1,i.BOX_DOUBLE_UP_AND_DOUBLE_LEFT)}fillRect(t,e,r,s,i,o,h){for(let n=e;n<e+s;n++)this.drawHLine(t,n,r,i,o,h)}drawConsole(t,e,r,s,i,o,h,n){n=n||exports.BlendMode.None;for(let a=0;a<h;a++)for(let h=0;h<o;h++){const o=r.getCell(s+h,i+a);o&&this.drawCell(t+h,e+a,o,n)}}drawCell(t,e,r,s){t>=0&&t<this.width&&e>=0&&e<this.height&&this.grid[e][t].drawCell(r,s)}}class h{constructor(t,e,r,s,i){this.url=t,this.charWidth=e,this.charHeight=r,this.scale=s||1,this.graphical=!!i}}const n=new h("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAEtElEQVRIx2WTsYsUMRTGPxTOJniWgRMFsbR4oJyDBE+s/AdsrIJKtEixIKwPHOc8tbCwsdNKLCy0tlBQGBCnel55CK5y1dqIbKVbhBlfZkYP8UsI2d98ed+bMAtUVTxUHELn3Krb2HwCbHVtUSo4f/5AOHnlEvD8c1sWhf229WQ1bGy63tG2pXu/9e52oCvfgHfvy7JtMxDXgyffimKnzEfETq71Rw6pclGpFvNLORYoihzLdrd+gjv7bNisYK3FoN2DLnx+D+esJRy3HZZnq/CZ9aA1vg6uQ9vacEvykbatu6pShw1rooYqOzqnNSqsceWss9Qe76ymuLD2sNpLAXS3RIe/4hgJhbceWSs9SE30RIEUmAzaWoraW0fDeUZMdgpvu4QEhYTW0AyjI1dSRxDkGhNQnR2RmilyCoHuYE+jn4n5cCoSc47wDFmIuNqLSH9EMCNj4rI2IkQ+WYNERSFmabkkjTAW38mb1giJAdRB0K2o34ulCYEATokNs+cJkabQf22gpORS2zrhI/NF0xRoOIR4+XIQMsH/mEd8lVCH69drBdG3PxsFZR2Y60SG/c5XBal3bGt8vNxsN6gl1/BaQzdNE8GSUxZnhXne5pT/lFiHSNNIyzUfAoIEedUD8d4WPdglBVEee7IRKKUsFOwUTN7aBvAzPqygjXTZGwsFHIWEfzTU+JUMFofnzImahlvex/hPHQi7OIwCu2R3JxkRPAyiruP96f2zYT+NEw70fcmACVLKQqbaFbUiQBlqSV4CWaadDCSI1L4M2dFkMH3LU16YOX+acyOMUUtggr86hF6H7e502NIAyNKswGz6qSz7C0oKEBEk1uMF5XdoMuD+goTUoaAsvTkl3Mby6gC8WSztlGJjkqagxeLIXie9GLYS76CLlF4IIvQeFFgXNEQXUIMdsxNdJsWECbXIijErdRDRFGGIpLNleVaqlDIQsOSHgX1dK0gJVPFGVW2Q1tBi6vB73+ggi7MMzx6NoDiDgyBEEdIBIEasIW3KYC2lvLotFt60zCwijWwvdrgCb4qqBzt+TuoYf6dG5vPIVmtsM3NVmZLL9Fo+Af9exwTWGjOdOkcO83lGRNbOZjHgkrZhTwp4knEM9BzMCAGGWJbfzzr/JlU3rJxESTkTqF+YK9esOiSDWVVJMNsfndaotAkRgB0eP3X4R0f3WwDHLn7RVrh26+tYtwI8eHnTWnvfnx/A6CCiNz/X258Vjw5mfrayvrJSp8Gx1GR1/GxrWg6OlJLWWEeV7FBDHS4DS3ZwQPUH6C8d0+k6hjGC2WwEd0fAdHrjV3e6+9WOwDARoDPiaNfpLGVDH+uMGKpIygV0tiOoZAR3RwCMAPiUWLzGiEUH6ztM4n1QTffRA+rwKeibnWPmHnAH89N7v0tEGUAdLjAzFCy1HZtbi+rIAHYARVJBXT1g7CkDqLpusdphsaoJvm9xa2sEdJ+IEmHr3gikH8DWhz9A1YMXAFZXVxei4gwe7YFEGWyNgJkN97Ej+PutEuabFaEAipIHcOLze0IU8EGTQQJ/ZiAC1hUuO9LJW5JQKDjoFWjUtzWBylZlqUDRxzUmDMog4enaQ1Kyp/1Y7v1vfwPx3em+Z+50IgAAAABJRU5ErkJggg==",8,8);function a(t,e){const r=new Array(e);for(let s=0;s<e;s++)r[s]=new Array(t);return r}const _=256;class A{constructor(){this.down=!1,this.downCount=0}}class E{constructor(t){this.keys=new Array(_);for(let t=0;t<_;t++)this.keys[t]=new A;t.addEventListener("keydown",t=>this.setKey(t,!0)),t.addEventListener("keyup",t=>this.setKey(t,!1))}setKey(t,e){t.stopPropagation(),t.preventDefault();const r=t.keyCode;r>=0&&r<_&&(this.keys[r].down=e)}updateKeys(){for(let t=0;t<_;t++)this.keys[t].down?this.keys[t].downCount++:this.keys[t].downCount=0}getKey(t){return t>=0&&t<_?this.keys[t]:null}}class d{constructor(t,e){this.el=t,this.options=e,this.font=e.font||n,this.prevX=0,this.prevY=0,this.x=0,this.y=0,this.dx=0,this.dy=0,this.buttons=[!1,!1,!1],t.addEventListener("mousedown",t=>this.handleEvent(t)),t.addEventListener("mouseup",t=>this.handleEvent(t)),t.addEventListener("mousemove",t=>this.handleEvent(t))}handleEvent(t){this.x=t.offsetX/this.font.charWidth|0,this.y=t.offsetY/this.font.charHeight|0,"mousedown"===t.type&&(this.buttons[t.button]=!0,this.options.requestFullscreen&&this.requestFullscreen()),"mouseup"===t.type&&(this.buttons[t.button]=!1)}requestFullscreen(){const t=this.el;t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen():t.mozRequestFullScreen&&t.mozRequestFullScreen()}update(){this.dx=this.x-this.prevX,this.dy=this.y-this.prevY,this.prevX=this.x,this.prevY=this.y}}const p="attribute vec2 a;attribute vec2 b;attribute vec3 c;attribute vec3 d;varying highp vec2 e;varying highp vec4 f;varying highp vec4 g;void main(void){gl_Position=vec4(a.x,a.y,0,1);e=b/16.0;f=vec4(c.r,c.g,c.b,1);g=vec4(d.r,d.g,d.b,1);}",x="varying highp vec2 e;varying highp vec4 f;varying highp vec4 g;uniform bool h;uniform sampler2D s;void main(void){gl_FragColor=texture2D(s,e);if(!h){if(gl_FragColor.r<0.1) {gl_FragColor=g;} else {gl_FragColor=f;}}}";function l(t,e){return t/e*2-1}const c={font:n,requestFullscreen:!1};exports.fromRgb=e,exports.fromHsv=function(t,r,s,i){const o=6*t|0,h=6*t-o,n=s*(1-r),a=s*(1-h*r),_=s*(1-(1-h)*r);let A,E,d;switch(o%6){case 0:A=s,E=_,d=n;break;case 1:A=a,E=s,d=n;break;case 2:A=n,E=s,d=_;break;case 3:A=n,E=a,d=s;break;case 4:A=_,E=n,d=s;break;case 5:A=s,E=n,d=a;break;default:A=0,E=0,d=0}return void 0===i&&(i=1),e(255*A|0,255*E|0,255*d|0,255*i|0)},exports.Colors=r,exports.Console=o,exports.Font=h,exports.DEFAULT_FONT=n,exports.FovMap=class{constructor(t,e,r){if(this.width=t,this.height=e,this.blocked=a(t,e),this.visible=a(t,e),this.originX=0,this.originY=0,this.minX=0,this.maxX=0,this.minY=0,this.maxY=0,this.radius=0,r)for(let s=0;s<e;s++)for(let e=0;e<t;e++)this.blocked[s][e]=r(e,s)}setBlocked(t,e,r){t>=0&&t<this.width&&e>=0&&e<this.height&&(this.blocked[e][t]=r)}isVisible(t,e){return!(t<0||t>=this.width||e<0||e>=this.height)&&this.visible[e][t]}computeOctantY(t,e){const r=[],s=[];let i,o,h,n,a,_,A,E,d,p,x=1,l=0,c=0,u=0;for(o=this.originY+e;o>=this.minY&&o<=this.maxY;o+=e,c=l,++x)for(h=.5/x,p=-1,n=Math.floor(u*x+.5),i=this.originX+n*t;n<=x&&i>=this.minX&&i<=this.maxX;i+=t,++n,p=d){if(a=!0,_=!1,E=p,d=(A=n/x)+h,c>0)if(this.visible[o-e][i]&&!this.blocked[o-e][i]||this.visible[o-e][i-t]&&!this.blocked[o-e][i-t]){for(let t=0;t<c&&a;++t)if(E<=s[t]&&d>=r[t])if(this.blocked[o][i]){if(E>=r[t]&&d<=s[t]){a=!1;break}r[t]=Math.min(r[t],E),s[t]=Math.max(s[t],d),_=!0}else if(A>r[t]&&A<s[t]){a=!1;break}}else a=!1;a&&(this.visible[o][i]=!0,this.blocked[o][i]&&(u>=E?u=d:_||(r[l]=E,s[l++]=d)))}}computeOctantX(t,e){const r=[],s=[];let i,o,h,n,a,_,A,E,d,p,x=1,l=0,c=0,u=0;for(i=this.originX+t;i>=this.minX&&i<=this.maxX;i+=t,c=l,++x)for(h=.5/x,p=-1,n=Math.floor(u*x+.5),o=this.originY+n*e;n<=x&&o>=this.minY&&o<=this.maxY;o+=e,++n,p=d){if(a=!0,_=!1,E=p,d=(A=n/x)+h,c>0)if(this.visible[o][i-t]&&!this.blocked[o][i-t]||this.visible[o-e][i-t]&&!this.blocked[o-e][i-t]){for(let t=0;t<c&&a;++t)if(E<=s[t]&&d>=r[t])if(this.blocked[o][i]){if(E>=r[t]&&d<=s[t]){a=!1;break}r[t]=Math.min(r[t],E),s[t]=Math.max(s[t],d),_=!0}else if(A>r[t]&&A<s[t]){a=!1;break}}else a=!1;a&&(this.visible[o][i]=!0,this.blocked[o][i]&&(u>=E?u=d:_||(r[l]=E,s[l++]=d)))}}computeFov(t,e,r){for(let t=0;t<this.height;t++)for(let e=0;e<this.width;e++)this.visible[t][e]=!1;this.visible[e][t]=!0,this.originX=t,this.originY=e,this.radius=r,this.minX=Math.max(0,t-r),this.minY=Math.max(0,e-r),this.maxX=Math.min(this.width-1,t+r),this.maxY=Math.min(this.height-1,e+r),this.computeOctantY(1,1),this.computeOctantX(1,1),this.computeOctantY(1,-1),this.computeOctantX(1,-1),this.computeOctantY(-1,1),this.computeOctantX(-1,1),this.computeOctantY(-1,-1),this.computeOctantX(-1,-1)}},exports.Key=A,exports.Keys=E,exports.VK_CANCEL=3,exports.VK_HELP=6,exports.VK_BACK_SPACE=8,exports.VK_TAB=9,exports.VK_CLEAR=12,exports.VK_RETURN=13,exports.VK_ENTER=14,exports.VK_SHIFT=16,exports.VK_CONTROL=17,exports.VK_ALT=18,exports.VK_PAUSE=19,exports.VK_CAPS_LOCK=20,exports.VK_ESCAPE=27,exports.VK_SPACE=32,exports.VK_PAGE_UP=33,exports.VK_PAGE_DOWN=34,exports.VK_END=35,exports.VK_HOME=36,exports.VK_LEFT=37,exports.VK_UP=38,exports.VK_RIGHT=39,exports.VK_DOWN=40,exports.VK_PRINTSCREEN=44,exports.VK_INSERT=45,exports.VK_DELETE=46,exports.VK_0=48,exports.VK_1=49,exports.VK_2=50,exports.VK_3=51,exports.VK_4=52,exports.VK_5=53,exports.VK_6=54,exports.VK_7=55,exports.VK_8=56,exports.VK_9=57,exports.VK_COLON=58,exports.VK_SEMICOLON=59,exports.VK_LESS_THAN=60,exports.VK_EQUALS=61,exports.VK_GREATER_THAN=62,exports.VK_QUESTION_MARK=63,exports.VK_AT=64,exports.VK_A=65,exports.VK_B=66,exports.VK_C=67,exports.VK_D=68,exports.VK_E=69,exports.VK_F=70,exports.VK_G=71,exports.VK_H=72,exports.VK_I=73,exports.VK_J=74,exports.VK_K=75,exports.VK_L=76,exports.VK_M=77,exports.VK_N=78,exports.VK_O=79,exports.VK_P=80,exports.VK_Q=81,exports.VK_R=82,exports.VK_S=83,exports.VK_T=84,exports.VK_U=85,exports.VK_V=86,exports.VK_W=87,exports.VK_X=88,exports.VK_Y=89,exports.VK_Z=90,exports.VK_CONTEXT_MENU=93,exports.VK_NUMPAD0=96,exports.VK_NUMPAD1=97,exports.VK_NUMPAD2=98,exports.VK_NUMPAD3=99,exports.VK_NUMPAD4=100,exports.VK_NUMPAD5=101,exports.VK_NUMPAD6=102,exports.VK_NUMPAD7=103,exports.VK_NUMPAD8=104,exports.VK_NUMPAD9=105,exports.VK_MULTIPLY=106,exports.VK_ADD=107,exports.VK_SEPARATOR=108,exports.VK_SUBTRACT=109,exports.VK_DECIMAL=110,exports.VK_DIVIDE=111,exports.VK_F1=112,exports.VK_F2=113,exports.VK_F3=114,exports.VK_F4=115,exports.VK_F5=116,exports.VK_F6=117,exports.VK_F7=118,exports.VK_F8=119,exports.VK_F9=120,exports.VK_F10=121,exports.VK_F11=122,exports.VK_F12=123,exports.VK_F13=124,exports.VK_F14=125,exports.VK_F15=126,exports.VK_F16=127,exports.VK_F17=128,exports.VK_F18=129,exports.VK_F19=130,exports.VK_F20=131,exports.VK_F21=132,exports.VK_F22=133,exports.VK_F23=134,exports.VK_F24=135,exports.VK_NUM_LOCK=144,exports.VK_SCROLL_LOCK=145,exports.VK_CIRCUMFLEX=160,exports.VK_EXCLAMATION=161,exports.VK_DOUBLE_QUOTE=162,exports.VK_HASH=163,exports.VK_DOLLAR=164,exports.VK_PERCENT=165,exports.VK_AMPERSAND=166,exports.VK_UNDERSCORE=167,exports.VK_OPEN_PAREN=168,exports.VK_CLOSE_PAREN=169,exports.VK_ASTERISK=170,exports.VK_PLUS=171,exports.VK_PIPE=172,exports.VK_HYPHEN_MINUS=173,exports.VK_OPEN_CURLY_BRACKET=174,exports.VK_CLOSE_CURLY_BRACKET=175,exports.VK_TILDE=176,exports.VK_COMMA=188,exports.VK_PERIOD=190,exports.VK_SLASH=191,exports.VK_BACK_QUOTE=192,exports.VK_OPEN_BRACKET=219,exports.VK_BACK_SLASH=220,exports.VK_CLOSE_BRACKET=221,exports.VK_QUOTE=222,exports.VK_META=224,exports.VK_ALTGR=225,exports.VK_WIN=91,exports.VK_KANA=21,exports.VK_HANGUL=21,exports.VK_EISU=22,exports.VK_JUNJA=23,exports.VK_FINAL=24,exports.VK_HANJA=25,exports.VK_KANJI=25,exports.VK_CONVERT=28,exports.VK_NONCONVERT=29,exports.VK_ACCEPT=30,exports.VK_MODECHANGE=31,exports.VK_SELECT=41,exports.VK_PRINT=42,exports.VK_EXECUTE=43,exports.VK_SLEEP=95,exports.RNG=class{constructor(t){this.m=2147483648,this.a=1103515245,this.c=12345,this.state=t||1}nextInt(){return this.state=(this.a*this.state+this.c)%this.m,this.state}nextFloat(){return this.nextInt()/(this.m-1)}nextRange(t,e){const r=e-t;return t+(this.nextInt()/this.m*r|0)}},exports.Terminal=class extends o{constructor(t,e,r,s){super(e,r),s=s||c,this.canvas=t,this.font=s.font||n,this.pixelWidth=e*this.font.charWidth,this.pixelHeight=r*this.font.charHeight,t.width=this.pixelWidth,t.height=this.pixelHeight,t.style.width=this.font.scale*this.pixelWidth+"px",t.style.height=this.font.scale*this.pixelHeight+"px",t.style.outline="none",t.tabIndex=0,this.keys=new E(t),this.mouse=new d(t,s);const i=t.getContext("webgl",{antialias:!1});if(!i)throw new Error("Unable to initialize WebGL. Your browser may not support it.");const o=i.createProgram();if(!o)throw new Error("Unable to initialize WebGL. Your browser may not support it.");this.gl=i,this.program=o,i.attachShader(o,this.buildShader(i.VERTEX_SHADER,p)),i.attachShader(o,this.buildShader(i.FRAGMENT_SHADER,x)),i.linkProgram(o),i.useProgram(o),this.font.graphical&&i.uniform1i(i.getUniformLocation(o,"h"),1),this.positionAttribLocation=this.getAttribLocation("a"),this.textureAttribLocation=this.getAttribLocation("b"),this.fgColorAttribLocation=this.getAttribLocation("c"),this.bgColorAttribLocation=this.getAttribLocation("d");const h=e*r;this.positionsArray=new Float32Array(3*h*4),this.indexArray=new Uint16Array(6*h),this.textureArray=new Float32Array(2*h*4),this.foregroundUint8Array=new Uint8Array(4*h*4),this.foregroundDataView=new DataView(this.foregroundUint8Array.buffer),this.backgroundUint8Array=new Uint8Array(4*h*4),this.backgroundDataView=new DataView(this.backgroundUint8Array.buffer);let a=0,_=0,A=0;for(let t=0;t<r;t++)for(let s=0;s<e;s++)this.positionsArray[a++]=l(s,e),this.positionsArray[a++]=-l(t,r),this.positionsArray[a++]=l(s+1,e),this.positionsArray[a++]=-l(t,r),this.positionsArray[a++]=l(s+1,e),this.positionsArray[a++]=-l(t+1,r),this.positionsArray[a++]=l(s,e),this.positionsArray[a++]=-l(t+1,r),this.indexArray[_++]=A+0,this.indexArray[_++]=A+1,this.indexArray[_++]=A+2,this.indexArray[_++]=A+0,this.indexArray[_++]=A+2,this.indexArray[_++]=A+3,A+=4;this.positionBuffer=i.createBuffer(),this.indexBuffer=i.createBuffer(),this.textureBuffer=i.createBuffer(),this.foregroundBuffer=i.createBuffer(),this.backgroundBuffer=i.createBuffer(),i.bindBuffer(i.ARRAY_BUFFER,this.positionBuffer),i.bufferData(i.ARRAY_BUFFER,this.positionsArray,i.STATIC_DRAW),i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,this.indexBuffer),i.bufferData(i.ELEMENT_ARRAY_BUFFER,this.indexArray,i.STATIC_DRAW),this.texture=this.loadTexture(this.font.url),this.renderLoop()}getAttribLocation(t){const e=this.gl.getAttribLocation(this.program,t);return this.gl.enableVertexAttribArray(e),e}flush(){let t=0,e=0;for(let r=0;r<this.height;r++)for(let s=0;s<this.width;s++){const i=this.getCell(s,r);if(!i.dirty){t+=8,e+=16;continue}const o=i.charCode%16+.5/256,h=(i.charCode/16|0)+.5/256;this.textureArray[t++]=o,this.textureArray[t++]=h,this.textureArray[t++]=o+1,this.textureArray[t++]=h,this.textureArray[t++]=o+1,this.textureArray[t++]=h+1,this.textureArray[t++]=o,this.textureArray[t++]=h+1;for(let t=0;t<4;t++)this.foregroundDataView.setUint32(e,i.fg,!1),this.backgroundDataView.setUint32(e,i.bg,!1),e+=4;i.dirty=!1}}isKeyDown(t){const e=this.keys.getKey(t);return e&&e.down}isKeyPressed(t){const e=this.keys.getKey(t),r=e?e.downCount:0;return 1===r||r>30&&r%3==0}getKeyDownCount(t){const e=this.keys.getKey(t);return e?e.downCount:0}buildShader(t,e){const r=this.gl,s=r.createShader(t);if(!s)throw new Error("An error occurred compiling the shader: ");if(r.shaderSource(s,e),r.compileShader(s),!r.getShaderParameter(s,r.COMPILE_STATUS))throw new Error("An error occurred compiling the shader: "+r.getShaderInfoLog(s));return s}loadTexture(t){const e=this.gl,r=e.createTexture();e.bindTexture(e.TEXTURE_2D,r);const s=e.RGBA,i=e.RGBA,o=e.UNSIGNED_BYTE,h=new Uint8Array([0,0,0,255]);e.texImage2D(e.TEXTURE_2D,0,s,1,1,0,i,o,h);const n=new Image;return n.onload=(()=>{e.bindTexture(e.TEXTURE_2D,r),e.texImage2D(e.TEXTURE_2D,0,s,i,o,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR)}),n.src=t,r}render(){const t=this.gl;t.clearColor(0,0,0,1),t.clearDepth(1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.viewport(0,0,this.pixelWidth,this.pixelHeight);{const e=2,r=t.FLOAT,s=!1,i=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.positionBuffer),t.vertexAttribPointer(this.positionAttribLocation,e,r,s,i,o)}{const e=2,r=t.FLOAT,s=!1,i=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.textureBuffer),t.bufferData(t.ARRAY_BUFFER,this.textureArray,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.textureAttribLocation,e,r,s,i,o)}{const e=4,r=t.UNSIGNED_BYTE,s=!0,i=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.foregroundBuffer),t.bufferData(t.ARRAY_BUFFER,this.foregroundUint8Array,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.fgColorAttribLocation,e,r,s,i,o)}{const e=4,r=t.UNSIGNED_BYTE,s=!0,i=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.backgroundBuffer),t.bufferData(t.ARRAY_BUFFER,this.backgroundUint8Array,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.bgColorAttribLocation,e,r,s,i,o)}t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.useProgram(this.program),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture),t.drawElements(t.TRIANGLES,this.width*this.height*6,t.UNSIGNED_SHORT,0)}renderLoop(){this.keys.updateKeys(),this.mouse.update(),this.update&&this.update(),this.flush(),this.render(),requestAnimationFrame(this.renderLoop.bind(this))}};
//# sourceMappingURL=index.js.map
