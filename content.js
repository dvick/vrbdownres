let downloads = [];

function downloadButtonClick(event) {
    event.stopPropagation();
    const existingMenu = document.getElementById('downloadDropdown');
    if (existingMenu) {
        existingMenu.parentElement.removeChild(existingMenu);
        return;
    }
    const menu = document.createElement('div');
    menu.id = 'downloadDropdown';
    menu.className = 'app-menu__content';
    menu.style.top = 'calc(100% + 10px)';
    menu.style.right = '0';
    const menuList = document.createElement('div');
    menuList.className = 'app-header-account-menu__list';
    menuList.setAttribute('data-v-65275bed', '');
    const linksDiv = document.createElement('div');
    linksDiv.setAttribute('data-v-65275bed', '');
    for (const download of downloads) {
        const link = document.createElement('a');
        link.className = 'app-header-account-menu__list-item font-body app-link';
        link.setAttribute('data-v-65275bed', '');
        link.href = download.url;
        const span = document.createElement('span');
        span.className = 'app-link__container';
        span.innerText = `${download.label} (${download.size})`;
        link.appendChild(span);
        linksDiv.appendChild(link);
    }
    menuList.appendChild(linksDiv);
    menu.appendChild(menuList);
    const actions = document.querySelector('.single-video-actions__comment-trailer');
    actions.appendChild(menu);
}

function documentClick() {
    const existingMenu = document.getElementById('downloadDropdown');
    if (existingMenu) {
        existingMenu.parentElement.removeChild(existingMenu);
    }
}

function doInjectButton() {
    const existingButton = document.getElementById('downloadButton');
    if (existingButton) {
        existingButton.parentElement.removeChild(existingButton);
    }
    const actions = document.querySelector('.single-video-actions__comment-trailer');
    actions.style.position = 'relative';
    const button = actions.querySelector('.single-video-actions__button__comment').cloneNode(true);
    button.id = 'downloadButton';
    button.children[0].innerText = 'Download';
    button.addEventListener('click', downloadButtonClick);
    actions.appendChild(button);
}

function getDownloads() {
    const token = document.cookie.match('(?:^|; )atoken=([^;]+)')[1];
    const videoId = window.location.pathname.match('^/video/([^/]+)')[1];
    fetch(`https://content.${window.location.hostname}/api/content/v1/videos/${videoId}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(resp => {
        if (!resp.ok)
            throw new Error('HTTP error: ' + resp.status);
        return resp.json();
    }).then(resp => {
        if (resp.status.code !== 1)
            throw new Error(resp.status.message);
        downloads = resp.data.item.downLoadVideoListForFront;
    });
}

function injectButton() {
    getDownloads();

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

document.addEventListener('click', documentClick);

if (window.location.pathname.startsWith('/video/')) {
    injectButton();
}
