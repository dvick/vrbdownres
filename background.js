if (typeof browser === 'undefined') {
    globalThis.browser = chrome;
}

browser.webNavigation.onHistoryStateUpdated.addListener((details) => {
    browser.tabs.sendMessage(details.tabId, 'injectButton', {frameId: details.frameId});
}, {url: [{hostEquals: "vrbangers.com", pathPrefix: "/video/"}]});
