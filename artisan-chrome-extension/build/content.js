// Artisan Image Analyzer - Content Script
console.log('🎨 Artisan Image Analyzer loading...');

let currentPopup = null;
let isAnalyzing = false;

// Inject Tailwind CSS
function injectTailwind() {
  if (!document.querySelector('#artisan-tailwind-css')) {
    const link = document.createElement('link');
    link.id = 'artisan-tailwind-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.tailwindcss.com';
    document.head.appendChild(link);
    console.log('✅ Tailwind CSS injected');
  }
}

// Create popup
function createPopup() {
  const popup = document.createElement('div');
  popup.id = 'artisan-analyzer-popup';
  popup.className = 'fixed z-[999999] max-w-md transform rotate-1 animate-pulse';
  popup.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  popup.style.position = 'fixed';
  popup.style.zIndex = '999999';
  popup.style.display = 'block';
  popup.style.visibility = 'visible';
  
  popup.innerHTML = `
    <div style="background: #d8b4fe; border: 4px solid black; box-shadow: 12px 12px 0px 0px rgba(0,0,0,1); padding: 20px; max-width: 400px;">
      <div style="background: black; color: white; padding: 16px; border-bottom: 4px solid black; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 24px;">🎨</span>
          <span style="font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 2px;">ANALYZING...</span>
        </div>
        <button onclick="if(window.closeAnalyzer) { window.closeAnalyzer(); } else { console.error('closeAnalyzer not found'); }" style="background: #ef4444; color: white; border: 2px solid black; width: 32px; height: 32px; font-weight: bold; font-size: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer;">×</button>
      </div>
      <div>
        <div id="analyzer-loading" style="text-align: center; padding: 32px 0;">
          <div style="width: 40px; height: 40px; border: 4px solid black; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
          <p style="font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #374151;">AI is analyzing the artwork...</p>
        </div>
        <div id="analyzer-results" style="display: none;"></div>
        <div id="analyzer-error" style="display: none;"></div>
      </div>
    </div>
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;
  
  document.body.appendChild(popup);
  
  // Add click outside to close
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closeAnalyzer();
    }
  });
  
  // Add keyboard listener for Escape key
  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      closeAnalyzer();
      document.removeEventListener('keydown', handleKeyPress);
    }
  };
  document.addEventListener('keydown', handleKeyPress);
  
  // Add direct event listener to close button
  setTimeout(() => {
    const closeBtn = popup.querySelector('button');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔴 Close button clicked via event listener');
        closeAnalyzer();
      });
      console.log('✅ Close button event listener added');
    }
  }, 100);
  
  return popup;
}

// Position popup at center
function positionPopupCenter(popup) {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const centerX = (window.innerWidth / 2) + scrollLeft;
  const centerY = (window.innerHeight / 2) + scrollTop;
  
  popup.style.position = 'fixed';
  popup.style.left = centerX + 'px';
  popup.style.top = centerY + 'px';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.zIndex = '999999';
  popup.style.display = 'block';
  popup.style.visibility = 'visible';
  
  console.log('📍 Popup positioned at:', centerX, centerY);
}

// Convert image to blob
async function imageToBlob(imageUrl) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      ctx.drawImage(this, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert image to blob'));
        }
      }, 'image/jpeg', 0.8);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    
    if (imageUrl.startsWith('data:')) {
      img.src = imageUrl;
    } else if (imageUrl.startsWith('http')) {
      img.src = imageUrl;
    } else {
      img.src = new URL(imageUrl, window.location.href).href;
    }
  });
}

// Call API
async function analyzeImage(imageBlob) {
  const formData = new FormData();
  formData.append('image', imageBlob, 'image.jpg');
  
  try {
    const response = await fetch('http://localhost:8080/classifier/trial_classify', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Display results
function displayResults(results, popup) {
  const resultsContainer = popup.querySelector('#analyzer-results');
  const loadingContainer = popup.querySelector('#analyzer-loading');
  
  loadingContainer.style.display = 'none';
  resultsContainer.style.display = 'block';
  
  const resultItems = [
    { key: 'style', label: 'Art Style', icon: '🎨', value: results.style },
    { key: 'artist', label: 'Artist', icon: '👨‍🎨', value: results.artist },
    { key: 'medium', label: 'Medium', icon: '🏷️', value: results.medium },
    { key: 'origin', label: 'Origin', icon: '📍', value: results.origin },
    { key: 'price', label: 'Price', icon: '💰', value: results.price ? `₹${results.price}` : 'N/A' },
    { key: 'themes', label: 'Themes', icon: '✨', value: results.themes },
    { key: 'color', label: 'Colors', icon: '🎨', value: results.color }
  ];
  
  resultsContainer.innerHTML = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="background: black; color: white; padding: 12px; border: 4px solid black; box-shadow: 6px 6px 0px 0px rgba(59,130,246,1); display: inline-block; transform: rotate(-1deg);">
        <h3 style="font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; display: flex; align-items: center; gap: 8px; margin: 0;">
          <span style="font-size: 24px;">📷</span>
          ANALYSIS RESULTS
        </h3>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
      ${resultItems.map((item, index) => `
        <div style="grid-column: ${index >= 4 ? '1 / -1' : 'auto'}; background: white; border: 4px solid black; box-shadow: 6px 6px 0px 0px rgba(0,0,0,1); padding: 16px; transform: rotate(-1deg); transition: all 0.2s;">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <div style="background: #60a5fa; color: white; padding: 8px; margin-right: 12px; border: 2px solid black;">
              <span style="font-size: 18px;">${item.icon}</span>
            </div>
            <h4 style="font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">${item.label}</h4>
          </div>
          <div style="background: #f3f4f6; border: 2px solid black; padding: 8px;">
            <p style="font-weight: bold; font-size: 14px; color: #1f2937; margin: 0;">${item.value || 'Not detected'}</p>
          </div>
        </div>
      `).join('')}
    </div>
    <div style="text-align: center;">
      <button onclick="window.copyResults('${JSON.stringify(results).replace(/'/g, "\\'")}')" style="background: #60a5fa; border: 4px solid black; box-shadow: 6px 6px 0px 0px rgba(0,0,0,1); color: black; font-weight: 900; font-size: 14px; padding: 12px 24px; display: flex; align-items: center; gap: 8px; margin: 0 auto; cursor: pointer; transition: all 0.2s;" id="copy-btn">
        <span>📋</span>
        COPY RESULTS
      </button>
    </div>
  `;
}

