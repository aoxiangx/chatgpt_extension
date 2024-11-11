// Function to highlight text matching the keyword with the selected colour
function highlightText(keyword, colour) {
  if (!keyword || !colour) return;

  // Clear previous highlights before applying new ones
  clearHighlights();

  // Escape special characters in the keyword for regex safety
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create a regex for exact word matching with word boundaries
  const regex = new RegExp(`\\b(${escapedKeyword})\\b`, 'gi');

  function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
          if (regex.test(node.textContent)) {
              // Reset lastIndex because regex is global
              regex.lastIndex = 0;
              
              // Create a wrapper element for the highlighted content
              const wrapper = document.createElement('span');
              
              // Replace matching keywords with highlighted spans
              const newContent = node.textContent.replace(regex, 
                  `<span class="highlight ${colour}" style="background-color: ${colour}">$1</span>`
              );
              
              wrapper.innerHTML = newContent;
              node.parentNode.replaceChild(wrapper, node);
          }
      } else if (node.nodeType === Node.ELEMENT_NODE && 
                !['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(node.tagName) &&
                !node.classList.contains('highlight')) {
          // Recursively process child nodes, skipping special elements
          Array.from(node.childNodes).forEach(child => processNode(child));
      }
  }

  // Start processing from body element
  processNode(document.body);
}

// Function to remove all highlights from the page
function clearHighlights() {
  const highlights = document.querySelectorAll('.highlight');
  highlights.forEach(highlight => {
      // Replace highlight spans with original text nodes
      const text = document.createTextNode(highlight.textContent);
      highlight.parentNode.replaceChild(text, highlight);
  });

  // Clean up any empty wrapper spans
  document.querySelectorAll('span:empty').forEach(span => {
      if (!span.hasChildNodes()) {
          span.remove();
      }
  });
}

// Function to hide elements containing the specified keyword
function hideContent(keyword) {
  if (!keyword) return;
  
  // Escape special characters in keyword
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b(${escapedKeyword})\\b`, 'gi');

  function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
          if (regex.test(node.textContent)) {
              // Find the nearest meaningful parent element
              let parent = node.parentElement;
              while (parent && ['SPAN', 'B', 'I', 'EM', 'STRONG'].includes(parent.tagName)) {
                  parent = parent.parentElement;
              }
              
              // If suitable parent found, hide only the matching text
              if (parent) {
                  const originalContent = parent.innerHTML;
                  parent.innerHTML = originalContent.replace(regex, 
                      '<span style="display: none;">$1</span>'
                  );
              }
          }
      } else if (node.nodeType === Node.ELEMENT_NODE && 
                !['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(node.tagName)) {
          // Recursively process child nodes
          Array.from(node.childNodes).forEach(child => processNode(child));
      }
  }

  // Start processing from body element
  processNode(document.body);
}

// Function to apply user settings for highlighting and hiding
function applySettings(settings) {
  // Restore all hidden content
  document.querySelectorAll('[style*="display: none"]').forEach(el => {
      const text = el.textContent;
      const textNode = document.createTextNode(text);
      el.parentNode.replaceChild(textNode, el);
  });
  
  // Clear existing highlights
  clearHighlights();
  
  // Apply new settings
  if (settings.highlightEnabled && settings.keyword) {
      highlightText(settings.keyword, settings.colour);
  }
  
  if (settings.hideEnabled && settings.keyword) {
      hideContent(settings.keyword);
  }
}

// Function to restore settings when page loads
function restoreHighlights() {
  chrome.storage.sync.get(['keyword', 'colour', 'highlightEnabled', 'hideEnabled'], (settings) => {
      applySettings(settings);
  });
}

// Listen for setting updates from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'applySettings') {
      applySettings(request.settings);
  }
});

// Initialize extension when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', restoreHighlights);
} else {
  restoreHighlights();
}