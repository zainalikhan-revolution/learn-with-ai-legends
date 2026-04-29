#!/bin/bash
echo "🔧 Injecting environment variables into config.js..."

# Replace placeholders with actual environment variables
sed -i "s|%%VITE_GOOGLE_GEMINI_API_KEY%%|${VITE_GOOGLE_GEMINI_API_KEY:-}|g" config.js
sed -i "s|%%VITE_OPENAI_API_KEY%%|${VITE_OPENAI_API_KEY:-}|g" config.js
sed -i "s|%%VITE_OPENROUTER_API_KEY%%|${VITE_OPENROUTER_API_KEY:-}|g" config.js
sed -i "s|%%VITE_GROQ_API_KEY%%|${VITE_GROQ_API_KEY:-}|g" config.js
sed -i "s|%%VITE_DEEPSEEK_API_KEY%%|${VITE_DEEPSEEK_API_KEY:-}|g" config.js
sed -i "s|%%VITE_ELEVENLABS_API_KEY%%|${VITE_ELEVENLABS_API_KEY:-}|g" config.js
sed -i "s|%%VITE_ASSEMBLYAI_API_KEY%%|${VITE_ASSEMBLYAI_API_KEY:-}|g" config.js

sed -i "s|%%VITE_ENABLE_GEMINI%%|${VITE_ENABLE_GEMINI:-false}|g" config.js
sed -i "s|%%VITE_ENABLE_OPENAI%%|${VITE_ENABLE_OPENAI:-false}|g" config.js
sed -i "s|%%VITE_ENABLE_OPENROUTER%%|${VITE_ENABLE_OPENROUTER:-false}|g" config.js
sed -i "s|%%VITE_ENABLE_GROQ%%|${VITE_ENABLE_GROQ:-false}|g" config.js
sed -i "s|%%VITE_ENABLE_DEEPSEEK%%|${VITE_ENABLE_DEEPSEEK:-false}|g" config.js
sed -i "s|%%VITE_ENABLE_ELEVENLABS%%|${VITE_ENABLE_ELEVENLABS:-false}|g" config.js
sed -i "s|%%VITE_ENABLE_ASSEMBLYAI%%|${VITE_ENABLE_ASSEMBLYAI:-false}|g" config.js

# Legacy variables for backwards compatibility
sed -i "s|%%VITE_PRIMARY_AI_PROVIDER%%|${VITE_PRIMARY_AI_PROVIDER:-gemini}|g" config.js
sed -i "s|%%VITE_USE_DATABASE%%|${VITE_USE_DATABASE:-false}|g" config.js

echo "✅ Environment variables injected successfully!"
echo "📊 Active providers:"
echo "   Gemini: ${VITE_ENABLE_GEMINI:-false}"
echo "   OpenAI: ${VITE_ENABLE_OPENAI:-false}"
echo "   Groq: ${VITE_ENABLE_GROQ:-false}"
echo "   DeepSeek: ${VITE_ENABLE_DEEPSEEK:-false}"
echo "   OpenRouter: ${VITE_ENABLE_OPENROUTER:-false}"
