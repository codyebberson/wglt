import"../modulepreload-polyfill-3cfb730f.js";/* empty css                */import{f as n,T as x,a as m}from"../terminal-34f48c6a.js";import{c as u}from"../path-d6151948.js";var S=(e=>(e[e.QUADRANT_SOUTHEAST=3]="QUADRANT_SOUTHEAST",e[e.QUADRANT_EAST=6]="QUADRANT_EAST",e[e.QUADRANT_NORTHEAST=12]="QUADRANT_NORTHEAST",e[e.QUADRANT_NORTH=24]="QUADRANT_NORTH",e[e.QUADRANT_NORTHWEST=48]="QUADRANT_NORTHWEST",e[e.QUADRANT_WEST=96]="QUADRANT_WEST",e[e.QUADRANT_SOUTHWEST=192]="QUADRANT_SOUTHWEST",e[e.QUADRANT_SOUTH=129]="QUADRANT_SOUTH",e))(S||{});function O(e,T){return e>0?T>0?3:T===0?6:12:e<0?T>0?192:T===0?96:48:T>0?129:24}const i={BLACK:n(0,0,0),WHITE:n(255,255,255),RED:n(136,0,0),CYAN:n(170,255,238),VIOLET:n(204,68,204),GREEN:n(0,204,85),BLUE:n(0,0,170),YELLOW:n(238,238,119),ORANGE:n(221,136,85),BROWN:n(102,68,0),LIGHT_RED:n(255,119,119),DARK_GRAY:n(51,51,51),GRAY:n(119,119,119),LIGHT_GREEN:n(170,255,102),LIGHT_BLUE:n(0,136,255),LIGHT_GRAY:n(187,187,187)},N=80,h=45,_=["    ########        #########        ########    ","    #......#        #.......#        #......#    ","    #......#        #...#...#        #......#    ","    #....#.#        #.#####.#        #......#    ","    #....#.#        #...#...#        #......#    ","    #..###.#        #.......#        #......#    ","    #......##########.......##########......#    ","#####.......................................#####","#...............................................#","#...............................................#","#...............................................#","#...............................................#","#...............................................#","#####.......................................#####","    #......##########.......##########......#    ","    #......#        #.......#        #......#    ","    #......#        #.......#        #......#    ","    #......#        #.......#        #......#    ","    #......#        #.......#        #......#    ","    #......#        #.......#        #......#    ","    #......#        #.......#        #......#    ","    #......#        #.......#        #......#    ","    #......##########.......##########......#    ","#####.......................................#####","#...............................................#","#...............................................#","#...............................................#","#...............................................#","#...............................................#","#####.......................................#####","    #......#############.#############......#    ","    #......#        #..#.#..#        #......#    ","    #..#####        #..#.#..#        #......#    ","    #......#        #..#.#..#        #......#    ","    #####..#        #.......#        #......#    ","    #......#        #.......#        #......#    ","    ########        #########        ########    "],R=_[0].length,E=_.length,p=(N-R)/2|0,f=(h-E)/2|0,g=15;function I(e,T){return _[T].charAt(e)}function U(e,T){return I(e,T)!=="."}const r=new x(document.querySelector("canvas"),N,h,{crt:{scale:3,blur:.5,curvature:.05,chroma:.5,vignette:.1,scanlineWidth:.75,scanlineIntensity:.25}}),t={x:Math.floor(R/2),y:Math.floor(E/2),direction:S.QUADRANT_NORTH,path:null,pathIndex:0},c=new m(R,E,U);function D(){c.computeFov(t.x,t.y,g,!1,t.direction),c.updateExplored()}function H(e,T){const A=t.x+e,o=t.y+T;A<0||A>=R||o<0||o>=E||U(A,o)||(t.x=A,t.y=o,t.direction=O(e,T),D())}r.update=function(){const e=r.getMovementKey();if(e&&H(e.x,e.y),t.path){for(;t.pathIndex<t.path.length&&t.x===t.path[t.pathIndex].x&&t.y===t.path[t.pathIndex].y;)t.pathIndex++;t.pathIndex<t.path.length&&H(t.path[t.pathIndex].x-t.x,t.path[t.pathIndex].y-t.y)}r.clear(),c.fillRect(0,0,N,h,0,i.WHITE,i.BLACK);for(let o=0;o<E;o++)for(let l=0;l<R;l++){const s=c.getCell(l,o);if(s&&s.explored){const a=c.isVisible(l,o)?i.WHITE:i.DARK_GRAY;c.drawString(l,o,I(l,o),a)}}const T={x:r.mouse.x-p,y:r.mouse.y-f},A=u(c,t,T,1e3);if(A){for(let o=1;o<A.length;o++){const l=A[o],s=c.getCell(l.x,l.y);s&&s.setBackground(i.RED)}r.mouse.buttons.get(0).isClicked()&&(t.path=A,t.pathIndex=0)}r.drawConsole(p,f,c,0,0,R,E),r.drawString(p+t.x,f+t.y,"@"),r.drawString(1,1,"Hello world!",i.WHITE),r.drawString(1,3,"Use arrow keys to move",i.WHITE)};D();
