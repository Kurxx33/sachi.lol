/** @license
 * DHTML Snowstorm! JavaScript-based snow for web pages
 * Making it snow on the internets since 2003. You're welcome.
 * -----------------------------------------------------------
 * Version 1.44.20131215 (Previous rev: 1.44.20131208)
 * Copyright (c) 2007, Scott Schiller. All rights reserved.
 * Code provided under the BSD License
 * http://schillmania.com/projects/snowstorm/license.txt
 */

/*jslint nomen: true, plusplus: true, sloppy: true, vars: true, white: true */
/*global window, document, navigator, clearInterval, setInterval */

var snowStorm = (function(window, document) {

    // --- common properties ---
  
    this.autoStart = true;          // Whether the snow should start automatically or not.
    this.excludeMobile = true;      // Snow is likely to be bad news for mobile phones' CPUs (and batteries.) Enable at your own risk.
    this.flakesMax = 128;           // Limit total amount of snow made (falling + sticking)
    this.flakesMaxActive = 64;      // Limit amount of snow falling at once (less = lower CPU use)
    this.animationInterval = 33;    // Theoretical "miliseconds per frame" measurement. 20 = fast + smooth, but high CPU use. 50 = more conservative, but slower
    this.useGPU = true;             // Enable transform-based hardware acceleration, reduce CPU load.
    this.className = null;          // CSS class name for further customization on snow elements
    this.flakeBottom = null;        // Integer for Y axis snow limit, 0 or null for "full-screen" snow effect
    this.followMouse = true;        // Snow movement can respond to the user's mouse
    this.snowColor = 'rgb(0, 4, 255)';        // Don't eat (or use?) yellow snow.
    this.snowCharacter = '&bull;';  // &bull; = bullet, &middot; is square on some systems etc.
    this.snowStick = true;          // Whether or not snow should "stick" at the bottom. When off, will never collect.
    this.targetElement = null;      // element which snow will be appended to (null = document.body) - can be an element ID eg. 'myDiv', or a DOM node reference
    this.useMeltEffect = true;      // When recycling fallen snow (or rarely, when falling), have it "melt" and fade out if browser supports it
    this.useTwinkleEffect = false;  // Allow snow to randomly "flicker" in and out of view while falling
    this.usePositionFixed = false;  // true = snow does not shift vertically when scrolling. May increase CPU load, disabled by default - if enabled, used only where supported
    this.usePixelPosition = false;  // Whether to use pixel values for snow top/left vs. percentages. Auto-enabled if body is position:relative or targetElement is specified.
    this.accessibility = true;      // Hide snow from screen readers
  
    // --- less-used bits ---
  
    this.freezeOnBlur = true;       // Only snow when the window is in focus (foreground.) Saves CPU.
    this.flakeLeftOffset = 0;       // Left margin/gutter space on edge of container (eg. browser window.) Bump up these values if seeing horizontal scrollbars.
    this.flakeRightOffset = 0;      // Right margin/gutter space on edge of container
    this.flakeWidth = 8;            // Max pixel width reserved for snow element
    this.flakeHeight = 8;           // Max pixel height reserved for snow element
    this.vMaxX = 5;                 // Maximum X velocity range for snow
    this.vMaxY = 4;                 // Maximum Y velocity range for snow
    this.zIndex = 0;                // CSS stacking order applied to each snowflake
  
    // --- "No user-serviceable parts inside" past this point, yadda yadda ---
  
    var storm = this,
    features,
    // UA sniffing and backCompat rendering mode checks for fixed position, etc.
    isIE = navigator.userAgent.match(/msie/i),
    isIE6 = navigator.userAgent.match(/msie 6/i),
    isMobile = navigator.userAgent.match(/mobile|opera m(ob|in)/i),
    isBackCompatIE = (isIE && document.compatMode === 'BackCompat'),
    noFixed = (isBackCompatIE || isIE6),
    screenX = null, screenX2 = null, screenY = null, scrollY = null, docHeight = null, vRndX = null, vRndY = null,
    windOffset = 1,
    windMultiplier = 2,
    flakeTypes = 6,
    fixedForEverything = false,
    targetElementIsRelative = false,
    opacitySupported = (function(){
      try {
        document.createElement('div').style.opacity = '0.5';
      } catch(e) {
        return false;
      }
      return true;
    }()),
    didInit = false,
    docFrag = document.createDocumentFragment();
  
    features = (function() {
  
      var getAnimationFrame;
  
      /**
       * hat tip: paul irish
       * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
       * https://gist.github.com/838785
       */
  
      function timeoutShim(callback) {
        window.setTimeout(callback, 1000/(storm.animationInterval || 20));
      }
  
      var _animationFrame = (window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          timeoutShim);
  
      // apply to window, avoid "illegal invocation" errors in Chrome
      getAnimationFrame = _animationFrame ? function() {
        return _animationFrame.apply(window, arguments);
      } : null;
  
      var testDiv;
  
      testDiv = document.createElement('div');
  
      function has(prop) {
  
        // test for feature support
        var result = testDiv.style[prop];
        return (result !== undefined ? prop : null);
  
      }
  
      // note local scope.
      var localFeatures = {
  
        transform: {
          ie:  has('-ms-transform'),
          moz: has('MozTransform'),
          opera: has('OTransform'),
          webkit: has('webkitTransform'),
          w3: has('transform'),
          prop: null // the normalized property value
        },
  
        getAnimationFrame: getAnimationFrame
  
      };
  
      localFeatures.transform.prop = (
        localFeatures.transform.w3 ||
        localFeatures.transform.moz ||
        localFeatures.transform.webkit ||
        localFeatures.transform.ie ||
        localFeatures.transform.opera
      );
  
      testDiv = null;
  
      return localFeatures;
  
    }());
  
    this.timer = null;
    this.flakes = [];
    this.disabled = false;
    this.active = false;
    this.meltFrameCount = 20;
    this.meltFrames = [];
  
    this.setXY = function(o, x, y) {
  
      if (!o) {
        return false;
      }
  
      if (storm.usePixelPosition || targetElementIsRelative) {
  
        o.style.left = (x - storm.flakeWidth) + 'px';
        o.style.top = (y - storm.flakeHeight) + 'px';
  
      } else if (noFixed) {
  
        o.style.right = (100-(x/screenX*100)) + '%';
        // avoid creating vertical scrollbars
        o.style.top = (Math.min(y, docHeight-storm.flakeHeight)) + 'px';
  
      } else {
  
        if (!storm.flakeBottom) {
  
          // if not using a fixed bottom coordinate...
          o.style.right = (100-(x/screenX*100)) + '%';
          o.style.bottom = (100-(y/screenY*100)) + '%';
  
        } else {
  
          // absolute top.
          o.style.right = (100-(x/screenX*100)) + '%';
          o.style.top = (Math.min(y, docHeight-storm.flakeHeight)) + 'px';
  
        }
  
      }
  
    };
  
    this.events = (function() {
  
      var old = (!window.addEventListener && window.attachEvent), slice = Array.prototype.slice,
      evt = {
        add: (old?'attachEvent':'addEventListener'),
        remove: (old?'detachEvent':'removeEventListener')
      };
  
      function getArgs(oArgs) {
        var args = slice.call(oArgs), len = args.length;
        if (old) {
          args[1] = 'on' + args[1]; // prefix
          if (len > 3) {
            args.pop(); // no capture
          }
        } else if (len === 3) {
          args.push(false);
        }
        return args;
      }
  
      function apply(args, sType) {
        var element = args.shift(),
            method = [evt[sType]];
        if (old) {
          element[method](args[0], args[1]);
        } else {
          element[method].apply(element, args);
        }
      }
  
      function addEvent() {
        apply(getArgs(arguments), 'add');
      }
  
      function removeEvent() {
        apply(getArgs(arguments), 'remove');
      }
  
      return {
        add: addEvent,
        remove: removeEvent
      };
  
    }());
  
    function rnd(n,min) {
      if (isNaN(min)) {
        min = 0;
      }
      return (Math.random()*n)+min;
    }
  
    function plusMinus(n) {
      return (parseInt(rnd(2),10)===1?n*-1:n);
    }
  
    this.randomizeWind = function() {
      var i;
      vRndX = plusMinus(rnd(storm.vMaxX,0.2));
      vRndY = rnd(storm.vMaxY,0.2);
      if (this.flakes) {
        for (i=0; i<this.flakes.length; i++) {
          if (this.flakes[i].active) {
            this.flakes[i].setVelocities();
          }
        }
      }
    };
  
    this.scrollHandler = function() {
      var i;
      // "attach" snowflakes to bottom of window if no absolute bottom value was given
      scrollY = (storm.flakeBottom ? 0 : parseInt(window.scrollY || document.documentElement.scrollTop || (noFixed ? document.body.scrollTop : 0), 10));
      if (isNaN(scrollY)) {
        scrollY = 0; // Netscape 6 scroll fix
      }
      if (!fixedForEverything && !storm.flakeBottom && storm.flakes) {
        for (i=0; i<storm.flakes.length; i++) {
          if (storm.flakes[i].active === 0) {
            storm.flakes[i].stick();
          }
        }
      }
    };
  
    this.resizeHandler = function() {
      if (window.innerWidth || window.innerHeight) {
        screenX = window.innerWidth - 16 - storm.flakeRightOffset;
        screenY = (storm.flakeBottom || window.innerHeight);
      } else {
        screenX = (document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth) - (!isIE ? 8 : 0) - storm.flakeRightOffset;
        screenY = storm.flakeBottom || document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight;
      }
      docHeight = document.body.offsetHeight;
      screenX2 = parseInt(screenX/2,10);
    };
  
    this.resizeHandlerAlt = function() {
      screenX = storm.targetElement.offsetWidth - storm.flakeRightOffset;
      screenY = storm.flakeBottom || storm.targetElement.offsetHeight;
      screenX2 = parseInt(screenX/2,10);
      docHeight = document.body.offsetHeight;
    };
  
    this.freeze = function() {
      // pause animation
      if (!storm.disabled) {
        storm.disabled = 1;
      } else {
        return false;
      }
      storm.timer = null;
    };
  
    this.resume = function() {
      if (storm.disabled) {
         storm.disabled = 0;
      } else {
        return false;
      }
      storm.timerInit();
    };
  
    this.toggleSnow = function() {
      if (!storm.flakes.length) {
        // first run
        storm.start();
      } else {
        storm.active = !storm.active;
        if (storm.active) {
          storm.show();
          storm.resume();
        } else {
          storm.stop();
          storm.freeze();
        }
      }
    };
  
    this.stop = function() {
      var i;
      this.freeze();
      for (i=0; i<this.flakes.length; i++) {
        this.flakes[i].o.style.display = 'none';
      }
      storm.events.remove(window,'scroll',storm.scrollHandler);
      storm.events.remove(window,'resize',storm.resizeHandler);
      if (storm.freezeOnBlur) {
        if (isIE) {
          storm.events.remove(document,'focusout',storm.freeze);
          storm.events.remove(document,'focusin',storm.resume);
        } else {
          storm.events.remove(window,'blur',storm.freeze);
          storm.events.remove(window,'focus',storm.resume);
        }
      }
    };
  
    this.show = function() {
      var i;
      for (i=0; i<this.flakes.length; i++) {
        this.flakes[i].o.style.display = 'block';
      }
    };
  
    this.SnowFlake = function(type,x,y) {
      var s = this;
      this.type = type;
      this.x = x||parseInt(rnd(screenX-20),10);
      this.y = (!isNaN(y)?y:-rnd(screenY)-12);
      this.vX = null;
      this.vY = null;
      this.vAmpTypes = [1,1.2,1.4,1.6,1.8]; // "amplification" for vX/vY (based on flake size/type)
      this.vAmp = this.vAmpTypes[this.type] || 1;
      this.melting = false;
      this.meltFrameCount = storm.meltFrameCount;
      this.meltFrames = storm.meltFrames;
      this.meltFrame = 0;
      this.twinkleFrame = 0;
      this.active = 1;
      this.fontSize = (10+(this.type/5)*10);
      this.o = document.createElement('div');
      this.o.innerHTML = storm.snowCharacter;
      if (storm.className) {
        this.o.setAttribute('class', storm.className);
      }
      this.o.style.color = storm.snowColor;
      this.o.style.position = (fixedForEverything?'fixed':'absolute');
      if (storm.useGPU && features.transform.prop) {
        // GPU-accelerated snow.
        this.o.style[features.transform.prop] = 'translate3d(0px, 0px, 0px)';
      }
      this.o.style.width = storm.flakeWidth+'px';
      this.o.style.height = storm.flakeHeight+'px';
      this.o.style.fontFamily = 'arial,verdana';
      this.o.style.cursor = 'default';
      this.o.style.overflow = 'hidden';
      this.o.style.fontWeight = 'normal';
      this.o.style.zIndex = storm.zIndex;
      if (storm.accessibility) {
        this.o.setAttribute('aria-hidden', storm.accessibility);
      }
      docFrag.appendChild(this.o);
  
      this.refresh = function() {
        if (isNaN(s.x) || isNaN(s.y)) {
          // safety check
          return false;
        }
        storm.setXY(s.o, s.x, s.y);
      };
  
      this.stick = function() {
        if (noFixed || (storm.targetElement !== document.documentElement && storm.targetElement !== document.body)) {
          s.o.style.top = (screenY+scrollY-storm.flakeHeight)+'px';
        } else if (storm.flakeBottom) {
          s.o.style.top = storm.flakeBottom+'px';
        } else {
          s.o.style.display = 'none';
          s.o.style.top = 'auto';
          s.o.style.bottom = '0%';
          s.o.style.position = 'fixed';
          s.o.style.display = 'block';
        }
      };
  
      this.vCheck = function() {
        if (s.vX>=0 && s.vX<0.2) {
          s.vX = 0.2;
        } else if (s.vX<0 && s.vX>-0.2) {
          s.vX = -0.2;
        }
        if (s.vY>=0 && s.vY<0.2) {
          s.vY = 0.2;
        }
      };
  
      this.move = function() {
        var vX = s.vX*windOffset, yDiff;
        s.x += vX;
        s.y += (s.vY*s.vAmp);
        if (s.x >= screenX || screenX-s.x < storm.flakeWidth) { // X-axis scroll check
          s.x = 0;
        } else if (vX < 0 && s.x-storm.flakeLeftOffset < -storm.flakeWidth) {
          s.x = screenX-storm.flakeWidth-1; // flakeWidth;
        }
        s.refresh();
        yDiff = screenY+scrollY-s.y+storm.flakeHeight;
        if (yDiff<storm.flakeHeight) {
          s.active = 0;
          if (storm.snowStick) {
            s.stick();
          } else {
            s.recycle();
          }
        } else {
          if (storm.useMeltEffect && s.active && s.type < 3 && !s.melting && Math.random()>0.998) {
            // ~1/1000 chance of melting mid-air, with each frame
            s.melting = true;
            s.melt();
            // only incrementally melt one frame
            // s.melting = false;
          }
          if (storm.useTwinkleEffect) {
            if (s.twinkleFrame < 0) {
              if (Math.random() > 0.97) {
                s.twinkleFrame = parseInt(Math.random() * 8, 10);
              }
            } else {
              s.twinkleFrame--;
              if (!opacitySupported) {
                s.o.style.visibility = (s.twinkleFrame && s.twinkleFrame % 2 === 0 ? 'hidden' : 'visible');
              } else {
                s.o.style.opacity = (s.twinkleFrame && s.twinkleFrame % 2 === 0 ? 0 : 1);
              }
            }
          }
        }
      };
  
      this.animate = function() {
        // main animation loop
        // move, check status, die etc.
        s.move();
      };
  
      this.setVelocities = function() {
        s.vX = vRndX+rnd(storm.vMaxX*0.12,0.1);
        s.vY = vRndY+rnd(storm.vMaxY*0.12,0.1);
      };
  
      this.setOpacity = function(o,opacity) {
        if (!opacitySupported) {
          return false;
        }
        o.style.opacity = opacity;
      };
  
      this.melt = function() {
        if (!storm.useMeltEffect || !s.melting) {
          s.recycle();
        } else {
          if (s.meltFrame < s.meltFrameCount) {
            s.setOpacity(s.o,s.meltFrames[s.meltFrame]);
            s.o.style.fontSize = s.fontSize-(s.fontSize*(s.meltFrame/s.meltFrameCount))+'px';
            s.o.style.lineHeight = storm.flakeHeight+2+(storm.flakeHeight*0.75*(s.meltFrame/s.meltFrameCount))+'px';
            s.meltFrame++;
          } else {
            s.recycle();
          }
        }
      };
  
      this.recycle = function() {
        s.o.style.display = 'none';
        s.o.style.position = (fixedForEverything?'fixed':'absolute');
        s.o.style.bottom = 'auto';
        s.setVelocities();
        s.vCheck();
        s.meltFrame = 0;
        s.melting = false;
        s.setOpacity(s.o,1);
        s.o.style.padding = '0px';
        s.o.style.margin = '0px';
        s.o.style.fontSize = s.fontSize+'px';
        s.o.style.lineHeight = (storm.flakeHeight+2)+'px';
        s.o.style.textAlign = 'center';
        s.o.style.verticalAlign = 'baseline';
        s.x = parseInt(rnd(screenX-storm.flakeWidth-20),10);
        s.y = parseInt(rnd(screenY)*-1,10)-storm.flakeHeight;
        s.refresh();
        s.o.style.display = 'block';
        s.active = 1;
      };
  
      this.recycle(); // set up x/y coords etc.
      this.refresh();
  
    };
  
    this.snow = function() {
      var active = 0, flake = null, i, j;
      for (i=0, j=storm.flakes.length; i<j; i++) {
        if (storm.flakes[i].active === 1) {
          storm.flakes[i].move();
          active++;
        }
        if (storm.flakes[i].melting) {
          storm.flakes[i].melt();
        }
      }
      if (active<storm.flakesMaxActive) {
        flake = storm.flakes[parseInt(rnd(storm.flakes.length),10)];
        if (flake.active === 0) {
          flake.melting = true;
        }
      }
      if (storm.timer) {
        features.getAnimationFrame(storm.snow);
      }
    };
  
    this.mouseMove = function(e) {
      if (!storm.followMouse) {
        return true;
      }
      var x = parseInt(e.clientX,10);
      if (x<screenX2) {
        windOffset = -windMultiplier+(x/screenX2*windMultiplier);
      } else {
        x -= screenX2;
        windOffset = (x/screenX2)*windMultiplier;
      }
    };
  
    this.createSnow = function(limit,allowInactive) {
      var i;
      for (i=0; i<limit; i++) {
        storm.flakes[storm.flakes.length] = new storm.SnowFlake(parseInt(rnd(flakeTypes),10));
        if (allowInactive || i>storm.flakesMaxActive) {
          storm.flakes[storm.flakes.length-1].active = -1;
        }
      }
      storm.targetElement.appendChild(docFrag);
    };
  
    this.timerInit = function() {
      storm.timer = true;
      storm.snow();
    };
  
    this.init = function() {
      var i;
      for (i=0; i<storm.meltFrameCount; i++) {
        storm.meltFrames.push(1-(i/storm.meltFrameCount));
      }
      storm.randomizeWind();
      storm.createSnow(storm.flakesMax); // create initial batch
      storm.events.add(window,'resize',storm.resizeHandler);
      storm.events.add(window,'scroll',storm.scrollHandler);
      if (storm.freezeOnBlur) {
        if (isIE) {
          storm.events.add(document,'focusout',storm.freeze);
          storm.events.add(document,'focusin',storm.resume);
        } else {
          storm.events.add(window,'blur',storm.freeze);
          storm.events.add(window,'focus',storm.resume);
        }
      }
      storm.resizeHandler();
      storm.scrollHandler();
      if (storm.followMouse) {
        storm.events.add(isIE?document:window,'mousemove',storm.mouseMove);
      }
      storm.animationInterval = Math.max(20,storm.animationInterval);
      storm.timerInit();
    };
  
    this.start = function(bFromOnLoad) {
      if (!didInit) {
        didInit = true;
      } else if (bFromOnLoad) {
        // already loaded and running
        return true;
      }
      if (typeof storm.targetElement === 'string') {
        var targetID = storm.targetElement;
        storm.targetElement = document.getElementById(targetID);
        if (!storm.targetElement) {
          throw new Error('Snowstorm: Unable to get targetElement "'+targetID+'"');
        }
      }
      if (!storm.targetElement) {
        storm.targetElement = (document.body || document.documentElement);
      }
      if (storm.targetElement !== document.documentElement && storm.targetElement !== document.body) {
        // re-map handler to get element instead of screen dimensions
        storm.resizeHandler = storm.resizeHandlerAlt;
        //and force-enable pixel positioning
        storm.usePixelPosition = true;
      }
      storm.resizeHandler(); // get bounding box elements
      storm.usePositionFixed = (storm.usePositionFixed && !noFixed && !storm.flakeBottom); // whether or not position:fixed is to be used
      if (window.getComputedStyle) {
        // attempt to determine if body or user-specified snow parent element is relatlively-positioned.
        try {
          targetElementIsRelative = (window.getComputedStyle(storm.targetElement, null).getPropertyValue('position') === 'relative');
        } catch(e) {
          // oh well
          targetElementIsRelative = false;
        }
      }
      fixedForEverything = storm.usePositionFixed;
      if (screenX && screenY && !storm.disabled) {
        storm.init();
        storm.active = true;
      }
    };
  
    function doDelayedStart() {
      window.setTimeout(function() {
        storm.start(true);
      }, 20);
      // event cleanup
      storm.events.remove(isIE?document:window,'mousemove',doDelayedStart);
    }
  
    function doStart() {
      if (!storm.excludeMobile || !isMobile) {
        doDelayedStart();
      }
      // event cleanup
      storm.events.remove(window, 'load', doStart);
    }
  
    // hooks for starting the snow
    if (storm.autoStart) {
      storm.events.add(window, 'load', doStart, false);
    }
  
    return this;
  
  }(window, document));

