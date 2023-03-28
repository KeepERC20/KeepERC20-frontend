chrome.action.onClicked.addListener(function (tab) {
    chrome.windows.create({
        url: chrome.runtime.getURL("index.html"),
        type: "popup", // No address bar,
        width: 800, // Width: 250-800 pixels
        height: 600 // Height: 250-600 pixels
    }, function (win) {
        // win represents the Window object from windows API
        // Do something after opening
    });
});