// Function to highlight text matching the keyword
function highlightText(keyword) {
  const regex = new RegExp(`(${keyword})`, 'gi');
  walkDOM(document.body, (node) => {
    if (node.nodeType === Node.TEXT_NODE && regex.test(node.textContent)) {
      const span = document.createElement("span");
      span.className = "highlight";
      span.innerHTML = node.textContent.replace(regex, `<span class="highlight">$1</span>`);
      node.replaceWith(span);
    }
  });
}

// Function to hide elements containing the keyword
function hideContent(keyword) {
  const regex = new RegExp(keyword, 'i');
  walkDOM(document.body, (node) => {
    if (node.nodeType === Node.TEXT_NODE && regex.test(node.textContent)) {
      node.parentElement.style.display = "none";
    }
  });
}

// Utility function to walk through DOM nodes efficiently
function walkDOM(root, callback) {
  let node = root.firstChild;
  while (node) {
    const nextNode = node.nextSibling;
    callback(node);
    if (node.firstChild) walkDOM(node, callback);
    node = nextNode;
  }
}

// Listener for messages from popup.js
chrome.runtime.onMessage.addListener((request) => {
  if (request.keyword) {
    if (request.action === "highlight") {
      highlightText(request.keyword);
    } else if (request.action === "hide") {
      hideContent(request.keyword);
    }
  }
});
