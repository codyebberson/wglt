!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("wglt",[],e):"object"==typeof exports?exports.wglt=e():t.wglt=e()}(window,function(){return function(t){var e={};function i(r){if(e[r])return e[r].exports;var s=e[r]={i:r,l:!1,exports:{}};return t[r].call(s.exports,s,s.exports,i),s.l=!0,s.exports}return i.m=t,i.c=e,i.d=function(t,e,r){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.d(r,s,function(e){return t[e]}.bind(null,s));return r},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=12)}([function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=i(7);e.Rect=class{constructor(t,e,i,r){this.x=this.left=t,this.y=this.top=e,this.width=i,this.height=r,this.x2=t+i,this.y2=e+r}getCenter(){return new r.Point(this.x+this.width/2|0,this.y+this.height/2|0)}intersects(t){return this.x<=t.x2&&this.x2>=t.x&&this.y<=t.y2&&this.y2>=t.y}}},function(t,e,i){"use strict";function r(t,e,i,r){return void 0===r&&(r=255),(t<<24)+(e<<16)+(i<<8)+r}Object.defineProperty(e,"__esModule",{value:!0}),e.fromRgb=r,e.fromHsv=function(t,e,i,s){const o=6*t|0,n=6*t-o,h=i*(1-e),a=i*(1-n*e),l=i*(1-(1-n)*e);let _,d,c;switch(o%6){case 0:_=i,d=l,c=h;break;case 1:_=a,d=i,c=h;break;case 2:_=h,d=i,c=l;break;case 3:_=h,d=a,c=i;break;case 4:_=l,d=h,c=i;break;case 5:_=i,d=h,c=a;break;default:_=0,d=0,c=0}return void 0===s&&(s=1),r(255*_|0,255*d|0,255*c|0,255*s|0)}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=256;class s{constructor(){this.down=!1,this.downCount=0}}e.Key=s;class o{constructor(t){this.keys=new Array(r);for(let t=0;t<r;t++)this.keys[t]=new s;t.addEventListener("keydown",t=>this.setKey(t,!0)),t.addEventListener("keyup",t=>this.setKey(t,!1))}setKey(t,e){t.stopPropagation(),t.preventDefault();const i=t.keyCode;i>=0&&i<r&&(this.keys[i].down=e)}updateKeys(){for(let t=0;t<r;t++)this.keys[t].down?this.keys[t].downCount++:this.keys[t].downCount=0}getKey(t){return t>=0&&t<r?this.keys[t]:null}}o.VK_CANCEL=3,o.VK_HELP=6,o.VK_BACK_SPACE=8,o.VK_TAB=9,o.VK_CLEAR=12,o.VK_ENTER=13,o.VK_SHIFT=16,o.VK_CONTROL=17,o.VK_ALT=18,o.VK_PAUSE=19,o.VK_CAPS_LOCK=20,o.VK_ESCAPE=27,o.VK_SPACE=32,o.VK_PAGE_UP=33,o.VK_PAGE_DOWN=34,o.VK_END=35,o.VK_HOME=36,o.VK_LEFT=37,o.VK_UP=38,o.VK_RIGHT=39,o.VK_DOWN=40,o.VK_PRINTSCREEN=44,o.VK_INSERT=45,o.VK_DELETE=46,o.VK_0=48,o.VK_1=49,o.VK_2=50,o.VK_3=51,o.VK_4=52,o.VK_5=53,o.VK_6=54,o.VK_7=55,o.VK_8=56,o.VK_9=57,o.VK_COLON=58,o.VK_SEMICOLON=59,o.VK_LESS_THAN=60,o.VK_EQUALS=61,o.VK_GREATER_THAN=62,o.VK_QUESTION_MARK=63,o.VK_AT=64,o.VK_A=65,o.VK_B=66,o.VK_C=67,o.VK_D=68,o.VK_E=69,o.VK_F=70,o.VK_G=71,o.VK_H=72,o.VK_I=73,o.VK_J=74,o.VK_K=75,o.VK_L=76,o.VK_M=77,o.VK_N=78,o.VK_O=79,o.VK_P=80,o.VK_Q=81,o.VK_R=82,o.VK_S=83,o.VK_T=84,o.VK_U=85,o.VK_V=86,o.VK_W=87,o.VK_X=88,o.VK_Y=89,o.VK_Z=90,o.VK_CONTEXT_MENU=93,o.VK_NUMPAD0=96,o.VK_NUMPAD1=97,o.VK_NUMPAD2=98,o.VK_NUMPAD3=99,o.VK_NUMPAD4=100,o.VK_NUMPAD5=101,o.VK_NUMPAD6=102,o.VK_NUMPAD7=103,o.VK_NUMPAD8=104,o.VK_NUMPAD9=105,o.VK_MULTIPLY=106,o.VK_ADD=107,o.VK_SEPARATOR=108,o.VK_SUBTRACT=109,o.VK_DECIMAL=110,o.VK_DIVIDE=111,o.VK_F1=112,o.VK_F2=113,o.VK_F3=114,o.VK_F4=115,o.VK_F5=116,o.VK_F6=117,o.VK_F7=118,o.VK_F8=119,o.VK_F9=120,o.VK_F10=121,o.VK_F11=122,o.VK_F12=123,o.VK_F13=124,o.VK_F14=125,o.VK_F15=126,o.VK_F16=127,o.VK_F17=128,o.VK_F18=129,o.VK_F19=130,o.VK_F20=131,o.VK_F21=132,o.VK_F22=133,o.VK_F23=134,o.VK_F24=135,o.VK_NUM_LOCK=144,o.VK_SCROLL_LOCK=145,o.VK_CIRCUMFLEX=160,o.VK_EXCLAMATION=161,o.VK_DOUBLE_QUOTE=162,o.VK_HASH=163,o.VK_DOLLAR=164,o.VK_PERCENT=165,o.VK_AMPERSAND=166,o.VK_UNDERSCORE=167,o.VK_OPEN_PAREN=168,o.VK_CLOSE_PAREN=169,o.VK_ASTERISK=170,o.VK_PLUS=171,o.VK_PIPE=172,o.VK_HYPHEN_MINUS=173,o.VK_OPEN_CURLY_BRACKET=174,o.VK_CLOSE_CURLY_BRACKET=175,o.VK_TILDE=176,o.VK_COMMA=188,o.VK_PERIOD=190,o.VK_SLASH=191,o.VK_BACK_QUOTE=192,o.VK_OPEN_BRACKET=219,o.VK_BACK_SLASH=220,o.VK_CLOSE_BRACKET=221,o.VK_QUOTE=222,o.VK_META=224,o.VK_ALTGR=225,o.VK_WIN=91,o.VK_KANA=21,o.VK_HANGUL=21,o.VK_EISU=22,o.VK_JUNJA=23,o.VK_FINAL=24,o.VK_HANJA=25,o.VK_KANJI=25,o.VK_CONVERT=28,o.VK_NONCONVERT=29,o.VK_ACCEPT=30,o.VK_MODECHANGE=31,o.VK_SELECT=41,o.VK_PRINT=42,o.VK_EXECUTE=43,o.VK_SLEEP=95,e.Keys=o},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),function(t){t[t.None=0]="None",t[t.Blend=1]="Blend",t[t.Add=2]="Add"}(e.BlendMode||(e.BlendMode={}))},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=i(1);class s{}s.BLACK=r.fromRgb(0,0,0),s.WHITE=r.fromRgb(255,255,255),s.LIGHT_GRAY=r.fromRgb(170,170,170),s.DARK_GRAY=r.fromRgb(85,85,85),s.YELLOW=r.fromRgb(255,255,85),s.BROWN=r.fromRgb(170,85,0),s.LIGHT_RED=r.fromRgb(255,85,85),s.DARK_RED=r.fromRgb(170,0,0),s.LIGHT_GREEN=r.fromRgb(85,255,85),s.DARK_GREEN=r.fromRgb(0,170,0),s.LIGHT_CYAN=r.fromRgb(85,255,255),s.DARK_CYAN=r.fromRgb(0,170,170),s.LIGHT_BLUE=r.fromRgb(85,85,255),s.DARK_BLUE=r.fromRgb(0,0,170),s.LIGHT_MAGENTA=r.fromRgb(255,85,255),s.DARK_MAGENTA=r.fromRgb(170,0,170),s.ORANGE=r.fromRgb(255,136,0),e.Colors=s},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class r{}r.SMILEY=1,r.INVERSE_SMILEY=2,r.HEART=3,r.DIAMOND=4,r.CLUB=5,r.SPADE=6,r.BULLET=7,r.INVERSE_BULLET=8,r.LIGHT_SHADE=176,r.MEDIUM_SHADE=177,r.DARK_SHADE=178,r.BOX_SINGLE_VERTICAL=179,r.BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT=180,r.BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT=185,r.BOX_DOUBLE_VERTICAL=186,r.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT=187,r.BOX_DOUBLE_UP_AND_DOUBLE_LEFT=188,r.BOX_SINGLE_DOWN_AND_SINGLE_LEFT=191,r.BOX_SINGLE_UP_AND_SINGLE_RIGHT=192,r.BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP=193,r.BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN=194,r.BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT=195,r.BOX_SINGLE_HORIZONTAL=196,r.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL=197,r.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT=200,r.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT=201,r.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP=202,r.BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN=203,r.BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT=204,r.BOX_DOUBLE_HORIZONTAL=205,r.BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL=206,r.BOX_SINGLE_UP_AND_SINGLE_LEFT=217,r.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT=218,r.BLOCK_TOP_LEFT=226,r.BLOCK_TOP_RIGHT=227,r.BLOCK_TOP_HALF=228,r.BLOCK_BOTTOM_LEFT=232,r.BLOCK_BOTTOM_RIGHT=229,r.BLOCK_RIGHT_HALF=231,r.BLOCK_CHECKER=230,e.Chars=r},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=i(3),s=i(9),o=i(5);e.Console=class{constructor(t,e){this.width=t,this.height=e,this.grid=new Array;for(let i=0;i<e;i++){const e=new Array;for(let i=0;i<t;i++)e.push(new s.Cell);this.grid.push(e)}this.clear()}clear(){for(let t=0;t<this.height;t++)for(let e=0;e<this.width;e++)this.drawChar(e,t,0)}getCell(t,e){if(!(t<0||e<0||t>=this.width||e>=this.height))return this.grid[e][t]}drawChar(t,e,i,r,s){t>=0&&t<this.width&&e>=0&&e<this.height&&this.grid[e][t].setValue(i,r,s)}drawString(t,e,i,r,s){for(let o=0;o<i.length;o++)this.drawChar(t+o,e,i.charCodeAt(o),r,s)}drawCenteredString(t,e,i,r,s){this.drawString(t-Math.floor(i.length/2),e,i,r,s)}drawHLine(t,e,i,r,s,o){for(let n=t;n<t+i;n++)this.drawChar(n,e,r,s,o)}drawVLine(t,e,i,r,s,o){for(let n=e;n<e+i;n++)this.drawChar(t,n,r,s,o)}drawRect(t,e,i,r,s,o,n){this.drawHLine(t,e,i,s,o,n),this.drawHLine(t,e+r-1,i,s,o,n),this.drawVLine(t,e,r,s,o,n),this.drawVLine(t+i-1,e,r,s,o,n)}drawBox(t,e,i,r,s,o,n,h,a,l,_,d,c,u){this.fillRect(t,e,i,r,0,c,u),this.drawHLine(t,e,i,s),this.drawHLine(t,e+r-1,i,n),this.drawVLine(t,e,r,h),this.drawVLine(t+i-1,e,r,o),this.drawChar(t,e,a),this.drawChar(t+i-1,e,l),this.drawChar(t,e+r-1,d),this.drawChar(t+i-1,e+r-1,_)}drawSingleBox(t,e,i,r,s,n){this.drawBox(t,e,i,r,o.Chars.BOX_SINGLE_HORIZONTAL,o.Chars.BOX_SINGLE_VERTICAL,o.Chars.BOX_SINGLE_HORIZONTAL,o.Chars.BOX_SINGLE_VERTICAL,o.Chars.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT,o.Chars.BOX_SINGLE_DOWN_AND_SINGLE_LEFT,o.Chars.BOX_SINGLE_UP_AND_SINGLE_LEFT,o.Chars.BOX_SINGLE_UP_AND_SINGLE_RIGHT,s,n)}drawDoubleBox(t,e,i,r,s,n){this.drawBox(t,e,i,r,o.Chars.BOX_DOUBLE_HORIZONTAL,o.Chars.BOX_DOUBLE_VERTICAL,o.Chars.BOX_DOUBLE_HORIZONTAL,o.Chars.BOX_DOUBLE_VERTICAL,o.Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT,o.Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT,o.Chars.BOX_DOUBLE_UP_AND_DOUBLE_LEFT,o.Chars.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT,s,n)}fillRect(t,e,i,r,s,o,n){for(let h=e;h<e+r;h++)this.drawHLine(t,h,i,s,o,n)}drawConsole(t,e,i,s,o,n,h,a){a=a||r.BlendMode.None;for(let r=0;r<h;r++)for(let h=0;h<n;h++){const n=i.getCell(s+h,o+r);n&&this.drawCell(t+h,e+r,n,a)}}drawCell(t,e,i,r){t>=0&&t<this.width&&e>=0&&e<this.height&&this.grid[e][t].drawCell(i,r)}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.Point=class{constructor(t,e){this.x=t,this.y=e}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.Dialog=class{constructor(t,e){this.contentsRect=t,this.title=e}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=i(3),s=i(1),o=i(4);e.Cell=class{constructor(t,e,i,r){this.charCode=void 0!==t?function(t){return"string"==typeof t&&t.length>0?t.charCodeAt(0):t}(t):" ".charCodeAt(0),this.fg=void 0!==e?e:o.Colors.WHITE,this.bg=void 0!==i?i:o.Colors.BLACK,void 0!==r&&(this.meta=r),this.dirty=!0}setCharCode(t){this.charCode!==t&&(this.charCode=t,this.dirty=!0)}setForeground(t){null!=t&&t!==this.fg&&(this.fg=t,this.dirty=!0)}setBackground(t){null!=t&&t!==this.bg&&(this.bg=t,this.dirty=!0)}setMeta(t){void 0!==t&&(this.meta=t,this.dirty=!0)}setValue(t,e,i,s){return"string"==typeof t&&(t=t.charCodeAt(0)),"number"==typeof t?(this.setCharCode(t),this.setForeground(e),this.setBackground(i),this.setMeta(s)):this.drawCell(t,r.BlendMode.None),this.dirty}drawCell(t,e){const i=255&t.bg;e===r.BlendMode.None||t.charCode>0?(this.setCharCode(t.charCode),this.setForeground(t.fg)):i>0&&i<255&&this.setForeground(this.blendColors(this.fg,t.bg,e)),e===r.BlendMode.None||255===i?this.setBackground(t.bg):i>0&&this.setBackground(this.blendColors(this.bg,t.bg,e)),this.setMeta(t.meta)}blendColors(t,e,i){const o=(255-(255&e))/255,n=1-o,h=t>>24&255,a=t>>16&255,l=t>>8&255,_=e>>24&255,d=e>>16&255,c=e>>8&255;switch(i){case r.BlendMode.Blend:return s.fromRgb(o*h+n*_|0,o*a+n*d|0,o*l+n*c|0);case r.BlendMode.Add:return s.fromRgb(this.clamp(h+n*_|0),this.clamp(a+n*d|0),this.clamp(l+n*c|0));default:return e}}clamp(t){return Math.min(255,t)}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class r{constructor(t,e,i,r,s){this.url=t,this.charWidth=e,this.charHeight=i,this.scale=r||1,this.graphical=!!s}}e.Font=r;e.DEFAULT_FONT=new r("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAEtElEQVRIx2WTsYsUMRTGPxTOJniWgRMFsbR4oJyDBE+s/AdsrIJKtEixIKwPHOc8tbCwsdNKLCy0tlBQGBCnel55CK5y1dqIbKVbhBlfZkYP8UsI2d98ed+bMAtUVTxUHELn3Krb2HwCbHVtUSo4f/5AOHnlEvD8c1sWhf229WQ1bGy63tG2pXu/9e52oCvfgHfvy7JtMxDXgyffimKnzEfETq71Rw6pclGpFvNLORYoihzLdrd+gjv7bNisYK3FoN2DLnx+D+esJRy3HZZnq/CZ9aA1vg6uQ9vacEvykbatu6pShw1rooYqOzqnNSqsceWss9Qe76ymuLD2sNpLAXS3RIe/4hgJhbceWSs9SE30RIEUmAzaWoraW0fDeUZMdgpvu4QEhYTW0AyjI1dSRxDkGhNQnR2RmilyCoHuYE+jn4n5cCoSc47wDFmIuNqLSH9EMCNj4rI2IkQ+WYNERSFmabkkjTAW38mb1giJAdRB0K2o34ulCYEATokNs+cJkabQf22gpORS2zrhI/NF0xRoOIR4+XIQMsH/mEd8lVCH69drBdG3PxsFZR2Y60SG/c5XBal3bGt8vNxsN6gl1/BaQzdNE8GSUxZnhXne5pT/lFiHSNNIyzUfAoIEedUD8d4WPdglBVEee7IRKKUsFOwUTN7aBvAzPqygjXTZGwsFHIWEfzTU+JUMFofnzImahlvex/hPHQi7OIwCu2R3JxkRPAyiruP96f2zYT+NEw70fcmACVLKQqbaFbUiQBlqSV4CWaadDCSI1L4M2dFkMH3LU16YOX+acyOMUUtggr86hF6H7e502NIAyNKswGz6qSz7C0oKEBEk1uMF5XdoMuD+goTUoaAsvTkl3Mby6gC8WSztlGJjkqagxeLIXie9GLYS76CLlF4IIvQeFFgXNEQXUIMdsxNdJsWECbXIijErdRDRFGGIpLNleVaqlDIQsOSHgX1dK0gJVPFGVW2Q1tBi6vB73+ggi7MMzx6NoDiDgyBEEdIBIEasIW3KYC2lvLotFt60zCwijWwvdrgCb4qqBzt+TuoYf6dG5vPIVmtsM3NVmZLL9Fo+Af9exwTWGjOdOkcO83lGRNbOZjHgkrZhTwp4knEM9BzMCAGGWJbfzzr/JlU3rJxESTkTqF+YK9esOiSDWVVJMNsfndaotAkRgB0eP3X4R0f3WwDHLn7RVrh26+tYtwI8eHnTWnvfnx/A6CCiNz/X258Vjw5mfrayvrJSp8Gx1GR1/GxrWg6OlJLWWEeV7FBDHS4DS3ZwQPUH6C8d0+k6hjGC2WwEd0fAdHrjV3e6+9WOwDARoDPiaNfpLGVDH+uMGKpIygV0tiOoZAR3RwCMAPiUWLzGiEUH6ztM4n1QTffRA+rwKeibnWPmHnAH89N7v0tEGUAdLjAzFCy1HZtbi+rIAHYARVJBXT1g7CkDqLpusdphsaoJvm9xa2sEdJ+IEmHr3gikH8DWhz9A1YMXAFZXVxei4gwe7YFEGWyNgJkN97Ej+PutEuabFaEAipIHcOLze0IU8EGTQQJ/ZiAC1hUuO9LJW5JQKDjoFWjUtzWBylZlqUDRxzUmDMog4enaQ1Kyp/1Y7v1vfwPx3em+Z+50IgAAAABJRU5ErkJggg==",8,8)},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.DialogState=class{constructor(t,e,i){this.dialog=t,this.rect=e,this.contentsOffset=i,this.open=!1,this.count=0}}},function(t,e,i){"use strict";function r(t){for(var i in t)e.hasOwnProperty(i)||(e[i]=t[i])}Object.defineProperty(e,"__esModule",{value:!0}),r(i(3)),r(i(9)),r(i(5)),r(i(1)),r(i(4)),r(i(6)),r(i(10)),r(i(13)),r(i(14)),r(i(8)),r(i(11)),r(i(16)),r(i(17)),r(i(18)),r(i(2)),r(i(19)),r(i(7)),r(i(0)),r(i(20)),r(i(21))},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class r{constructor(t,e){this.x=t,this.y=e,this.blocked=!1,this.visible=!1,this.g=0,this.h=0,this.prev=null}}e.FovCell=r;e.FovMap=class{constructor(t,e,i){this.width=t,this.height=e,this.grid=new Array(e);for(let i=0;i<e;i++){this.grid[i]=new Array(t);for(let e=0;e<t;e++)this.grid[i][e]=new r(e,i)}if(this.originX=0,this.originY=0,this.minX=0,this.maxX=0,this.minY=0,this.maxY=0,this.radius=0,i)for(let r=0;r<e;r++)for(let e=0;e<t;e++)this.grid[r][e].blocked=i(e,r)}getCell(t,e){return this.grid[e][t]}setBlocked(t,e,i){t>=0&&t<this.width&&e>=0&&e<this.height&&(this.grid[e][t].blocked=i)}isVisible(t,e){return!(t<0||t>=this.width||e<0||e>=this.height)&&this.grid[e][t].visible}computeOctantY(t,e){const i=[],r=[];let s,o,n,h,a,l,_,d,c,u,E=1,f=0,g=0,A=0;for(o=this.originY+e;o>=this.minY&&o<=this.maxY;o+=e,g=f,++E)for(n=.5/E,u=-1,h=Math.floor(A*E+.5),s=this.originX+h*t;h<=E&&s>=this.minX&&s<=this.maxX;s+=t,++h,u=c){if(a=!0,l=!1,d=u,c=(_=h/E)+n,g>0)if(this.grid[o-e][s].visible&&!this.grid[o-e][s].blocked||this.grid[o-e][s-t].visible&&!this.grid[o-e][s-t].blocked){for(let t=0;t<g&&a;++t)if(d<=r[t]&&c>=i[t])if(this.grid[o][s].blocked){if(d>=i[t]&&c<=r[t]){a=!1;break}i[t]=Math.min(i[t],d),r[t]=Math.max(r[t],c),l=!0}else if(_>i[t]&&_<r[t]){a=!1;break}}else a=!1;a&&(this.grid[o][s].visible=!0,this.grid[o][s].blocked&&(A>=d?A=c:l||(i[f]=d,r[f++]=c)))}}computeOctantX(t,e){const i=[],r=[];let s,o,n,h,a,l,_,d,c,u,E=1,f=0,g=0,A=0;for(s=this.originX+t;s>=this.minX&&s<=this.maxX;s+=t,g=f,++E)for(n=.5/E,u=-1,h=Math.floor(A*E+.5),o=this.originY+h*e;h<=E&&o>=this.minY&&o<=this.maxY;o+=e,++h,u=c){if(a=!0,l=!1,d=u,c=(_=h/E)+n,g>0)if(this.grid[o][s-t].visible&&!this.grid[o][s-t].blocked||this.grid[o-e][s-t].visible&&!this.grid[o-e][s-t].blocked){for(let t=0;t<g&&a;++t)if(d<=r[t]&&c>=i[t])if(this.grid[o][s].blocked){if(d>=i[t]&&c<=r[t]){a=!1;break}i[t]=Math.min(i[t],d),r[t]=Math.max(r[t],c),l=!0}else if(_>i[t]&&_<r[t]){a=!1;break}}else a=!1;a&&(this.grid[o][s].visible=!0,this.grid[o][s].blocked&&(A>=d?A=c:l||(i[f]=d,r[f++]=c)))}}computeFov(t,e,i){for(let t=0;t<this.height;t++)for(let e=0;e<this.width;e++)this.grid[t][e].visible=!1;this.grid[e][t].visible=!0,this.originX=t,this.originY=e,this.radius=i,this.minX=Math.max(0,t-i),this.minY=Math.max(0,e-i),this.maxX=Math.min(this.width-1,t+i),this.maxY=Math.min(this.height-1,e+i),this.computeOctantY(1,1),this.computeOctantX(1,1),this.computeOctantY(1,-1),this.computeOctantX(1,-1),this.computeOctantY(-1,1),this.computeOctantX(-1,1),this.computeOctantY(-1,-1),this.computeOctantX(-1,-1)}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=i(15);e.GUI=class{constructor(t,e){this.terminal=t,this.renderer=e||new r.DefaultDialogRenderer,this.dialogs=[]}add(t){this.dialogs.push(this.renderer.getState(this.terminal,t))}handleInput(){if(0===this.dialogs.length)return!1;const t=this.dialogs.length-1,e=this.dialogs[this.dialogs.length-1];return e.dialog.handleInput(this.terminal,e.contentsOffset)&&this.dialogs.splice(t,1),!0}draw(){for(let t=0;t<this.dialogs.length;t++)this.renderer.draw(this.terminal,this.dialogs[t])}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=i(4),s=i(7),o=i(0),n=i(11);e.DefaultDialogRenderer=class{getState(t,e){const i=e.contentsRect.width+4,r=e.contentsRect.height+4,h=(t.width-i)/2|0,a=(t.height-r)/2|0;return new n.DialogState(e,new o.Rect(h,a,i,r),new s.Point(h+2,a+2))}draw(t,e){const i=e.dialog,{x:s,y:o,width:n,height:h}=e.rect;t.fillRect(s,o,n,h,0,r.Colors.WHITE,r.Colors.BLACK),t.drawSingleBox(s,o,n,h),t.drawCenteredString(s+n/2|0,o," "+i.title+" "),i.drawContents(t,e.contentsOffset)}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=i(2),s=i(0),o=i(8);e.MessageDialog=class extends o.Dialog{constructor(t,e){const i=e.split("\n");let r=t.length;for(let t=0;t<i.length;t++)r=Math.max(r,i[t].length);const o=i.length;super(new s.Rect(0,0,r,o),t),this.lines=i}drawContents(t,e){for(let i=0;i<this.lines.length;i++)t.drawString(e.x,e.y+i,this.lines[i])}handleInput(t,e){return t.isKeyPressed(r.Keys.VK_ESCAPE)}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=i(2),s=i(0),o=i(8);e.SelectDialog=class extends o.Dialog{constructor(t,e,i){let r=t.length;for(let t=0;t<e.length;t++)r=Math.max(r,e[t].length+4);const o=e.length;super(new s.Rect(0,0,r,o),t),this.options=e,this.callback=i}drawContents(t,e){for(let i=0;i<this.options.length;i++){const r=String.fromCharCode(65+i)+" - "+this.options[i];t.drawString(e.x,e.y+i,r)}}handleInput(t,e){for(let e=0;e<this.options.length;e++)if(t.isKeyPressed(r.Keys.VK_A+e))return this.callback(e),!0;return t.isKeyPressed(r.Keys.VK_ESCAPE)}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=i(5),s=i(1),o=i(6),n=[{charCode:r.Chars.BLOCK_TOP_LEFT,active:[1,0,0,0]},{charCode:r.Chars.BLOCK_TOP_RIGHT,active:[0,1,0,0]},{charCode:r.Chars.BLOCK_TOP_HALF,active:[1,1,0,0]},{charCode:r.Chars.BLOCK_BOTTOM_LEFT,active:[0,0,1,0]},{charCode:r.Chars.BLOCK_BOTTOM_RIGHT,active:[0,0,0,1]},{charCode:r.Chars.BLOCK_RIGHT_HALF,active:[0,1,0,1]},{charCode:r.Chars.BLOCK_CHECKER,active:[1,0,0,1]}];function h(t){const e=document.createElement("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");return i.drawImage(t,0,0),i.getImageData(0,0,t.width,t.height).data}function a(t,e,i,r,s){const o=4*(r*s+i),h=4*(r*s+i+1),a=4*((r+1)*s+i),d=4*((r+1)*s+i+1),c=[[e[o],e[o+1],e[o+2]],[e[h],e[h+1],e[h+2]],[e[a],e[a+1],e[a+2]],[e[d],e[d+1],e[d+2]]];let u=Number.MAX_VALUE,E=0,f=null,g=null;for(let t=0;t<n.length;t++){const e=n[t],i=l(e.active,c);i.error<u&&(u=i.error,E=e.charCode,f=i.bg,g=i.fg)}t.drawChar(i/2,r/2,E,_(g),_(f))}function l(t,e){const i=[[0,0,0],[0,0,0]],r=[[0,0,0],[0,0,0]],s=[0,0];for(let r=0;r<4;r++){for(let s=0;s<3;s++)i[t[r]][s]+=e[r][s];s[t[r]]++}for(let t=0;t<2;t++)for(let e=0;e<3;e++)r[t][e]=i[t][e]/s[t];let o=0;for(let i=0;i<4;i++){let s=0;for(let o=0;o<3;o++){const n=e[i][o]-r[t[i]][o];s+=n*n}o+=Math.sqrt(s)}return{bg:r[0],fg:r[1],error:o}}function _(t){return s.fromRgb(t[0],t[1],t[2])}e.loadImage=function(t,e){const i=new Image;i.onload=(()=>{const t=i.width,r=i.height,n=h(i),a=new o.Console(t,r);let l=0;for(let e=0;e<r;e++)for(let i=0;i<t;i++)a.getCell(i,e).setBackground(s.fromRgb(n[l++],n[l++],n[l++],n[l++]));e(a)}),i.src=t},e.loadImage2x=function(t,e){const i=new Image;i.onload=(()=>{const t=i.width,r=i.height,s=h(i),n=new o.Console(t/2,r/2);for(let e=0;e<r;e+=2)for(let i=0;i<t;i+=2)a(n,s,i,e,t);e(n)}),i.src=t}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=[-1,0,1,-1,1,-1,0,1],s=[-1,-1,-1,0,0,1,1,1],o=[1.5,1,1.5,1,1,1.5,1,1.5];function n(t){let e=null,i=-1,r=1/0;for(let s=0;s<t.length;s++){const o=t[s];o.g!==1/0&&o.g+o.h<r&&(e=o,i=s,r=o.g+o.h)}return t.splice(i,1),e}function h(t){const e=[];let i=t;for(;i;)e.push(i),i=i.prev;return e.reverse(),e}e.computePath=function(t,e,i,a){!function(t,e){for(let i=0;i<t.height;i++)for(let r=0;r<t.width;r++){const s=t.grid[i][r];s.g=1/0,s.h=Math.min(Math.abs(r-e.x),Math.abs(i-e.y)),s.prev=null}}(t,i);const l=t.grid[e.y][e.x];l.g=0;const _=[l];for(;_.length>0;){const e=n(_);if(e.x===i.x&&e.y===i.y)return h(e);for(let i=0;i<r.length;i++){const n=e.x+r[i],h=e.y+s[i];if(n>=0&&n<t.width&&h>=0&&h<t.height){const r=t.grid[h][n],s=e.g+o[i];s<r.g&&s<=a&&!t.grid[h][n].blocked&&(r.g=s,r.prev=e,_.push(r))}}}return null}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.RNG=class{constructor(t){this.m=2147483648,this.a=1103515245,this.c=12345,this.state=t||1}nextInt(){return this.state=(this.a*this.state+this.c)%this.m,this.state}nextFloat(){return this.nextInt()/(this.m-1)}nextRange(t,e){const i=e-t;return t+(this.nextInt()/this.m*i|0)}chooseIndex(t){const e=t.reduce((t,e)=>t+e),i=this.nextRange(1,e+1);let r=0;for(let e=0;e<t.length;e++)if(i<=(r+=t[e]))return e;return t.length-1}chooseKey(t){const e=[],i=[];for(const r in t)t.hasOwnProperty(r)&&(e.push(r),i.push(t[r]));return e[this.chooseIndex(i)]}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=i(6),s=i(10),o=i(2),n=i(22),h=i(23);function a(t,e){return t/e*2-1}const l={font:s.DEFAULT_FONT,requestFullscreen:!1};e.Terminal=class extends r.Console{constructor(t,e,i,r){super(e,i),r=r||l,this.canvas=t,this.font=r.font||s.DEFAULT_FONT,this.pixelWidth=e*this.font.charWidth,this.pixelHeight=i*this.font.charHeight,t.width=this.pixelWidth,t.height=this.pixelHeight,t.style.width=this.font.scale*this.pixelWidth+"px",t.style.height=this.font.scale*this.pixelHeight+"px",t.style.outline="none",t.tabIndex=0,this.keys=new o.Keys(t),this.mouse=new n.Mouse(this,r);const _=t.getContext("webgl",{antialias:!1});if(!_)throw new Error("Unable to initialize WebGL. Your browser may not support it.");const d=_.createProgram();if(!d)throw new Error("Unable to initialize WebGL. Your browser may not support it.");this.gl=_,this.program=d,_.attachShader(d,this.buildShader(_.VERTEX_SHADER,h.VERTEX_SHADER_SOURCE)),_.attachShader(d,this.buildShader(_.FRAGMENT_SHADER,h.FRAGMENT_SHADER_SOURCE)),_.linkProgram(d),_.useProgram(d),this.font.graphical&&_.uniform1i(_.getUniformLocation(d,"h"),1),this.positionAttribLocation=this.getAttribLocation("a"),this.textureAttribLocation=this.getAttribLocation("b"),this.fgColorAttribLocation=this.getAttribLocation("c"),this.bgColorAttribLocation=this.getAttribLocation("d");const c=e*i;this.positionsArray=new Float32Array(3*c*4),this.indexArray=new Uint16Array(6*c),this.textureArray=new Float32Array(2*c*4),this.foregroundUint8Array=new Uint8Array(4*c*4),this.foregroundDataView=new DataView(this.foregroundUint8Array.buffer),this.backgroundUint8Array=new Uint8Array(4*c*4),this.backgroundDataView=new DataView(this.backgroundUint8Array.buffer);let u=0,E=0,f=0;for(let t=0;t<i;t++)for(let r=0;r<e;r++)this.positionsArray[u++]=a(r,e),this.positionsArray[u++]=-a(t,i),this.positionsArray[u++]=a(r+1,e),this.positionsArray[u++]=-a(t,i),this.positionsArray[u++]=a(r+1,e),this.positionsArray[u++]=-a(t+1,i),this.positionsArray[u++]=a(r,e),this.positionsArray[u++]=-a(t+1,i),this.indexArray[E++]=f+0,this.indexArray[E++]=f+1,this.indexArray[E++]=f+2,this.indexArray[E++]=f+0,this.indexArray[E++]=f+2,this.indexArray[E++]=f+3,f+=4;this.positionBuffer=_.createBuffer(),this.indexBuffer=_.createBuffer(),this.textureBuffer=_.createBuffer(),this.foregroundBuffer=_.createBuffer(),this.backgroundBuffer=_.createBuffer(),_.bindBuffer(_.ARRAY_BUFFER,this.positionBuffer),_.bufferData(_.ARRAY_BUFFER,this.positionsArray,_.STATIC_DRAW),_.bindBuffer(_.ELEMENT_ARRAY_BUFFER,this.indexBuffer),_.bufferData(_.ELEMENT_ARRAY_BUFFER,this.indexArray,_.STATIC_DRAW),this.texture=this.loadTexture(this.font.url),this.renderLoop()}getAttribLocation(t){const e=this.gl.getAttribLocation(this.program,t);return this.gl.enableVertexAttribArray(e),e}flush(){let t=0,e=0;for(let i=0;i<this.height;i++)for(let r=0;r<this.width;r++){const s=this.getCell(r,i);if(!s.dirty){t+=8,e+=16;continue}const o=s.charCode%16,n=s.charCode/16|0;this.textureArray[t++]=o,this.textureArray[t++]=n,this.textureArray[t++]=o+1,this.textureArray[t++]=n,this.textureArray[t++]=o+1,this.textureArray[t++]=n+1,this.textureArray[t++]=o,this.textureArray[t++]=n+1;for(let t=0;t<4;t++)this.foregroundDataView.setUint32(e,s.fg,!1),this.backgroundDataView.setUint32(e,s.bg,!1),e+=4;s.dirty=!1}}isKeyDown(t){const e=this.keys.getKey(t);return e&&e.down}isKeyPressed(t){const e=this.keys.getKey(t),i=e?e.downCount:0;return 1===i||i>30&&i%3==0}getKeyDownCount(t){const e=this.keys.getKey(t);return e?e.downCount:0}buildShader(t,e){const i=this.gl,r=i.createShader(t);if(!r)throw new Error("An error occurred compiling the shader: ");if(i.shaderSource(r,e),i.compileShader(r),!i.getShaderParameter(r,i.COMPILE_STATUS))throw new Error("An error occurred compiling the shader: "+i.getShaderInfoLog(r));return r}loadTexture(t){const e=this.gl,i=e.createTexture();e.bindTexture(e.TEXTURE_2D,i);const r=e.RGBA,s=e.RGBA,o=e.UNSIGNED_BYTE,n=new Uint8Array([0,0,0,255]);e.texImage2D(e.TEXTURE_2D,0,r,1,1,0,s,o,n);const h=new Image;return h.onload=(()=>{e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,r,s,o,h),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR)}),h.src=t,i}render(){const t=this.gl;t.clearColor(0,0,0,1),t.clearDepth(1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.viewport(0,0,this.pixelWidth,this.pixelHeight);{const e=2,i=t.FLOAT,r=!1,s=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.positionBuffer),t.vertexAttribPointer(this.positionAttribLocation,e,i,r,s,o)}{const e=2,i=t.FLOAT,r=!1,s=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.textureBuffer),t.bufferData(t.ARRAY_BUFFER,this.textureArray,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.textureAttribLocation,e,i,r,s,o)}{const e=4,i=t.UNSIGNED_BYTE,r=!0,s=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.foregroundBuffer),t.bufferData(t.ARRAY_BUFFER,this.foregroundUint8Array,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.fgColorAttribLocation,e,i,r,s,o)}{const e=4,i=t.UNSIGNED_BYTE,r=!0,s=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,this.backgroundBuffer),t.bufferData(t.ARRAY_BUFFER,this.backgroundUint8Array,t.DYNAMIC_DRAW),t.vertexAttribPointer(this.bgColorAttribLocation,e,i,r,s,o)}t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.useProgram(this.program),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.texture);{const e=this.width*this.height*6,i=t.UNSIGNED_SHORT,r=0;t.drawElements(t.TRIANGLES,e,i,r)}}renderLoop(){this.keys.updateKeys(),this.mouse.update(),this.update&&this.update(),this.flush(),this.render(),requestAnimationFrame(this.renderLoop.bind(this))}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const r=i(0);e.Mouse=class{constructor(t,e){this.el=t.canvas,this.width=t.width,this.height=t.height,this.options=e,this.prevX=0,this.prevY=0,this.x=0,this.y=0,this.dx=0,this.dy=0,this.buttons=[!1,!1,!1];const i=this.el;i.addEventListener("mousedown",t=>this.handleEvent(t)),i.addEventListener("mouseup",t=>this.handleEvent(t)),i.addEventListener("mousemove",t=>this.handleEvent(t)),i.addEventListener("contextmenu",t=>this.handleEvent(t));const r=this.handleTouchEvent.bind(this);i.addEventListener("touchstart",r),i.addEventListener("touchend",r),i.addEventListener("touchcancel",r),i.addEventListener("touchmove",r)}handleTouchEvent(t){if(t.stopPropagation(),t.preventDefault(),"touchend"===t.type&&this.options.requestFullscreen&&this.requestFullscreen(),t.touches.length>0){const e=t.touches[0];this.updatePosition(e.clientX,e.clientY),this.buttons[0]=!0}else this.buttons[0]=!1}handleEvent(t){t.stopPropagation(),t.preventDefault(),this.updatePosition(t.clientX,t.clientY),"mousedown"===t.type&&(this.buttons[t.button]=!0,this.el.focus(),this.options.requestFullscreen&&this.requestFullscreen()),"mouseup"===t.type&&(this.buttons[t.button]=!1)}updatePosition(t,e){let i=this.el.getBoundingClientRect();const s=this.width/this.height,o=i.width/i.height;if(o-s>.01){const t=s*i.height,e=i.width-t;i=new r.Rect(Math.floor(e/2),0,t,i.height)}if(o-s<-.01){const t=i.width/s,e=i.height-t;i=new r.Rect(0,Math.floor(e/2),i.width,t)}this.x=this.width*(t-i.left)/i.width|0,this.y=this.height*(e-i.top)/i.height|0}requestFullscreen(){const t=this.el;t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen?t.webkitRequestFullscreen():t.mozRequestFullScreen&&t.mozRequestFullScreen()}update(){this.dx=this.x-this.prevX,this.dy=this.y-this.prevY,this.prevX=this.x,this.prevY=this.y}}},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.VERTEX_SHADER_SOURCE="attribute vec2 a;attribute vec2 b;attribute vec3 c;attribute vec3 d;varying highp vec2 e;varying highp vec4 f;varying highp vec4 g;void main(void){gl_Position=vec4(a.x,a.y,0,1);e=b/16.0;f=vec4(c.r,c.g,c.b,1);g=vec4(d.r,d.g,d.b,1);}",e.FRAGMENT_SHADER_SOURCE="varying highp vec2 e;varying highp vec4 f;varying highp vec4 g;uniform bool h;uniform sampler2D s;void main(void){gl_FragColor=texture2D(s,e);if(h){if(gl_FragColor.a<0.1){gl_FragColor=texture2D(s,g.rg*16.0+fract(e*16.0)/16.0);}}else{if(gl_FragColor.r<0.1) {gl_FragColor=g;} else {gl_FragColor=f;}}}"}])});