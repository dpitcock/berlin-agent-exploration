# Webhook Testing Scripts

Quick testing tools for the Berlin Bouncer n8n webhook.

## Quick Start

```bash
# Test with default settings (Berghain, test pixel)
npm run test:webhook

# Test specific clubs
npm run test:webhook:berghain
npm run test:webhook:kitkat
npm run test:webhook:sisyphus

# Test with a real image
node test-webhook.js Berghain ./path/to/outfit.jpg
node test-webhook.js KitKat ~/Downloads/my-outfit.png
```

## Scripts

### Node.js Script (`test-webhook.js`)

**Usage:**
```bash
node test-webhook.js [club] [image-path]
```

**Examples:**
```bash
# Quick test with default pixel
node test-webhook.js

# Test Berghain
node test-webhook.js Berghain

# Test with real image
node test-webhook.js KitKat ./outfit.jpg
```

**Features:**
- ✅ Colorful output with emojis
- ✅ Response time tracking
- ✅ Supports all image formats (jpg, png, gif, webp)
- ✅ Pretty-printed JSON responses
- ✅ Error handling

### Bash Script (`test-webhook.sh`)

**Usage:**
```bash
./test-webhook.sh [club] [image-path]
```

**Examples:**
```bash
# Quick test
./test-webhook.sh

# Test with image
./test-webhook.sh Sisyphus ~/rave-outfit.png
```

**Features:**
- ✅ Works on macOS and Linux
- ✅ Colorful terminal output
- ✅ Requires `jq` for JSON parsing (optional)
- ✅ Base64 encoding built-in

## Configuration

Set the webhook URL via environment variable:

```bash
export N8N_WEBHOOK_URL="https://your-instance.app.n8n.cloud/webhook/berlin-bouncer"
npm run test:webhook
```

Or edit the default in the scripts directly.

## Valid Clubs

- `Berghain` - Strict techno culture
- `KitKat` - Fetish/provocative fashion
- `Sisyphus` - Artistic/rave vibes

## Output Example

```
🎭 Berlin Bouncer Webhook Test
================================
🏢 Club: Berghain
🔗 Webhook: https://dpitt.app.n8n.cloud/webhook-test/berlin-bouncer
📸 Image: ./outfit.jpg

📤 Sending request...
⏱️  Response time: 1234ms
📊 Status: 200 OK

✅ Response:
================================
{
  "verdict": "REJECT",
  "message": "Too many colors. This isn't a rainbow parade.",
  "club": "Berghain"
}
================================

🚫 VERDICT: REJECTED
💬 Message: Too many colors. This isn't a rainbow parade.
```

## Troubleshooting

**"Connection refused"**
- Make sure your n8n workflow is activated
- Check the webhook URL is correct

**"Invalid club"**
- Use exact spelling: `Berghain`, `KitKat`, or `Sisyphus`

**"Image not found"**
- Check the file path is correct
- Use absolute or relative paths

**Bash script: "jq: command not found"**
- Install jq: `brew install jq` (macOS) or `apt install jq` (Linux)
- Or the script will fall back to raw JSON output
