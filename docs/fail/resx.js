document.addEventListener("DOMContentLoaded", function () {

    const x = document.getElementById("enter");

    function xx() {
        document.fullscreenElement ? document.xxx && document.xxx() : document.documentElement.requestFullscreen();
    }

    x.addEventListener("click", xx);

    const body = document.getElementsByTagName("body")[0];

    window.addEventListener("keydown", (e) => {
        if (e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case "s":
                    e.preventDefault();
                    window.location.href = "https://bloody.bio/consist";
                    break;
                case "c":
                    e.preventDefault();
                    window.location.href = "https://bloody.bio/consist";
                    break;
                case "e":
                    e.preventDefault();
                    window.location.href = "https://bloody.bio/consist";
                    break;
                case "u":
                    e.preventDefault();
                    window.location.href = "https://bloody.bio/consist";
                    break;
            }
        }
    });

    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });
});

document.addEventListener("DOMContentLoaded", function () {

    var options = {
        strings: ["creator @ fraud.gay", "cudi my righthand", "beloved  paster", "@adopters", "@backfilled"],
        typeSpeed: 45,
        backSpeed: 35,
        backDelay: 500,
        startDelay: 500,
        loop: true,
        showCursor: false 
    };
    
    var typed = new Typed(".description", options);
    
});
