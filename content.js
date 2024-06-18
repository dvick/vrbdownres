function doInjectButton() {
    if (document.querySelector('.video-download-button__activator')) {
        return;
    }
    const button = document.createElement('button');
    button.className = 'video-download-button__activator app-link app-link__button app-link__button--block --single-video';
    button.setAttribute('data-v-d6d564ee', '');
    button.innerText = 'Download';
    const appMenuActivator = document.querySelector('.single-video-info__download-button > .app-menu__activator');
    appMenuActivator.appendChild(button);
}

function injectButton() {
    const preview = document.querySelector('.single-video-poster__preview');

    if (preview.classList.contains('--loading')) {
        const observer = new MutationObserver((mutations, observer) => {
            if (!preview.classList.contains('--loading')) {
                observer.disconnect();
                doInjectButton();
            }
        });
        observer.observe(preview, {
            attributes: true,
            attributeFilter: ['class']
        });
    } else {
        doInjectButton();
    }
}

if (typeof browser === 'undefined') {
    window.browser = chrome;
}

browser.runtime.onMessage.addListener((message) => {
    if (message === 'injectButton') {
        let target, callback;
        if (document.querySelector('.dashboard__container')) {
            target = document.getElementById('__nuxt');
            callback = (mutations, observer) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.id === '__layout') {
                            observer.disconnect();
                            injectButton();
                            return;
                        }
                    }
                }
            };
        } else {
            target = document.querySelector('main.app-content');
            callback = (mutations, observer) => {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        observer.disconnect();
                        injectButton();
                        return;
                    }
                }
            };
        }
        const observer = new MutationObserver(callback);
        observer.observe(target, {childList: true});
    }
});

if (window.location.pathname.startsWith('/video/')) {
    injectButton();
}