const colour = "red";
const sparkles = 50;

/****************************
 *  Tinkerbell Magic Sparkle *
 *(c)2005-13 mf2fm web-design*
 *  http://www.mf2fm.com/rv  *
 * DON'T EDIT BELOW THIS BOX *
 ****************************/
let x = ox = 400;
let y = oy = 300;
let swide = 800;
let shigh = 600;
let sleft = sdown = 0;
const tiny = [];
const star = [];
const starv = [];
const starx = [];
const stary = [];
const tinyx = [];
const tinyy = [];
const tinyv = [];

window.onload = function () {
    if (document.getElementById) {
        let i, rats, rlef, rdow;
        for (i = 0; i < sparkles; i++) {
            rats = createDiv(3, 3);
            rats.style.visibility = "hidden";
            rats.style.zIndex = "999";
            document.body.appendChild(tiny[i] = rats);
            starv[i] = 0;
            tinyv[i] = 0;
            rats = createDiv(5, 5);
            rats.style.backgroundColor = "transparent";
            rats.style.visibility = "hidden";
            rats.style.zIndex = "999";
            rlef = createDiv(1, 5);
            rdow = createDiv(5, 1);
            rats.appendChild(rlef);
            rats.appendChild(rdow);
            rlef.style.top = "2px";
            rlef.style.left = "0px";
            rdow.style.top = "0px";
            rdow.style.left = "2px";
            document.body.appendChild(star[i] = rats);
        }
        set_width();
        sparkle();
    }
}

