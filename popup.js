// Select elements
const keywordInput = document.getElementById("keyword");
const applyButton = document.getElementById("applyFilter");

// Load saved keyword on popup open
chrome.storage.sync.get("keyword", ({ keyword }) => {
  if (keyword) {
    keywordInput.value = keyword;
  }
});

// Listen for button click to save the keyword and trigger content script
applyButton.addEventListener("click", () => {
  const keyword = keywordInput.value;
  
  // Save keyword to Chrome storage
  chrome.storage.sync.set({ keyword }, () => {
    console.log(`Keyword "${keyword}" saved.`);
  });
  
  // Send message to content script to highlight content
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "highlight", keyword });
  });
});
