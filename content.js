// Function to highlight specified keyword
function highlightText(keyword) {
    const regex = new RegExp(`(${keyword})`, 'gi');
    
    // Walk through all text nodes on the page
    document.body.innerHTML = document.body.innerHTML.replace(regex, '<span class="highlight">$1</span>');
  }
  
  // Listen for messages from popup.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "highlight" && request.keyword) {
      highlightText(request.keyword);
    }
  });
  
  