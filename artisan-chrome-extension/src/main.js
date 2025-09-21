import './style.css'

// Artisan Image Analyzer Chrome Extension Popup
let activeTab = 'classifier';
let image = null;
let result = null;
let loading = false;
let error = null;

// Initialize the popup interface
function initializePopup() {
  document.querySelector('#app').innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-200 relative overflow-hidden p-4">
      <!-- Decorative Elements -->
      <div class="absolute top-4 left-4 w-6 h-6 bg-orange-400 transform rotate-45 animate-pulse"></div>
      <div class="absolute top-8 right-8 w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
      <div class="absolute bottom-12 left-8 w-5 h-5 bg-green-400 transform rotate-12 animate-pulse"></div>
      <div class="absolute bottom-4 right-12 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>

      <div class="container mx-auto relative z-20 max-w-md">
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="bg-gradient-to-r from-purple-400 to-pink-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 transform rotate-1 inline-block">
            <div class="flex items-center justify-center gap-2 mb-2">
              <span class="text-3xl animate-pulse">🪄</span>
              <span class="text-2xl animate-bounce">✨</span>
            </div>
            <h1 class="text-2xl font-black uppercase tracking-wider text-black">
              IMAGE ANALYZER
            </h1>
            <p class="text-sm font-bold mt-2 text-black">
              Hover over images to analyze!
            </p>
          </div>
        </div>

        <!-- Status Section -->
        <div class="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(147,51,234,1)] p-6 transform -rotate-1 mb-6">
          <div class="flex items-center mb-4">
            <div class="bg-blue-400 text-black p-2 mr-3 border-2 border-black">
              <span class="text-xl">📷</span>
            </div>
            <h2 class="text-xl font-black uppercase tracking-wider text-black">
              HOW TO USE
            </h2>
          </div>
          
          <div class="space-y-3">
            <div class="bg-gray-100 border-2 border-black p-3">
              <p class="font-bold text-sm text-black">
                1. Navigate to any webpage with images
              </p>
            </div>
            <div class="bg-gray-100 border-2 border-black p-3">
              <p class="font-bold text-sm text-black">
                2. Hover over any image for 1 second
              </p>
            </div>
            <div class="bg-gray-100 border-2 border-black p-3">
              <p class="font-bold text-sm text-black">
                3. AI will analyze the artwork automatically!
              </p>
            </div>
          </div>
          
          <div class="mt-4 p-3 bg-yellow-100 border-2 border-yellow-500">
            <p class="text-xs font-bold text-yellow-800">
              ⚠️ Make sure your API server is running on localhost:8000
            </p>
          </div>
        </div>

        <!-- Test Section -->
        <div class="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(34,197,94,1)] p-6 transform rotate-1">
          <div class="flex items-center mb-4">
            <div class="bg-green-400 text-black p-2 mr-3 border-2 border-black">
              <span class="text-xl">🧪</span>
            </div>
            <h2 class="text-xl font-black uppercase tracking-wider text-black">
              TEST ANALYZER
            </h2>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold mb-2 uppercase tracking-wide text-black">
                Upload Test Image:
              </label>
              <input
                type="file"
                accept="image/*"
                id="test-image-input"
                class="w-full p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
              />
            </div>
            
            <button
              id="test-analyze-btn"
              class="w-full bg-purple-400 hover:bg-purple-500 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] text-black font-black text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              disabled
            >
              <span class="text-xl">🪄</span>
              TEST ANALYZE
            </button>
          </div>
          
          <div id="test-results" class="hidden mt-4">
            <!-- Results will be populated here -->
          </div>
          
          <div id="test-error" class="hidden mt-4">
            <!-- Error will be populated here -->
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  setupEventListeners();
}

// Setup event listeners for the popup
function setupEventListeners() {
  const imageInput = document.getElementById('test-image-input');
  const analyzeBtn = document.getElementById('test-analyze-btn');
  
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      image = file;
      analyzeBtn.disabled = false;
      hideError();
    } else {
      image = null;
      analyzeBtn.disabled = true;
    }
  });
  
  analyzeBtn.addEventListener('click', testAnalyzeImage);
}