function sparkle() {
    let c;
    if (Math.abs(x - ox) > 1 || Math.abs(y - oy) > 1) {
        ox = x;
        oy = y;
        for (c = 0; c < sparkles; c++) if (!starv[c]) {
            star[c].style.left = (starx[c] = x) + "px";
            star[c].style.top = (stary[c] = y + 1) + "px";
            star[c].style.clipPath = "rect(0px, 5px, 5px, 0px)";
            star[c].childNodes[0].style.backgroundColor = star[c].childNodes[1].style.backgroundColor = (colour === "random") ? newColour() : colour;
            star[c].style.visibility = "visible";
            starv[c] = 50;
            break;
        }
    }
    for (c = 0; c < sparkles; c++) {
        if (starv[c]) update_star(c);
        if (tinyv[c]) update_tiny(c);
    }
    setTimeout("sparkle()", 40);
}

function update_star(i) {
    if (--starv[i] === 25) star[i].style.clipPath = "rect(1px, 4px, 4px, 1px)";
    if (starv[i]) {
        stary[i] += 1 + Math.random() * 3;
        starx[i] += (i % 5 - 2) / 5;
        if (stary[i] < shigh + sdown) {
            star[i].style.top = stary[i] + "px";
            star[i].style.left = starx[i] + "px";
        } else {
            star[i].style.visibility = "hidden";
            starv[i] = 0;

        }
    } else {
        tinyv[i] = 50;
        tiny[i].style.top = (tinyy[i] = stary[i]) + "px";
        tiny[i].style.left = (tinyx[i] = starx[i]) + "px";
        tiny[i].style.width = "2px";
        tiny[i].style.height = "2px";
        tiny[i].style.backgroundColor = star[i].childNodes[0].style.backgroundColor;
        star[i].style.visibility = "hidden";
        tiny[i].style.visibility = "visible"
    }
}

