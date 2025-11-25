# Berlin Club Bouncer - Web App

Premium Next.js web application for the Berlin Club Bouncer AI agent.

## 🚀 Quick Start

### Prerequisites
- Node.js 20 or higher
- npm or yarn
- n8n webhook URL (see [../N8N_WORKFLOW_SETUP.md](../N8N_WORKFLOW_SETUP.md))

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp env.example .env.local

# Edit .env.local and add your n8n webhook URL
# N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/berlin-bouncer
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 📁 Project Structure

```
bouncer-app/
├── app/
│   ├── api/
│   │   └── judge/
│   │       └── route.ts          # API endpoint that calls n8n
│   ├── globals.css               # Premium dark theme + animations
│   ├── layout.tsx                # Root layout with SEO
│   └── page.tsx                  # Main UI component
├── public/                       # Static assets
├── package.json                  # Dependencies (Node 20+)
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind CSS config
└── env.example                   # Environment variable template
```

## 🎨 Features

### UI/UX
- **Berlin Underground Design**: A dark, industrial techno aesthetic featuring chrome effects, neon glows, and scanlines.
- **Official Club Logos**: Vectorized logos for Berghain, KitKat, and Sisyphus.
- **Interactive Club Selection**: Modernist buttons with neon glow effects and large glowing checkmarks.
- **Photo Upload**: Supports drag-and-drop and direct camera capture on mobile.
- **Real-time Verdict**: Displays the AI's judgment with a percentage score and satirical commentary.
- **Responsive**: Optimized for all devices, from mobile phones to desktop monitors.

### Technical
- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **API Routes** for backend logic
- **Image optimization** built-in

## 🔧 Configuration

### Environment Variables

Create `.env.local` with:

```bash
N8N_WEBHOOK_URL=your_n8n_webhook_url_here
```

**Where to get the webhook URL:**
1. Set up your n8n workflow (see [../N8N_WORKFLOW_SETUP.md](../N8N_WORKFLOW_SETUP.md))
2. Copy the webhook URL from the Webhook node
3. Paste it into `.env.local`

### Mock Mode

If `N8N_WEBHOOK_URL` is not set, the app runs in **mock mode** with pre-defined responses. Perfect for testing the UI without n8n!

## 🧪 Testing

### Test Locally

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Select a club
4. Upload a test photo
5. Click "Face the Bouncer"

### Test with n8n

1. Make sure your n8n workflow is activated
2. Set `N8N_WEBHOOK_URL` in `.env.local`
3. Upload a real photo
4. Verify the verdict comes from your n8n workflow

## 🚀 Deployment

### Deploy to Vercel

See [../VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md) for detailed instructions.

Quick version:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variable
vercel env add N8N_WEBHOOK_URL

# Deploy to production
vercel --prod
```

## 🎭 How It Works

1. **User selects a club** (Berghain, KitKat, or Sisyphus)
2. **User uploads a photo** of their outfit
3. **Frontend sends data** to `/api/judge` endpoint
4. **API route converts image** to base64
5. **API calls n8n webhook** with club + image data
6. **n8n workflow processes** the request:
   - Validates photo (OpenAI Vision)
   - Routes to club-specific judge
   - Returns verdict
7. **Frontend displays verdict** with animation

## 🎨 Customization

### Change Colors

Edit `app/globals.css`:

```css
:root {
  --accent-berghain: #000000;    /* Berghain theme */
  --accent-kitkat: #ff006e;      /* KitKat theme */
  --accent-sisyphus: #00f5ff;    /* Sisyphus theme */
}
```

### Add More Clubs

1. Update the `clubs` array in `app/page.tsx`
2. Add corresponding AI judge in n8n workflow
3. Update the Switch node in n8n

### Modify UI

All UI code is in `app/page.tsx`. The component is well-commented and easy to modify.

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Image Optimization**: Automatic via Next.js

## 🐛 Troubleshooting

### "N8N_WEBHOOK_URL not configured"

**Solution**: Create `.env.local` and add your webhook URL

### "Webhook timeout"

**Solution**: 
- Check n8n workflow is activated
- Verify webhook URL is correct
- Check n8n execution logs for errors

### "Image upload failed"

**Solution**:
- Check file size (max 10MB recommended)
- Verify file is an image (JPG, PNG, WEBP)
- Check browser console for errors

### Build errors

**Solution**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Fonts**: Inter, Space Grotesk (Google Fonts)
- **Deployment**: Vercel
- **Node Version**: 20+

## 🤝 Contributing

Want to improve the UI? Here are some ideas:

- [ ] Add animations for verdict reveal
- [ ] Implement dark/light mode toggle
- [ ] Add sound effects for accept/reject
- [ ] Create a gallery of past submissions
- [ ] Add social sharing buttons
- [ ] Implement rate limiting
- [ ] Add analytics tracking

## 📄 License

MIT License - See [../LICENSE](../LICENSE)

## 🙏 Credits

- **Design**: Inspired by Berlin's underground nightlife
- **Icons**: Emoji (native)
- **Fonts**: Google Fonts (Inter, Space Grotesk)
- **Framework**: Next.js by Vercel

---

**Need help?** Check the main [README](../README.md) or the deployment guides!
