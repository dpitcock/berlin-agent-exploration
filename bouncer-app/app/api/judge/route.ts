import { NextRequest, NextResponse } from 'next/server';
import { logEnvKeys } from '@/app/env-check';

// Log environment variables on first load
let hasLoggedEnv = false;
if (!hasLoggedEnv) {
  logEnvKeys();
  hasLoggedEnv = true;
}

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const club = formData.get('club') as string;
    const photo = formData.get('photo') as File | null;
    const mockFailure = formData.get('mockFailure') === 'true';

    if (!club) {
      return NextResponse.json(
        { verdict: 'ERROR', message: 'Missing club selection', club: 'Unknown' },
        { status: 400 }
      );
    }

    // Check if we're in mock mode (no N8N_WEBHOOK_URL configured)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    const isMockMode = !n8nWebhookUrl;

    if (isMockMode) {
      console.log(`[MOCK MODE] Simulating judgment for ${club}...`);

      // Check if user wants to simulate a failure
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

      // In mock mode, we don't require a photo
      // Simulate network delay (2-4 seconds)
      const delay = 2000 + Math.random() * 2000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Randomly decide accept/reject (30% accept, 70% reject to match Berghain vibes)
      const isAccept = Math.random() < 0.3;
      const verdict = isAccept ? 'ACCEPT' : 'REJECT';

      // Get random message for this club
      const clubResponses = MOCK_RESPONSES[club as keyof typeof MOCK_RESPONSES];
      const messages = isAccept ? clubResponses.accept : clubResponses.reject;
      const message = messages[Math.floor(Math.random() * messages.length)];

      return NextResponse.json({
        verdict,
        message,
        club,
        _mock: true, // Flag to indicate this is a mock response
      });
    }

    // Real mode requires a photo
    if (!photo) {
      return NextResponse.json(
        { verdict: 'ERROR', message: 'Missing photo', club },
        { status: 400 }
      );
    }

    // Real n8n logic starts here
    // Convert photo to base64 for n8n
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Send to n8n webhook
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        club,
        image: {
          data: base64Image,
          mimeType: photo.type,
          filename: photo.name,
        },
      }),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook failed: ${n8nResponse.statusText}`);
    }

    const verdict = await n8nResponse.json();
    return NextResponse.json(verdict);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      {
        verdict: 'ERROR',
        message: 'I quit being a bouncer',
        club: 'Unknown',
      },
      { status: 500 }
    );
  }
}
