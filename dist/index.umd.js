!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.wglt={})}(this,function(t){var e;function i(t,e,i,s){return void 0===s&&(s=255),(t<<24)+(e<<16)+(i<<8)+s}(e=t.BlendMode||(t.BlendMode={}))[e.None=0]="None",e[e.Blend=1]="Blend",e[e.Add=2]="Add";class s{}s.BLACK=i(0,0,0),s.WHITE=i(255,255,255),s.LIGHT_GRAY=i(170,170,170),s.DARK_GRAY=i(85,85,85),s.YELLOW=i(255,255,85),s.BROWN=i(170,85,0),s.LIGHT_RED=i(255,85,85),s.DARK_RED=i(170,0,0),s.LIGHT_GREEN=i(85,255,85),s.DARK_GREEN=i(0,170,0),s.LIGHT_CYAN=i(85,255,255),s.DARK_CYAN=i(0,170,170),s.LIGHT_BLUE=i(85,85,255),s.DARK_BLUE=i(0,0,170),s.LIGHT_MAGENTA=i(255,85,255),s.DARK_MAGENTA=i(170,0,170),s.ORANGE=i(255,136,0);class r{constructor(t,e,i,r){this.charCode=void 0!==t?function(t){return"string"==typeof t&&t.length>0?t.charCodeAt(0):t}(t):" ".charCodeAt(0),this.fg=void 0!==e?e:s.WHITE,this.bg=void 0!==i?i:s.BLACK,void 0!==r&&(this.meta=r),this.dirty=!0}setCharCode(t){this.charCode!==t&&(this.charCode=t,this.dirty=!0)}setForeground(t){null!=t&&t!==this.fg&&(this.fg=t,this.dirty=!0)}setBackground(t){null!=t&&t!==this.bg&&(this.bg=t,this.dirty=!0)}setMeta(t){void 0!==t&&(this.meta=t,this.dirty=!0)}setValue(e,i,s,r){return"string"==typeof e&&(e=e.charCodeAt(0)),"number"==typeof e?(this.setCharCode(e),this.setForeground(i),this.setBackground(s),this.setMeta(r)):this.drawCell(e,t.BlendMode.None),this.dirty}drawCell(e,i){const s=255&e.bg;i===t.BlendMode.None||e.charCode>0?(this.setCharCode(e.charCode),this.setForeground(e.fg)):s>0&&s<255&&this.setForeground(this.blendColors(this.fg,e.bg,i)),i===t.BlendMode.None||255===s?this.setBackground(e.bg):s>0&&this.setBackground(this.blendColors(this.bg,e.bg,i)),this.setMeta(e.meta)}blendColors(e,s,r){const h=(255-(255&s))/255,n=1-h,o=e>>24&255,a=e>>16&255,_=e>>8&255,d=s>>24&255,l=s>>16&255,E=s>>8&255;switch(r){case t.BlendMode.Blend:return i(h*o+n*d|0,h*a+n*l|0,h*_+n*E|0);case t.BlendMode.Add:return i(this.clamp(o+n*d|0),this.clamp(a+n*l|0),this.clamp(_+n*E|0));default:return s}}clamp(t){return Math.min(255,t)}}class h{}h.SMILEY=1,h.INVERSE_SMILEY=2,h.HEART=3,h.DIAMOND=4,h.CLUB=5,h.SPADE=6,h.BULLET=7,h.INVERSE_BULLET=8,h.LIGHT_SHADE=176,h.MEDIUM_SHADE=177,h.DARK_SHADE=178,h.BOX_SINGLE_VERTICAL=179,h.BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT=180,h.BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT=185,h.BOX_DOUBLE_VERTICAL=186,h.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT=187,h.BOX_DOUBLE_UP_AND_DOUBLE_LEFT=188,h.BOX_SINGLE_DOWN_AND_SINGLE_LEFT=191,h.BOX_SINGLE_UP_AND_SINGLE_RIGHT=192,h.BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP=193,h.BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN=194,h.BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT=195,h.BOX_SINGLE_HORIZONTAL=196,h.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL=197,h.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT=200,h.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT=201,h.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP=202,h.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN=203,h.BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT=204,h.BOX_DOUBLE_HORIZONTAL=205,h.BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL=206,h.BOX_SINGLE_UP_AND_SINGLE_LEFT=217,h.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT=218,h.CHECKER=230;class n{constructor(t,e){this.width=t,this.height=e,this.grid=new Array;for(let i=0;i<e;i++){const e=new Array;for(let i=0;i<t;i++)e.push(new r);this.grid.push(e)}this.clear()}clear(){for(let t=0;t<this.height;t++)for(let e=0;e<this.width;e++)this.drawChar(e,t,0)}getCell(t,e){if(!(t<0||e<0||t>=this.width||e>=this.height))return this.grid[e][t]}drawChar(t,e,i,s,r){t>=0&&t<this.width&&e>=0&&e<this.height&&this.grid[e][t].setValue(i,s,r)}drawString(t,e,i,s,r){for(let h=0;h<i.length;h++)this.drawChar(t+h,e,i.charCodeAt(h),s,r)}drawCenteredString(t,e,i,s,r){this.drawString(t-Math.floor(i.length/2),e,i,s,r)}drawHLine(t,e,i,s,r,h){for(let n=t;n<t+i;n++)this.drawChar(n,e,s,r,h)}drawVLine(t,e,i,s,r,h){for(let n=e;n<e+i;n++)this.drawChar(t,n,s,r,h)}drawRect(t,e,i,s,r,h,n){this.drawHLine(t,e,i,r,h,n),this.drawHLine(t,e+s-1,i,r,h,n),this.drawVLine(t,e,s,r,h,n),this.drawVLine(t+i-1,e,s,r,h,n)}drawBox(t,e,i,s,r,h,n,o,a,_,d,l,E,A){this.fillRect(t,e,i,s,0,E,A),this.drawHLine(t,e,i,r),this.drawHLine(t,e+s-1,i,n),this.drawVLine(t,e,s,o),this.drawVLine(t+i-1,e,s,h),this.drawChar(t,e,a),this.drawChar(t+i-1,e,_),this.drawChar(t,e+s-1,l),this.drawChar(t+i-1,e+s-1,d)}drawSingleBox(t,e,i,s,r,n){this.drawBox(t,e,i,s,h.BOX_SINGLE_HORIZONTAL,h.BOX_SINGLE_VERTICAL,h.BOX_SINGLE_HORIZONTAL,h.BOX_SINGLE_VERTICAL,h.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT,h.BOX_SINGLE_DOWN_AND_SINGLE_LEFT,h.BOX_SINGLE_UP_AND_SINGLE_LEFT,h.BOX_SINGLE_UP_AND_SINGLE_RIGHT,r,n)}drawDoubleBox(t,e,i,s,r,n){this.drawBox(t,e,i,s,h.BOX_DOUBLE_HORIZONTAL,h.BOX_DOUBLE_VERTICAL,h.BOX_DOUBLE_HORIZONTAL,h.BOX_DOUBLE_VERTICAL,h.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT,h.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT,h.BOX_DOUBLE_UP_AND_DOUBLE_LEFT,h.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT,r,n)}fillRect(t,e,i,s,r,h,n){for(let o=e;o<e+s;o++)this.drawHLine(t,o,i,r,h,n)}drawConsole(e,i,s,r,h,n,o,a){a=a||t.BlendMode.None;for(let t=0;t<o;t++)for(let o=0;o<n;o++){const n=s.getCell(r+o,h+t);n&&this.drawCell(e+o,i+t,n,a)}}drawCell(t,e,i,s){t>=0&&t<this.width&&e>=0&&e<this.height&&this.grid[e][t].drawCell(i,s)}}class o{constructor(t,e,i,s,r){this.url=t,this.charWidth=e,this.charHeight=i,this.scale=s||1,this.graphical=!!r}}const a=new o("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAEtElEQVRIx2WTsYsUMRTGPxTOJniWgRMFsbR4oJyDBE+s/AdsrIJKtEixIKwPHOc8tbCwsdNKLCy0tlBQGBCnel55CK5y1dqIbKVbhBlfZkYP8UsI2d98ed+bMAtUVTxUHELn3Krb2HwCbHVtUSo4f/5AOHnlEvD8c1sWhf229WQ1bGy63tG2pXu/9e52oCvfgHfvy7JtMxDXgyffimKnzEfETq71Rw6pclGpFvNLORYoihzLdrd+gjv7bNisYK3FoN2DLnx+D+esJRy3HZZnq/CZ9aA1vg6uQ9vacEvykbatu6pShw1rooYqOzqnNSqsceWss9Qe76ymuLD2sNpLAXS3RIe/4hgJhbceWSs9SE30RIEUmAzaWoraW0fDeUZMdgpvu4QEhYTW0AyjI1dSRxDkGhNQnR2RmilyCoHuYE+jn4n5cCoSc47wDFmIuNqLSH9EMCNj4rI2IkQ+WYNERSFmabkkjTAW38mb1giJAdRB0K2o34ulCYEATokNs+cJkabQf22gpORS2zrhI/NF0xRoOIR4+XIQMsH/mEd8lVCH69drBdG3PxsFZR2Y60SG/c5XBal3bGt8vNxsN6gl1/BaQzdNE8GSUxZnhXne5pT/lFiHSNNIyzUfAoIEedUD8d4WPdglBVEee7IRKKUsFOwUTN7aBvAzPqygjXTZGwsFHIWEfzTU+JUMFofnzImahlvex/hPHQi7OIwCu2R3JxkRPAyiruP96f2zYT+NEw70fcmACVLKQqbaFbUiQBlqSV4CWaadDCSI1L4M2dFkMH3LU16YOX+acyOMUUtggr86hF6H7e502NIAyNKswGz6qSz7C0oKEBEk1uMF5XdoMuD+goTUoaAsvTkl3Mby6gC8WSztlGJjkqagxeLIXie9GLYS76CLlF4IIvQeFFgXNEQXUIMdsxNdJsWECbXIijErdRDRFGGIpLNleVaqlDIQsOSHgX1dK0gJVPFGVW2Q1tBi6vB73+ggi7MMzx6NoDiDgyBEEdIBIEasIW3KYC2lvLotFt60zCwijWwvdrgCb4qqBzt+TuoYf6dG5vPIVmtsM3NVmZLL9Fo+Af9exwTWGjOdOkcO83lGRNbOZjHgkrZhTwp4knEM9BzMCAGGWJbfzzr/JlU3rJxESTkTqF+YK9esOiSDWVVJMNsfndaotAkRgB0eP3X4R0f3WwDHLn7RVrh26+tYtwI8eHnTWnvfnx/A6CCiNz/X258Vjw5mfrayvrJSp8Gx1GR1/GxrWg6OlJLWWEeV7FBDHS4DS3ZwQPUH6C8d0+k6hjGC2WwEd0fAdHrjV3e6+9WOwDARoDPiaNfpLGVDH+uMGKpIygV0tiOoZAR3RwCMAPiUWLzGiEUH6ztM4n1QTffRA+rwKeibnWPmHnAH89N7v0tEGUAdLjAzFCy1HZtbi+rIAHYARVJBXT1g7CkDqLpusdphsaoJvm9xa2sEdJ+IEmHr3gikH8DWhz9A1YMXAFZXVxei4gwe7YFEGWyNgJkN97Ej+PutEuabFaEAipIHcOLze0IU8EGTQQJ/ZiAC1hUuO9LJW5JQKDjoFWjUtzWBylZlqUDRxzUmDMog4enaQ1Kyp/1Y7v1vfwPx3em+Z+50IgAAAABJRU5ErkJggg==",8,8);class _{constructor(t,e){this.x=t,this.y=e,this.blocked=!1,this.visible=!1,this.g=0,this.h=0,this.prev=null}}const d=256;class l{constructor(){this.down=!1,this.downCount=0}}class E{constructor(t){this.keys=new Array(d);for(let t=0;t<d;t++)this.keys[t]=new l;t.addEventListener("keydown",t=>this.setKey(t,!0)),t.addEventListener("keyup",t=>this.setKey(t,!1))}setKey(t,e){t.stopPropagation(),t.preventDefault();const i=t.keyCode;i>=0&&i<d&&(this.keys[i].down=e)}updateKeys(){for(let t=0;t<d;t++)this.keys[t].down?this.keys[t].downCount++:this.keys[t].downCount=0}getKey(t){return t>=0&&t<d?this.keys[t]:null}}E.VK_CANCEL=3,E.VK_HELP=6,E.VK_BACK_SPACE=8,E.VK_TAB=9,E.VK_CLEAR=12,E.VK_RETURN=13,E.VK_ENTER=14,E.VK_SHIFT=16,E.VK_CONTROL=17,E.VK_ALT=18,E.VK_PAUSE=19,E.VK_CAPS_LOCK=20,E.VK_ESCAPE=27,E.VK_SPACE=32,E.VK_PAGE_UP=33,E.VK_PAGE_DOWN=34,E.VK_END=35,E.VK_HOME=36,E.VK_LEFT=37,E.VK_UP=38,E.VK_RIGHT=39,E.VK_DOWN=40,E.VK_PRINTSCREEN=44,E.VK_INSERT=45,E.VK_DELETE=46,E.VK_0=48,E.VK_1=49,E.VK_2=50,E.VK_3=51,E.VK_4=52,E.VK_5=53,E.VK_6=54,E.VK_7=55,E.VK_8=56,E.VK_9=57,E.VK_COLON=58,E.VK_SEMICOLON=59,E.VK_LESS_THAN=60,E.VK_EQUALS=61,E.VK_GREATER_THAN=62,E.VK_QUESTION_MARK=63,E.VK_AT=64,E.VK_A=65,E.VK_B=66,E.VK_C=67,E.VK_D=68,E.VK_E=69,E.VK_F=70,E.VK_G=71,E.VK_H=72,E.VK_I=73,E.VK_J=74,E.VK_K=75,E.VK_L=76,E.VK_M=77,E.VK_N=78,E.VK_O=79,E.VK_P=80,E.VK_Q=81,E.VK_R=82,E.VK_S=83,E.VK_T=84,E.VK_U=85,E.VK_V=86,E.VK_W=87,E.VK_X=88,E.VK_Y=89,E.VK_Z=90,E.VK_CONTEXT_MENU=93,E.VK_NUMPAD0=96,E.VK_NUMPAD1=97,E.VK_NUMPAD2=98,E.VK_NUMPAD3=99,E.VK_NUMPAD4=100,E.VK_NUMPAD5=101,E.VK_NUMPAD6=102,E.VK_NUMPAD7=103,E.VK_NUMPAD8=104,E.VK_NUMPAD9=105,E.VK_MULTIPLY=106,E.VK_ADD=107,E.VK_SEPARATOR=108,E.VK_SUBTRACT=109,E.VK_DECIMAL=110,E.VK_DIVIDE=111,E.VK_F1=112,E.VK_F2=113,E.VK_F3=114,E.VK_F4=115,E.VK_F5=116,E.VK_F6=117,E.VK_F7=118,E.VK_F8=119,E.VK_F9=120,E.VK_F10=121,E.VK_F11=122,E.VK_F12=123,E.VK_F13=124,E.VK_F14=125,E.VK_F15=126,E.VK_F16=127,E.VK_F17=128,E.VK_F18=129,E.VK_F19=130,E.VK_F20=131,E.VK_F21=132,E.VK_F22=133,E.VK_F23=134,E.VK_F24=135,E.VK_NUM_LOCK=144,E.VK_SCROLL_LOCK=145,E.VK_CIRCUMFLEX=160,E.VK_EXCLAMATION=161,E.VK_DOUBLE_QUOTE=162,E.VK_HASH=163,E.VK_DOLLAR=164,E.VK_PERCENT=165,E.VK_AMPERSAND=166,E.VK_UNDERSCORE=167,E.VK_OPEN_PAREN=168,E.VK_CLOSE_PAREN=169,E.VK_ASTERISK=170,E.VK_PLUS=171,E.VK_PIPE=172,E.VK_HYPHEN_MINUS=173,E.VK_OPEN_CURLY_BRACKET=174,E.VK_CLOSE_CURLY_BRACKET=175,E.VK_TILDE=176,E.VK_COMMA=188,E.VK_PERIOD=190,E.VK_SLASH=191,E.VK_BACK_QUOTE=192,E.VK_OPEN_BRACKET=219,E.VK_BACK_SLASH=220,E.VK_CLOSE_BRACKET=221,E.VK_QUOTE=222,E.VK_META=224,E.VK_ALTGR=225,E.VK_WIN=91,E.VK_KANA=21,E.VK_HANGUL=21,E.VK_EISU=22,E.VK_JUNJA=23,E.VK_FINAL=24,E.VK_HANJA=25,E.VK_KANJI=25,E.VK_CONVERT=28,E.VK_NONCONVERT=29,E.VK_ACCEPT=30,E.VK_MODECHANGE=31,E.VK_SELECT=41,E.VK_PRINT=42,E.VK_EXECUTE=43,E.VK_SLEEP=95;class A{constructor(t,e,i){this.terminal=t,this.rect=e,this.title=i}draw(t){const{x:e,y:i,width:r,height:h}=this.rect;t.fillRect(e,i,r,h,0,s.LIGHT_GREEN,s.DARK_GRAY),t.drawSingleBox(e,i,r,h),t.drawCenteredString(e+r/2|0,i," "+this.title+" "),this.drawContents()}}class c{constructor(t,e,i,s){this.x=this.left=t,this.y=this.top=e,this.width=i,this.height=s}}const u=[-1,0,1,-1,1,-1,0,1],g=[-1,-1,-1,0,0,1,1,1],L=[1.5,1,1.5,1,1,1.5,1,1.5];function f(t){let e=null,i=-1,s=Infinity;for(let r=0;r<t.length;r++){const h=t[r];Infinity!==h.g&&h.g+h.h<s&&(e=h,i=r,s=h.g+h.h)}return t.splice(i,1),e}function K(t){const e=[];let i=t;for(;i;)e.push(i),i=i.prev;return e.reverse(),e}class V{constructor(t,e){this.el=t.canvas,this.width=t.width,this.height=t.height,this.options=e,this.prevX=0,this.prevY=0,this.x=0,this.y=0,this.dx=0,this.dy=0,this.buttons=[!1,!1,!1];const i=this.el;i.addEventListener("mousedown",t=>this.handleEvent(t)),i.addEventListener("mouseup",t=>this.handleEvent(t)),i.addEventListener("mousemove",t=>this.handleEvent(t));const s=this.handleTouchEvent.bind(this);i.addEventListener("touchstart",s),i.addEventListener("touchend",s),i.addEventListener("touchcancel",s),i.addEventListener("touchmove",s)}handleTouchEvent(t){if(t.stopPropagation(),t.preventDefault(),"touchend"===t.type&&this.options.requestFullscreen&&this.requestFullscreen(),t.touches.length>0){const e=t.touches[0];this.updatePosition(e.clientX,e.clientY),this.buttons[0]=!0}else this.buttons[0]=!1}handleEvent(t){t.stopPropagation(),t.preventDefault(),this.updatePosition(t.clientX,t.clientY),"mousedown"===t.type&&(this.buttons[t.button]=!0,this.el.focus(),this.options.requestFullscreen&&this.requestFullscreen()),"mouseup"===t.type&&(this.buttons[t.button]=!1)}updatePosition(t,e){let i=this.el.getBoundingClientRect();const s=this.width/this.height,r=i.width/i.height;if(r-s>.01){const t=s*i.height;i=new c(Math.floor((i.width-t)/2),0,t,i.height)}if(r-s<-.01){const t=i.width/s;i=new c(0,Math.floor((i.height-t)/2),i.width,t)}this.x=this.width*(t-i.left)/i.width|0,this.y=this.height*(e-i.top)/i.height|0}requestFullscreen(){const t=this.el;t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen():t.mozRequestFullScreen&&t.mozRequestFullScreen()}update(){this.dx=this.x-this.prevX,this.dy=this.y-this.prevY,this.prevX=this.x,this.prevY=this.y}}const R="attribute vec2 a;attribute vec2 b;attribute vec3 c;attribute vec3 d;varying highp vec2 e;varying highp vec4 f;varying highp vec4 g;void main(void){gl_Position=vec4(a.x,a.y,0,1);e=b/16.0;f=vec4(c.r,c.g,c.b,1);g=vec4(d.r,d.g,d.b,1);}",N="varying highp vec2 e;varying highp vec4 f;varying highp vec4 g;uniform bool h;uniform sampler2D s;void main(void){gl_FragColor=texture2D(s,e);if(!h){if(gl_FragColor.r<0.1) {gl_FragColor=g;} else {gl_FragColor=f;}}}";function D(t,e){return t/e*2-1}const T={font:a,requestFullscreen:!1};t.Cell=r,t.Chars=h,t.fromRgb=i,t.fromHsv=function(t,e,s,r){const h=6*t|0,n=6*t-h,o=s*(1-e),a=s*(1-n*e),_=s*(1-(1-n)*e);let d,l,E;switch(h%6){case 0:d=s,l=_,E=o;break;case 1:d=a,l=s,E=o;break;case 2:d=o,l=s,E=_;break;case 3:d=o,l=a,E=s;break;case 4:d=_,l=o,E=s;break;case 5:d=s,l=o,E=a;break;default:d=0,l=0,E=0}return void 0===r&&(r=1),i(255*d|0,255*l|0,255*E|0,255*r|0)},t.Colors=s,t.Console=n,t.Font=o,t.DEFAULT_FONT=a,t.FovCell=_,t.FovMap=class{constructor(t,e,i){this.width=t,this.height=e,this.grid=new Array(e);for(let i=0;i<e;i++){this.grid[i]=new Array(t);for(let e=0;e<t;e++)this.grid[i][e]=new _(e,i)}if(this.originX=0,this.originY=0,this.minX=0,this.maxX=0,this.minY=0,this.maxY=0,this.radius=0,i)for(let s=0;s<e;s++)for(let e=0;e<t;e++)this.grid[s][e].blocked=i(e,s)}getCell(t,e){return this.grid[e][t]}setBlocked(t,e,i){t>=0&&t<this.width&&e>=0&&e<this.height&&(this.grid[e][t].blocked=i)}isVisible(t,e){return!(t<0||t>=this.width||e<0||e>=this.height)&&this.grid[e][t].visible}computeOctantY(t,e){const i=[],s=[];let r,h,n,o,a,_,d,l,E,A,c=1,u=0,g=0,L=0;for(h=this.originY+e;h>=this.minY&&h<=this.maxY;h+=e,g=u,++c)for(n=.5/c,A=-1,o=Math.floor(L*c+.5),r=this.originX+o*t;o<=c&&r>=this.minX&&r<=this.maxX;r+=t,++o,A=E){if(a=!0,_=!1,l=A,E=(d=o/c)+n,g>0)if(this.grid[h-e][r].visible&&!this.grid[h-e][r].blocked||this.grid[h-e][r-t].visible&&!this.grid[h-e][r-t].blocked){for(let t=0;t<g&&a;++t)if(l<=s[t]&&E>=i[t])if(this.grid[h][r].blocked){if(l>=i[t]&&E<=s[t]){a=!1;break}i[t]=Math.min(i[t],l),s[t]=Math.max(s[t],E),_=!0}else if(d>i[t]&&d<s[t]){a=!1;break}}else a=!1;a&&(this.grid[h][r].visible=!0,this.grid[h][r].blocked&&(L>=l?L=E:_||(i[u]=l,s[u++]=E)))}}computeOctantX(t,e){const i=[],s=[];let r,h,n,o,a,_,d,l,E,A,c=1,u=0,g=0,L=0;for(r=this.originX+t;r>=this.minX&&r<=this.maxX;r+=t,g=u,++c)for(n=.5/c,A=-1,o=Math.floor(L*c+.5),h=this.originY+o*e;o<=c&&h>=this.minY&&h<=this.maxY;h+=e,++o,A=E){if(a=!0,_=!1,l=A,E=(d=o/c)+n,g>0)if(this.grid[h][r-t].visible&&!this.grid[h][r-t].blocked||this.grid[h-e][r-t].visible&&!this.grid[h-e][r-t].blocked){for(let t=0;t<g&&a;++t)if(l<=s[t]&&E>=i[t])if(this.grid[h][r].blocked){if(l>=i[t]&&E<=s[t]){a=!1;break}i[t]=Math.min(i[t],l),s[t]=Math.max(s[t],E),_=!0}else if(d>i[t]&&d<s[t]){a=!1;break}}else a=!1;a&&(this.grid[h][r].visible=!0,this.grid[h][r].blocked&&(L>=l?L=E:_||(i[u]=l,s[u++]=E)))}}computeFov(t,e,i){for(let t=0;t<this.height;t++)for(let e=0;e<this.width;e++)this.grid[t][e].visible=!1;this.grid[e][t].visible=!0,this.originX=t,this.originY=e,this.radius=i,this.minX=Math.max(0,t-i),this.minY=Math.max(0,e-i),this.maxX=Math.min(this.width-1,t+i),this.maxY=Math.min(this.height-1,e+i),this.computeOctantY(1,1),this.computeOctantX(1,1),this.computeOctantY(1,-1),this.computeOctantX(1,-1),this.computeOctantY(-1,1),this.computeOctantX(-1,1),this.computeOctantY(-1,-1),this.computeOctantX(-1,-1)}},t.GUI=class{constructor(t){this.terminal=t,this.dialogs=[]}add(t){this.dialogs.push(t)}handleInput(){if(0===this.dialogs.length)return!1;const t=this.dialogs[this.dialogs.length-1];return t.handleInput()&&this.dialogs.splice(this.dialogs.indexOf(t),1),!0}draw(){for(let t=0;t<this.dialogs.length;t++)this.dialogs[t].draw(this.terminal)}},t.Key=l,t.Keys=E,t.MessageDialog=class extends A{constructor(t,e,i){const s=i.length+6;super(t,new c((t.width-s)/2|0,(t.height-5)/2|0,s,5),e),this.message=i}drawContents(){this.terminal.drawCenteredString(this.rect.x+this.rect.width/2|0,this.rect.y+2,this.message)}handleInput(){return this.terminal.isKeyPressed(E.VK_ESCAPE)}},t.computePath=function(t,e,i,s){!function(t,e){for(let i=0;i<t.height;i++)for(let s=0;s<t.width;s++){const r=t.grid[i][s];r.g=Infinity,r.h=Math.min(Math.abs(s-e.x),Math.abs(i-e.y)),r.prev=null}}(t,i);const r=t.grid[e.y][e.x];r.g=0;const h=[r];for(;h.length>0;){const e=f(h);if(e.x===i.x&&e.y===i.y)return K(e);for(let r=0;r<u.length;r++){const n=e.x+u[r],o=e.y+g[r];if(n>=0&&n<t.width&&o>=0&&o<t.height){const a=t.grid[o][n],_=e.g+L[r];_<a.g&&(i.x===a.x&&i.y===a.y||!t.grid[o][n].blocked)&&_<=s&&(a.g=_,a.prev=e,h.push(a))}}}return null},t.Point=class{constructor(t,e){this.x=t,this.y=e}},t.RNG=class{constructor(t){this.m=2147483648,this.a=1103515245,this.c=12345,this.state=t||1}nextInt(){return this.state=(this.a*this.state+this.c)%this.m,this.state}nextFloat(){return this.nextInt()/(this.m-1)}nextRange(t,e){const i=e-t;return t+(this.nextInt()/this.m*i|0)}},t.SelectDialog=class extends A{constructor(t,e,i,s){let r=e.length+6;for(let t=0;t<i.length;t++)r=Math.max(r,i[t].length+9);const h=4+i.length;super(t,new c((t.width-r)/2|0,(t.height-h)/2|0,r,h),e),this.options=i,this.callback=s}drawContents(){for(let t=0;t<this.options.length;t++){const e=String.fromCharCode(65+t)+" - "+this.options[t];this.terminal.drawString(this.rect.x+2,this.rect.y+2+t,e)}}handleInput(){for(let t=0;t<this.options.length;t++)if(this.terminal.isKeyPressed(E.VK_A+t))return this.callback(this.options[t]),!0;return this.terminal.isKeyPressed(E.VK_ESCAPE)}},t.Terminal=class extends n{constructor(t,e,i,s){super(e,i),s=s||T,this.canvas=t,this.font=s.font||a,this.pixelWidth=e*this.font.charWidth,this.pixelHeight=i*this.font.charHeight,t.width=this.pixelWidth,t.height=this.pixelHeight,t.style.width=this.font.scale*this.pixelWidth+"px",t.style.height=this.font.scale*this.pixelHeight+"px",t.style.outline="none",t.tabIndex=0,this.keys=new E(t),this.mouse=new V(this,s);const r=t.getContext("webgl",{antialias:!1});if(!r)throw new Error("Unable to initialize WebGL. Your browser may not support it.");const h=r.createProgram();if(!h)throw new Error("Unable to initialize WebGL. Your browser may not support it.");this.gl=r,this.program=h,r.attachShader(h,this.buildShader(r.VERTEX_SHADER,R)),r.attachShader(h,this.buildShader(r.FRAGMENT_SHADER,N)),r.linkProgram(h),r.useProgram(h),this.font.graphical&&r.uniform1i(r.getUniformLocation(h,"h"),1),this.positionAttribLocation=this.getAttribLocation("a"),this.textureAttribLocation=this.getAttribLocation("b"),this.fgColorAttribLocation=this.getAttribLocation("c"),this.bgColorAttribLocation=this.getAttribLocation("d");const n=e*i;this.positionsArray=new Float32Array(3*n*4),this.indexArray=new Uint16Array(6*n),this.textureArray=new Float32Array(2*n*4),this.foregroundUint8Array=new Uint8Array(4*n*4),this.foregroundDataView=new DataView(this.foregroundUint8Array.buffer),this.backgroundUint8Array=new Uint8Array(4*n*4),this.backgroundDataView=new DataView(this.backgroundUint8Array.buffer);let o=0,_=0,d=0;for(let t=0;t<i;t++)for(let s=0;s<e;s++)this.positionsArray[o++]=D(s,e),this.positionsArray[o++]=-D(t,i),this.positionsArray[o++]=D(s+1,e),this.positionsArray[o++]=-D(t,i),this.positionsArray[o++]=D(s+1,e),this.positionsArray[o++]=-D(t+1,i),this.positionsArray[o++]=D(s,e),this.positionsArray[o++]=-D(t+1,i),this.indexArray[_++]=d+0,this.indexArray[_++]=d+1,this.indexArray[_++]=d+2,this.indexArray[_++]=d+0,this.indexArray[_++]=d+2,this.indexArray[_++]=d+3,d+=4;this.positionBuffer=r.createBuffer(),this.indexBuffer=r.createBuffer(),this.textureBuffer=r.createBuffer(),this.foregroundBuffer=r.createBuffer(),this.backgroundBuffer=r.createBuffer(),r.bindBuffer(r.ARRAY_BUFFER,this.positionBuffer),r.bufferData(r.ARRAY_BUFFER,this.positionsArray,r.STATIC_DRAW),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,this.indexBuffer),r.bufferData(r.ELEMENT_ARRAY_BUFFER,this.indexArray,r.STATIC_DRAW),this.texture=this.loadTexture(this.font.url),this.renderLoop()}getAttribLocation(t){const e=this.gl.getAttribLocation(this.program,t);return this.gl.enableVertexAttribArray(e),e}flush(){let t=0,e=0;for(let i=0;i<this.height;i++)for(let s=0;s<this.width;s++){const r=this.getCell(s,i);if(!r.dirty){t+=8,e+=16;continue}const h=r.charCode%16+.5/256,n=(r.charCode/16|0)+.5/256;this.textureArray[t++]=h,this.textureArray[t++]=n,this.textureArray[t++]=h+1,this.textureArray[t++]=n,this.textureArray[t++]=h+1,this.textureArray[t++]=n+1,this.textureArray[t++]=h,this.textureArray[t++]=n+1;for(let t=0;t<4;t++)this.foregroundDataView.setUint32(e,r.fg,!1),this.backgroundDataView.setUint32(e,r.bg,!1),e+=4;r.dirty=!1}}isKeyDown(t){const e=this.keys.getKey(t);return e&&e.down}isKeyPressed(t){const e=this.keys.getKey(t),i=e?e.downCount:0;return 1===i||i>30&&i%3==0}getKeyDownCount(t){const e=this.keys.getKey(t);return e?e.downCount:0}buildShader(t,e){const i=this.gl,s=i.createShader(t);if(!s)throw new Error("An error occurred compiling the shader: ");if(i.shaderSource(s,e),i.compileShader(s),!i.getShaderParameter(s,i.COMPILE_STATUS))throw new Error("An error occurred compiling the shader: "+i.getShaderInfoLog(s));return s}loadTexture(t){const e=this.gl,i=e.createTexture();e.bindTexture(e.TEXTURE_2D,i);const s=e.RGBA,r=e.RGBA,h=e.UNSIGNED_BYTE,n=new Uint8Array([0,0,0,255]);e.texImage2D(e.TEXTURE_2D,0,s,1,1,0,r,h,n);const o=new Image;return o.onload=(()=>{e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,s,r,h,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR)}),o.src=t,i}render(){const t=this.gl;t.clearColor(0,0,0,1),t.clearDepth(1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.viewport(0,0,this.pixelWidth,this.pixelHeight);{const e=2,i=t.FLOAT,s=!1,r=0,h=0;t.bindBuffer(t.ARRAY_BUFFER,this.positionBuffer),t.vertexAttribPointer(this.positionAttribLocation,e,i,s,r,h)}{const e=2,i=t.FLOAT,s=!1,r=0,h=0;t.bindBuffer(t.ARRAY_BUFFER,this.textureBuffer),t.bufferData(t.ARRAY_BUFFER,this.textureArray,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.textureAttribLocation,e,i,s,r,h)}{const e=4,i=t.UNSIGNED_BYTE,s=!0,r=0,h=0;t.bindBuffer(t.ARRAY_BUFFER,this.foregroundBuffer),t.bufferData(t.ARRAY_BUFFER,this.foregroundUint8Array,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.fgColorAttribLocation,e,i,s,r,h)}{const e=4,i=t.UNSIGNED_BYTE,s=!0,r=0,h=0;t.bindBuffer(t.ARRAY_BUFFER,this.backgroundBuffer),t.bufferData(t.ARRAY_BUFFER,this.backgroundUint8Array,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.bgColorAttribLocation,e,i,s,r,h)}t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.useProgram(this.program),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture),t.drawElements(t.TRIANGLES,this.width*this.height*6,t.UNSIGNED_SHORT,0)}renderLoop(){this.keys.updateKeys(),this.mouse.update(),this.update&&this.update(),this.flush(),this.render(),requestAnimationFrame(this.renderLoop.bind(this))}}});
//# sourceMappingURL=index.umd.js.map
