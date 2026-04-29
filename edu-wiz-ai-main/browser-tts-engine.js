// =====================================================
// BROWSER TTS ENGINE V5100 - NO SERVER NEEDED
// Calls Google TTS API directly from browser
// =====================================================

window.BrowserTTSEngine = {
    async speak(text, tutorName, languageHint) {
        try {
            // Get API key from config
            const apiKey = window.ENV?.VITE_GOOGLE_CLOUD_TTS_KEY ||
                window.__ENV__?.VITE_GOOGLE_CLOUD_TTS_KEY ||
                'AIzaSyCdCTqlJhDtAyGv_2ujnRa3jLL6-og1F7E'; // Fallback

            // Detect Urdu
            const isUrdu = languageHint === 'ur' || languageHint === 'ur-PK' ||
                text.match(/[\u0600-\u06FF]/);

            // Detect gender
            const isFemale = /Marie|Curie|Lady|Female/i.test(tutorName);

            // V5215: Select best WORKING voice - ur-IN has best male voices
            // ur-PK-Wavenet-B doesn't exist (returns 400), ur-IN-Wavenet-B WORKS
            const voice = isUrdu
                ? (isFemale ? 'ur-PK-Wavenet-A' : 'ur-IN-Wavenet-B')
                : (isFemale ? 'en-US-Neural2-F' : 'en-US-Neural2-D');

            // V5215: Set correct language code for the voice region
            const languageCode = isUrdu ? (voice.startsWith('ur-IN') ? 'ur-IN' : 'ur-PK') : 'en-US';

            console.log('🎙️ Browser TTS:', { isUrdu, isFemale, voice, languageCode });

            // Call Google TTS API directly
            const response = await fetch(
                `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        input: { text: text.substring(0, 1000) },
                        voice: { languageCode, name: voice },
                        audioConfig: { audioEncoding: 'MP3' }
                    })
                }
            );

            const data = await response.json();

            if (data.audioContent) {
                return {
                    success: true,
                    audioContent: data.audioContent,
                    voiceUsed: voice
                };
            } else {
                console.error('❌ TTS API Error:', data);
                return { success: false, error: data };
            }

        } catch (error) {
            console.error('❌ Browser TTS Error:', error);
            return { success: false, error: error.message };
        }
    },

    // Browser fallback using Web Speech API
    async speakWithBrowser(text, languageHint) {
        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = languageHint === 'ur' || languageHint === 'ur-PK' ? 'ur-PK' : 'en-US';
            utterance.onend = () => resolve({ success: true, method: 'browser' });
            utterance.onerror = () => resolve({ success: false, method: 'browser' });
            window.speechSynthesis.speak(utterance);
        });
    }
};

console.log('✅ Browser TTS Engine V5100 Ready - NO SERVER NEEDED');
