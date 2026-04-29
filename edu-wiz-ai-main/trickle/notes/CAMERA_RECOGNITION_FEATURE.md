# 📸 Camera Recognition Feature - Implementation Guide

## Overview

This guide explains how to add real-time camera recognition so students can show their homework directly to the camera and get instant AI analysis and solutions.

---

## 🎯 Feature Description

**What it does:**
- Student opens video call with AI tutor
- Student shows homework/question to camera
- AI captures frame, recognizes text/math
- AI provides step-by-step solution in real-time
- Works with handwritten and printed text

**Languages supported:**
- Urdu (اردو)
- English
- Mixed Urdu-English

---

## 🔧 Technical Implementation

### Step 1: Enable Camera Access

Add to `components/VideoCall.js`:

```javascript
const [stream, setStream] = React.useState(null);
const [isCapturing, setIsCapturing] = React.useState(false);
const videoRef = React.useRef(null);
const canvasRef = React.useRef(null);

// Start camera
const startCamera = async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { 
        width: 1280, 
        height: 720,
        facingMode: 'user' // or 'environment' for back camera
      }
    });
    setStream(mediaStream);
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  } catch (error) {
    console.error('Camera access denied:', error);
    addToTranscript('system', '⚠️ Please allow camera access');
  }
};

// Capture frame
const captureFrame = () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  
  return canvas.toDataURL('image/jpeg', 0.8);
};
```

### Step 2: Add OCR with Google Cloud Vision API

Create `utils/homeworkRecognition.js`:

```javascript
const GOOGLE_VISION_API_KEY = 'YOUR_API_KEY';

async function recognizeHomework(imageBase64) {
  // Remove data URL prefix
  const base64Image = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: base64Image },
          features: [
            { type: 'TEXT_DETECTION', maxResults: 1 },
            { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 }
          ],
          imageContext: {
            languageHints: ['en', 'ur'] // Support English and Urdu
          }
        }]
      })
    }
  );
  
  const result = await response.json();
  if (result.responses && result.responses[0].textAnnotations) {
    return result.responses[0].textAnnotations[0].description;
  }
  return null;
}

async function analyzeHomeworkWithAI(recognizedText, tutor) {
  const systemPrompt = `You are ${tutor.name}, a ${tutor.subject} expert.
  
The student has shown you this homework problem:
"${recognizedText}"

Please:
1. Identify the problem type
2. Provide a step-by-step solution
3. Explain the concept in simple terms
4. Use Pakistani examples when relevant
5. Respond in the same language as the question`;

  return await invokeAIAgent(systemPrompt, recognizedText);
}
```

### Step 3: Add Auto-Capture Feature

```javascript
// Auto-capture every 2 seconds when enabled
React.useEffect(() => {
  let interval;
  if (isCapturing && stream) {
    interval = setInterval(async () => {
      const frame = captureFrame();
      const text = await recognizeHomework(frame);
      
      if (text && text.length > 10) { // Valid homework detected
        setIsCapturing(false); // Stop auto-capture
        addToTranscript('system', '📸 Homework detected! Analyzing...');
        
        const solution = await analyzeHomeworkWithAI(text, tutor);
        addToTranscript('assistant', `${tutor.name}: ${solution}`);
      }
    }, 2000);
  }
  
  return () => clearInterval(interval);
}, [isCapturing, stream]);
```

### Step 4: Update UI with Camera Controls

Add to VideoCall component:

```jsx
<div className="flex gap-3">
  <button 
    onClick={startCamera}
    className="flex-1 btn-primary py-3"
  >
    <div className="flex items-center justify-center gap-2">
      <div className="icon-camera text-xl"></div>
      <span>Enable Camera</span>
    </div>
  </button>
  
  <button 
    onClick={() => setIsCapturing(!isCapturing)}
    disabled={!stream}
    className={`flex-1 py-3 rounded-lg font-semibold ${
      isCapturing 
        ? 'bg-red-600 hover:bg-red-700' 
        : 'bg-green-600 hover:bg-green-700'
    }`}
  >
    <div className="flex items-center justify-center gap-2">
      <div className={`icon-${isCapturing ? 'stop-circle' : 'play'} text-xl`}></div>
      <span>{isCapturing ? 'Stop Recognition' : 'Start Recognition'}</span>
    </div>
  </button>
</div>

{/* Camera Preview */}
{stream && (
  <div className="relative rounded-lg overflow-hidden border-2 border-green-500">
    <video 
      ref={videoRef}
      autoPlay 
      playsInline
      className="w-full h-48 object-cover"
    />
    {isCapturing && (
      <div className="absolute top-2 right-2 bg-red-600 px-3 py-1 rounded-full">
        <span className="text-sm font-bold text-white">🔴 Scanning...</span>
      </div>
    )}
  </div>
)}

<canvas ref={canvasRef} className="hidden" />
```

