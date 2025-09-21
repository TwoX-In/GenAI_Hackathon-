chrome.runtime.onInstalled.addListener(() => { chrome.contextMenus.create({ id: "analyze-image", title: "🎨 Analyze Image with Artisan AI", contexts: ["image"] }) }); chrome.contextMenus.onClicked.addListener((e, a) => { e.menuItemId === "analyze-image" && e.srcUrl && chrome.tabs.sendMessage(a.id, { action: "analyzeImage", imageUrl: e.srcUrl, imageElement: e.srcUrl }) }); chrome.runtime.onMessage.addListener((e, a, n) => { e.action === "analyzeImage" && chrome.tabs.sendMessage(a.tab.id, { action: "analyzeImage", imageUrl: e.imageUrl, imageElement: e.imageUrl }) });
<<<<<<< HEAD

=======
>>>>>>> b2e721e761ed162d031ac67f808aab8014459e6a
