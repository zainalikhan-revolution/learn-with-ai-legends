# 🚀 Vercel Deployment Guide for E-Study Card

## Quick Start - Deploy to Vercel in 5 Minutes

### Step 1: Prepare Your Project

1. **Download all project files** from Trickle
2. Make sure you have these files:
   - `index.html`
   - `app.js`
   - `config.js`
   - `vercel.json`
   - All components and utils folders

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to your project folder
cd e-study-card-ai-tutor

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. **Import Git Repository** or **Upload Files**
4. Configure:
   - Framework Preset: **Other**
   - Build Command: *Leave empty*
   - Output Directory: *Leave empty*
   - Install Command: *Leave empty*
5. Click **"Deploy"**
6. Your site will be live at `https://your-project.vercel.app`

### Step 3: Configure Environment Variables (API Keys)

After deployment, add your API keys:

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each API key:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `VITE_OPENAI_API_KEY` | `your_key_here` | OpenAI GPT-4 for advanced AI |
| `VITE_ELEVENLABS_API_KEY` | `your_key_here` | ElevenLabs for voice synthesis |
| `VITE_OPENROUTER_API_KEY` | `your_key_here` | OpenRouter for multiple AI models |
| `VITE_GOOGLE_AI_API_KEY` | `your_key_here` | Google AI Studio for Gemini |
| `VITE_ASSEMBLYAI_API_KEY` | `your_key_here` | AssemblyAI for speech-to-text |
| `VITE_GOOGLE_CLOUD_API_KEY` | `your_key_here` | Google Cloud for Vision OCR |
| `VITE_HEYGEN_API_KEY` | `your_key_here` | HeyGen for talking avatars |
| `VITE_AGORA_APP_ID` | `your_app_id_here` | Agora for video calls |
| `VITE_DID_API_KEY` | `your_key_here` | D-ID for avatar animation |

4. Click **"Save"** for each variable
5. **Redeploy** your project to apply changes

---

## 🔑 How to Get API Keys

### 1. OpenAI API Key (MOST IMPORTANT)

