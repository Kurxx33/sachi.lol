function init404Page() {
    var currentPath = window.location.pathname;

    var pathElement = document.getElementById('wrongPath');
    if (pathElement) {
        pathElement.textContent = currentPath;
    }
}

window.onload = function() {
    init404Page();
};
