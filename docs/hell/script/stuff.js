document.addEventListener('DOMContentLoaded', function() {
    let currentMember = null;
    let audioPlayer = document.getElementById('audio-player');

const songs = [
    'assets/song1.mp3', // 0
    'assets/hellsing.mp3', // 1
    'assets/angeldust.mp3', // 2
    'assets/song4.mp3',  // 3
    'assets/fff.mp3',   // 4
    'assets/song8.mp3', // 5
    'assets/swipe_cards.mp3', // 6
    'assets/god.mp3', // 7
    'assets/g0re.mp3', // 8
    'assets/penis.mp3',// 9
    'assets/life.mp3',// 10
    'assets/main.mp3' // 11
];

function showMember(member) {
    const memberInfo = {
        'Lte': { 'name': 'Lte', 'image': 'assets/DDDD.jpg', 'description': 'tattooed in reverse', 'songIndex': 4 },
        'Claudia': { 'name': 'Claudia', 'image': 'assets/claud.png', 'description': 'o_O', 'songIndex': 1 },
        'Viscount': { 'name': 'Viscount', 'image': 'assets/vis.jpg', 'description': 'Uh..', 'songIndex': 3 },
        'CEO': { 'name': 'CEO', 'image': 'assets/ceo.png', 'description': 'love miracle', 'songIndex': 0 },
        'Romance': { 'name': 'Romance', 'image': 'assets/romancee.gif', 'description': 'Love is just a dream', 'songIndex': 2 },
        'Miserable': { 'name': 'Miserable', 'image': 'assets/miserable1.jpg', 'description': 'xman', 'songIndex': 5 }, 
        'Hardline': { 'name': 'Hardline', 'image': 'assets/Hardline.jpg', 'description': 'Point the camera on me, but you won’t see the face', 'songIndex': 6 }, 
        'Pie': { 'name': 'Pierce', 'image': 'assets/pie.png', 'description': 'Pierce-Chan', 'songIndex': 7 }, 
        'Gore': { 'name': 'Gore', 'image': 'assets/poc.jpg', 'description': '', 'songIndex': 8 }, 
        'Luci': { 'name': 'Luci', 'image': 'assets/word.jpg', 'description': '', 'songIndex': 10},
        'Kalash': { 'name': 'Kalashnikov', 'image': 'assets/kalash.jpg', 'description': 'humanitys last breath', 'songIndex': 9 } 
    };
 const hardcodedVolume = 0.2; 
    if (audioPlayer) {
        audioPlayer.volume = hardcodedVolume; 
    }
        const info = memberInfo[member];
        if (!info) return;

        const memberDiv = document.getElementById('member-info');
        const selectedElement = document.querySelector(`[onclick="showMember('${member}')"]`);

        if (currentMember) {
            currentMember.classList.remove('selected');
            const previousDot = document.getElementById(`${currentMember.getAttribute('data-member')}-dot`);
            if (previousDot) previousDot.innerHTML = '::';
            stopMusic();
        }

        if (currentMember === selectedElement) {
            currentMember = null;
            memberDiv.innerHTML = '';
            playDefaultSong();
            return;
        }

        if (selectedElement) {
            selectedElement.classList.add('selected');
            selectedElement.setAttribute('data-member', member);
        } else {
            console.warn('Selected element not found for member:', member);
            return;
        }

        document.querySelectorAll('.yellow').forEach(dot => {
            dot.innerHTML = '::';
        });

        const currentDot = document.getElementById(`${member}-dot`);
        if (currentDot) {
            currentDot.innerHTML = '<span style="color: #8a0000; margin-top: -2px;">&bull;</span>';
        }

memberDiv.innerHTML = `
    <img src="${info.image}" class="fade-in" style="width: 120px; height: 120px;" draggable="false">
    <p style="margin-top: 5px; margin-bottom: 0; color: #b90000;">[ ${info.name} ]</p>
    <hr style="border-top: 1px solid #b90000; margin: 3px 0;">
    <p class="glitch" style="margin-top: 5px;">${info.description}</p>
`;


        changeSong(info.songIndex);

        currentMember = selectedElement;
    }

    function playDefaultSong() {
        const defaultSongIndex = songs.length - 1;
        changeSong(defaultSongIndex);
    }

    function changeSong(songIndex) {
        if (!audioPlayer) {
            console.error('Audio player element not found');
            return;
        }

        const songPath = songs[songIndex] || songs[songs.length - 1];
        audioPlayer.src = songPath;
        audioPlayer.play().catch(error => {
            console.error('Error playing song:', error);
        });
    }

    function stopMusic() {
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }
    }

    function removeOverlay() {
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.style.display = 'none';
            playDefaultSong();
        }
    }

    window.showMember = showMember;
    window.removeOverlay = removeOverlay;
});
        $(document).ready(function () {
            const audio = document.getElementById('audioPlayer');
            const playPauseBtn = document.getElementById('playPauseBtn');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const volumeSlider = document.getElementById('volumeSlider');
            const kSec = document.getElementById('kSec');
            const currentTimeEl = document.getElementById('currentTime');
            const totalTimeEl = document.getElementById('totalTime');
            const splashScreen = document.getElementById('splashScreen');
            const userLocation = document.getElementById('userLocation');

    // Songs list
    const songs = [
        {
            name: "Sad.mp3",
            url: "https://r2.interrupted.me/107/youtube-kawaoorptdg-audio-1.mp3"
        },
        {
            name: "Realize.mp3",
            url: "https://r2.interrupted.me/107/youtube-imrcalyxoq0-audio.mp3"
        },
        {
            name: "Bloody4s.mp3",
            url: "https://r2.interrupted.me/107/youtube-rn4wqbmaxau-audio.mp3"
        },
        {
            name: "187Killa.mp3",
            url: "https://r2.interrupted.me/107/youtube-yiqvdqryt1m-audio.mp3"
        },
        {
            name: "Addict.mp3",
            url: "https://r2.interrupted.me/107/youtube-iugb8jnuu2a-audio.mp3"
        }
    ];
// You can repalce these songs btw
            let currentSongIndex = 0;

            // Load the current song
            function loadSong(song) {
                audio.src = song.url;
                document.getElementById('songName').textContent = "Currently Playing: " + song.name;
                audio.play();
                playPauseBtn.innerHTML = '<i class="ri-pause-fill"></i>';
            }

            // Load initial song
            loadSong(songs[currentSongIndex]);

            // Play/Pause functionality
            playPauseBtn.addEventListener('click', function () {
                if (audio.paused) {
                    audio.play();
                    playPauseBtn.innerHTML = '<i class="ri-pause-fill"></i>';
                } else {
                    audio.pause();
                    playPauseBtn.innerHTML = '<i class="ri-play-fill"></i>';
                }
            });

            // Previous song
            prevBtn.addEventListener('click', function () {
                currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
                loadSong(songs[currentSongIndex]);
            });

            // Next song
            nextBtn.addEventListener('click', function () {
                currentSongIndex = (currentSongIndex + 1) % songs.length;
                loadSong(songs[currentSongIndex]);
            });

            // Volume control functionality
            volumeSlider.addEventListener('input', function () {
                audio.volume = volumeSlider.value;
            });

            // Update time display
            audio.addEventListener('timeupdate', function () {
                const currentTime = Math.floor(audio.currentTime);
                const totalTime = Math.floor(audio.duration);

                currentTimeEl.textContent = formatTime(currentTime);
                totalTimeEl.textContent = formatTime(totalTime);
            });

            // Format time to mm:ss
            function formatTime(seconds) {
                const minutes = Math.floor(seconds / 60);
                const secs = seconds % 60;
                return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }

            // Fetch user's IP and display it
            $.getJSON('https://api.ipify.org?format=json', function (data) {
                userLocation.textContent = 'Your IP: ' + data.ip;
                splashScreen.addEventListener('click', function () {
                    audio.play();
                    splashScreen.style.opacity = 0;
                    setTimeout(() => {
                        splashScreen.style.display = 'none';
                    }, 1000); // Time to allow opacity transition
                });
            });
        });