**For:** GPT-4 AI responses, advanced tutoring

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or login
3. Click **"Create new secret key"**
4. Copy the key immediately (you won't see it again!)
5. Add to Vercel: `VITE_OPENAI_API_KEY`

**Cost:** $0.01-0.03 per 1K tokens (very affordable)

---

### 2. ElevenLabs API Key

**For:** Natural voice synthesis in Urdu and English

1. Go to [ElevenLabs Developer Portal](https://elevenlabs.io/app/developers/api-keys)
2. Sign up or login
3. Generate API key
4. Copy the key
5. Add to Vercel: `VITE_ELEVENLABS_API_KEY`

**Cost:** Starting at $5/month

---

### 3. OpenRouter API Key

**For:** Access to multiple AI models (Claude, GPT, Gemini, etc.)

1. Go to [OpenRouter Settings](https://openrouter.ai/settings/keys)
2. Sign up or login
3. Generate API key
4. Copy the key
5. Add to Vercel: `VITE_OPENROUTER_API_KEY`

**Cost:** Pay-per-use, very affordable

---

### 4. Google AI Studio API Key

**For:** Google Gemini AI models

1. Go to [Google AI Studio](https://aistudio.google.com/api-key)
2. Sign up or login with Google account
3. Click **"Get API Key"**
4. Copy the key
5. Add to Vercel: `VITE_GOOGLE_AI_API_KEY`

**Cost:** Free tier available, very generous limits

---

### 5. AssemblyAI API Key

**For:** Speech-to-text transcription (Urdu & English)

1. Go to [AssemblyAI Dashboard](https://www.assemblyai.com/dashboard/activation)
2. Sign up or login
3. Copy your API key from dashboard
4. Add to Vercel: `VITE_ASSEMBLYAI_API_KEY`

**Cost:** Free tier: 5 hours/month

---

### 6. Google Cloud API Key

**For:** Vision OCR for homework recognition

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable these APIs:
   - Cloud Speech-to-Text API
   - Cloud Text-to-Speech API
   - Cloud Vision API
4. Create credentials → API Key
5. Copy the key

**Cost:** Free tier: 1,000 requests/month

---

### 2. HeyGen API Key

**For:** Realistic talking AI avatars

1. Sign up at [heygen.com](https://www.heygen.com/)
2. Go to API Dashboard
3. Generate API key
4. Copy the key

**Cost:** Starting at $199/month

---

### 3. ElevenLabs API Key

**For:** Natural voice synthesis in Urdu/English

1. Sign up at [elevenlabs.io](https://elevenlabs.io/)
2. Go to Profile → API Keys
3. Generate new key
4. Copy the key

**Cost:** Starting at $5/month

---

### 4. Agora App ID

**For:** Real-time video call infrastructure

1. Sign up at [agora.io](https://www.agora.io/)
2. Create new project
3. Copy App ID

**Cost:** Free tier: 10,000 minutes/month

---

### 5. D-ID API Key

**For:** Talking avatar alternative

1. Sign up at [d-id.com](https://www.d-id.com/)
2. Get API key from dashboard
3. Copy the key

**Cost:** Starting at $49/month

---

## 📦 Vercel Deployment Checklist

- [ ] Download all project files
- [ ] Install Vercel CLI (`npm install -g vercel`)
- [ ] Run `vercel --prod` in project folder
- [ ] Wait for deployment (2-3 minutes)
- [ ] Add environment variables in Vercel Dashboard
- [ ] Redeploy after adding API keys
- [ ] Test live site at your Vercel URL
- [ ] Configure custom domain (optional)

---

## 🌐 Custom Domain Setup

### Add Your Domain to Vercel:

1. Go to **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `estudycard.com`)
4. Follow DNS configuration instructions

### Update DNS Records:

Add these records at your domain registrar:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

Wait 5-10 minutes for DNS propagation.

---

## 🔧 Embedding in Existing Website

### Option 1: Using iframe

```html
<!-- Add this to your SiteGround website -->
<iframe 
  src="https://your-project.vercel.app" 
  width="100%" 
  height="800px" 
  frameborder="0"
  style="border:none;"
></iframe>
```

### Option 2: Using subdomain

1. Create subdomain in SiteGround: `learn.yourdomain.com`
2. Point subdomain to Vercel:
   - Type: CNAME
   - Name: learn
   - Value: cname.vercel-dns.com
3. Add custom domain in Vercel

### Option 3: Direct link

Simply add a link on your website:

```html
<a href="https://your-project.vercel.app" target="_blank">
  Launch E-Study Card AI Tutor
</a>
```

---

## 🚨 Troubleshooting

### Issue: Site not loading
**Solution:** Check `vercel.json` is present and `index.html` is in root

### Issue: API keys not working
**Solution:** 
1. Verify keys are correct in Vercel Dashboard
2. Redeploy after adding/changing keys
3. Check browser console for errors

### Issue: CORS errors
**Solution:** Use Trickle Proxy API for third-party requests

### Issue: Images not showing
**Solution:** Verify image URLs are accessible publicly

---

## 📊 Post-Deployment Monitoring

### Add Analytics:

In Vercel Dashboard:
1. Go to **Analytics** tab
2. Enable **Web Analytics**
3. Monitor traffic and performance

### Check Logs:

1. Go to **Deployments** tab
2. Click on latest deployment
3. View **Function Logs** and **Build Logs**

---

## 🎉 Success! Your E-Study Card is Live

After deployment:
- ✅ Share your live URL with students
- ✅ Monitor usage in Vercel Analytics
- ✅ Add API keys gradually as you get them
- ✅ Scale automatically with Vercel's CDN
- ✅ Embed in your existing SiteGround website

---

## 💡 Pro Tips

1. **Start with free tier**: Use Trickle AI (built-in, free)
2. **Add APIs gradually**: Start with Google Cloud (best value)
3. **Monitor costs**: Check API usage in respective dashboards
4. **Test locally**: Use `.env.local` before deploying
5. **Version control**: Use GitHub for easier deployments

---

## 📞 Support

- **Vercel Issues**: [vercel.com/support](https://vercel.com/support)
- **E-Study Card**: support@trickle.so
- **API Providers**: Check their respective support pages

---

*Last updated: October 29, 2025*
*Deployment time: ~5 minutes*
*No build tools required!*