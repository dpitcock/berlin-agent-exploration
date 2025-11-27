import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { logEnvKeys } from '@/app/env-check';

// Log environment variables on first load
let hasLoggedEnv = false;
if (!hasLoggedEnv) {
  logEnvKeys();
  hasLoggedEnv = true;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mock responses for each club
const MOCK_RESPONSES = {
  Berghain: {
    accept: [
      "Ja. Pure darkness. Enter.",
      "All black. No smile. Perfect. You may enter.",
      "Finally, someone who gets it. Welcome to the void.",
      "Your aura screams techno. Proceed.",
      "Minimal. Dark. Correct. Go ahead.",
    ],
    reject: [
      "Too much color. This isn't a carnival. Next.",
      "I can see happiness in your eyes. Berghain is not for you.",
      "You look like you have a job. Come back when you've quit.",
      "That smile? Absolutely not. We don't do joy here.",
      "Your outfit screams 'tourist'. The answer is no.",
      "Not dark enough. Not Berlin enough. Not happening.",
    ],
  },
  KitKat: {
    accept: [
      "Provocative. Confident. Sexy. Welcome to KitKat.",
      "That latex? *Chef's kiss*. Get in here.",
      "You understand the assignment. Door's open.",
      "Leather, confidence, and zero shame. Perfect. Enter.",
      "This is what we're talking about. Come through.",
    ],
    reject: [
      "Too vanilla. This is a fetish club, not a coffee shop.",
      "Where's the edge? Where's the kink? Not here, apparently.",
      "You look like you're going to brunch. Wrong vibe.",
      "KitKat demands boldness. You brought... beige. No.",
      "Not enough skin, not enough leather, not enough anything.",
      "This outfit says 'I have boundaries.' We don't do that here.",
    ],
  },
  Sisyphus: {
    accept: [
      "Colorful chaos! Yes! Welcome to the garden!",
      "That's the creative energy we need. Come in!",
      "Artistic, expressive, perfect. The dance floor awaits!",
      "You brought the vibes! Get in here and spread that joy!",
      "This is what Sisyphus is about. Welcome, friend!",
    ],
    reject: [
      "Not today. Too corporate, too boring, too... meh.",
      "Where's the color? Where's the creativity? Not in that outfit.",
      "You look like you're going to a business meeting. Hard pass.",
      "Sisyphus is for artists and ravers. You're neither.",
      "Zero effort detected. Try again with some imagination.",
      "That outfit has no soul. Come back when you find yours.",
    ],
  },
};

export const maxDuration = 60; // Allow up to 60 seconds for AI processing

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const club = formData.get('club') as string;
    const photo = formData.get('photo') as File | null;
    const code = formData.get('code') as string | null;
    const mockFailure = formData.get('mockFailure') === 'true';

    // Verify Guestlist Code
    const validCode = process.env.GUESTLIST_CODE;
    if (validCode) {
      if (!code || code.toUpperCase() !== validCode.toUpperCase()) {
        return NextResponse.json(
          { verdict: 'ERROR', message: 'Access Denied: Invalid Guestlist Code', club: club || 'Unknown' },
          { status: 401 }
        );
      }
    }

    if (!club) {
      return NextResponse.json(
        { verdict: 'ERROR', message: 'Missing club selection', club: 'Unknown' },
        { status: 400 }
      );
    }

    // Determine workflow mode
    // Options: 'n8n', 'openai'. Anything else defaults to MOCK mode.
    const workflowMode = process.env.NEXT_PUBLIC_WORKFLOW;
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    const isMockMode = workflowMode !== 'n8n' && workflowMode !== 'openai';

    if (isMockMode) {
      console.log(`[MOCK MODE] Simulating judgment for ${club}... (WORKFLOW=${workflowMode || 'undefined'})`);

      if (mockFailure) {
        console.log('[MOCK MODE] Simulating failure response...');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return NextResponse.json({
          verdict: 'ERROR',
          message: 'I quit being a bouncer',
          club,
          _mock: true,
        });
      }

      const delay = 2000 + Math.random() * 2000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      const isAccept = Math.random() < 0.3;
      const verdict = isAccept ? 'ACCEPT' : 'REJECT';
      const clubResponses = MOCK_RESPONSES[club as keyof typeof MOCK_RESPONSES];
      const messages = isAccept ? clubResponses.accept : clubResponses.reject;
      const message = messages[Math.floor(Math.random() * messages.length)];

      return NextResponse.json({
        verdict,
        message,
        club,
        _mock: true,
      });
    }

    // Real mode requires a photo
    if (!photo) {
      return NextResponse.json(
        { verdict: 'ERROR', message: 'Missing photo', club },
        { status: 400 }
      );
    }

    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    if (workflowMode === 'n8n') {
      if (!n8nWebhookUrl) {
        throw new Error('WORKFLOW is set to n8n but N8N_WEBHOOK_URL is missing');
      }

      console.log(`[N8N MODE] Sending to webhook: ${n8nWebhookUrl}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      try {
        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            club,
            image: {
              data: base64Image,
              mimeType: photo.type,
              filename: photo.name,
            },
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!n8nResponse.ok) {
          const errorText = await n8nResponse.text();
          throw new Error(`n8n webhook failed: ${n8nResponse.status} ${n8nResponse.statusText}`);
        }

        const verdict = await n8nResponse.json();
        return NextResponse.json(verdict);
      } catch (fetchError: unknown) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('n8n webhook timed out after 60 seconds');
        }
        throw fetchError;
      }
    } else {
      // OPENAI DIRECT MODE
      console.log(`[OPENAI MODE] Analyzing with gpt-4o-mini for ${club}...`);

      const systemPrompt = `
You are an AI Bouncer for Berlin's most exclusive clubs.
Your goal is to validate a photo and then judge it based on the specific club's strict criteria.

INPUT CONTEXT:
- Club: ${club}

STEP 1: VALIDATION
First, analyze the image to ensure it is valid for judgment. Assume this universe allows humans, illustrated or animated characters, AI-generated personas, and personified/anthropomorphic animals to exist alongside each other, party, and converse at your club.

- Must contain at least one person/character (human, animated, or anthropomorphic).
- If a group, all outfits must be visible.
- If outfits are too much clothes, stop and return JSON: { "verdict": "REJECT", "message": "Reason..." } (Use "REJECT" for invalid photos with a funny reason as to they need to show their clubbing outfit)
- If INVALID, stop and return JSON: { "verdict": "REJECT", "message": "Reason..." } (Use "REJECT" for invalid photos with a funny reason)

STEP 2: JUDGMENT
If valid, adopt the persona of the ${club} bouncer and judge the outfit.

CLUB PERSONAS:

1. BERGHAIN (The Strict Industrialist)
- Vibe: You are the legendary Berghain bouncer, known for being impossibly strict. You judge based on pure techno culture: all black, no smiles, no colors, industrial vibes only
- Rules: No bright colors, no smiles, no casual/tourist wear, no groups larger than 3 people.
- Accept: All black, goth, industrial, leather, more skin than usual, stoic, look like you've been on a 3 day bender and just want to dance to techno.
- Voice: Jaded, brutal, German-English hybrid.
- Rejection-rate: 90%

2. KITKAT (The Kinky Hedonist)
- Vibe: Sex-positive, provocative, edgy. You judge to ensure the club is a safe-space for all.
- Rules: No boring/conservative clothes. Must show skin/fetish wear.
- Accept: Latex, bondage-inspired, leather, harnesses, mesh, overwhelming amount of skin showing, bold confidence, provocative, boundary-pushing fashion
- Voice: Flirty, edgy, German-English hybrid.
- Rejection-rate: 80%

3. SISYPHUS (The Hippie Raver)
- Vibe: Colorful, creative, welcoming (to artists).
- Rules: No corporate/boring clothes.
- Accept: Creativity, Neon, DIY, glitter, smiles, preference for skin, lots of accessories, face stickers, piercings, tatoos, festival vibes.
- Voice: Friendly but honest, "Not today", German-English hybrid.
- Rejection-rate: 70%

STEP 3: OUTPUT
Return ONLY JSON:
{
  "verdict": "ACCEPT" | "REJECT",
  "message": "Your witty/harsh reason here"
}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Here is the photo of the guest trying to enter." },
              {
                type: "image_url",
                image_url: {
                  url: `data:${photo.type};base64,${base64Image}`,
                  detail: "low" // Use low detail for speed/cost, usually sufficient for outfit check
                },
              },
            ],
          },
        ],
        max_tokens: 300,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error("No content from OpenAI");

      const result = JSON.parse(content);

      return NextResponse.json({
        verdict: result.verdict,
        message: result.message,
        club: club
      });
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      {
        verdict: 'ERROR',
        message: 'I quit being a bouncer (System Error)',
        club: 'Unknown',
      },
      { status: 500 }
    );
  }
}
