const classMap = {
    'vrconk.com': 'video-download-button__activator app-link app-link__button app-link__button--block --single-video',
    'blowvr.com': 'video-download-button__activator app-link app-link--uppercase app-link__button app-link__button--block'
};
//don't have these, copying vrconk:
classMap['vrbangers.com'] = classMap['vrconk.com'];
classMap['vrbtrans.com'] = classMap['vrconk.com'];

const dataAttrMap = {
    'vrbangers.com': 'd6d564ee',
    'vrconk.com': '37da09dc',
    'blowvr.com': '5074a90a'
};
dataAttrMap['vrbtrans.com'] = dataAttrMap['vrbangers.com']; //don't have, copying vrbangers

const innerMap = {
    'vrbangers.com': 'Download',
    'vrconk.com': 'Download',
    'blowvr.com': 'Download<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 24" fill="none" class="app-icon" data-v-67c9ab81="" data-v-5074a90a="" data-testid="" style="--icon-width: 24; --icon-height: 24;"><path d="M12.5 15L12.8536 15.3536L12.5 15.7071L12.1464 15.3536L12.5 15ZM18.8536 9.35355L12.8536 15.3536L12.1464 14.6464L18.1464 8.64645L18.8536 9.35355ZM12.1464 15.3536L6.14645 9.35355L6.85355 8.64645L12.8536 14.6464L12.1464 15.3536Z"></path></svg>',
    'vrbtrans.com': 'Download'
}

function doInjectButton() {
    if (document.querySelector('.video-download-button__activator')) {
        return;
    }
    const button = document.createElement('button');
    button.className = classMap[window.location.hostname];
    button.setAttribute('data-v-' + dataAttrMap[window.location.hostname], '');
    button.innerHTML = innerMap[window.location.hostname];
    const appMenuActivator = document.querySelector('.video-download-button > .app-menu__activator');
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