---

## 💰 Pricing

### Google Cloud Vision API:
- **First 1,000 requests/month**: FREE
- **After that**: $1.50 per 1,000 requests
- **Estimated cost for 1000 students**: $50-100/month

### Alternative: OpenAI Vision API:
- **GPT-4 Vision**: $0.01 per image
- **More accurate** for complex math problems
- **Better** for mixed Urdu-English text

---

## 🎯 User Experience Flow

1. **Student clicks "Video Call"**
2. **AI tutor appears**
3. **Student clicks "Enable Camera"** → Browser asks permission
4. **Student clicks "Start Recognition"** → Camera starts analyzing
5. **Student shows homework to camera**
6. **AI captures frame automatically**
7. **AI recognizes text** (2-3 seconds)
8. **AI provides solution** in transcript
9. **Student can ask follow-up questions**

---

## 🔒 Privacy & Security

### Important Considerations:

1. **Camera Permission**: Always request user consent
2. **Data Storage**: Don't store captured images unless user agrees
3. **Local Processing**: Process frames locally when possible
4. **HTTPS Required**: Camera API only works on secure connections
5. **Age Restrictions**: Ensure COPPA compliance for students under 13

### Implementation:

```javascript
// Check for HTTPS
if (window.location.protocol !== 'https:') {
  alert('Camera feature requires HTTPS connection');
  return;
}

// Request permission with clear explanation
const requestCameraPermission = async () => {
  const consent = confirm(
    'E-Study Card needs camera access to analyze your homework.\n\n' +
    '• Images are processed in real-time\n' +
    '• Not stored on our servers\n' +
    '• Used only for homework analysis\n\n' +
    'Allow camera access?'
  );
  
  if (consent) {
    await startCamera();
  }
};
```

---

## 📱 Mobile Optimization

### Responsive Camera Controls:

```javascript
// Detect mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Use appropriate camera (front/back)
const constraints = {
  video: {
    facingMode: isMobile ? 'environment' : 'user',
    width: { ideal: isMobile ? 720 : 1280 },
    height: { ideal: isMobile ? 1280 : 720 }
  }
};
```

---

## 🧪 Testing Checklist

- [ ] Test with printed homework
- [ ] Test with handwritten homework
- [ ] Test with Urdu text
- [ ] Test with English text
- [ ] Test with mixed Urdu-English
- [ ] Test with math equations
- [ ] Test with diagrams
- [ ] Test on mobile devices
- [ ] Test in low light conditions
- [ ] Test camera permissions
- [ ] Test without HTTPS (should fail gracefully)
- [ ] Test with multiple students simultaneously

---

## 🎓 Example Use Cases

### Physics Problem:
```
Student shows: "A ball is thrown at 20 m/s. Find max height."
AI recognizes: Text + identifies as projectile motion
AI responds: "Great physics question! Let me solve this step by step..."
```

### Math Problem:
```
Student shows: "Solve: 2x + 5 = 15"
AI recognizes: Algebraic equation
AI responds: "This is a linear equation. Let's solve it together..."
```

### Urdu Question:
```
Student shows: "قائد اعظم کی پیدائش کب ہوئی؟"
AI recognizes: Pakistan Studies question in Urdu
AI responds: "بہت اچھا سوال! قائد اعظم 25 دسمبر 1876 کو پیدا ہوئے..."
```

---

## 🚀 Implementation Timeline

### Phase 1 (Week 1-2): Basic Camera
- [ ] Add camera access
- [ ] Implement frame capture
- [ ] Test on multiple devices

### Phase 2 (Week 3-4): OCR Integration
- [ ] Integrate Google Cloud Vision
- [ ] Add text recognition
- [ ] Test with sample homework

### Phase 3 (Week 5-6): AI Analysis
- [ ] Connect to AI tutor
- [ ] Implement solution generation
- [ ] Test with real students

### Phase 4 (Week 7-8): Optimization
- [ ] Improve accuracy
- [ ] Reduce latency
- [ ] Add mobile support

---

## 📞 Support

For camera feature implementation:
- Email: support@trickle.so
- Documentation: See API_SETUP_GUIDE.md

---

*Last updated: October 27, 2025*
*Feature Status: Planned (Not yet implemented)*
*Estimated Cost: $50-100/month for 1000 active students*