// Display error
function displayError(error, popup) {
  const errorContainer = popup.querySelector('#analyzer-error');
  const loadingContainer = popup.querySelector('#analyzer-loading');
  
  loadingContainer.style.display = 'none';
  errorContainer.style.display = 'block';
  
  errorContainer.innerHTML = `
    <div style="background: #fef2f2; border: 4px solid #ef4444; box-shadow: 6px 6px 0px 0px rgba(220,38,38,0.3); padding: 24px; text-align: center;">
      <span style="font-size: 36px; display: block; margin-bottom: 16px;">⚠️</span>
      <p style="font-weight: bold; color: #dc2626; margin-bottom: 8px;">Failed to analyze image</p>
      <p style="font-size: 14px; color: #4b5563; margin-bottom: 16px;">${error.message}</p>
      <p style="font-size: 12px; color: #6b7280; margin-bottom: 16px;">Make sure the API server is running on localhost:8080</p>
      <button onclick="window.retryAnalysis()" style="background: #fbbf24; border: 4px solid black; box-shadow: 6px 6px 0px 0px rgba(0,0,0,1); color: black; font-weight: 900; font-size: 14px; padding: 12px 24px; display: flex; align-items: center; gap: 8px; margin: 0 auto; cursor: pointer; transition: all 0.2s;">
        <span>🔄</span>
        RETRY
      </button>
    </div>
  `;
}

// Global functions - ensure they're properly attached
function closeAnalyzer() {
  console.log('🔴 Close button clicked');
  if (currentPopup) {
    currentPopup.remove();
    currentPopup = null;
    console.log('✅ Popup closed successfully');
  } else {
    console.log('⚠️ No popup to close');
  }
  isAnalyzing = false;
}

