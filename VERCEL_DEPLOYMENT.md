# Vercel Deployment Guide

This guide shows you how to deploy the Berlin Club Bouncer web app to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free) - [Sign up at vercel.com](https://vercel.com)
- Your n8n webhook URL (from the n8n workflow setup)

---

## Step 1: Push Code to GitHub

1. **Initialize Git** (if not already done):
```bash
cd bouncer-app
git init
git add .
git commit -m "Initial commit: Berlin Club Bouncer app"
```

2. **Create GitHub Repository**:
   - Go to [github.com/new](https://github.com/new)
   - Name it: `berlin-club-bouncer`
   - Make it public or private
   - Don't initialize with README (you already have one)

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/berlin-club-bouncer.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select your `berlin-club-bouncer` repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `bouncer-app`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

5. **Add Environment Variables**:
   - Click **Environment Variables**
   - Add variable:
     - **Name**: `N8N_WEBHOOK_URL`
     - **Value**: Your n8n webhook URL (e.g., `https://yourname.app.n8n.cloud/webhook/berlin-bouncer`)
   - Click **Add**

6. Click **Deploy**
7. Wait 2-3 minutes for deployment to complete
8. Your app is live! 🎉

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
cd bouncer-app
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? `berlin-club-bouncer`
   - In which directory is your code located? `./`
   - Want to override settings? **N**

5. **Add environment variable**:
```bash
vercel env add N8N_WEBHOOK_URL
```
   - Paste your n8n webhook URL
   - Select all environments (Production, Preview, Development)

6. **Deploy to production**:
```bash
vercel --prod
```

---

## Step 3: Test Your Deployment

1. Open your Vercel URL (e.g., `https://berlin-club-bouncer.vercel.app`)
2. Select a club
3. Upload a test photo
4. Click "Face the Bouncer"
5. Verify you get a verdict from the AI!

---

## Step 4: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-60 minutes)

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `N8N_WEBHOOK_URL` | Your n8n workflow webhook URL | `https://yourname.app.n8n.cloud/webhook/berlin-bouncer` |

---

## Updating Your Deployment

### Automatic Deployments (Recommended)

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update: improved UI"
git push
```

Vercel will automatically:
- Detect the push
- Build your app
- Deploy to production
- Give you a preview URL

### Manual Deployments

```bash
cd bouncer-app
vercel --prod
```

---

## Troubleshooting

### Build Fails

**Error: Node version mismatch**
- Solution: We've set `"engines": { "node": ">=20.0.0" }` in package.json
- Vercel will automatically use Node 20

**Error: Missing dependencies**
- Solution: Delete `node_modules` and `package-lock.json`, then run `npm install`

### Runtime Errors

**Error: N8N_WEBHOOK_URL not defined**
- Check environment variables in Vercel dashboard
- Make sure you added it to Production environment
- Redeploy after adding env vars

**Error: Webhook timeout**
- n8n workflow might be taking too long
- Check n8n execution logs
- Optimize AI prompts or increase timeout

### Image Upload Issues

**Error: File too large**
- Vercel has a 4.5MB limit for serverless functions
- Add file size validation in the frontend
- Or use Vercel Blob storage for larger files

---

## Performance Optimization

### Enable Edge Functions (Optional)

For faster global response times:

1. Create `bouncer-app/middleware.ts`:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: '/api/:path*',
};

export function middleware(request: NextRequest) {
  return NextResponse.next();
}
```

2. Deploy - Vercel will automatically use Edge Runtime

### Enable Image Optimization

Next.js automatically optimizes images. No configuration needed!

---

## Monitoring & Analytics

### Vercel Analytics (Free)

1. In Vercel dashboard, go to your project
2. Click **Analytics** tab
3. Enable Web Analytics
4. Add this to `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Monitor n8n Executions

1. In n8n, go to **Executions**
2. View all workflow runs
3. Check for errors or slow executions
4. Optimize prompts if needed

---

## Cost Estimates

- **Vercel Hobby (Free)**:
  - 100GB bandwidth/month
  - Unlimited deployments
  - Perfect for this project!

- **Vercel Pro** ($20/month):
  - Only needed if you get viral traffic
  - 1TB bandwidth
  - Advanced analytics

---

## Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use environment variables** - For all secrets
3. **Rate limiting** - Consider adding to prevent abuse
4. **CORS** - Already configured in API route

---

## Next Steps

✅ Deploy to Vercel  
✅ Test with real photos  
✅ Share with friends  
✅ Submit to Agent Roast Show!

---

## Useful Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Start production server locally
npm run start

# Deploy to Vercel
vercel --prod

# View deployment logs
vercel logs

# Check environment variables
vercel env ls
```

---

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

Good luck! 🚀