function update_tiny(i) {
    if (--tinyv[i] === 25) {
        tiny[i].style.width = "1px";
        tiny[i].style.height = "1px";
    }
    if (tinyv[i]) {
        tinyy[i] += 1 + Math.random() * 3;
        tinyx[i] += (i % 5 - 2) / 5;
        if (tinyy[i] < shigh + sdown) {
            tiny[i].style.top = tinyy[i] + "px";
            tiny[i].style.left = tinyx[i] + "px";
        } else {
            tiny[i].style.visibility = "hidden";
            tinyv[i] = 0;

        }
    } else tiny[i].style.visibility = "hidden";
}

document.addEventListener("mousemove", mouse);

function mouse(e) {
    if (e) {
        y = e.pageY;
        x = e.pageX;
    }
}

window.addEventListener("scroll", set_scroll);

function set_scroll() {
    if (typeof (self.pageYOffset) == 'number') {
        sdown = self.pageYOffset;
        sleft = self.pageXOffset;
    } else if (document.body && (document.body.scrollTop || document.body.scrollLeft)) {
        sdown = document.body.scrollTop;
        sleft = document.body.scrollLeft;
    } else if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
        sleft = document.documentElement.scrollLeft;
        sdown = document.documentElement.scrollTop;
    } else {
        sdown = 0;
        sleft = 0;
    }
}

