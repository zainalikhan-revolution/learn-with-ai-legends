# 🔑 API Setup Guide for E-Study Card AI Tutor

## Overview

E-Study Card uses Trickle's built-in AI function `invokeAIAgent()` which doesn't require any API key configuration. However, if you want to add advanced features, here's how to integrate external APIs.

---

## ✅ Currently Working (No API Key Needed)

### Trickle AI Agent
The platform currently uses **Trickle's built-in AI** via `invokeAIAgent()` function:
- **Location**: `utils/aiAgent.js`
- **Function**: `chatWithTutor(tutor, userMessage)`
- **Cost**: FREE (included with Trickle platform)
- **No configuration needed**

---

## 🚀 Optional Advanced Features (Requires API Keys)

### 1. Voice Features (Speech-to-Text & Text-to-Speech)

#### Option A: Google Cloud Speech & TTS (Recommended)

**Setup Steps:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Cloud Speech-to-Text API
   - Cloud Text-to-Speech API
4. Create credentials (API Key)
5. Copy your API key

**Add to code:**

```javascript
// In utils/voiceHandler.js (create new file)
const GOOGLE_API_KEY = 'YOUR_API_KEY_HERE';

// Speech to Text
async function speechToText(audioBlob) {
  const response = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify({
        audio: { content: audioBlob },
        config: {
          languageCode: 'ur-PK', // Urdu Pakistan
          alternativeLanguageCodes: ['en-US']
        }
      })
    }
  );
  return await response.json();
}

// Text to Speech
async function textToSpeech(text) {
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: 'ur-PK', name: 'ur-PK-Standard-A' },
        audioConfig: { audioEncoding: 'MP3' }
      })
    }
  );
  return await response.json();
}
```

**Pricing:**
- Speech-to-Text: $0.024/minute (₹2.5/minute)
- Text-to-Speech: $16 per 1M characters

---

#### Option B: ElevenLabs (Premium Voice)

**Setup:**
1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Go to Profile → API Keys
3. Generate new API key

**Add to code:**

```javascript
// In utils/voiceHandler.js
const ELEVENLABS_API_KEY = 'YOUR_ELEVENLABS_KEY';

async function textToSpeechElevenLabs(text) {
  const response = await fetch(
    'https://api.elevenlabs.io/v1/text-to-speech/VOICE_ID',
    {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2'
      })
    }
  );
  return await response.blob();
}
```

**Pricing:** $99/month for 500K characters

---

### 2. Video Avatar Features (Realistic Talking Avatars)

#### Option A: HeyGen API (Recommended)

**Setup:**
1. Sign up at [HeyGen](https://www.heygen.com/)
2. Go to API Dashboard
3. Generate API key

**Add to code:**

```javascript
// In utils/avatarHandler.js (create new file)
const HEYGEN_API_KEY = 'YOUR_HEYGEN_KEY';

async function generateTalkingAvatar(text, avatarId) {
  const response = await fetch(
    'https://api.heygen.com/v1/video.generate',
    {
      method: 'POST',
      headers: {
        'X-Api-Key': HEYGEN_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar_id: avatarId,
        text: text,
        voice_id: 'urdu_voice'
      })
    }
  );
  return await response.json();
}
```

**Pricing:** $199-499/month

---

#### Option B: D-ID API

**Setup:**
1. Sign up at [D-ID](https://www.d-id.com/)
2. Get API key from dashboard

**Add to code:**

```javascript
const DID_API_KEY = 'YOUR_DID_KEY';

async function createTalkingAvatar(imageUrl, audioUrl) {
  const response = await fetch(
    'https://api.d-id.com/talks',
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${DID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_url: imageUrl,
        script: {
          type: 'audio',
          audio_url: audioUrl
        }
      })
    }
  );
  return await response.json();
}
```

**Pricing:** $49-199/month

---

### 3. Image Analysis (Homework OCR)

#### Google Cloud Vision API

**Setup:**
1. Enable Cloud Vision API in Google Cloud Console
2. Use same API key as above

**Add to code:**

```javascript
// In utils/imageAnalyzer.js (create new file)
const GOOGLE_API_KEY = 'YOUR_API_KEY_HERE';

async function analyzeHomework(imageBase64) {
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify({
        requests: [{
          image: { content: imageBase64 },
          features: [
            { type: 'TEXT_DETECTION' },
            { type: 'DOCUMENT_TEXT_DETECTION' }
          ]
        }]
      })
    }
  );
  const result = await response.json();
  return result.responses[0].textAnnotations[0].description;
}
```

**Pricing:** ₹1.5 per 1000 images

---

### 4. Video Call Infrastructure

#### Agora.io (Recommended)

**Setup:**
1. Sign up at [Agora](https://www.agora.io/)
2. Create new project
3. Get App ID and App Certificate

**Add to code:**

```javascript
// In utils/videoCall.js (create new file)
const AGORA_APP_ID = 'YOUR_AGORA_APP_ID';

async function initVideoCall(channelName) {
  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  await client.join(AGORA_APP_ID, channelName, null, null);
  
  const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  
  await client.publish([localVideoTrack, localAudioTrack]);
  return { client, localVideoTrack, localAudioTrack };
}
```

**Pricing:** $0.99 per 1000 minutes (10,000 free minutes/month)

---

## 📋 Implementation Checklist

### Phase 1: Basic Setup (Already Done ✅)
- [x] Text chat with AI tutors
- [x] Video call interface (static images)
- [x] Homework upload
- [x] Live transcript viewer

### Phase 2: Voice Features (Optional)
- [ ] Add Google Speech-to-Text API key
- [ ] Implement voice input in VideoCall component
- [ ] Add Text-to-Speech for AI responses
- [ ] Test with Urdu and English

### Phase 3: Video Avatars (Optional)
- [ ] Choose HeyGen or D-ID
- [ ] Add API key
- [ ] Integrate talking avatar generation
- [ ] Test lip-sync with Pakistani accent

### Phase 4: Advanced OCR (Optional)
- [ ] Add Google Vision API key
- [ ] Implement homework problem extraction
- [ ] Show step-by-step solutions

---

## 💡 Recommendations

### For MVP (Minimum Viable Product):
**Use current setup** - No API keys needed. Trickle AI works perfectly for text chat.

### For Enhanced Experience:
1. **Add Google Cloud APIs** ($50-100/month)
   - Speech-to-Text for voice questions
   - Text-to-Speech for voice responses
   - Vision API for homework OCR

### For Premium Version:
1. **Add HeyGen** ($199-499/month)
   - Realistic talking avatars
   - Professional video quality
2. **Add Agora.io** ($50-200/month)
   - Real-time video calls
   - Screen sharing

---

## 🔒 Security Best Practices

**Never expose API keys in frontend code!**

### Correct Approach:

1. **Use Trickle Proxy API:**
```javascript
async function secureAPICall(endpoint, data) {
  const response = await fetch(
    `https://proxy-api.trickle-app.host/?url=${endpoint}`,
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_KEY', // Key stays server-side
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );
  return await response.json();
}
```

2. **Store keys in environment variables** (not in code)

---

## 📞 Support

For API key issues:
- Email: support@trickle.so
- Documentation: Check each API provider's docs

---

*Last updated: October 27, 2025*