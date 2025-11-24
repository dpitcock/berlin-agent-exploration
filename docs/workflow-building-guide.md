# n8n Workflow Building Guide

This guide walks you through building the Berlin Club Bouncer workflow step-by-step in n8n.

## Workflow Overview

```
Typeform Trigger → Fetch Image → Photo Validation → Club Router → Club-Specific Judge → Response
```

## Step-by-Step Instructions

### 1. Create New Workflow

1. In n8n, click **Workflows** → **Add workflow**
2. Name it "Berlin Club Bouncer"
3. Click to open the workflow canvas

---

### 2. Add Typeform Trigger

**Node: Typeform Trigger**

1. Click the **+** button on the canvas
2. Search for "Typeform Trigger"
3. Click to add it
4. Configure:
   - **Credential**: Select your Typeform API credential
   - **Form**: Select your "Berlin Club Bouncer" form
   - **Trigger On**: Form Response
5. Click **Execute Node** to test (submit a test form response first)

**Expected Output:**
You should see JSON data with your form fields, including the club selection and image URL.

---

### 3. Add HTTP Request Node (Fetch Image)

**Node: HTTP Request**

1. Click the **+** after Typeform Trigger
2. Search for "HTTP Request"
3. Configure:
   - **Method**: GET
   - **URL**: `{{ $json.answers.find(a => a.field.type === 'file_upload').file_url }}`
     - This extracts the image URL from Typeform's response
   - **Response Format**: File
   - **Binary Property**: `photo`
4. Click **Execute Node** to test

**Expected Output:**
You should see binary data representing the downloaded image.

---

### 4. Add OpenAI Node (Photo Validation)

**Node: OpenAI**

This node checks if the photo is valid (contains people, all outfits visible, etc.)

1. Click **+** after HTTP Request
2. Search for "OpenAI"
3. Configure:
   - **Credential**: Select your OpenAI credential
   - **Resource**: Chat
   - **Model**: gpt-4-vision-preview (or gpt-4o)
   - **Messages**: Add a User Message
     - **Message Type**: Image (Binary)
     - **Binary Data**: `photo`
   - **Text**: Use this prompt:

```
Analyze this photo and determine if it's valid for club entry judgment.

Check:
1. Does the photo contain at least one person? (If no, reject)
2. How many people are in the photo?
3. If it's a group photo, are ALL outfits fully visible? (If not, reject)

Return ONLY valid JSON in this exact format:
{
  "valid": true or false,
  "peopleCount": number,
  "allOutfitsVisible": true or false,
  "rejectReason": "funny message if invalid, empty string if valid"
}

Examples:
- No people: {"valid": false, "peopleCount": 0, "allOutfitsVisible": false, "rejectReason": "No humans detected. Try partying with your coat rack instead."}
- Group with hidden outfits: {"valid": false, "peopleCount": 3, "allOutfitsVisible": false, "rejectReason": "Not all outfits are visible. Can't judge invisible fashion!"}
- Valid solo: {"valid": true, "peopleCount": 1, "allOutfitsVisible": true, "rejectReason": ""}
```

4. Click **Execute Node** to test

**Expected Output:**
JSON with validation results.

---

### 5. Add Code Node (Parse & Validate)

**Node: Code**

This node parses the AI response and checks Berghain's group size rule.

1. Click **+** after OpenAI
2. Search for "Code"
3. Set **Mode**: Run Once for All Items
4. Add this JavaScript code:

```javascript
// Get the club selection from Typeform
const club = $('Typeform Trigger').item.json.answers.find(a => a.field.ref === 'club_selection').choice.label;

// Parse the AI validation response
const aiResponse = $input.item.json.choices[0].message.content;
const validation = JSON.parse(aiResponse);

// Check if photo is invalid
if (!validation.valid) {
  return [{
    json: {
      verdict: "REJECT",
      reasoning: validation.rejectReason,
      club: club
    }
  }];
}

// Berghain special rule: reject groups of 3+
if (club === 'Berghain' && validation.peopleCount > 2) {
  return [{
    json: {
      verdict: "REJECT",
      reasoning: "Berghain doesn't do groups of 3+. This isn't a tourist bus. Come back with one friend max, or solo.",
      club: club
    }
  }];
}

// Photo is valid, pass through with club info
return [{
  json: {
    club: club,
    peopleCount: validation.peopleCount,
    photoValid: true
  }
}];
```

5. Click **Execute Node** to test

---

### 6. Add Switch Node (Route by Club)

**Node: Switch**

Routes to different AI judges based on club selection.

