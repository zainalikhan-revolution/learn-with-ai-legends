# 🚀 Deployment Guide for E-Study Card AI Tutor

## Overview

This guide will help you deploy the E-Study Card AI Tutor platform to various hosting platforms including Vercel, Netlify, and SiteGround.

---

## ✅ Current Status

Your E-Study Card platform is built with:
- Pure HTML, CSS, JavaScript (No build step required)
- React 18 (loaded via CDN)
- TailwindCSS (loaded via CDN)
- Trickle AI Integration (built-in)

**This means**: You can deploy it to ANY static hosting platform without complex build configurations!

---

## 🌐 Option 1: Deploy to Vercel (Recommended)

### Why Vercel?
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Custom domains
- ✅ Zero configuration needed

### Deployment Steps:

#### Method A: Using Vercel CLI (Fastest)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Navigate to your project folder:**
```bash
cd your-project-folder
```

3. **Deploy:**
```bash
vercel
```

4. **Follow the prompts:**
   - Login to Vercel account
   - Set up project
   - Deploy!

5. **Production deployment:**
```bash
vercel --prod
```

#### Method B: Using Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub, GitLab, or Bitbucket
3. **Click "Add New Project"**
4. **Import your repository** OR **upload project folder**
5. **Configure:**
   - Framework Preset: **Other**
   - Build Command: *Leave empty*
   - Output Directory: *Leave empty*
   - Install Command: *Leave empty*
6. **Click "Deploy"**
7. **Done!** Your site is live at `https://your-project.vercel.app`

### Custom Domain on Vercel:

1. Go to your project settings
2. Click **Domains**
3. Add your custom domain (e.g., `estudycard.com`)
4. Update DNS records at your domain registrar:
   - Add CNAME record pointing to Vercel

---

## 🌐 Option 2: Deploy to Netlify

### Steps:

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login**
3. **Drag and drop** your project folder
4. **Or connect Git repository**
5. **Configure:**
   - Build command: *Leave empty*
   - Publish directory: `.` (root)
6. **Deploy!**

### Custom Domain on Netlify:

1. Go to **Domain settings**
2. Add custom domain
3. Update DNS records

---

## 🖥️ Option 3: Deploy to SiteGround

### Why SiteGround?
- ✅ Traditional hosting
- ✅ cPanel access
- ✅ Full server control
- ✅ Great for businesses

### Deployment Steps:

#### Step 1: Prepare Your Files

1. **Download all project files** from Trickle
2. **Organize in a folder** named `estudycard` or `public_html`

#### Step 2: Upload to SiteGround

**Method A: Using File Manager (Browser)**

1. **Login to SiteGround cPanel**
2. **Go to File Manager**
3. **Navigate to** `public_html` folder
4. **Upload** your project folder
5. **Extract** if zipped

**Method B: Using FTP (Recommended for large projects)**

1. **Get FTP credentials** from SiteGround:
   - Host: `ftp.yourdomain.com`
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21

2. **Use FTP client** (FileZilla recommended):
   - Download [FileZilla](https://filezilla-project.org/)
   - Connect using credentials above
   - Upload project files to `public_html`

3. **Set permissions:**
   - Folders: 755
   - Files: 644

#### Step 3: Configure Domain

1. **If using main domain:**
   - Files should be in `public_html`
   - Access via `https://yourdomain.com`

2. **If using subdomain:**
   - Create subdomain in cPanel (e.g., `learn.yourdomain.com`)
   - Upload files to subdomain folder
   - Access via `https://learn.yourdomain.com`

#### Step 4: Enable HTTPS (SSL)

1. Go to **cPanel → SSL/TLS Status**
2. Enable **Let's Encrypt SSL** (Free)
3. Wait 5-10 minutes for activation
4. Access site via `https://`

---

## 🔑 API Configuration for Production

### Current Setup (No API Keys):
- ✅ Using Trickle's built-in AI (free)
- ✅ No configuration needed
- ✅ Works out of the box

### Adding API Keys (Future Features):

#### Step 1: Create Config File

Create `config.js` in your project:

```javascript
// config.js
const CONFIG = {
  // Google Cloud APIs
  GOOGLE_API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
  
  // HeyGen API (Video Avatars)
  HEYGEN_API_KEY: 'YOUR_HEYGEN_KEY_HERE',
  
  // ElevenLabs (Voice)
  ELEVENLABS_API_KEY: 'YOUR_ELEVENLABS_KEY_HERE',
  
  // Agora (Video Calls)
  AGORA_APP_ID: 'YOUR_AGORA_APP_ID_HERE',
  
  // Environment
  ENVIRONMENT: 'production'
};
```

#### Step 2: Load Config in index.html

```html
<script src="config.js"></script>
```

#### Step 3: Use in Your Code

```javascript
// In utils/voiceHandler.js
const API_KEY = CONFIG.GOOGLE_API_KEY;
```

### ⚠️ Security Warning:

**Never commit API keys to public repositories!**

**Better approach:**
1. Use environment variables
2. Use Trickle Proxy API
3. Store keys server-side only

---

## 📊 Monitoring & Analytics

### Add Google Analytics:

In `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

---

## 🔧 Troubleshooting

### Issue: Site not loading

**Solution:**
- Check `index.html` is in root folder
- Verify all file paths are relative (not absolute)
- Check browser console for errors

### Issue: API not working

**Solution:**
- Verify API keys are correct
- Check Trickle Proxy API is configured
- Test with Postman first

### Issue: Images not showing

**Solution:**
- Check image URLs are accessible
- Verify CORS settings
- Use CDN for images

---

## 🎯 Post-Deployment Checklist

- [ ] Test all tutor pages
- [ ] Test video call interface
- [ ] Test chat functionality
- [ ] Test homework upload
- [ ] Verify transcript viewer
- [ ] Check mobile responsiveness
- [ ] Test on different browsers
- [ ] Enable HTTPS/SSL
- [ ] Set up custom domain
- [ ] Add Google Analytics
- [ ] Test API integrations (if added)
- [ ] Monitor performance
- [ ] Set up backups

---

## 📱 Progressive Web App (PWA) - Optional

To make E-Study Card installable on mobile:

### Step 1: Create manifest.json

```json
{
  "name": "E-Study Card AI Tutor",
  "short_name": "E-Study Card",
  "description": "Learn from AI Legends",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a1a",
  "theme_color": "#FF6B00",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Step 2: Add to index.html

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#FF6B00">
```

---

## 🚀 Performance Optimization

### Enable Compression (SiteGround):

Add to `.htaccess`:

```apache
# Enable GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## 📞 Support

### Deployment Issues:
- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Netlify**: [netlify.com/support](https://netlify.com/support)
- **SiteGround**: [siteground.com/support](https://siteground.com/support)

### Trickle Issues:
- Email: support@trickle.so

---

## 🎉 Next Steps After Deployment

1. **Share your live URL** with students
2. **Collect feedback** and iterate
3. **Add API integrations** gradually
4. **Monitor usage** and performance
5. **Scale** as needed

---

*Last updated: October 27, 2025*
*Platform: E-Study Card AI Tutor v1.0*