chrome.action.onClicked.addListener(function (tab) {
    chrome.windows.create({
        url: chrome.runtime.getURL("index.html"),
        type: "normal"
        // type: "popup", // No address bar,
        // width: 800, // Width: 250-800 pixels
        // height: 600 // Height: 250-600 pixels
    }, function (win) {
        // win represents the Window object from windows API
        // Do something after opening

        chrome.management.get(chrome.runtime.id, function (extensionInfo) {
            if (extensionInfo.installType === 'development') {
                // console.log("DEV MODE");
            }
        });
    });

    // // Open extension's default_popup in a new tab
    // chrome.tabs.create({
    //     url: chrome.runtime.getURL("index.html")
    // });
});