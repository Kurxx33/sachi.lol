function createLoadingIndicator() {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loadingIndicator';
    loadingElement.style.position = 'fixed';
    loadingElement.style.top = '0';
    loadingElement.style.left = '0';
    loadingElement.style.width = '100%';
    loadingElement.style.height = '100%';
    loadingElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    loadingElement.style.zIndex = '1000';
    loadingElement.style.textAlign = 'center';
    loadingElement.style.paddingTop = '20%';
    loadingElement.style.opacity = '0';
    loadingElement.style.transition = 'opacity 1s ease';

    const logo = document.createElement('img');
    logo.src = 'https://r2.interrupted.me/uploads/01j9ern6wc96x5191t1jmb32gk.gif';
    logo.alt = 'Logo';
    logo.style.maxWidth = '200px';
    logo.style.height = 'auto';

    loadingElement.appendChild(logo);
    document.body.appendChild(loadingElement);
    return loadingElement;
}

function showLoadingIndicator(loadingElement) {
    loadingElement.style.display = 'block';
    loadingElement.style.opacity = '1';
}

function hideLoadingIndicator(loadingElement) {
    loadingElement.style.opacity = '0';
    setTimeout(() => {
        loadingElement.style.display = 'none';
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    const loadingElement = createLoadingIndicator();
    showLoadingIndicator(loadingElement);

    setTimeout(function() {
        hideLoadingIndicator(loadingElement);
    }, 5000);
});