1. Click **+** after Code node
2. Search for "Switch"
3. Configure:
   - **Mode**: Rules
   - **Value**: `{{ $json.club }}`
   - **Rules**:
     - Rule 1: `Berghain` (equals)
     - Rule 2: `KitKat` (equals)
     - Rule 3: `Sisyphus` (equals)
4. Click **Execute Node** to test

---

### 7. Add Club-Specific AI Judge Nodes

You'll create **three separate OpenAI nodes**, one for each club.

#### 7a. Berghain Judge

1. From Switch output 0 (Berghain), click **+**
2. Add **OpenAI** node
3. Rename it to "Berghain Judge"
4. Configure:
   - **Credential**: Your OpenAI credential
   - **Resource**: Chat
   - **Model**: gpt-4-vision-preview or gpt-4o
   - **Messages**: User Message
     - **Message Type**: Image (Binary)
     - **Binary Data**: `photo` (from HTTP Request node)
   - **Text**: Copy the Berghain prompt from `club-personalities.md`

#### 7b. KitKat Judge

1. From Switch output 1 (KitKat), click **+**
2. Add **OpenAI** node
3. Rename it to "KitKat Judge"
4. Configure same as above, but use the KitKat prompt

#### 7c. Sisyphus Judge

1. From Switch output 2 (Sisyphus), click **+**
2. Add **OpenAI** node
3. Rename it to "Sisyphus Judge"
4. Configure same as above, but use the Sisyphus prompt

---

### 8. Add Merge Node (Combine Results)

**Node: Merge**

Combines the outputs from all three judge nodes.

1. Click **+** after any of the judge nodes
2. Search for "Merge"
3. Configure:
   - **Mode**: Append
   - **Input 1**: Connect from Berghain Judge
   - **Input 2**: Connect from KitKat Judge
   - Manually connect Sisyphus Judge output to this Merge node

---

### 9. Add Code Node (Format Response)

**Node: Code**

Formats the final response for the user.

1. Click **+** after Merge
2. Add **Code** node
3. Set **Mode**: Run Once for All Items
4. Add this code:

```javascript
// Parse the AI judge response
const aiResponse = $input.item.json.choices[0].message.content;
const judgment = JSON.parse(aiResponse);

// Get club name
const club = $('Code').item.json.club;

// Format the response
const response = {
  club: club,
  verdict: judgment.verdict,
  message: judgment.reasoning,
  timestamp: new Date().toISOString()
};

return [{
  json: response
}];
```

---

### 10. Add Respond to Webhook Node (Optional)

If you want to return the response directly to the user:

1. Click **+** after the Format Response Code node
2. Search for "Respond to Webhook"
3. Configure:
   - **Response Body**: `{{ $json }}`
   - **Response Code**: 200

---

### 11. Connect Error Handling

For the Code node that validates the photo:

1. Click the **+** on the error output (red dot)
2. Add a **Code** node for error handling
3. Add this code:

```javascript
return [{
  json: {
    verdict: "ERROR",
    message: "Something went wrong processing your photo. Please try again with a clear image.",
    error: $input.item.json.message || "Unknown error"
  }
}];
```

---

## Testing Your Workflow

### Test 1: Valid Solo Photo
1. Submit a Typeform with a solo person in all black
2. Watch the workflow execute
3. Verify it routes to the correct club
4. Check the AI verdict

### Test 2: Group Photo (Berghain)
1. Submit a photo with 3 people to Berghain
2. Should be rejected before reaching the AI judge

### Test 3: Invalid Photo (No People)
1. Submit a photo of just clothing (no person)
2. Should be rejected by the validation node

### Test 4: All Three Clubs
1. Test each club with appropriate outfits
2. Verify each judge has a unique personality

---

## Workflow Optimization Tips

1. **Add Caching**: Use the "Cache" option in HTTP Request to avoid re-downloading images
2. **Set Timeouts**: Add timeout settings to prevent hanging on slow APIs
3. **Add Logging**: Use "Sticky Note" nodes to document your workflow
4. **Error Handling**: Add error outputs to all AI nodes
5. **Rate Limiting**: Be aware of OpenAI API rate limits

---

## Exporting Your Workflow

Once everything works:

1. Click the **⋮** menu (three dots) in the top right
2. Select **Download**
3. Choose **JSON**
4. Save as `berlin-bouncer-workflow.json`
5. This is what you'll submit to the Agent Roast Show!

---

## Next Steps

- Test extensively with different photos
- Refine the AI prompts for better humor
- Add more error handling
- Consider adding a database to log all submissions
- Create a public form link to share with friends

Good luck! 🎉