var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

var colour="white";
		var sparkles=50;
		var x=ox=400;
		var y=oy=300;
		var swide=800;
		var shigh=600;
		var sleft=sdown=0;
		var tiny=new Array();
		var star=new Array();
		var starv=new Array();
		var starx=new Array();
		var stary=new Array();
		var tinyx=new Array();
		var tinyy=new Array();
		var tinyv=new Array();
		window.onload=function() { if (document.getElementById) {
		  var i, rats, rlef, rdow;
		  for (var i=0; i<sparkles; i++) {
		    var rats=createDiv(3, 3);
		    rats.style.visibility="hidden";
		    rats.style.zIndex="999";
		    document.body.appendChild(tiny[i]=rats);
		    starv[i]=0;
		    tinyv[i]=0;
		    var rats=createDiv(5, 5);
		    rats.style.backgroundColor="transparent";
		    rats.style.visibility="hidden";
		    rats.style.zIndex="999";
		    var rlef=createDiv(1, 5);
		    var rdow=createDiv(5, 1);
		    rats.appendChild(rlef);
		    rats.appendChild(rdow);
		    rlef.style.top="2px";
		    rlef.style.left="0px";
		    rdow.style.top="0px";
		    rdow.style.left="2px";
		    document.body.appendChild(star[i]=rats);
		  }
		  set_width();
		  sparkle();
		}}
		function sparkle() {
		  var c;
		  if (Math.abs(x-ox)>1 || Math.abs(y-oy)>1) {
		    ox=x;
		    oy=y;
		    for (c=0; c<sparkles; c++) if (!starv[c]) {
		      star[c].style.left=(starx[c]=x)+"px";
		      star[c].style.top=(stary[c]=y+1)+"px";
		      star[c].style.clip="rect(0px, 5px, 5px, 0px)";
		      star[c].childNodes[0].style.backgroundColor=star[c].childNodes[1].style.backgroundColor=(colour=="random")?newColour():colour;
		      star[c].style.visibility="visible";
		      starv[c]=50;
		      break;
		    }
		  }
		  for (c=0; c<sparkles; c++) {
		    if (starv[c]) update_star(c);
		    if (tinyv[c]) update_tiny(c);
		  }
		  setTimeout("sparkle()", 40);
		}

		function update_star(i) {
		  if (--starv[i]==25) star[i].style.clip="rect(1px, 4px, 4px, 1px)";
		  if (starv[i]) {
		    stary[i]+=1+Math.random()*3;
		    starx[i]+=(i%5-2)/5;
		    if (stary[i]<shigh+sdown) {
		      star[i].style.top=stary[i]+"px";
		      star[i].style.left=starx[i]+"px";
		    }
		    else {
		      star[i].style.visibility="hidden";
		      starv[i]=0;
		      return;
		    }
		  }
		  else {
		    tinyv[i]=50;
		    tiny[i].style.top=(tinyy[i]=stary[i])+"px";
		    tiny[i].style.left=(tinyx[i]=starx[i])+"px";
		    tiny[i].style.width="2px";
		    tiny[i].style.height="2px";
		    tiny[i].style.backgroundColor=star[i].childNodes[0].style.backgroundColor;
		    star[i].style.visibility="hidden";
		    tiny[i].style.visibility="visible"
		  }
		}
		function update_tiny(i) {
		  if (--tinyv[i]==25) {
		    tiny[i].style.width="1px";
		    tiny[i].style.height="1px";
		  }
		  if (tinyv[i]) {
		    tinyy[i]+=1+Math.random()*3;
		    tinyx[i]+=(i%5-2)/5;
		    if (tinyy[i]<shigh+sdown) {
		      tiny[i].style.top=tinyy[i]+"px";
		      tiny[i].style.left=tinyx[i]+"px";
		    }
		    else {
		      tiny[i].style.visibility="hidden";
		      tinyv[i]=0;
		      return;
		    }
		  }
		  else tiny[i].style.visibility="hidden";
		}
		document.onmousemove=mouse;
		function mouse(e) {
		  if (e) {
		    y=e.pageY;
		    x=e.pageX;
		  }
		  else {
		    set_scroll();
		    y=event.y+sdown;
		    x=event.x+sleft;
		  }
		}
		window.onscroll=set_scroll;
		function set_scroll() {
		  if (typeof(self.pageYOffset)=='number') {
		    sdown=self.pageYOffset;
		    sleft=self.pageXOffset;
		  }
		  else if (document.body && (document.body.scrollTop || document.body.scrollLeft)) {
		    sdown=document.body.scrollTop;
		    sleft=document.body.scrollLeft;
		  }
		  else if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
		    sleft=document.documentElement.scrollLeft;
		    sdown=document.documentElement.scrollTop;
		  }
		  else {
		    sdown=0;
		    sleft=0;
		  }
		}
		window.onresize=set_width;
		function set_width() {
		  var sw_min=999999;
		  var sh_min=999999;
		  if (document.documentElement && document.documentElement.clientWidth) {
		    if (document.documentElement.clientWidth>0) sw_min=document.documentElement.clientWidth;
		    if (document.documentElement.clientHeight>0) sh_min=document.documentElement.clientHeight;
		  }
		  if (typeof(self.innerWidth)=='number' && self.innerWidth) {
		    if (self.innerWidth>0 && self.innerWidth<sw_min) sw_min=self.innerWidth;
		    if (self.innerHeight>0 && self.innerHeight<sh_min) sh_min=self.innerHeight;
		  }
		  if (document.body.clientWidth) {
		    if (document.body.clientWidth>0 && document.body.clientWidth<sw_min) sw_min=document.body.clientWidth;
		    if (document.body.clientHeight>0 && document.body.clientHeight<sh_min) sh_min=document.body.clientHeight;
		  }
		  if (sw_min==999999 || sh_min==999999) {
		    sw_min=800;
		    sh_min=600;
		  }
		  swide=sw_min;
		  shigh=sh_min;
		}
		function createDiv(height, width) {
		  var div=document.createElement("div");
		  div.style.position="absolute";
		  div.style.height=height+"px";
		  div.style.width=width+"px";
		  div.style.overflow="hidden";
		  return (div);
		}
		function newColour() {
		  var c=new Array();
		  c[0]=255;
		  c[1]=Math.floor(Math.random()*256);
		  c[2]=Math.floor(Math.random()*(256-c[1]/2));
		  c.sort(function(){return (0.5 - Math.random());});
		  return ("rgb("+c[0]+", "+c[1]+", "+c[2]+")");
		}

}
