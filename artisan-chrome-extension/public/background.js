// Background script for Artisan Image Analyzer
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item for images
  chrome.contextMenus.create({
    id: "analyze-image",
    title: "🎨 Analyze Image with Artisan AI",
    contexts: ["image"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyze-image" && info.srcUrl) {
    // Send message to content script to analyze the image
    chrome.tabs.sendMessage(tab.id, {
      action: "analyzeImage",
      imageUrl: info.srcUrl,
      imageElement: info.srcUrl
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeImage") {
    // Forward the message to the content script
    chrome.tabs.sendMessage(sender.tab.id, {
      action: "analyzeImage",
      imageUrl: request.imageUrl,
      imageElement: request.imageUrl
    });
  }
});

