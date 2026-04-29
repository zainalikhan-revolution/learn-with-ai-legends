# 🚀 Deployment Instructions for E-Study Card

## Quick Deployment to Vercel (5 minutes)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Initialize git in your project folder:
```bash
git init
git add .
git commit -m "Initial commit - E-Study Card AI Tutor"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel Website (Easiest)**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. **IMPORTANT**: Configure these settings:
   - **Framework Preset**: Other
   - **Build Command**: Leave EMPTY (delete any default value)
   - **Output Directory**: `.` (just a dot)
   - **Install Command**: Leave EMPTY
6. Click **"Deploy"**
7. Wait 1-2 minutes - Done! ✅

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Step 3: Your Site is Live! 🎉

Your E-Study Card will be live at:
`https://YOUR_PROJECT.vercel.app`

---

## ✅ What Works Out of the Box

- ✅ All 8 AI tutors with video calls
- ✅ Text chat functionality
- ✅ Camera upload for homework
- ✅ Live transcript viewer
- ✅ Responsive mobile design
- ✅ Trickle AI integration (FREE - no API keys needed!)

---

## 🔑 Adding API Keys (Optional - For Advanced Features)

After deployment, you can add API keys in Vercel Dashboard:

1. Go to your project in Vercel
2. Click **Settings** → **Environment Variables**
3. Add these variables (only add the ones you have):

| Variable Name | Get API Key From |
|--------------|------------------|
| `VITE_OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com/api-keys) |
| `VITE_ELEVENLABS_API_KEY` | [elevenlabs.io](https://elevenlabs.io/app/developers/api-keys) |
| `VITE_OPENROUTER_API_KEY` | [openrouter.ai](https://openrouter.ai/settings/keys) |
| `VITE_GOOGLE_AI_API_KEY` | [aistudio.google.com](https://aistudio.google.com/api-key) |
| `VITE_ASSEMBLYAI_API_KEY` | [assemblyai.com](https://www.assemblyai.com/dashboard/activation) |

4. After adding keys, click **"Redeploy"** to apply changes

---

## 🔧 Troubleshooting

### Problem: Build Failed

**Solution**: Make sure these settings in Vercel:
- Build Command: **EMPTY** (not "npm run build")
- Output Directory: **`.`** (just a dot)
- Install Command: **EMPTY**

### Problem: Page Not Loading

**Solution**: 
- Check that `index.html` is in the root directory
- Verify all file paths are relative (start with `./ ` or `../`)
- Check browser console for errors

### Problem: Camera Not Working

**Solution**:
- Make sure you're accessing via HTTPS (Vercel auto-provides this)
- Allow camera permissions in browser
- Test on Chrome or Edge (better camera support)

---

## 📱 Custom Domain

1. Go to **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `estudycard.com`)
4. Update DNS records at your domain registrar:
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

---

## 💡 Important Notes

- ✅ **No build step required** - All files run directly in browser
- ✅ **No Node.js needed** - Pure HTML/CSS/JavaScript
- ✅ **FREE hosting** - Vercel hobby plan is free
- ✅ **Auto HTTPS** - Vercel provides SSL automatically
- ✅ **Global CDN** - Fast loading worldwide

---

## 📞 Support

- **Vercel Issues**: [vercel.com/support](https://vercel.com/support)
- **Project Issues**: Check `README.md` in `trickle/notes/`

---

*Last updated: October 30, 2025*
*Deployment time: ~2 minutes*
*No API keys required to start!*