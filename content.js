let downloads = [], curVideoId;

async function downloadButtonClick(event) {
    event.stopPropagation();
    const existingMenu = document.getElementById('downloadDropdown');
    if (existingMenu) {
        existingMenu.parentElement.removeChild(existingMenu);
        return;
    }
    if (getVideoId() != curVideoId) {
        await getDownloads();
    }
    const accountMenu = document.querySelector('.app-header-account-menu__wrapper');
    let dataAttr;
    for (const attr of accountMenu.attributes) {
        if (attr.name.startsWith('data-v-')) {
            dataAttr = attr.name;
            break;
        }
    }
    const menu = document.createElement('div');
    menu.id = 'downloadDropdown';
    menu.className = 'app-menu__content';
    menu.style.top = 'calc(100% + 10px)';
    menu.style.right = '0';
    const menuList = document.createElement('div');
    menuList.className = 'app-header-account-menu__list';
    if (dataAttr)
        menuList.setAttribute(dataAttr, '');
    const linksDiv = document.createElement('div');
    if (dataAttr)
        linksDiv.setAttribute(dataAttr, '');
    for (const download of downloads) {
        const link = document.createElement('a');
        link.className = 'app-header-account-menu__list-item font-body app-link';
        if (dataAttr)
            link.setAttribute(dataAttr, '');
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

function injectButton() {
    if (document.getElementById('downloadButton'))
        return;
    const actions = document.querySelector('.single-video-actions__comment-trailer');
    actions.style.position = 'relative';
    const button = actions.querySelector('.single-video-actions__button__comment').cloneNode(true);
    button.id = 'downloadButton';
    button.children[0].innerText = 'Download';
    button.addEventListener('click', downloadButtonClick);
    actions.appendChild(button);
    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.removedNodes) {
                if (node == button) {
                    actions.appendChild(button);
                    return;
                }
            }
        }
    }).observe(actions, {childList: true});
}

function getVideoId() {
    return window.location.pathname.match('^/video/([^/]+)')[1];
}

function getDownloads() {
    const token = document.cookie.match('(?:^|; )atoken=([^;]+)')[1];
    const videoId = getVideoId();
    return fetch(`https://content.${window.location.hostname}/api/content/v1/videos/${videoId}`, {
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
        curVideoId = videoId;
    });
}

if (typeof browser === 'undefined') {
    window.browser = chrome;
}

browser.runtime.onMessage.addListener((message) => {
    if (message === 'injectButton') {
        new MutationObserver((mutations, observer) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.parentNode.querySelector('.single-video-actions__comment-trailer')) {
                        observer.disconnect();
                        injectButton();
                        return;
                    }
                }
            }
        }).observe(document.body, {childList: true, subtree: true});
    }
});

document.addEventListener('click', documentClick);

if (window.location.pathname.startsWith('/video/')) {
    injectButton();
}
