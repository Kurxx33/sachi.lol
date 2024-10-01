setTimeout(function() {
    document.getElementById('loading').style.display = 'none';
  }, 2000);

 

  window.addEventListener("load", () => {
    setTimeout(function () {
      indefiniteWrite();
    }, 0);
  });
  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function () {
      loaded();
    });
  } else {
    if (document.attachEvent) {
      document.attachEvent("onreadystatechange", function () {
        loaded();
      });
    }
  }
  function loaded() {
    setInterval(loop, 350);
  }
  var x = 0;
  var titleText = ["g", "go", "god", "godc", "godca", "godcap", "https://t.me/g0dcap", "g0dcap@jabber.cz", "A", "AH", "AHM", "AHME", "AHMET", "AHMET Y", "AHMET YI",  "AHMET YIL", "AHMET YILD", "AHMET YILDI", "AHMET YILDIZ"];
  function loop() {
    document.getElementsByTagName("title")[0].innerHTML = titleText[x++ % titleText.length];
  }
   
  function indefiniteWrite() {
    let _0x9ac0x8 = ["GOTTGLEICH", "MACHER", "SKYPE PROFI", "GODLIKE", "LEGO BUILDER #1"];
    var _0x9ac0x9 = Math.floor(Math.random() * Math.floor(_0x9ac0x8.length));
    let _0x9ac0xa = _0x9ac0x8[_0x9ac0x9];
    var _0x9ac0xb = document.getElementById("quotes");
    var _0x9ac0xc = new Typewriter(quotes, {loop: true});
    _0x9ac0xc.typeString(_0x9ac0xa).pauseFor(1e3).deleteAll().pauseFor(100).callFunction(() => {
      _0x9ac0xc.stop();
      indefiniteWrite();
    }).start();
  }
  
