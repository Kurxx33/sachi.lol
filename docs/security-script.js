// Function to check security
function checkSecurity() {
    // Check for potential threats
    if (navigator.userAgent === "" || navigator.userAgent === null) {
        // Block the request if the user agent is empty
        window.location.href = "/threat-detected.html";
    } else {
        // Check for other malicious activity
        let userAgent = navigator.userAgent;
        if (userAgent.includes("bot") || userAgent.includes("crawler")) {
            // Block the request if the user agent indicates a bot or crawler
            window.location.href = "/threat-detected.html";
        } else {
            // Allow the request if the user agent appears to be legitimate
            // Fade out the security overlay
            let securityOverlay = document.getElementById("security-overlay");
            securityOverlay.classList.add("animate-fade-out");
            setTimeout(function() {
                securityOverlay.style.display = "none";
            }, 1000);
        }
    }
}

// Call the checkSecurity function
checkSecurity();
