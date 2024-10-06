// chrome.browserAction.onClicked.addListener(function(tab) { alert('icon clicked')});
chrome.action.onClicked.addListener(function (tab) {
    console.log("Hello")
});
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['src/js/toggle_container.js']
    });
});
