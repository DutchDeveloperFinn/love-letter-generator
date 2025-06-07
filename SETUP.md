# Love Letter Generator - Setup Instructions

## Quick Deployment Guide 🚀

### Ready to Deploy! ✅
You already have your OpenRouter API key, so let's get this live!

### Option 1: Vercel Web Deployment (Easiest)
1. **Go to** [vercel.com](https://vercel.com)
2. **Sign up** with GitHub (free)
3. **Click "Add New"** → "Project"
4. **Drag & drop** your entire `LoveLetters` folder
5. **Add Environment Variable:**
   - Key: `OPENROUTER_API_KEY`
   - Value: [Your API key from OpenRouter]
6. **Deploy!** 🎉

### Option 2: GitHub + Vercel (Recommended for updates)
1. **Create GitHub repo** and push this code
2. **Connect Vercel** to your GitHub repo
3. **Add your API key** as environment variable
4. **Auto-deploy** on every update!

### Environment Variable Setup
In Vercel dashboard:
- **Key:** `OPENROUTER_API_KEY`
- **Value:** Your OpenRouter API key (starts with sk-or-v1-)

### Local Testing Options
- **Frontend only:** Open `test-final.html` (works now)
- **Full testing:** Deploy to Vercel first, then test live URL

## Project Structure
```
├── index.html          # Main application
├── api/generate.js     # AI generation endpoint
├── test.html          # Test version (no API needed)
└── SETUP.md           # This file
```

## Features
- ✅ Completely free AI model (Mistral-7B)
- ✅ Fast edge runtime
- ✅ Simple one-page interface
- ✅ Mobile responsive
- ✅ No rate limits on free tier 