window.addEventListener("resize", set_width);

function set_width() {
    let sw_min = 999999;
    let sh_min = 999999;
    if (document.documentElement && document.documentElement.clientWidth) {
        if (document.documentElement.clientWidth > 0) sw_min = document.documentElement.clientWidth;
        if (document.documentElement.clientHeight > 0) sh_min = document.documentElement.clientHeight;
    }
    if (typeof (self.innerWidth) == 'number' && self.innerWidth) {
        if (self.innerWidth > 0 && self.innerWidth < sw_min) sw_min = self.innerWidth;
        if (self.innerHeight > 0 && self.innerHeight < sh_min) sh_min = self.innerHeight;
    }
    if (document.body.clientWidth) {
        if (document.body.clientWidth > 0 && document.body.clientWidth < sw_min) sw_min = document.body.clientWidth;
        if (document.body.clientHeight > 0 && document.body.clientHeight < sh_min) sh_min = document.body.clientHeight;
    }
    if (sw_min === 999999 || sh_min === 999999) {
        sw_min = 800;
        sh_min = 600;
    }
    swide = sw_min;
    shigh = sh_min;
}

function createDiv(height, width) {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.height = height + "px";
    div.style.width = width + "px";
    div.style.overflow = "hidden";
    return (div);
}

function newColour() {
    const c = [];
    c[0] = 255;
    c[1] = Math.floor(Math.random() * 256);
    c[2] = Math.floor(Math.random() * (256 - c[1] / 2));
    c.sort(function () {
        return (0.5 - Math.random());
    });
    return ("rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")");
}
