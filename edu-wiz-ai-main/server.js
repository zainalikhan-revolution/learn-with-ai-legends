const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images

// ============================================
// API ROUTES
// ============================================

// 1. CHAT GENERATION
app.post('/api/chat', async (req, res) => {
    try {
        const { provider, prompt, options } = req.body;

        console.log(`🤖 Chat Request: ${provider} - ${prompt.substring(0, 50)}...`);

        let apiKey, endpoint, model;

        // Select Provider Configuration
        switch (provider) {
            case 'groq':
                apiKey = process.env.VITE_GROQ_API_KEY;
                endpoint = 'https://api.groq.com/openai/v1/chat/completions';
                model = options.model || 'llama-3.3-70b-versatile';
                break;
            case 'openrouter':
                apiKey = process.env.VITE_OPENROUTER_API_KEY;
                endpoint = 'https://openrouter.ai/api/v1/chat/completions';
                model = options.model || 'meta-llama/llama-3.1-8b-instruct:free';
                break;
            case 'deepseek':
                apiKey = process.env.VITE_DEEPSEEK_API_KEY;
                endpoint = 'https://api.deepseek.com/v1/chat/completions';
                model = options.model || 'deepseek-chat';
                break;
            case 'openai':
                apiKey = process.env.VITE_OPENAI_API_KEY;
                endpoint = 'https://api.openai.com/v1/chat/completions';
                model = options.model || 'gpt-3.5-turbo';
                break;
            default:
                return res.status(400).json({ error: 'Invalid provider' });
        }

        if (!apiKey) {
            return res.status(500).json({ error: `API Key for ${provider} not configured on server` });
        }

        // Make Request
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                ...(provider === 'openrouter' ? {
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'E-Study Card'
                } : {})
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                temperature: options.temperature || 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `${provider} failed with status ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        res.json({ content });

    } catch (error) {
        console.error('❌ Chat API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 2. VISION ANALYSIS
app.post('/api/vision', async (req, res) => {
    try {
        const { provider, base64Image, prompt } = req.body;

        console.log(`👁️ Vision Request: ${provider}`);

        let apiKey;
        let result = '';

        switch (provider) {
            case 'google_cloud':
                apiKey = process.env.VITE_GOOGLE_CLOUD_VISION_KEY;
                if (!apiKey) throw new Error('Google Cloud Vision API key missing');

                const gcvResponse = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        requests: [{
                            image: { content: base64Image },
                            features: [
                                { type: 'TEXT_DETECTION', maxResults: 10 },
                                { type: 'LABEL_DETECTION', maxResults: 10 },
                                { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 10 }
                            ]
                        }]
                    })
                });

                if (!gcvResponse.ok) throw new Error(`Google Cloud Vision failed: ${gcvResponse.statusText}`);

                const gcvData = await gcvResponse.json();
                const text = gcvData.responses[0].textAnnotations?.[0]?.description || 'No text detected';
                const labels = gcvData.responses[0].labelAnnotations?.map(l => l.description).join(', ') || 'No labels';

                result = `I can see: ${labels}.\n\nDetected text: ${text}\n\n${prompt}`;
                break;

            case 'gemini':
                apiKey = process.env.VITE_GEMINI_API_KEY;
                if (!apiKey) throw new Error('Gemini API key missing');

                const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { text: prompt },
                                { inline_data: { mime_type: 'image/jpeg', data: base64Image } }
                            ]
                        }]
                    })
                });

                if (!geminiResponse.ok) throw new Error(`Gemini failed: ${geminiResponse.statusText}`);

                const geminiData = await geminiResponse.json();
                result = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
                break;

            case 'openai':
                apiKey = process.env.VITE_OPENAI_API_KEY;
                if (!apiKey) throw new Error('OpenAI API key missing');

                const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o-mini',
                        messages: [{
                            role: 'user',
                            content: [
                                { type: 'text', text: prompt },
                                { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                            ]
                        }],
                        max_tokens: 1000
                    })
                });

                if (!openaiResponse.ok) throw new Error(`OpenAI failed: ${openaiResponse.statusText}`);

                const openaiData = await openaiResponse.json();
                result = openaiData.choices?.[0]?.message?.content || 'No response';
                break;

            default:
                return res.status(400).json({ error: 'Invalid provider' });
        }

        res.json({ content: result });

    } catch (error) {
        console.error('❌ Vision API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve static files (AFTER API routes to avoid conflicts)
app.use(express.static(path.join(__dirname)));

// Start Server (Only if run directly)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`✅ Proxy Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
