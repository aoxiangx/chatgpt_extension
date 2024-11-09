const keywordInput = document.getElementById("keyword");
const colourSelect = document.getElementById("colour");
const applyButton = document.getElementById("applyHighlight");
const removeButton = document.getElementById("removeHighlights");

// Load saved settings on popup open
chrome.storage.sync.get(["keyword", "colour"], ({ keyword, colour }) => {
  if (keyword) keywordInput.value = keyword;
  if (colour) colourSelect.value = colour;
});

// Apply highlight
applyButton.addEventListener("click", () => {
  const keyword = keywordInput.value;
  const colour = colourSelect.value;

  chrome.storage.sync.set({ keyword, colour }, () => {
    console.log(`Keyword "${keyword}" and colour "${colour}" saved.`);
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "highlight", keyword, colour });
  });
});

// Remove highlights
removeButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "removeHighlights" });
  });
});
