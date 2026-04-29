// AUTO-LOAD BROWSER TTS ENGINE
(function () {
    'use strict';

    console.log('🔄 Loading Browser TTS Engine...');

    // Load browser-tts-engine.js if not already loaded
    if (!window.BrowserTTSEngine) {
        const script = document.createElement('script');
        script.src = '/edu-wiz-ai-main/browser-tts-engine.js?v=' + Date.now();
        script.onload = function () {
            console.log('✅ Browser TTS Engine loaded successfully');
        };
        script.onerror = function () {
            console.error('❌ Failed to load browser-tts-engine.js');
        };
        document.head.appendChild(script);
    }
})();
