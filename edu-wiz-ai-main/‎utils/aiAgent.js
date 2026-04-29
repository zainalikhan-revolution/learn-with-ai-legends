// ============================================
// AI AGENT - TEXT + VISION - COMPLETE FIXED
// ✅ Creates window.aiAgent for text chat
// ✅ Creates window.visionAgent for vision
// ✅ Fixed provider type detection
// ============================================

// ============================================
// TEXT AI AGENT
// ============================================
class TextAIAgent {
  constructor() {
    this.providers = [];
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;
    
    if (!window.CONFIG || !window.CONFIG.textAI) {
      console.warn('⚠️ Text AI config not found');
      return;
    }

    this.providers = window.CONFIG.textAI
      .filter(p => p.enabled)
      .sort((a, b) => a.priority - b.priority);
    
    this.initialized = true;
    
    console.log('🔧 Text AI Agent initialized with providers:');
    this.providers.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} (Priority: ${p.priority})`);
    });
  }

  async generateText(prompt, options = {}) {
    this.initialize();
    
    if (this.providers.length === 0) {
      throw new Error('No text AI providers available. Check your API keys in config.js');
    }

    let lastError = null;
    
    // Try each provider in order
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      console.log(`🤖 Trying ${provider.name}...`);
      
      try {
        // Detect provider type from name or endpoint
        let providerType;
        if (provider.name.toLowerCase().includes('groq')) {
          providerType = 'groq';
        } else if (provider.name.toLowerCase().includes('openrouter')) {
          providerType = 'openrouter';
        } else if (provider.name.toLowerCase().includes('deepseek')) {
          providerType = 'deepseek';
        } else if (provider.name.toLowerCase().includes('openai')) {
          providerType = 'openai';
        } else {
          throw new Error(`Unknown provider: ${provider.name}`);
        }
        
        let result;
        
        switch (providerType) {
          case 'groq':
            result = await this.generateWithGroq(prompt, provider, options);
            break;
          case 'openrouter':
            result = await this.generateWithOpenRouter(prompt, provider, options);
            break;
          case 'deepseek':
            result = await this.generateWithDeepSeek(prompt, provider, options);
            break;
          case 'openai':
            result = await this.generateWithOpenAI(prompt, provider, options);
            break;
          default:
            throw new Error(`Unknown provider type: ${providerType}`);
        }
        
        if (result) {
          console.log(`✅ ${provider.name} success!`);
          return result;
        }
      } catch (error) {
        console.warn(`❌ ${provider.name} failed:`, error.message);
        lastError = error;
        continue;
      }
    }
    
    throw new Error(`All text AI providers failed. Last error: ${lastError?.message || 'Unknown'}`);
  }

  async generateWithGroq(prompt, provider, options) {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Groq failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async generateWithOpenRouter(prompt, provider, options) {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'E-Study Card'
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenRouter failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async generateWithDeepSeek(prompt, provider, options) {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `DeepSeek failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async generateWithOpenAI(prompt, provider, options) {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: options.temperature || 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenAI failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

// ============================================
// VISION AI AGENT
// ============================================
class VisionAgent {
  constructor() {
    this.providers = [];
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;
    
    if (!window.CONFIG || !window.CONFIG.visionAI) {
      console.warn('⚠️ Vision config not found');
      return;
    }

    this.providers = window.CONFIG.visionAI
      .filter(p => p.enabled)
      .sort((a, b) => a.priority - b.priority);
    
    this.initialized = true;
    
    console.log('🔧 Vision Agent initialized with providers:');
    this.providers.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} (Priority: ${p.priority})`);
    });
  }

  async analyzeImage(base64Image, prompt) {
    this.initialize();
    
    if (this.providers.length === 0) {
      throw new Error('No vision providers available. Check your API keys in config.js');
    }

    let lastError = null;
    
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      console.log(`🔍 Trying ${provider.name}...`);
      
      try {
        let result;
        
        // Use the type from config, or detect from name
        const type = provider.type || (
          provider.name.toLowerCase().includes('gemini') ? 'gemini' :
          provider.name.toLowerCase().includes('openai') ? 'openai' :
          provider.name.toLowerCase().includes('google') ? 'google_cloud' :
          null
        );
        
        if (!type) {
          throw new Error(`Cannot determine provider type for ${provider.name}`);
        }
        
        switch (type) {
          case 'gemini':
            result = await this.analyzeWithGemini(base64Image, prompt, provider);
            break;
          case 'openai':
            result = await this.analyzeWithOpenAI(base64Image, prompt, provider);
            break;
          case 'google_cloud':
            result = await this.analyzeWithGoogleCloud(base64Image, prompt, provider);
            break;
          default:
            throw new Error(`Unknown provider type: ${type}`);
        }
        
        if (result) {
          console.log(`✅ ${provider.name} success!`);
          return result;
        }
      } catch (error) {
        console.warn(`❌ ${provider.name} failed:`, error.message);
        lastError = error;
        continue;
      }
    }
    
    throw new Error(`All vision providers failed. Last error: ${lastError?.message || 'Unknown'}`);
  }

  async analyzeWithGemini(base64Image, prompt, provider) {
    const response = await fetch(`${provider.endpoint}?key=${provider.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: 'image/jpeg', data: base64Image } }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: provider.maxTokens || 1000
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Gemini Vision failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini');
    }

    return data.candidates[0].content.parts[0].text;
  }

  async analyzeWithOpenAI(base64Image, prompt, provider) {
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: 'low'
              }
            }
          ]
        }],
        max_tokens: provider.maxTokens || 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenAI Vision failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }

    return data.choices[0].message.content;
  }

  async analyzeWithGoogleCloud(base64Image, prompt, provider) {
    const response = await fetch(`${provider.endpoint}?key=${provider.apiKey}`, {
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Google Cloud Vision failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text and labels
    const textAnnotations = data.responses[0].textAnnotations || [];
    const labelAnnotations = data.responses[0].labelAnnotations || [];
    
    const detectedText = textAnnotations.length > 0 ? textAnnotations[0].description : 'No text detected';
    const labels = labelAnnotations.map(l => l.description).join(', ');
    
    return `I can see: ${labels}.\n\nDetected text: ${detectedText}\n\n${prompt}`;
  }
}

// ============================================
// CREATE GLOBAL INSTANCES
// ============================================
window.aiAgent = new TextAIAgent();
window.visionAgent = new VisionAgent();

console.log('✅ Text AI Agent loaded with multi-provider support');
console.log('✅ Vision Agent loaded with multi-provider support');
