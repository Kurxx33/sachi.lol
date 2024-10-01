document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey && (e.key === 's' || e.key === 'S')) || 
        (e.ctrlKey && (e.key === 'u' || e.key === 'U')) || 
        (e.ctrlKey && (e.key === 'p' || e.key === 'P'))) {
        e.preventDefault();
    }
});

document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});

const sparklesEnabled = true;
const sparkles = 250;
const sparkleLifetime = 30;
const sparkleDistance = 30;
const stars = [];
const tinies = [];
const docHeight = document.documentElement.scrollHeight;
const docWidth = document.documentElement.scrollWidth;

window.onload = () => {
    initSparkles();
    if (sparklesEnabled) {
        animateSparkles();
    }

    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && ['s', 'S', 'u', 'U', 'p', 'P'].includes(e.key)) {
            e.preventDefault();
        }
    });
    document.addEventListener('selectstart', e => e.preventDefault());
};
