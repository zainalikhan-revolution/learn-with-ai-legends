// ============================================
// LIP-SYNC ENGINE V1.0
// Real-time mouth animation from audio output
// Uses Web Audio API AnalyserNode
// ============================================

(function() {
    'use strict';

    // Audio context (shared globally)
    let audioContext = null;
    let analyser = null;
    let dataArray = null;
    let source = null;
    let isConnected = false;
    let mouthOpenness = 0;
    let smoothedMouth = 0;
    let animFrameId = null;
    let isSpeakingNow = false;

    // Smoothing factor (0 = instant, 1 = no change)
    const SMOOTH_UP = 0.4;    // Mouth opens quickly
    const SMOOTH_DOWN = 0.15; // Mouth closes smoothly
    const THRESHOLD = 0.08;   // Minimum amplitude to register
    const SCALE = 2.5;        // Amplify mouth movement

    function getAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }

    function setupAnalyser() {
        if (analyser) return analyser;
        const ctx = getAudioContext();
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        return analyser;
    }

    // Connect to an HTMLAudioElement (ElevenLabs audio)
    function connectAudioElement(audioElement) {
        try {
            const ctx = getAudioContext();
            if (ctx.state === 'suspended') ctx.resume();

            setupAnalyser();

            // Disconnect previous source
            if (source) {
                try { source.disconnect(); } catch(e) {}
            }

            source = ctx.createMediaElementSource(audioElement);
            source.connect(analyser);
            analyser.connect(ctx.destination);
            isConnected = true;
            isSpeakingNow = true;

            // Start the animation loop
            if (!animFrameId) startLoop();

            console.log('🎤 LipSync: Connected to audio element');
        } catch(e) {
            console.warn('🎤 LipSync: Connection error (element may already be connected)', e.message);
            // Fallback: use simulated lip-sync
            isSpeakingNow = true;
            if (!animFrameId) startLoop();
        }
    }

    // Connect to Web Speech API (browser TTS) - uses simulated lip-sync
    function connectSpeechSynthesis() {
        isSpeakingNow = true;
        if (!animFrameId) startLoop();
        console.log('🎤 LipSync: Using simulated mode for browser TTS');
    }

    // Disconnect / stop
    function disconnect() {
        isSpeakingNow = false;
        mouthOpenness = 0;
        smoothedMouth = 0;
    }

    // Main analysis loop
    function startLoop() {
        function tick() {
            animFrameId = requestAnimationFrame(tick);

            if (!isSpeakingNow) {
                // Smoothly close mouth when not speaking
                smoothedMouth *= 0.85;
                if (smoothedMouth < 0.01) smoothedMouth = 0;
                mouthOpenness = smoothedMouth;
                return;
            }

            if (analyser && dataArray && isConnected) {
                // Real audio analysis
                analyser.getByteFrequencyData(dataArray);

                // Focus on voice frequency range (85-300 Hz for fundamental, 300-3000 Hz for harmonics)
                // With fftSize=256 and 44100Hz sample rate, each bin ≈ 172Hz
                // Bins 0-5 cover ~0-860Hz (fundamental voice range)
                let sum = 0;
                let count = 0;
                for (let i = 1; i < 8; i++) {
                    sum += dataArray[i];
                    count++;
                }
                let avg = (sum / count) / 255;

                // Apply threshold and scaling
                if (avg < THRESHOLD) avg = 0;
                avg = Math.min(1, avg * SCALE);

                // Smooth
                if (avg > smoothedMouth) {
                    smoothedMouth = smoothedMouth + (avg - smoothedMouth) * SMOOTH_UP;
                } else {
                    smoothedMouth = smoothedMouth + (avg - smoothedMouth) * SMOOTH_DOWN;
                }
            } else {
                // Simulated lip-sync (for browser TTS or when audio analysis unavailable)
                // Creates natural-looking mouth movements
                const time = Date.now() / 1000;
                const base = 0.3 + Math.sin(time * 8) * 0.2 + Math.sin(time * 13) * 0.15 + Math.sin(time * 21) * 0.1;
                const variation = Math.random() * 0.15;
                const target = Math.max(0, Math.min(1, base + variation));

                if (target > smoothedMouth) {
                    smoothedMouth = smoothedMouth + (target - smoothedMouth) * 0.35;
                } else {
                    smoothedMouth = smoothedMouth + (target - smoothedMouth) * 0.2;
                }
            }

            mouthOpenness = smoothedMouth;
        }

        tick();
    }

    // Public API
    window.LipSyncEngine = {
        connectAudioElement: connectAudioElement,
        connectSpeechSynthesis: connectSpeechSynthesis,
        disconnect: disconnect,
        getMouthOpenness: function() { return mouthOpenness; },
        isSpeaking: function() { return isSpeakingNow; },
        setSpeaking: function(val) { 
            isSpeakingNow = val;
            if (val && !animFrameId) startLoop();
        }
    };

    console.log('✅ LipSync Engine V1.0 loaded');
})();
