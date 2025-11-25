# Berlin Club Bouncer AI 🎭🔥

A satirical AI agent that judges whether your outfit is worthy of Berlin's most notorious clubs: **Berghain**, **KitKat**, and **Sisyphus**.

**Built for the Agent Roast Show - November 26, 2025**

![Berlin Nightlife](https://img.shields.io/badge/Berlin-Nightlife-black?style=for-the-badge)
![Powered by n8n](https://img.shields.io/badge/Powered%20by-n8n-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=for-the-badge&logo=openai)

---

## 🎯 What It Does

Users submit:
- 📸 A photo of their outfit
- 🏢 Their club of choice (Berghain, KitKat, or Sisyphus)

The AI agent:
1. ✅ Validates the photo (checks for people, group size, outfit visibility)
2. 🔀 Routes to club-specific judges with unique personalities
3. 🎭 Delivers a witty accept/reject verdict

---

## 🏗️ Architecture

This project uses a **modern hybrid approach** that showcases both UI/UX skills and n8n workflow automation:

```
┌─────────────────────────────────────────────────────────────┐
│                    USER EXPERIENCE                          │
│                                                             │
│  Premium Next.js Web App (Vercel)                          │
│  • Stunning Berlin club aesthetic                          │
│  • Photo upload with preview                               │
│  • Real-time verdict display                               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Webhook
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI BRAIN (n8n)                           │
│                                                             │
│  n8n Workflow                                              │
│  1. Photo Validation (OpenAI Vision)                       │
│  2. Group Size Check                                       │
│  3. Club Router (Switch)                                   │
│  4. Club-Specific AI Judges                                │
│     • Berghain: Harsh techno minimalist                    │
│     • KitKat: Provocative fetish expert                    │
│     • Sisyphus: Creative rave enthusiast                   │
│  5. Return Verdict                                         │
└─────────────────────────────────────────────────────────────┘
```

**Why this approach?**
- ✅ **Better than Typeform** - Custom UI showcases your agency's design skills
- ✅ **Still uses n8n** - All AI logic runs in n8n (perfect for the contest)
- ✅ **More impressive** - Shows full-stack capabilities
- ✅ **Better UX** - Seamless experience for users

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- n8n account ([n8n.cloud](https://n8n.cloud) - free tier works!)
- OpenAI API key ([platform.openai.com](https://platform.openai.com))
- Vercel account ([vercel.com](https://vercel.com) - free)

### Setup in 3 Steps

#### 1️⃣ Set up n8n Workflow

Follow the detailed guide: **[N8N_WORKFLOW_SETUP.md](./N8N_WORKFLOW_SETUP.md)**

Quick version:
1. Create n8n workflow with Webhook trigger
2. Add OpenAI nodes for photo validation and club-specific judging
3. Copy your webhook URL

#### 2️⃣ Deploy Web App to Vercel

Follow the detailed guide: **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)**

Quick version:
```bash
cd bouncer-app
npm install
vercel
```

Add environment variable:
- `N8N_WEBHOOK_URL` = Your n8n webhook URL

#### 3️⃣ Test It!

1. Open your Vercel URL
2. Select a club
3. Upload a photo
4. Get judged by the AI bouncer! 🚪

---

## 📁 Project Structure

```
berlin-agent-exploration/
├── bouncer-app/                    # Next.js web application
│   ├── app/
│   │   ├── api/judge/             # API route that calls n8n
│   │   ├── globals.css            # Premium dark theme
│   │   ├── layout.tsx             # Root layout with SEO
│   │   └── page.tsx               # Main UI (club selection + upload)
│   ├── package.json               # Node 20+ specified
│   └── env.example                # Environment variable template
│
├── docs/                          # Original documentation
│   ├── setup-guide.md             # Detailed setup instructions
│   ├── club-personalities.md      # AI prompt details for each club
│   ├── testing-guide.md           # How to test the agent
│   └── workflow-building-guide.md # n8n workflow building steps
│
├── N8N_WORKFLOW_SETUP.md          # 🆕 Step-by-step n8n guide
├── VERCEL_DEPLOYMENT.md           # 🆕 Step-by-step Vercel guide
├── QUICKSTART.md                  # Quick checklist
└── README.md                      # This file
```

---

## 🎨 Features
## ✨ Features

- **Berlin Underground UI**: A premium, dark-mode aesthetic inspired by Berlin's techno scene (chrome, neon, industrial).
- **Official Club Logos**: Vectorized logos for Berghain, KitKat, and Sisyphus.
- **AI-Powered Judging**: Uses OpenAI's GPT-4o Vision to analyze your outfit against specific club criteria.
- **Three Distinct Personalities**:
  - **Berghain**: Ruthless, minimalist, seeks the "dark industrial techno" look.
  - **KitKat**: Kinky, extravagant, looks for "fetish, latex, and bold expression".
  - **Sisyphus**: Playful, artistic, wants "colorful chaos and festival vibes".
- **Real-time Verdicts**: Instant feedback with a percentage match score and a roast/compliment.
- **Mobile-First Design**: Fully responsive with camera capture support for on-the-go vibe checks.
- **Privacy Focused**: Photos are processed in memory and never stored.
- **Technical Excellence**:
  - ⚡ **Next.js 16** with App Router
  - 🎨 **Tailwind CSS 4** for styling
  - 🔄 **n8n workflow** for AI orchestration
  - 🚀 **Vercel deployment** with Edge Functions
  - 🔒 **Environment-based config** for security

---

## 🎭 Club Personalities

### 🖤 Berghain - The Techno Temple
- **Vibe**: Ultra-strict, minimalist, no-nonsense
- **Dress Code**: All black, industrial aesthetic, serious faces
- **Rejects**: Colors, smiles, groups of 3+, tourist vibes
- **Acceptance Rate**: ~10% (brutal!)

### 💋 KitKat - The Fetish Playground
- **Vibe**: Edgy, provocative, sex-positive
- **Dress Code**: Leather, latex, harnesses, creative fashion
- **Rejects**: Conservative clothing, boring outfits
- **Acceptance Rate**: ~40% (rewards creativity)

### 🌈 Sisyphus - The Creative Rave Haven
- **Vibe**: Artistic, inclusive, colorful
- **Dress Code**: Rave wear, neon, creative expression
- **Rejects**: Boring, corporate, uninspired looks
- **Acceptance Rate**: ~60% (most welcoming)

---

## 🧪 Testing

Test with these scenarios:

- ✅ **Solo photo, all black** → Berghain should accept
- ✅ **Solo photo, colorful** → Sisyphus should accept
- ✅ **Solo photo, fetish wear** → KitKat should accept
- ❌ **Group of 3** → Berghain should reject
- ❌ **No people in photo** → All clubs reject
- ❌ **Hidden outfits** → All clubs reject

See **[docs/testing-guide.md](./docs/testing-guide.md)** for detailed test cases.

---

## 💰 Cost Estimates

| Service | Plan | Cost |
|---------|------|------|
| **Vercel** | Hobby (Free) | $0/month |
| **n8n Cloud** | Free Tier | $0/month (5,000 executions) |
| **OpenAI** | Pay-as-you-go | ~$0.01-0.05 per image |

**Total for testing**: ~$5-10 in OpenAI credits

---

## 📚 Documentation

- **[N8N_WORKFLOW_SETUP.md](./N8N_WORKFLOW_SETUP.md)** - Complete n8n workflow guide
- **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Vercel deployment guide
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick checklist
- **[docs/club-personalities.md](./docs/club-personalities.md)** - AI prompts and personalities
- **[docs/testing-guide.md](./docs/testing-guide.md)** - Testing scenarios

---

## 🎯 Submission Checklist

For the **Agent Roast Show** contest:

- [ ] n8n workflow created and tested
- [ ] Web app deployed to Vercel
- [ ] Tested with multiple photos
- [ ] Club personalities are funny and distinct
- [ ] Error handling works
- [ ] Export n8n workflow as JSON
- [ ] Submit via event form
- [ ] Confirm attendance for November 26

---

## 🛠️ Local Development

```bash
# Install dependencies
cd bouncer-app
npm install

# Create environment file
cp env.example .env.local
# Edit .env.local and add your N8N_WEBHOOK_URL

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 🤝 Contributing

This is a contest submission, but feel free to:
- Fork and create your own version
- Add more clubs (Tresor, About Blank, Watergate)
- Improve the AI prompts
- Enhance the UI

---

## 📄 License

MIT License - Feel free to use this for your own projects!

---

## 🙏 Credits

- **Built by**: Top marketing agency in Berlin (that's you! 😉)
- **Powered by**: n8n, OpenAI, Next.js, Vercel
- **Inspired by**: Berlin's legendary nightlife culture
- **For**: Agent Roast Show - November 26, 2025

---

## 🎉 Good Luck!

May your outfit be worthy of the bouncer's approval! 🚪✨

**Questions?** Check the docs or open an issue.

**Ready to deploy?** Start with [N8N_WORKFLOW_SETUP.md](./N8N_WORKFLOW_SETUP.md)!
