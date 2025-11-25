# Detailed Setup Guide

## ⚠️ NOTE: This guide has been updated for the new architecture!

**We're now using a custom Vercel web app instead of Typeform.**  
This showcases your agency's UI skills while still using n8n for the AI logic.

For the complete setup, see:
- **[../N8N_WORKFLOW_SETUP.md](../N8N_WORKFLOW_SETUP.md)** - n8n workflow setup
- **[../VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md)** - Web app deployment

---

## Prerequisites

Before you begin, make sure you have:
- Node.js 20 or higher
- An email address for account signups
- Credit card for AI API (OpenAI charges per API call, usually ~$0.01-0.05 per image)
- GitHub account (for deploying to Vercel)

## Step-by-Step Setup

### 1. Create n8n Account (5 minutes)

**Option A: n8n Cloud (Recommended for beginners)**

1. Visit [https://n8n.cloud](https://n8n.cloud)
2. Click "Start for free"
3. Sign up with email or Google
4. Verify your email
5. You'll be redirected to your n8n instance dashboard
6. Your instance URL will be something like: `https://yourname.app.n8n.cloud`

**Option B: Self-Hosted with Docker**

```bash
# Create a directory for n8n data
mkdir ~/.n8n

# Run n8n in Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

Access at: `http://localhost:5678`

### 2. Deploy Web App (15 minutes)

**We're NOT using Typeform anymore!** Instead, you'll deploy a custom Next.js web app to Vercel.

**Why?** 
- ✅ Showcases your agency's UI/UX skills
- ✅ Better user experience
- ✅ More impressive for the contest
- ✅ Still uses n8n for all the AI logic

**Steps:**
1. See [../VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md) for complete deployment guide
2. The web app has the same functionality as Typeform (club selection + photo upload)
3. But with a premium Berlin nightlife aesthetic!

### 3. Get OpenAI API Access (10 minutes)

1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys** section
4. Click "Create new secret key"
5. Name it "n8n-berlin-bouncer"
6. **Copy the key immediately** (you won't see it again!)
7. Go to **Billing** → Add payment method
8. Add at least $5 credit (should last for hundreds of tests)

### 4. Configure n8n Workflow

**Follow the complete guide:** [../N8N_WORKFLOW_SETUP.md](../N8N_WORKFLOW_SETUP.md)

Quick overview:

1. In n8n, create a new workflow called "Berlin Club Bouncer"
2. Add a **Webhook** trigger node (not Typeform trigger!)
3. Add **OpenAI** credentials:
   - Click your profile → **Credentials**
   - Click "Add Credential"
   - Search for "OpenAI"
   - Paste your API key from step 3
   - Click "Save"
4. Build the workflow with these nodes:
   - Webhook Trigger → Parse Input → Photo Validation → Check Validation → Switch (by club) → Club Judges → Format Response
5. **Copy the Webhook URL** - you'll need this for your Vercel app!

### 5. Connect Web App to n8n

1. In your Vercel deployment, add environment variable:
   - Name: `N8N_WEBHOOK_URL`
   - Value: Your webhook URL from n8n
2. Redeploy if needed
3. Your web app will now send data to n8n!

## Testing Your Setup

### Test Web App Locally

1. Navigate to `bouncer-app` directory
2. Run `npm install` then `npm run dev`
3. Open http://localhost:3000
4. Select a club and upload a test photo
5. You should see mock responses (if n8n not connected yet)

### Test n8n Connection

1. Make sure your n8n workflow is **activated** (toggle in top right)
2. Add `N8N_WEBHOOK_URL` to your `.env.local` file
3. Restart the dev server
4. Submit a photo through the web app
5. Check n8n executions - you should see the workflow run!
6. Verify you get a real AI verdict back

### Test OpenAI Integration

1. In n8n, check the execution logs
2. Look for the OpenAI node outputs
3. Verify the AI is analyzing photos correctly
4. Check that verdicts match club personalities

## Troubleshooting

### Webhook not receiving data
- Make sure the n8n workflow is **activated** (toggle on)
- Check that `N8N_WEBHOOK_URL` in Vercel matches your webhook URL exactly
- Verify the webhook node in n8n is configured correctly
- Check Vercel function logs for errors

### Web app not loading
- Make sure you ran `npm install` in the `bouncer-app` directory
- Check that Node.js 20+ is installed: `node --version`
- Clear `.next` folder and rebuild: `rm -rf .next && npm run dev`

### OpenAI errors
- Check your API key is correct in n8n credentials
- Verify you have billing set up and credits available
- Make sure you're using a vision-capable model (`gpt-4o` or `gpt-4-vision-preview`)
- Check OpenAI API status page

### Image not loading in n8n
- Verify the image is being converted to base64 correctly
- Check the Parse Input code node in n8n
- Make sure the binary data is named `photo`
- Check n8n execution logs for the exact error

## Cost Estimates

- **Vercel Hobby (Free)**: Unlimited deployments, 100GB bandwidth/month
- **n8n Cloud Free Tier**: 5,000 workflow executions/month (plenty for testing)
- **OpenAI GPT-4o Vision**: ~$0.01-0.05 per image analysis
- **Total for testing**: ~$5-10 in OpenAI credits

## Next Steps

Once your setup is complete:
1. ✅ Build the workflow (see workflow building guide)
2. ✅ Test with sample photos
3. ✅ Refine AI prompts for maximum humor
4. ✅ Export and submit to Agent Roast Show!
