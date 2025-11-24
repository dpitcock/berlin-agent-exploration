# Detailed Setup Guide

## Prerequisites

Before you begin, make sure you have:
- A computer with internet access
- An email address for account signups
- Credit card for AI API (OpenAI charges per API call, usually ~$0.01-0.05 per image)

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

### 2. Create Typeform (10 minutes)

1. Go to [https://typeform.com](https://typeform.com)
2. Click "Get started" and create a free account
3. Click "Create typeform" → "Start from scratch"
4. Name it "Berlin Club Bouncer"

**Add Question 1: Club Selection**
- Click "+" to add a question
- Select "Multiple choice"
- Question text: "Which club are you trying to get into?"
- Add choices:
  - Berghain
  - KitKat
  - Sisyphus
- Toggle "Required" on

**Add Question 2: Photo Upload**
- Click "+" to add another question
- Select "File upload"
- Question text: "Upload a photo of your outfit"
- Under "File types", select "Images only"
- Toggle "Required" on

**Publish the form:**
- Click "Publish" in the top right
- Copy the form link (you'll test with this)
- Note your **Form ID** (found in Settings → Form ID, or in the URL)

### 3. Get OpenAI API Access (10 minutes)

1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys** section
4. Click "Create new secret key"
5. Name it "n8n-berlin-bouncer"
6. **Copy the key immediately** (you won't see it again!)
7. Go to **Billing** → Add payment method
8. Add at least $5 credit (should last for hundreds of tests)

### 4. Configure n8n Credentials

**Add Typeform Credentials:**

1. In n8n, click your profile icon → **Credentials**
2. Click "Add Credential"
3. Search for "Typeform API"
4. Get your Typeform token:
   - Go to Typeform → Profile → Settings → Personal tokens
   - Click "Generate a new token"
   - Name it "n8n-integration"
   - Copy the token
5. Paste into n8n and click "Save"

**Add OpenAI Credentials:**

1. In n8n Credentials, click "Add Credential"
2. Search for "OpenAI"
3. Paste your API key
4. Click "Save"

### 5. Create Your First Workflow

1. In n8n, click "Workflows" → "Add workflow"
2. Name it "Berlin Club Bouncer"
3. You're now in the workflow canvas!

**Next:** Follow the workflow building guide in `club-personalities.md` to add nodes and configure the logic.

## Testing Your Setup

### Test Typeform
1. Open your Typeform link
2. Submit a test response with a sample photo
3. Check Typeform responses dashboard to confirm it was received

### Test n8n Connection
1. In your workflow, add a "Typeform Trigger" node
2. Select your form
3. Click "Listen for test event"
4. Submit another Typeform response
5. You should see the data appear in n8n!

### Test OpenAI
1. Add an "OpenAI" node to your workflow
2. Select "Chat" resource
3. Set a simple prompt: "Say hello"
4. Click "Test step"
5. You should get a response from the AI

## Troubleshooting

### Typeform not triggering
- Make sure the workflow is **activated** (toggle in top right)
- Check that you selected the correct form in the trigger node
- Verify your Typeform credentials are saved correctly

### OpenAI errors
- Check your API key is correct
- Verify you have billing set up and credits available
- Make sure you're using a vision-capable model (gpt-4-vision-preview or gpt-4o)

### Image not loading
- Typeform image URLs expire after some time
- Make sure the HTTP Request node has "Response Format" set to "File"
- Check that the image URL field name matches your Typeform field

## Cost Estimates

- **n8n Cloud Free Tier**: 5,000 workflow executions/month (plenty for testing)
- **Typeform Free**: 10 responses/month (upgrade to $25/mo for unlimited)
- **OpenAI GPT-4 Vision**: ~$0.01-0.05 per image analysis
- **Total for testing**: ~$5-10

## Next Steps

Once your setup is complete:
1. ✅ Build the workflow (see workflow building guide)
2. ✅ Test with sample photos
3. ✅ Refine AI prompts for maximum humor
4. ✅ Export and submit to Agent Roast Show!
