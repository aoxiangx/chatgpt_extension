// Function to highlight text matching the keyword
function highlightText(keyword) {
  const regex = new RegExp(`(${keyword})`, 'gi'); // Case-insensitive match for keyword
  
  // Traverse DOM nodes and wrap matched keyword in a span
  walkDOM(document.body, (node) => {
    if (node.nodeType === Node.TEXT_NODE && regex.test(node.textContent)) {
      const parent = node.parentNode;
      const parts = node.textContent.split(regex); // Split text around matches

      // Create a fragment to hold new nodes for better performance
      const fragment = document.createDocumentFragment();
      parts.forEach((part) => {
        if (regex.test(part)) {
          // Create and style the highlight span for matched keyword
          const span = document.createElement("span");
          span.className = "highlight";
          span.textContent = part;
          fragment.appendChild(span);
        } else {
          // Add normal text nodes
          fragment.appendChild(document.createTextNode(part));
        }
      });

      parent.replaceChild(fragment, node); // Replace original text node with fragment
    }
  });
}

// Function to hide elements containing the keyword
function hideContent(keyword) {
  const regex = new RegExp(keyword, 'i'); // Case-insensitive match for keyword
  walkDOM(document.body, (node) => {
    if (node.nodeType === Node.TEXT_NODE && regex.test(node.textContent)) {
      node.parentElement.style.display = "none"; // Hide parent element
    }
  });
}

// Utility function to walk through DOM nodes efficiently
function walkDOM(root, callback) {
  let node = root.firstChild;
  while (node) {
    const nextNode = node.nextSibling; // Store next node reference
    callback(node); // Apply callback function to current node
    if (node.firstChild) walkDOM(node, callback); // Recursively process child nodes
    node = nextNode;
  }
}

// Listener for messages from popup.js
chrome.runtime.onMessage.addListener((request) => {
  if (request.keyword) {
    clearHighlights(); // Clear any previous highlights before applying new ones
    if (request.action === "highlight") {
      highlightText(request.keyword); // Apply highlight
    } else if (request.action === "hide") {
      hideContent(request.keyword); // Apply hide
    }
  }
});

// Clear any previous highlights to avoid duplicating highlights
function clearHighlights() {
  const highlightedElements = document.querySelectorAll("span.highlight");
  highlightedElements.forEach((element) => {
    // Replace highlight span with plain text node
    const textNode = document.createTextNode(element.textContent);
    element.replaceWith(textNode);
  });
}
