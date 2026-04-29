// ============================================
// CONFIG.JS - V5132 FINAL FIX
// ✅ FUNCTION BINDING FIXED
// ✅ ALL API KEYS WORKING
// ============================================

(function () {
  'use strict';

  console.log('☢️ Loading V5145 ULTIMATE RECONCILIATION...');

  const env = window.__ENV__ || {};
  const pickKey = (...values) => {
    for (const value of values) {
      if (value && String(value).trim()) return String(value).trim();
    }
    return '';
  };

  window.CONFIG = {
    apiKeys: {
      gemini: pickKey('AIzaSyB9S6dUOUXFDs12rnAYu10CC4vYOscznKo', env.VITE_GEMINI_API_KEY),
      groq: pickKey('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', env.VITE_GROQ_API_KEY),
      tts: pickKey('AIzaSyCdCTqlJhDtAyGv_2ujnRa3jLL6-og1F7E', env.VITE_GOOGLE_CLOUD_TTS_KEY),
      vision: pickKey(env.VITE_GOOGLE_CLOUD_VISION_KEY, 'AIzaSyAiS1nkvUXzV_bXdSdirt3xWEh-gtiADRI'),
      youtube: pickKey('AIzaSyA-AbpYsnsxgO9Qne9Eu8GWlpRuy46Tvbg', env.VITE_YOUTUBE_API_KEY),
      googleSearch: pickKey('AIzaSyAzxu_4DyPr_lEX7sJOmMalZaztJlgvPgs', env.VITE_GOOGLE_SEARCH_API_KEY),
      googleSearchCx: pickKey('67aaf737831ca4618', env.VITE_GOOGLE_SEARCH_CX)
    }
  };

  window.cleanTextForDisplay = function (text) {
    if (!text) return "";
    return text
      .replace(/@@@IMAGES@@@[\s\S]*?(@@@|$)/g, '')
      .replace(/:::IMAGES:::[\s\S]*?(:::|$)/g, '')
      .replace(/@@@VIDEO_SUGGESTIONS@@@[\s\S]*?(@@@|$)/g, '')
      .replace(/:::VIDEO:::[\s\S]*?(:::|$)/g, '')
      .replace(/:::.*?:::/g, '')
      .replace(/\{"link":".*?\}/g, '')
      .trim();
  };

  const API = {
    getKeys: () => window.CONFIG.apiKeys,

    applyScholarUrdu: (text) => {
      if (!text) return text;
      const dict = {
        'سواگت': 'خوش آمدید', 'پرنام': 'اسلام و علیکم', 'دھنیواد': 'شکریہ',
        'نمستے': 'اسلام و علیکم', 'شکتی': 'طاقت', 'گیان': 'علم',
        'وگیان': 'سائنس', 'ہندی': 'اردو کو خالص'
      };
      let cleaned = text.replace(/\[RESPONSE\]|\[PROTOCOL\]/gi, '').trim();
      Object.keys(dict).forEach(k => { cleaned = cleaned.replace(new RegExp(k, 'g'), dict[k]); });
      return cleaned;
    },

    extractImagePayload: (base64Img) => {
      if (!base64Img) return '';
      return String(base64Img).includes(',') ? String(base64Img).split(',')[1].replace(/\s/g, '') : String(base64Img).replace(/\s/g, '');
    },

    detectLanguageStyle: (text = '') => {
      const rawText = String(text);
      const requestMatch = rawText.match(/Student request:\s*([\s\S]*?)(?=\n\s*(?:Internal visual notes:|Answer directly|Never mention|Speak naturally|If the student)|$)/i);
      const value = (requestMatch ? requestMatch[1] : rawText).toLowerCase();
      if (/[\u0600-\u06FF]/.test(value) || /\b(in urdu|urdu mein|urdu me)\b/i.test(value)) return 'Urdu script';
      if (/\b(kya|kiya|kia|hai|hain|ho|mera|meri|mujhe|tum|aap|dekho|dekh|batao|samjhao|kaise|kyun|acha|acha ji|shukriya)\b/i.test(value)) {
        return 'Roman Urdu/Hinglish';
      }
      return 'English';
    },

    cleanVisionAnswer: (text) => {
      if (!text) return text;
      return String(text)
        .replace(/according to\s+(google cloud vision|the vision analysis|the image analysis)[,:\s]*/gi, '')
        .replace(/\bgoogle cloud vision\b/gi, 'what I can see')
        .replace(/\bcloud vision\b/gi, 'what I can see')
        .replace(/\bvision detections?\b/gi, 'what I can see')
        .replace(/\bdetected labels?\b/gi, 'visible details')
        .replace(/\bdetected objects?\b/gi, 'visible objects')
        .replace(/\bocr\b/gi, 'text')
        .replace(/\s{2,}/g, ' ')
        .trim();
    },

    analyzeWithGoogleCloudVision: async (base64Img) => {
      const k = API.getKeys();
      const imgData = API.extractImagePayload(base64Img);

      if (!k.vision) throw new Error('Google Cloud Vision API key is missing');
      if (!imgData) throw new Error('No image data provided to Google Cloud Vision');

      console.log('🔍 V5301 CLOUD VISION request to: https://vision.googleapis.com/v1/images:annotate');
      const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${k.vision}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: imgData },
            features: [
              { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
              { type: 'TEXT_DETECTION', maxResults: 5 },
              { type: 'LABEL_DETECTION', maxResults: 15 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
              { type: 'WEB_DETECTION', maxResults: 10 }
            ]
          }]
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error?.message || `Google Cloud Vision failed with status ${res.status}`);
      }

      const response = data.responses?.[0] || {};
      if (response.error) {
        throw new Error(response.error.message || 'Google Cloud Vision returned an image error');
      }

      const fullText = response.fullTextAnnotation?.text || response.textAnnotations?.[0]?.description || '';
      const labels = (response.labelAnnotations || []).map(item => item.description).filter(Boolean);
      const objects = (response.localizedObjectAnnotations || []).map(item => item.name).filter(Boolean);
      const bestGuesses = (response.webDetection?.bestGuessLabels || []).map(item => item.label).filter(Boolean);
      const webEntities = (response.webDetection?.webEntities || [])
        .filter(item => item.description)
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 8)
        .map(item => item.description);

      const chunks = [];
      if (fullText.trim()) chunks.push(`Detected text/OCR:\n${fullText.trim()}`);
      if (objects.length) chunks.push(`Objects: ${[...new Set(objects)].join(', ')}`);
      if (labels.length) chunks.push(`Labels: ${[...new Set(labels)].join(', ')}`);
      if (bestGuesses.length) chunks.push(`Best guesses: ${[...new Set(bestGuesses)].join(', ')}`);
      if (webEntities.length) chunks.push(`Related visual entities: ${[...new Set(webEntities)].join(', ')}`);

      if (!chunks.length) {
        throw new Error('Google Cloud Vision did not detect readable text, labels, or objects');
      }

      return chunks.join('\n\n');
    },

    interpretVisionSummary: async (prompt, masterSys, visionSummary) => {
      const languageStyle = API.detectLanguageStyle(prompt);
      const interpretationPrompt = `${masterSys}

You are looking through the student's camera. Use the internal visual notes below silently.
Never mention Google Cloud Vision, Cloud Vision, OCR, labels, detections, metadata, backend analysis, or any API/tool name.
Speak naturally as if you personally see the camera frame.
Answer only in this language/style: ${languageStyle}.
If the student's wording is Roman Urdu/Hinglish, reply in Roman Urdu/Hinglish. If it is Urdu script, reply in Urdu script. If it is English, reply in English.
If the visual notes are uncertain, say what seems visible and politely ask the student to show it more clearly.

Student request:
${prompt}

Internal visual notes:
${visionSummary}

Answer directly as the AI tutor. If text or math is visible, read it and help solve/explain it.`;

      const interpreted = await API.chat(interpretationPrompt);
      const content = interpreted?.content ? API.cleanVisionAnswer(window.cleanTextForDisplay(interpreted.content)) : '';
      if (content && !/trouble connecting|please retry|server busy|temporarily unavailable/i.test(content)) {
        return content;
      }
      return API.cleanVisionAnswer(`I can see this: ${visionSummary}`);
    },

    chat: async (prompt, sysRef = '', base64Img = null) => {
      const k = API.getKeys();
      let isVision = !!base64Img;
      let rawContent = null;

      const masterSys = `${sysRef}\n\n[PROTOCOL]: Expert AI Tutor, Pure Scholarly Urdu when needed, Academic & Encouraging`;
      const visionStudentPrompt = isVision
        ? `You are looking through the student's camera.
Never mention Google Cloud Vision, Cloud Vision, OCR, labels, detections, metadata, backend analysis, or any API/tool name.
Speak naturally as if you personally see the camera frame.
Answer only in this language/style: ${API.detectLanguageStyle(prompt)}.
If the student's wording is Roman Urdu/Hinglish, reply in Roman Urdu/Hinglish. If it is Urdu script, reply in Urdu script. If it is English, reply in English.

Student request: ${prompt}`
        : prompt;

      // V5300: VISION-SPECIFIC ENDPOINTS (only models that support multimodal input)
      // gemini-pro does NOT support vision, so exclude it for vision requests
      const visionEndpoints = [
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${k.gemini}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${k.gemini}`
      ];

      const textEndpoints = [
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${k.gemini}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${k.gemini}`,
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${k.gemini}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${k.gemini}`,
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${k.gemini}`
      ];

      const endpoints = isVision ? visionEndpoints : textEndpoints;

      for (const url of endpoints) {
        try {
          const imgData = base64Img ? API.extractImagePayload(base64Img) : null;
          const body = { contents: [{ parts: [{ text: masterSys + "\n\nStudent: " + visionStudentPrompt }] }] };
          if (isVision && imgData) {
            body.contents[0].parts.push({ inline_data: { mime_type: "image/jpeg", data: imgData } });
          }

          console.log(`🔍 V5300 ${isVision ? 'VISION' : 'TEXT'} request to: ${url.split('?')[0]}`);
          const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
          if (res.ok) {
            const d = await res.json();
            const txt = d.candidates?.[0]?.content?.parts?.[0]?.text;
            if (txt) {
              console.log(`✅ V5300 ${isVision ? 'VISION' : 'TEXT'} success!`);
              rawContent = txt;
              break;
            }
          } else {
            const errData = await res.json().catch(() => ({}));
            console.warn(`⚠️ V5300 Endpoint failed (${res.status}):`, errData?.error?.message || 'Unknown error');
          }
        } catch (e) {
          console.warn(`⚠️ V5300 Endpoint exception:`, e.message);
        }
      }

      // Google Cloud Vision fallback. This supports the separate Cloud Vision API key.
      if (!rawContent && isVision) {
        try {
          console.warn('⚠️ Gemini vision failed, trying Google Cloud Vision...');
          const visionSummary = await API.analyzeWithGoogleCloudVision(base64Img);
          rawContent = await API.interpretVisionSummary(prompt, masterSys, visionSummary);
          console.log('✅ V5301 CLOUD VISION fallback success!');
        } catch (e) {
          console.warn('⚠️ Google Cloud Vision fallback failed:', e.message);
        }
      }

      // GROQ FALLBACK (text only - Groq doesn't support vision)
      if (!rawContent && !isVision) {
        console.warn('⚠️ Gemini failed, using Groq...');
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${k.groq}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [{ role: 'system', content: masterSys }, { role: 'user', content: prompt }]
            })
          });
          const d = await res.json();
          if (d.choices?.[0]?.message?.content) rawContent = d.choices[0].message.content;
        } catch (e) { console.error('Groq error:', e); }
      }

      // V5300: If vision STILL failed after trying all endpoints with both keys,
      // show a real error instead of silently stripping the image
      if (!rawContent && isVision) {
        console.error('❌ V5300: ALL vision endpoints failed! Returning vision error.');
        rawContent = "I'm having trouble analyzing the image right now. Please make sure the image is clear and well-lit, then try again. If the problem persists, the vision API may be temporarily unavailable.";
      }

      if (!rawContent) rawContent = "I'm having trouble connecting. Please try again.";

      if (isVision) rawContent = API.cleanVisionAnswer(rawContent);

      return { success: true, content: API.applyScholarUrdu(rawContent) };
    },

    translate: async (text, target = 'ur') => {
      const clean = window.cleanTextForDisplay(text);
      // V5141: Strict Prompt + Scholar Filter
      const prompt = `Translate to ${target === 'ur' ? 'Scholarly Urdu' : 'English'}.
CRITICAL: ONLY provide the translated content. NO headers like [RESPONSE], NO greetings, NO extra text.
Text: ${clean}`;
      const res = await API.chat(prompt);
      const resContent = res.success ? res.content : clean;
      return API.applyScholarUrdu(window.cleanTextForDisplay(resContent));
    },

    searchImages: async (query) => {
      try {
        const k = API.getKeys();
        const res = await fetch(`https://www.googleapis.com/customsearch/v1?key=${k.googleSearch}&cx=${k.googleSearchCx}&q=${encodeURIComponent(query)}&searchType=image&num=5`);
        const d = await res.json();
        // V5215: Use Google CDN thumbnails as primary (ALWAYS loadable, no hotlink block)
        // Keep original link for fullscreen viewing
        return (d.items || []).map(i => ({
          link: i.image?.thumbnailLink || i.link,
          originalLink: i.link,
          title: i.title
        }));
      } catch (e) {
        console.error('Image search error:', e);
        return [];
      }
    },

    searchVideos: async (query, max = 2) => {
      try {
        const k = API.getKeys();
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${k.youtube}&type=video&videoDuration=short&maxResults=${max}`);
        const d = await res.json();
        return (d.items || []).map(i => ({ id: i.id.videoId, title: i.snippet.title }));
      } catch (e) {
        console.error('Video search error:', e);
        return [];
      }
    },

    speak: async (text, tutorName = '', rate = 1.0) => {
      const k = API.getKeys();
      const clean = window.cleanTextForDisplay(text).replace(/[^\w\u0600-\u06FF\s,.?!]/gu, '').replace(/\s+/g, ' ').trim();
      if (clean.length < 2) return { success: false };

      const hasUrdu = /[\u0600-\u06FF]/.test(clean);
      const langCode = hasUrdu ? 'ur-PK' : 'en-US';

      // VOICES THAT ARE GUARANTEED TO WORK OR AUTO-SELECT
      let voicesToTry = [];
      const isFemale = /marie|curie|female/i.test(tutorName);

      if (hasUrdu) {
        // V5215: FIXED URDU VOICE ORDER
        // ur-PK-Wavenet-B and ur-PK-Standard-B DON'T EXIST (return 400)
        // ur-IN has verified working male voices, use those first
        if (isFemale) {
          voicesToTry = ['ur-PK-Wavenet-A', 'ur-PK-Standard-A', 'ur-IN-Wavenet-A', 'ur-IN-Standard-A'];
        } else {
          // Male voices: ur-IN-Wavenet-B is the BEST working male Urdu voice
          voicesToTry = ['ur-IN-Wavenet-B', 'ur-IN-Standard-B', 'ur-IN-Wavenet-C', 'ur-IN-Standard-C', 'ur-PK-Standard-A'];
        }
      } else {
        voicesToTry = isFemale ? ['en-US-Wavenet-C', 'en-US-Standard-C', 'en-US'] : ['en-US-Wavenet-D', 'en-US-Standard-D', 'en-US'];
      }

      for (let vName of voicesToTry) {
        try {
          const vLang = vName.startsWith('ur-IN') ? 'ur-IN' : langCode;
          const body = {
            input: { text: clean.substring(0, 5000) },
            voice: { languageCode: vLang, name: vName },
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate: rate,
              // V5210: Natural powerful male pitch (-1.5 instead of -3.0 which was too deep/robotic)
              pitch: (vName.includes('-B') || vName.includes('-C') || vName.includes('-D')) ? -1.5 : 0.0
            }
          };

          const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${k.tts}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });

          if (res.ok) {
            const data = await res.json();
            if (data.audioContent) return { success: true, audioContent: data.audioContent };
          } else {
            const err = await res.json();
            console.warn(`TTS Fail for ${vName}:`, err);
          }
        } catch (e) { console.error(`TTS Exception for ${vName}:`, e); }
      }

      console.log("☢️ Browser Voice Fallback Triggered");
      return { success: true, browserFallback: true, text: clean, lang: langCode, rate: rate };
    },

    // V5200: MINDMAP GENERATOR 🧠
    generateMindMap: async (topic, subject) => {
      const prompt = `Generate a hierarchical JSON mindmap for the topic "${topic}" in the subject "${subject}".
Format: { "id": "root", "label": "Topic", "children": [ { "id": "c1", "label": "Subtopic", "children": [...] } ] }
Rules:
1. Root node is the main topic.
2. At least 3 major branches.
3. Each branch must have 2-3 sub-branches.
4. Keep labels short (max 4-5 words).
5. STRICT JSON ONLY. No markdown, no "json" tags.`;

      try {
        const res = await API.chat(prompt);
        let jsonStr = res.success ? res.content : '{}';
        // Clean potential markdown
        jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error("MindMap Gen Error:", e);
        return {
          id: "root", label: "Error Loading Map",
          children: [{ id: "e1", label: "Please try again" }]
        };
      }
    }
  };

  window.BrowserAPIEngine = API;
  window.CONFIG.API = API; // ✅ V5146: Expose for VideoCall.js

  const init = () => {
    window.speakText = async (text, tutorName, onStart, onEnd, voiceId, rate = 1.0) => {
      if (onStart) onStart();
      const result = await API.speak(text, tutorName, rate);

      if (result.browserFallback) {
        const u = new SpeechSynthesisUtterance(result.text);
        u.lang = result.lang;
        u.rate = result.rate;

        // V5143: Gender-Aware Browser Fallback
        const voices = window.speechSynthesis.getVoices();
        const isFem = /marie|curie|female/i.test(tutorName);
        const matchingVoice = voices.find(v => v.lang.startsWith(result.lang) && (isFem ? !/male|david|mark/i.test(v.name) : /male|david|mark/i.test(v.name))) || voices.find(v => v.lang.startsWith(result.lang));

        if (matchingVoice) {
          u.voice = matchingVoice;
          if (!isFem) u.pitch = 0.5;
        } else {
          console.warn(`⚠️ No native browser voice found for ${result.lang}. May sound like English.`);
        }

        // V1700: Connect LipSync Engine for avatar mouth animation
        u.onstart = () => { if (window.LipSyncEngine) window.LipSyncEngine.connectSpeechSynthesis(); };
        u.onend = () => { if (window.LipSyncEngine) window.LipSyncEngine.disconnect(); if (onEnd) onEnd(); };
        u.onerror = () => { if (window.LipSyncEngine) window.LipSyncEngine.disconnect(); if (onEnd) onEnd(); };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
        return;
      }

      if (result.success && result.audioContent) {
        const audio = new Audio();
        const blob = new Blob([Uint8Array.from(atob(result.audioContent), c => c.charCodeAt(0))], { type: 'audio/mp3' });
        audio.src = URL.createObjectURL(blob);
        audio.playbackRate = rate;
        // V1700: Connect LipSync Engine for avatar mouth animation
        audio.onplay = () => { if (window.LipSyncEngine) { try { window.LipSyncEngine.connectAudioElement(audio); } catch(e) { window.LipSyncEngine.setSpeaking(true); } } };
        audio.onended = () => { if (window.LipSyncEngine) window.LipSyncEngine.disconnect(); if (onEnd) onEnd(); };
        audio.onerror = () => { if (window.LipSyncEngine) window.LipSyncEngine.disconnect(); if (onEnd) onEnd(); };
        window.currentAudio = audio;
        await audio.play();
      } else {
        if (onEnd) onEnd();
      }
    };

    window.stopAllVoices = () => {
      if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio.currentTime = 0;
        window.currentAudio = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      // V1700: Stop LipSync on voice kill
      if (window.LipSyncEngine) window.LipSyncEngine.disconnect();
    };

    window.googleTranslate = (text, target) => API.translate(text, target);
    window.searchGoogleImages = (query) => API.searchImages(query);
    window.searchYouTubeVideos = (query, max) => API.searchVideos(query, max);

    const unlock = () => {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      window.speechSynthesis?.resume();
    };
    ['click', 'touchstart', 'mousedown', 'keydown'].forEach(e =>
      window.addEventListener(e, unlock, { once: true })
    );

    console.log('✅ V5145 ULTIMATE RECONCILIATION READY');
  };

  [0, 500, 1000, 2000].forEach(t => setTimeout(init, t));
})();
