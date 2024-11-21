if (localStorage.getItem("cookieBannerDisplayed")) {
    document.querySelector('.js-cookie-banner').remove();
} else {
    document.getElementById("cookie").style.display = "block";

    function dismiss() {
        document.querySelector('.js-cookie-banner').remove();
        localStorage.setItem("cookieBannerDisplayed", "true");
    }

    function decline() {
        document.querySelector('.js-cookie-banner').remove();
    }

    const button = document.querySelector('.cookie-button');
    const buttonDecline = document.querySelector('.cookie-decline-button');
    if (button) {
        button.addEventListener("click", dismiss);
    }
    if (buttonDecline) {
        buttonDecline.addEventListener("click", decline);
    }
}

const autoLoadDuration = 1000;
const eventList = ["touchstart", "touchmove", "touchend", "wheel", "mousemove", "keydown"];

const autoLoadTimeout = setTimeout(runScripts, autoLoadDuration * 1000);

eventList.forEach(function (eventName) {
    window.addEventListener(eventName, triggerScripts, { passive: true });
});

function triggerScripts() {
    runScripts();
    clearTimeout(autoLoadTimeout);
    eventList.forEach(function (eventName) {
        window.removeEventListener(eventName, triggerScripts, { passive: true });
    });
}

function runScripts() {
    document.querySelectorAll("script[delay]").forEach(function (script) {
        script.setAttribute("src", script.getAttribute("delay"));
    });
}