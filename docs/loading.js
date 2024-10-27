// loading.js

// Create loading indicator element
function createLoadingIndicator() {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loadingIndicator';
    loadingElement.style.position = 'fixed';
    loadingElement.style.top = '0';
    loadingElement.style.left = '0';
    loadingElement.style.width = '100%';
    loadingElement.style.height = '100%';
    loadingElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Black background
    loadingElement.style.zIndex = '1000'; // On top of other content
    loadingElement.style.textAlign = 'center';
    loadingElement.style.paddingTop = '20%';
    loadingElement.style.opacity = '0'; // Start invisible
    loadingElement.style.transition = 'opacity 1s ease'; // Smooth fade effect

    const logo = document.createElement('img');
    logo.src = 'https://r2.interrupted.me/uploads/01j9ern6wc96x5191t1jmb32gk.gif'; // Replace with your logo path
    logo.alt = 'Logo';
    logo.style.maxWidth = '200px'; // Adjust size as needed
    logo.style.height = 'auto';

    loadingElement.appendChild(logo);
    document.body.appendChild(loadingElement);
    return loadingElement;
}

function showLoadingIndicator(loadingElement) {
    loadingElement.style.display = 'block'; // Show loading indicator
    loadingElement.style.opacity = '1'; // Fully visible
}

function hideLoadingIndicator(loadingElement) {
    loadingElement.style.opacity = '0'; // Fade out
    setTimeout(() => {
        loadingElement.style.display = 'none'; // Hide after fade
    }, 1000); // Match the transition duration
}

window.onload = function() {
    const loadingElement = createLoadingIndicator(); // Create loading indicator
    showLoadingIndicator(loadingElement); // Show loading indicator

    setTimeout(function() {
        hideLoadingIndicator(loadingElement); // Hide loading indicator after 3 seconds
    }, 5000); // 3000 milliseconds = 3 seconds
};
