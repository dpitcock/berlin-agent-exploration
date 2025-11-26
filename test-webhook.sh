#!/bin/bash

# Berlin Bouncer Webhook Test Script
# Usage: ./test-webhook.sh [club] [image-path]

set -e

# Configuration
WEBHOOK_URL="${N8N_WEBHOOK_URL:-https://dpitt.app.n8n.cloud/webhook-test/berlin-bouncer}"
CLUB="${1:-Berghain}"
IMAGE_PATH="$2"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Validate club
case "$CLUB" in
  Berghain|KitKat|Sisyphus)
    ;;
  *)
    echo -e "${RED}❌ Invalid club: $CLUB${NC}"
    echo "   Valid clubs: Berghain, KitKat, Sisyphus"
    exit 1
    ;;
esac

# Show help
if [[ "$1" == "--help" ]] || [[ "$1" == "-h" ]]; then
  echo "🎭 Berlin Bouncer Webhook Test Script"
  echo ""
  echo "Usage:"
  echo "  ./test-webhook.sh [club] [image-path]"
  echo ""
  echo "Arguments:"
  echo "  club        Club name (default: Berghain)"
  echo "              Options: Berghain, KitKat, Sisyphus"
  echo "  image-path  Path to image file (optional)"
  echo ""
  echo "Examples:"
  echo "  ./test-webhook.sh"
  echo "  ./test-webhook.sh Berghain"
  echo "  ./test-webhook.sh KitKat ./my-outfit.jpg"
  echo "  ./test-webhook.sh Sisyphus ~/Downloads/rave-outfit.png"
  echo ""
  echo "Environment:"
  echo "  N8N_WEBHOOK_URL  Override webhook URL"
  exit 0
fi

echo -e "${PURPLE}🎭 Berlin Bouncer Webhook Test${NC}"
echo "================================"
echo -e "${BLUE}🏢 Club:${NC} $CLUB"
echo -e "${BLUE}🔗 Webhook:${NC} $WEBHOOK_URL"

# Prepare payload
if [[ -n "$IMAGE_PATH" ]] && [[ -f "$IMAGE_PATH" ]]; then
  echo -e "${BLUE}📸 Image:${NC} $IMAGE_PATH"
  
  # Get base64 of image
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IMAGE_BASE64=$(base64 -i "$IMAGE_PATH")
  else
    # Linux
    IMAGE_BASE64=$(base64 -w 0 "$IMAGE_PATH")
  fi
  
  # Detect mime type
  EXT="${IMAGE_PATH##*.}"
  case "${EXT,,}" in
    jpg|jpeg)
      MIME_TYPE="image/jpeg"
      ;;
    png)
      MIME_TYPE="image/png"
      ;;
    gif)
      MIME_TYPE="image/gif"
      ;;
    webp)
      MIME_TYPE="image/webp"
      ;;
    *)
      MIME_TYPE="image/jpeg"
      ;;
  esac
  
  FILENAME=$(basename "$IMAGE_PATH")
else
  echo -e "${YELLOW}⚠️  No image provided, using 1x1 test pixel${NC}"
  IMAGE_BASE64="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  MIME_TYPE="image/png"
  FILENAME="test.png"
fi

echo ""

# Create JSON payload
PAYLOAD=$(cat <<EOF
{
  "club": "$CLUB",
  "image": {
    "data": "$IMAGE_BASE64",
    "mimeType": "$MIME_TYPE",
    "filename": "$FILENAME"
  }
}
EOF
)

# Send request
echo -e "${BLUE}📤 Sending request...${NC}"
START_TIME=$(date +%s%3N)

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

END_TIME=$(date +%s%3N)
DURATION=$((END_TIME - START_TIME))

# Parse response
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo -e "${BLUE}⏱️  Response time:${NC} ${DURATION}ms"
echo -e "${BLUE}📊 Status:${NC} $HTTP_CODE"
echo ""

if [[ "$HTTP_CODE" != "200" ]]; then
  echo -e "${RED}❌ Error Response:${NC}"
  echo "$BODY"
  exit 1
fi

echo -e "${GREEN}✅ Response:${NC}"
echo "================================"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo "================================"
echo ""

# Parse verdict
VERDICT=$(echo "$BODY" | jq -r '.verdict' 2>/dev/null || echo "")
MESSAGE=$(echo "$BODY" | jq -r '.message' 2>/dev/null || echo "")

if [[ "$VERDICT" == "ACCEPT" ]]; then
  echo -e "${GREEN}🎉 VERDICT: ACCEPTED!${NC}"
elif [[ "$VERDICT" == "REJECT" ]]; then
  echo -e "${RED}🚫 VERDICT: REJECTED${NC}"
fi

if [[ -n "$MESSAGE" ]] && [[ "$MESSAGE" != "null" ]]; then
  echo -e "${PURPLE}💬 Message:${NC} $MESSAGE"
fi