// Attach to window object
window.closeAnalyzer = closeAnalyzer;

function copyResults(resultsJson) {
  const results = JSON.parse(resultsJson);
  navigator.clipboard.writeText(JSON.stringify(results, null, 2)).then(() => {
    const copyBtn = document.querySelector('#copy-btn');
    if (copyBtn) {
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span>✅</span> COPIED!';
      copyBtn.style.background = '#10b981';
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.style.background = '#60a5fa';
      }, 2000);
    }
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

function retryAnalysis() {
  closeAnalyzer();
}

// Attach all functions to window
window.copyResults = copyResults;
window.retryAnalysis = retryAnalysis;

// Main analysis function
async function handleImageAnalysis(imageUrl) {
  console.log('🎨 Starting image analysis for:', imageUrl);
  
  if (isAnalyzing) {
    console.log('⚠️ Already analyzing, skipping...');
    return;
  }
  
  if (currentPopup) {
    currentPopup.remove();
  }
  
  isAnalyzing = true;
  currentPopup = createPopup();
  positionPopupCenter(currentPopup);
  console.log('📱 Popup created and positioned');
  
  // Force visibility
  setTimeout(() => {
    if (currentPopup) {
      currentPopup.style.display = 'block';
      currentPopup.style.visibility = 'visible';
      currentPopup.style.opacity = '1';
      console.log('👁️ Popup visibility forced');
    }
  }, 100);
  
  try {
    console.log('🖼️ Converting image to blob...');
    const imageBlob = await imageToBlob(imageUrl);
    console.log('✅ Image converted to blob');
    
    console.log('🚀 Calling API...');
    const results = await analyzeImage(imageBlob);
    console.log('✅ API response received:', results);
    
    displayResults(results, currentPopup);
    console.log('🎉 Results displayed successfully!');
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    displayError(error, currentPopup);
  } finally {
    isAnalyzing = false;
  }
}

// Message listener setup
function setupMessageListener() {
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('📨 Message received:', request);
      if (request.action === "analyzeImage" && request.imageUrl) {
        console.log('🎯 Processing analyzeImage request');
        handleImageAnalysis(request.imageUrl);
      }
    });
    console.log('✅ Chrome runtime message listener set up successfully');
  } else {
    console.warn('⚠️ Chrome runtime API not available, retrying in 100ms...');
    setTimeout(setupMessageListener, 100);
  }
}

// Initialize
function initialize() {
  console.log('🚀 Initializing Artisan Image Analyzer...');
  injectTailwind();
  setupMessageListener();
  
  // Ensure all functions are available globally
  ensureGlobalFunctions();
  
  console.log('✅ Initialization complete');
}

// Ensure all functions are available globally
function ensureGlobalFunctions() {
  window.closeAnalyzer = closeAnalyzer;
  window.copyResults = copyResults;
  window.retryAnalysis = retryAnalysis;
  window.testArtisanAnalyzer = testArtisanAnalyzer;
  window.testPopup = testPopup;
  window.forceClosePopup = forceClosePopup;
  
  console.log('🔧 Global functions attached:', {
    closeAnalyzer: typeof window.closeAnalyzer,
    copyResults: typeof window.copyResults,
    retryAnalysis: typeof window.retryAnalysis
  });
}

function testArtisanAnalyzer() {
  console.log('🧪 Testing Artisan Analyzer...');
  handleImageAnalysis('https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Test+Image');
}

function testPopup() {
  console.log('🧪 Testing popup visibility...');
  const popup = createPopup();
  positionPopupCenter(popup);
  console.log('📍 Popup created, check if visible');
}

function forceClosePopup() {
  console.log('🔴 Force closing popup...');
  closeAnalyzer();
}

// Attach test functions to window
window.testArtisanAnalyzer = testArtisanAnalyzer;
window.testPopup = testPopup;
window.forceClosePopup = forceClosePopup;

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Cleanup
window.addEventListener('beforeunload', () => {
  if (currentPopup) {
    currentPopup.remove();
  }
});

console.log('🎨 Artisan Image Analyzer loaded successfully!');