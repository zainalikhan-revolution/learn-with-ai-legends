# 🎓 E-Study Card - AI Video Tutor Platform

Pakistan's first AI video tutor platform with 8 legendary teachers providing personalized learning experiences.

## 🌟 Features

- **8 AI Tutors**: Einstein, Al-Khwarizmi, Marie Curie, Ibn Sina, Alan Turing, Allama Iqbal, Shakespeare, Mirza Ghalib
- **Live Video Calls**: Face-to-face learning with realistic AI avatars
- **Bilingual Support**: Learn in Urdu, English, or mix both languages
- **Homework Upload**: Take photos of homework and get instant solutions
- **Real-time Transcript**: Live conversation history with timestamps
- **Smart Personalization**: AI adapts to your learning style

## 🚀 Quick Deployment to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Then add your API keys in Vercel Dashboard → Settings → Environment Variables.

See **VERCEL_DEPLOYMENT.md** for detailed instructions.

## 🔑 Environment Variables

Add these in Vercel Dashboard for advanced features:

```
VITE_GOOGLE_API_KEY=your_key
VITE_HEYGEN_API_KEY=your_key
VITE_ELEVENLABS_API_KEY=your_key
VITE_AGORA_APP_ID=your_id
VITE_DID_API_KEY=your_key
```

## 💻 Tech Stack

- React 18 (CDN)
- TailwindCSS (CDN)
- Trickle AI (built-in, free)
- Pure HTML/CSS/JS (no build step!)

## 📁 Project Structure

```
/
├── index.html              # Main landing page
├── app.js                  # Main app logic
├── config.js               # API configuration
├── vercel.json             # Vercel config
├── components/             # React components
├── utils/                  # Utility functions
├── trickle/
│   ├── assets/            # Images and resources
│   ├── notes/             # Documentation
│   └── rules/             # Development rules
├── VERCEL_DEPLOYMENT.md   # Deployment guide
└── README.md              # This file
```

## 🎯 For Students

1. Visit the website
2. Choose your AI tutor
3. Start learning via video call or text chat
4. Upload homework for instant help
5. Learn at your own pace!

## 🛠️ For Developers

### Local Development

1. Clone/download the project
2. Open `index.html` in browser
3. No build step needed!

### Production Deployment

1. Deploy to Vercel (recommended)
2. Add API keys as environment variables
3. Done!

## 📚 Documentation

- **VERCEL_DEPLOYMENT.md** - Complete deployment guide
- **trickle/notes/API_SETUP_GUIDE.md** - API configuration
- **trickle/notes/DEPLOYMENT_GUIDE.md** - All hosting options
- **trickle/notes/CAMERA_RECOGNITION_FEATURE.md** - Future features

## 🌐 Embedding in Your Website

### iFrame Method:
```html
<iframe src="https://your-vercel-url.vercel.app" width="100%" height="800px"></iframe>
```

### Direct Link:
```html
<a href="https://your-vercel-url.vercel.app">Launch AI Tutor</a>
```

## 📊 Costs

- **Trickle AI**: FREE (included)
- **Google Cloud**: $0-50/month (free tier available)
- **Vercel Hosting**: FREE (hobby plan)
- **Optional APIs**: $50-500/month (HeyGen, ElevenLabs, etc.)

## 📞 Support

- Email: support@trickle.so
- Documentation: See `/trickle/notes/` folder

## 📄 License

© 2025 E-Study Card. All rights reserved.

---

**Ready to deploy?** See VERCEL_DEPLOYMENT.md for step-by-step guide!