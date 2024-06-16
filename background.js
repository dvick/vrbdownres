if (typeof browser === 'undefined') {
	globalThis.browser = chrome;
}

browser.webNavigation.onHistoryStateUpdated.addListener((details) => {
	browser.tabs.sendMessage(details.tabId, 'injectButton');
}, {url: [{hostEquals: "vrbangers.com", pathPrefix: "/video/"}]});
