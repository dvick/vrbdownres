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
		const main = document.querySelector('main.app-content');
		const observer = new MutationObserver((mutations, observer) => {
			for (const mutation of mutations) {
				if (mutation.addedNodes.length > 0) {
					observer.disconnect();
					injectButton();
					return;
				}
			}
                });
		observer.observe(main, {
			childList: true
		});
	}
});

if (window.location.pathname.startsWith('/video/')) {
	injectButton();
}
