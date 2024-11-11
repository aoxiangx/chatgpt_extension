// Function to highlight text matching the keyword
function highlightText(keyword, colour) {
  const regex = new RegExp(`(${keyword})`, 'gi');

  walkDOM(document.body, (node) => {
    if (node.nodeType === Node.TEXT_NODE && regex.test(node.textContent)) {
      const parent = node.parentNode;
      const parts = node.textContent.split(regex);
      
      // Create a fragment for performance
      const fragment = document.createDocumentFragment();
      parts.forEach((part) => {
        if (regex.test(part)) {
          const span = document.createElement("span");
          span.className = `highlight ${colour}`;
          span.textContent = part;
          fragment.appendChild(span);
        } else {
          fragment.appendChild(document.createTextNode(part));
        }
      });
      
      parent.replaceChild(fragment, node);
    }
  });
  
  saveHighlight(keyword, colour);
}

// Save highlight data to storage
function saveHighlight(keyword, colour) {
  chrome.storage.local.get({ highlights: [] }, (data) => {
    const newHighlight = { keyword, colour };
    const updatedHighlights = [...data.highlights, newHighlight];
    chrome.storage.local.set({ highlights: updatedHighlights });
  });
}

// Function to remove all highlights
function removeHighlights() {
  const highlights = document.querySelectorAll("span.highlight");
  highlights.forEach((highlight) => {
    const textNode = document.createTextNode(highlight.textContent);
    highlight.replaceWith(textNode);
  });
  
  chrome.storage.local.set({ highlights: [] }); // Clear saved highlights
}

// Restore highlights after page load
function restoreHighlights() {
  chrome.storage.local.get("highlights", (data) => {
    if (data.highlights && data.highlights.length > 0) {
      data.highlights.forEach(({ keyword, colour }) => {
        highlightText(keyword, colour);
      });
    }
  });
}

// DOM traversal function
function walkDOM(root, callback) {
  let node = root.firstChild;
  while (node) {
    const nextNode = node.nextSibling;
    callback(node);
    if (node.firstChild) walkDOM(node, callback);
    node = nextNode;
  }
}

// Message listener for popup actions
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "highlight" && request.keyword) {
    highlightText(request.keyword, request.colour);
  } else if (request.action === "removeHighlights") {
    removeHighlights();
  }
});

// Function to apply settings received from popup.js
function applySettings(settings) {
  if (settings.highlightEnabled) {
    highlightText(settings.keyword, settings.colour);
  }
  
  if (settings.hideEnabled) {
    hideContent(settings.keyword);
  }
}

// Listener for messages from popup.js
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "applySettings") {
    applySettings(request.settings);
  }
});


// On page load, restore highlights
document.addEventListener("DOMContentLoaded", restoreHighlights);
