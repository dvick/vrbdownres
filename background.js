if (typeof browser === 'undefined') {
    globalThis.browser = chrome;
}

browser.webNavigation.onHistoryStateUpdated.addListener((details) => {
    browser.tabs.sendMessage(details.tabId, 'injectButton', {frameId: details.frameId});
}, {
    url: [
        {hostEquals: 'vrbangers.com', pathPrefix: '/video/'},
        {hostEquals: 'vrbtrans.com', pathPrefix: '/video/'},
        {hostEquals: 'vrbgay.com', pathPrefix: '/video/'},
        {hostEquals: 'vrconk.com', pathPrefix: '/video/'},
        {hostEquals: 'blowvr.com', pathPrefix: '/video/'},
        {hostEquals: 'arporn.com', pathPrefix: '/video/'}
    ]
});
