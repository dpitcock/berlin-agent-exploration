# n8n Workflow Setup Guide

This guide shows you how to create the n8n workflow that powers the Berlin Club Bouncer AI.

## Overview

The workflow receives data from your Vercel web app and uses OpenAI Vision to judge outfits based on Berlin club aesthetics.

**Flow:**
```
Webhook Trigger → Photo Validation → Club Router → Club-Specific Judge → Return Verdict
```

---

## Prerequisites

1. **n8n Account** - [Sign up at n8n.cloud](https://n8n.cloud) (free tier works!)
2. **OpenAI API Key** - [Get one at platform.openai.com](https://platform.openai.com)
3. **Billing setup** - Add $5-10 credits to OpenAI account

---

## Step 1: Create n8n Workflow
 
### Option A: Import Existing Workflow (Recommended)
 
1. Log into your n8n instance
2. Click **Workflows** → **Add workflow**
3. Click the **three dots** (⋮) in the top right corner
4. Select **Import from File**
5. Upload `berlin-club-bouncer-n8n-workflow.json` from this repository
6. Add your OpenAI credentials (see Step 4)
7. Save and Activate!
 
### Option B: Build from Scratch
 
1. Log into your n8n instance
2. Click **Workflows** → **Add workflow**
3. Name it: `Berlin Club Bouncer`

---

## Step 2: Add Webhook Trigger

1. Click **+** on the canvas
2. Search for **"Webhook"**
3. Configure:
   - **HTTP Method**: POST
   - **Path**: `berlin-bouncer` (or your choice)
   - **Response Mode**: "When Last Node Finishes"
   - **Response Code**: 200

4. **Copy the Webhook URL** - You'll need this for your Vercel app!
   - Example: `https://yourname.app.n8n.cloud/webhook/berlin-bouncer`

---

## Step 3: Add Code Node (Parse Input)

1. Click **+** after Webhook
2. Add **Code** node
3. Name it: `Parse Input`
4. Set **Mode**: "Run Once for All Items"
5. Add this code:

```javascript
// Extract data from webhook
const club = $input.item.json.body.club;
const imageData = $input.item.json.body.image;

// Convert base64 to binary for OpenAI
const buffer = Buffer.from(imageData.data, 'base64');

// VALIDATION: Check image size (limit to 10MB)
const MAX_SIZE_MB = 10;
const sizeInMB = buffer.length / (1024 * 1024);

if (sizeInMB > MAX_SIZE_MB) {
  throw new Error(`Image is too large (${sizeInMB.toFixed(2)}MB). Max allowed is ${MAX_SIZE_MB}MB.`);
}

return [{
  json: {
    club: club,
    imageData: imageData
  },
  binary: {
    photo: {
      data: buffer.toString('base64'),
      mimeType: imageData.mimeType,
      fileName: imageData.filename
    }
  }
}];
```

---

## Step 4: Add OpenAI Credentials

1. Click your profile → **Credentials**
2. Click **Add Credential**
3. Search for **"OpenAI"**
4. Paste your API key
5. Click **Save**

---

## Step 5: Add Photo Validation Node

1. Click **+** after Parse Input
2. Add **OpenAI** node
3. Name it: `Photo Validation`
4. Configure:
   - **Credential**: Select your OpenAI credential
   - **Resource**: Image
   - **Operation**: Analyze Image
   - **Model**: `gpt-4o` (or `gpt-4o-mini`)
   - **Input Data Field Name**: `photo`
   - **Text Input**: Use this prompt:

```
Analyze this photo or image and determine if it is valid for club entry judgment. You are a polite but grumpy authoritative club bouncer who hates to be bothered doing his job.

Check:
1. Does the image contain at least one person OR a human-like character (e.g. illustrated, animated, AI-generated, or cartoon-style) OR or personified/anthropomorphic animals wearing outfits? (If no, reject)
2. How many valid human or human-like subjects are visible?
3. If it's a group image, are ALL outfits fully visible? (If not, reject)
4. Determine the type of subjects: "real", "illustrated", "animated", "AI-generated", or "unknown".
5. Reject if the subjects are too abstract, non-human, or clothing visibility cannot be judged."

Return ONLY valid JSON in this exact format:
{
  "valid": true or false,
  "peopleCount": number,
  "allOutfitsVisible": true or false,
  "subjectType": "real" | "illustrated" | "animated" | "AI-generated" |  "personified_animal" | "unknown",
  "rejectReason": "funny message if invalid, empty string if valid"
}

Examples:
- No people: {"valid": false, "peopleCount": 0, "allOutfitsVisible": false, "subjectType": "unknown", "rejectReason": "No humans detected. Try partying with your coat rack instead."}
- Group with hidden outfits: {"valid": false, "peopleCount": 3, "allOutfitsVisible": false, "subjectType": "real", "rejectReason": "Not all outfits are visible. Can't judge invisible fashion!"}
- Valid solo human: {"valid": true, "peopleCount": 1, "allOutfitsVisible": true, "subjectType": "real", "rejectReason": ""}
- Valid illustrated character: {"valid": true, "peopleCount": 1, "allOutfitsVisible": true, "subjectType": "illustrated", "rejectReason": ""}
- Valid personified animal: {"valid": true, "peopleCount": 1, "allOutfitsVisible": true, "subjectType": "personified_animal", "rejectReason": ""}
- Abstract art: {"valid": false, "peopleCount": 0, "allOutfitsVisible": false, "subjectType": "unknown", "rejectReason": "Is this modern art or alien couture? No judgment possible."}
```

---

## Step 6: Add Validation Check Node

1. Click **+** after Photo Validation
2. Add **Code** node
3. Name it: `Check Validation`
4. Set **Mode**: "Run Once for All Items"
5. Add this code:

```javascript
// Get club and image date from previous node
const club = $('Parse Input').first().json.club;
const imageData = $('Parse Input').first().binary

// Parse AI validation response
const aiResponseRaw = $input.first().json.output[0].content[0].text;
// Locate first and last bracket positions for JSON extraction
const jsonStart = aiResponseRaw.indexOf('{');
const jsonEnd = aiResponseRaw.lastIndexOf('}');

// Extract just the JSON substring
if (jsonStart === -1 || jsonEnd === -1) {
  throw new Error('JSON braces not found in AI response');
}

const jsonString = aiResponseRaw.substring(jsonStart, jsonEnd + 1).trim();

// Parse JSON safely
const validation = JSON.parse(jsonString);

// Check if photo is invalid
if (!validation.valid) {
  return [{
    json: {
      verdict: "REJECT",
      message: validation.rejectReason,
      club: club
    }
  }];
}

// Berghain special rule: reject groups of 3+
if (club === 'Berghain' && validation.peopleCount > 2) {
  return [{
    json: {
      verdict: "REJECT",
      message: "Berghain doesn't do groups of 3+. This isn't a tourist bus. Come back with one friend max, or solo.",
      club: club
    }
  }];
}

// Photo is valid, continue to club-specific judge
return [{
  json: {
    club: club,
    peopleCount: validation.peopleCount,
    subjectType: validation.subjectType,
    photoValid: true,
    ...imageData
  }
}];
```

---

## Step 7: Add Switch Node (Route by Club)

1. Click **+** after Check Validation
2. Add **Switch** node
3. Configure:
   - **Mode**: Rules
   - **Value**: `{{ $json.club }}`
   - **Rules**:
     - Output 0: `Berghain` (equals)
     - Output 1: `KitKat` (equals)
     - Output 2: `Sisyphus` (equals)

---

## Step 8: Add Club-Specific Judge Nodes

Create **three OpenAI nodes**, one for each club:

### 8a. Berghain Judge

1. From Switch output 0, click **+**
2. Add **OpenAI** node
3. Name it: `Berghain Judge`
4. Configure:
   - **Credential**: Your OpenAI credential
   - **Resource**: Image
   - **Operation**: Analyze Image
   - **Model**: `gpt-4o-mini`
   - **Input Data Field Name**: `photo`
   - **Simplify output**: false
   - **Text Input**: 

```
You are the legendary Berghain bouncer, known for being impossibly strict and rejecting 90% of people. You judge based on pure techno culture: all black, no smiles, no colors, industrial vibes only.

Assume this universe allows humans, illustrated or animated characters, AI-generated personas, and personified/anthropomorphic animals to exist alongside each other, party, and converse at Berghain.

Analyze this photo of someone trying to enter Berghain.

STRICT RULES:
- Groups of 3+ are INSTANTLY REJECTED (already filtered, but reinforce)
- Any bright colors = reject
- Smiling or happy faces = reject
- Casual tourist clothing = reject
- Visible logos/branding = reject

ACCEPT criteria:
- All black outfit
- Industrial/leather/harness aesthetic
- Serious, stoic expression
- Minimal techno vibe

Respond in JSON format:
{
  "verdict": "ACCEPT" or "REJECT",
  "reasoning": "2-3 sentence harsh but witty explanation in the voice of a jaded Berghain bouncer. Be creative and funny, but brutal."
}

Remember: You reject 90% of people. Be extremely picky. Make it hurt.
```

### 8b. KitKat Judge

1. From Switch output 1, click **+**
2. Add **OpenAI** node
3. Name it: `KitKat Judge`
4. Configure same as above, but use this prompt:

```
You are the KitKat Club bouncer, guardian of Berlin's most notorious fetish party. You value creativity, confidence, and provocative fashion. This is a sex-positive, boundary-pushing space.

Assume this universe allows humans, illustrated or animated characters, AI-generated personas, and personified/anthropomorphic animals to exist alongside each other, party, and converse at KitKat.

Analyze this photo of someone trying to enter KitKat.

ACCEPT criteria:
- Fetish wear: leather, latex, harnesses, bondage-inspired
- Bold, provocative outfits
- Creative, edgy fashion
- Confident energy
- Skin showing in a tasteful, provocative way

REJECT criteria:
- Boring, conservative clothing
- "Normal" nightclub outfits
- Prudish or timid presentation
- Lack of edge or creativity
- If you think they have other outfits they intend to change into once indoors
- Not enough skin showing

Respond in JSON format:
{
  "verdict": "ACCEPT" or "REJECT",
  "reasoning": "2-3 sentence witty, provocative explanation. Be playful and edgy, but not crude. Channel sex-positive Berlin nightlife energy."
}

Be selective but fair. Reward creativity and confidence. Remember you have a German accent so let the response be in some German-English hybrid language understandable to all.
```

### 8c. Sisyphus Judge

1. From Switch output 2, click **+**
2. Add **OpenAI** node
3. Name it: `Sisyphus Judge`
4. Configure same as above, but use this prompt:

```
You are the Sisyphus bouncer, welcoming creative souls to Berlin's most artistic rave space. You value self-expression, color, creativity, and good vibes. This is a place for artists, ravers, and free spirits.

Assume this universe allows humans, illustrated or animated characters, AI-generated personas, and personified/anthropomorphic animals to exist alongside each other, party, and converse at Berghain.

Analyze this photo of someone trying to enter Sisyphus.

ACCEPT criteria:
- Colorful, artistic outfits
- Rave wear: neon, patterns, creative makeup, festival vibes
- Unique, DIY, handmade pieces
- Playful, expressive, creative energy
- Bohemian, artistic aesthetic

REJECT criteria:
- Boring, plain, uninspired clothing
- Corporate or business casual
- No smiles, enthusiasm to get in
- Zero creativity or effort
- "Just came from work" vibes
- Start every rejection with "Not today"

Respond in JSON format:
{
  "verdict": "ACCEPT" or "REJECT",
  "reasoning": "2-3 sentence friendly but honest explanation. Be encouraging to creative souls, but call out boring vibes. Channel inclusive rave culture energy."
}

Be welcoming to creativity, but don't let in the uninspired. You reject about 75% of people. Remember you have a German accent so let the response be in some German-English hybrid language understandable to all
```

---

## Step 9: Add Merge Node

1. Click **+** after any judge node
2. Add **Merge** node
3. Configure:
   - **Mode**: Append
4. Connect all three judge nodes to this Merge node

---

## Step 10: Add Format Response Node

1. Click **+** after Merge
2. Add **Code** node
3. Name it: `Format Response`
4. Set **Mode**: "Run Once for All Items"
5. Add this code:

```javascript
// Get the AI response text
let aiResponse = $input.first().json.output[0].content[0].text;

// Remove markdown code blocks if present
aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

// Extract JSON from the response
const jsonStart = aiResponse.indexOf('{');
const jsonEnd = aiResponse.lastIndexOf('}');

if (jsonStart === -1 || jsonEnd === -1) {
  throw new Error('JSON braces not found in AI response');
}

const jsonString = aiResponse.substring(jsonStart, jsonEnd + 1).trim();
const judgment = JSON.parse(jsonString);

// Get club name from Check Validation node
const club = $('Check Validation').first().json.club;

// Format the response to send back to the web app
return [{
  json: {
    verdict: judgment.verdict,
    message: judgment.reasoning,
    club: club
  }
}];
```

---

## Step 11: Activate Workflow

1. Click the **toggle switch** in the top right to activate
2. Your workflow is now live!
3. **Copy the Webhook URL** from Step 2

---

## Step 12: Test the Workflow

1. Click **Execute Workflow** button
2. In the Webhook node, click **Listen for Test Event**
3. From your web app, submit a test photo
4. Watch the workflow execute in real-time!

---

## Troubleshooting

### Webhook not receiving data
- Make sure workflow is **activated** (toggle on)
- Check that the webhook URL in your Vercel app matches exactly
- Verify the webhook path is correct

### OpenAI errors
- Check your API key is valid
- Verify you have billing set up and credits available
- Make sure you're using `gpt-4o` or `gpt-4-vision-preview`

### JSON parsing errors
- The AI sometimes returns text before/after JSON
- Add error handling in Code nodes to extract JSON from text

---

## Cost Estimates

- **n8n Cloud Free Tier**: 5,000 executions/month
- **OpenAI GPT-4o Vision**: ~$0.01-0.05 per image
- **Total for testing**: ~$5-10

---

## Export Your Workflow

Once everything works:

1. Click **⋮** menu (three dots) in top right
2. Select **Download**
3. Choose **JSON**
4. Save as `berlin-bouncer-workflow.json`
5. This is your contest submission! 🎉

---

## Next Steps

✅ Test with different outfit photos  
✅ Refine AI prompts for better humor  
✅ Add error handling  
✅ Submit to Agent Roast Show!

Good luck! 🚀
