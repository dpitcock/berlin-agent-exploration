# Berlin Club Photo Judge Agent 🎭🔥

A satirical AI agent built with n8n that judges whether your outfit is worthy of Berlin's most notorious clubs: Berghain, KitKat, and Sisyphus.

**Built for the Agent Roast Show - November 26, 2025**

## What It Does

Users submit:
- A photo of their outfit
- Their club of choice (Berghain, KitKat, or Sisyphus)

The AI agent:
1. Validates the photo (checks for people, group size, outfit visibility)
2. Routes to club-specific judges with unique personalities
3. Delivers a witty accept/reject verdict

## Getting Started

### Step 1: Set Up n8n

You have two options:

#### Option A: n8n Cloud (Easiest)
1. Go to [n8n.cloud](https://n8n.cloud)
2. Sign up for a free account
3. You'll get a hosted n8n instance immediately

#### Option B: Self-Hosted (More Control)
```bash
# Using Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Or using npm
npm install n8n -g
n8n start
```

Access n8n at `http://localhost:5678`

### Step 2: Set Up Typeform

1. Go to [typeform.com](https://typeform.com) and create a free account
2. Create a new form with:
   - **Question 1**: "Which club are you trying to get into?" (Multiple choice)
     - Options: Berghain, KitKat, Sisyphus
   - **Question 2**: "Upload a photo of your outfit" (File upload)
     - Allow image files only
3. Note your Form ID (found in the form URL or settings)

### Step 3: Set Up AI Provider

You'll need access to an AI vision model. Options:

#### OpenAI (Recommended)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account and get an API key
3. Add credits to your account (GPT-4 Vision required)

#### Alternative: Anthropic Claude
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Get an API key
3. Claude 3 models support vision

### Step 4: Configure n8n Credentials

In n8n:
1. Go to **Settings** → **Credentials**
2. Add **Typeform API** credentials
   - Get your Typeform API token from Typeform settings
3. Add **OpenAI API** credentials
   - Paste your OpenAI API key

### Step 5: Import the Workflow

1. In n8n, click **Workflows** → **Import from File**
2. Import `berlin-bouncer-workflow.json` from this repository
3. Update the following in the workflow:
   - Typeform Trigger: Select your form
   - AI nodes: Verify your OpenAI credentials are selected

### Step 6: Activate & Test

1. Click **Activate** in the top right
2. Submit a test entry through your Typeform
3. Watch the workflow execute in n8n
4. Check the execution log for the AI's verdict

## Project Structure

```
n8n-berlin-bouncer/
├── README.md                          # This file
├── berlin-bouncer-workflow.json       # n8n workflow (to be created)
├── docs/
│   ├── setup-guide.md                # Detailed setup instructions
│   ├── club-personalities.md         # AI prompt details for each club
│   └── testing-guide.md              # How to test the agent
└── examples/
    ├── test-photos/                  # Sample photos for testing
    └── sample-responses.md           # Example AI responses
```

## Next Steps

1. **Set up your accounts** (n8n, Typeform, OpenAI)
2. **Build the workflow** following the requirements doc
3. **Test with various photos** to refine the AI prompts
4. **Export the final workflow** as JSON
5. **Submit to the Agent Roast Show** before November 26!

## Resources

- [n8n Documentation](https://docs.n8n.io)
- [Typeform API Docs](https://developer.typeform.com)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)
- [Agent Roast Show Event](https://lu.ma/agent-roast-show)

## Submission Checklist

- [ ] Workflow JSON exported
- [ ] Tested with multiple photos
- [ ] Club personalities are funny and distinct
- [ ] Error handling works (no people, groups, etc.)
- [ ] Submitted via event form
- [ ] Confirmed attendance for November 26

---

**Good luck getting past the bouncer! 🚪🎉**