// Test image analysis function
async function testAnalyzeImage() {
  if (!image) return;
  
  const analyzeBtn = document.getElementById('test-analyze-btn');
  const resultsContainer = document.getElementById('test-results');
  const errorContainer = document.getElementById('test-error');
  
  loading = true;
  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = `
    <div class="w-5 h-5 border-2 border-black rounded-full border-t-transparent animate-spin mr-2"></div>
    ANALYZING...
  `;
  
  hideResults();
  hideError();
  
  try {
    const formData = new FormData();
    formData.append('image', image);
    
    const response = await fetch('http://localhost:8080/classifier/trial_classify', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const results = await response.json();
    displayTestResults(results);
    
  } catch (err) {
    console.error('Analysis failed:', err);
    displayTestError(err);
  } finally {
    loading = false;
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = `
      <span class="text-xl">🪄</span>
      TEST ANALYZE
    `;
  }
}

// Display test results
function displayTestResults(results) {
  const resultsContainer = document.getElementById('test-results');
  
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
    <div class="bg-blue-300 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
      <div class="text-center mb-4">
        <h3 class="text-lg font-black uppercase tracking-wider flex items-center justify-center gap-2">
          <span class="text-xl">📊</span>
          RESULTS
        </h3>
      </div>

      <div class="grid grid-cols-1 gap-2 mb-4">
        ${resultItems.map(item => `
          <div class="bg-white border-2 border-black p-2">
            <div class="flex items-center mb-1">
              <span class="text-sm mr-2">${item.icon}</span>
              <span class="font-black text-xs uppercase">${item.label}</span>
            </div>
            <p class="font-bold text-xs text-gray-800">
              ${item.value || 'Not detected'}
            </p>
          </div>
        `).join('')}
      </div>

      <button
        onclick="copyTestResults('${JSON.stringify(results).replace(/'/g, "\\'")}')"
        class="w-full bg-green-400 hover:bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] text-black font-black text-sm py-2 flex items-center justify-center gap-2 transition-all"
        id="copy-test-btn"
      >
        <span>📋</span>
        COPY RESULTS
      </button>
    </div>
  `;
  
  resultsContainer.classList.remove('hidden');
}

// Display test error
function displayTestError(error) {
  const errorContainer = document.getElementById('test-error');
  
  errorContainer.innerHTML = `
    <div class="bg-red-100 border-4 border-red-500 shadow-[6px_6px_0px_0px_rgba(220,38,38,0.3)] p-4">
      <div class="text-center">
        <span class="text-3xl block mb-2">⚠️</span>
        <p class="font-bold text-red-600 mb-2">Analysis Failed</p>
        <p class="text-sm text-gray-600 mb-2">${error.message}</p>
        <p class="text-xs text-gray-500">Make sure the API server is running on localhost:8000</p>
      </div>
    </div>
  `;
  
  errorContainer.classList.remove('hidden');
}

// Helper functions
function hideResults() {
  const resultsContainer = document.getElementById('test-results');
  resultsContainer.classList.add('hidden');
}

function hideError() {
  const errorContainer = document.getElementById('test-error');
  errorContainer.classList.add('hidden');
}

// Global copy function
window.copyTestResults = function(resultsJson) {
  const results = JSON.parse(resultsJson);
  navigator.clipboard.writeText(JSON.stringify(results, null, 2)).then(() => {
    const copyBtn = document.getElementById('copy-test-btn');
    if (copyBtn) {
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span>✅</span> COPIED!';
      copyBtn.className = copyBtn.className.replace('bg-green-400', 'bg-yellow-400');
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.className = copyBtn.className.replace('bg-yellow-400', 'bg-green-400');
      }, 2000);
    }
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
};

// Initialize the popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePopup);
} else {
  initializePopup();
}
