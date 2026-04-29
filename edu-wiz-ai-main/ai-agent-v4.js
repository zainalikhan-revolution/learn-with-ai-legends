// ===================================
// AI AGENT V5000 (SERVER)
// ===================================

class AiAgent {
    async generateText(prompt, options = {}) {
        try {
            const response = await fetch('api-v50.php?action=chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    system_instruction: options.system_instruction
                })
            });

            const rawResponse = await response.text();
            let data;
            try {
                // TRY HARD: Find the first { and last } to strip PHP HTML-noise
                const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
                data = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
            } catch (e) {
                console.error('❌ JSON Parse Fail. Raw:', rawResponse);
                return '📡 Server busy. Please retry.';
            }

            return data.content || '📡 Please retry.';
        } catch (error) {
            console.error('AI error:', error);
            return '📡 Connection error.';
        }
    }
}

class VisionAgent {
    async analyzeImage(base64Image, prompt = "") {
        if (window.BrowserAPIEngine && window.BrowserAPIEngine.chat) {
            try {
                const result = await window.BrowserAPIEngine.chat(prompt, '', base64Image);
                if (result && result.content) return result.content;
            } catch (error) {
                console.warn('Browser vision engine failed, trying server fallback:', error);
            }
        }

        try {
            const response = await fetch('api-v50.php?action=vision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ base64Image, prompt })
            });

            const rawResponse = await response.text();
            let data;
            try {
                const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
                data = JSON.parse(jsonMatch ? jsonMatch[0] : rawResponse);
            } catch (e) {
                console.error('❌ Vision Parse Fail. Raw:', rawResponse);
                return '👁️ Vision temporarily unavailable.';
            }

            return data.content || '👁️ Vision analysis ready.';
        } catch (error) {
            console.error('Vision error:', error);
            return '👁️ Vision temporarily unavailable.';
        }
    }
}

window.aiAgent = new AiAgent();
window.visionAgent = new VisionAgent();
console.log('✅ AI Agent V5000 (SERVER) Ready');
