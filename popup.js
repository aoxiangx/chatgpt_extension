const keywordInput = document.getElementById("keyword");
const colourSelect = document.getElementById("colour");
const highlightSwitch = document.getElementById("highlightSwitch");
const hideSwitch = document.getElementById("hideSwitch");
const saveButton = document.getElementById("saveSettings");

// Load saved settings on popup open
chrome.storage.sync.get(["keyword", "colour", "highlightEnabled", "hideEnabled"], (data) => {
  keywordInput.value = data.keyword || '';
  colourSelect.value = data.colour || 'yellow';
  highlightSwitch.checked = !!data.highlightEnabled;
  hideSwitch.checked = !!data.hideEnabled;
});

// Save settings on button click
saveButton.addEventListener("click", () => {
  const keyword = keywordInput.value;
  const colour = colourSelect.value;
  const highlightEnabled = highlightSwitch.checked;
  const hideEnabled = hideSwitch.checked;

  // Save settings to Chrome storage
  chrome.storage.sync.set({
    keyword,
    colour,
    highlightEnabled,
    hideEnabled
  }, () => {
    console.log("Settings saved:", { keyword, colour, highlightEnabled, hideEnabled });
  });

  // Send settings to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "applySettings",
      settings: { keyword, colour, highlightEnabled, hideEnabled }
    });
  });
});
