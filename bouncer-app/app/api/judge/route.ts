import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const club = formData.get('club') as string;
    const photo = formData.get('photo') as File;

    if (!club || !photo) {
      return NextResponse.json(
        { verdict: 'ERROR', message: 'Missing club selection or photo', club: club || 'Unknown' },
        { status: 400 }
      );
    }

    // Get n8n webhook URL from environment variable
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      // If n8n is not configured, return a mock response for testing
      console.warn('N8N_WEBHOOK_URL not configured, using mock response');
      return getMockResponse(club);
    }

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
        message: 'The bouncer is having a bad day. Try again later.',
        club: 'Unknown',
      },
      { status: 500 }
    );
  }
}

// Mock response for testing without n8n
function getMockResponse(club: string) {
  const mockResponses = {
    Berghain: {
      verdict: 'REJECT',
      message: "Did you think this was a carnival? That outfit screams 'I'm here for the Instagram photo.' Berghain is a temple of darkness, not a tourist attraction. Try Sisyphus.",
      club: 'Berghain',
    },
    KitKat: {
      verdict: 'ACCEPT',
      message: "Now THAT'S what I'm talking about. Leather harness, confidence, and you clearly know what you're walking into. Welcome to the playground. Don't be shy.",
      club: 'KitKat',
    },
    Sisyphus: {
      verdict: 'ACCEPT',
      message: 'YES! That neon outfit and those creative accessories scream Sisyphus energy. You clearly came to dance, express yourself, and have a good time. Welcome home, raver!',
      club: 'Sisyphus',
    },
  };

  return NextResponse.json(
    mockResponses[club as keyof typeof mockResponses] || {
      verdict: 'ERROR',
      message: 'Unknown club selected.',
      club,
    }
  );
}
