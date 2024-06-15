function injectButton() {
	const button = document.createElement('button');
	button.className = 'video-download-button__activator app-link app-link__button app-link__button--block --single-video';
	button.setAttribute('data-v-d6d564ee', '');
	button.innerText = 'Download';
	const appMenuActivator = document.querySelector('.single-video-info__download-button > .app-menu__activator');
	appMenuActivator.appendChild(button);
}

const preview = document.querySelector('.single-video-poster__preview');

if (preview.classList.contains('--loading')) {
	const observer = new MutationObserver((mutations, observer) => {
		if (!preview.classList.contains('--loading')) {
			observer.disconnect();
			injectButton();
		}
	});
	observer.observe(preview, {
		attributes: true,
		attributeFilter: ['class']
	});
} else {
	injectButton();
}
