const keywordInput = document.getElementById("keyword");
const applyButton = document.getElementById("applyFilter");
const filterOptions = document.getElementsByName("filterOption");

chrome.storage.sync.get(["keyword", "filterOption"], ({ keyword, filterOption }) => {
  if (keyword) keywordInput.value = keyword;
  if (filterOption) document.getElementById(filterOption).checked = true;
});

applyButton.addEventListener("click", () => {
  const keyword = keywordInput.value;
  const selectedOption = [...filterOptions].find(option => option.checked).value;

  chrome.storage.sync.set({ keyword, filterOption: selectedOption }, () => {
    console.log(`Keyword "${keyword}" and option "${selectedOption}" saved.`);
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: selectedOption, keyword });
  });
});
