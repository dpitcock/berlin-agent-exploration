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

    // --- MOCK MODE FOR TESTING ---
    const useMocks = process.env.USE_MOCKS === 'true';
    const mockedResponse = process.env.MOCKED_RESPONSE || 'reject'; // default to reject
    const MOCK_DELAY = 3000; // 3 seconds to see the eyes animation

    console.log('[DEBUG] Environment variables:', {
      USE_MOCKS: process.env.USE_MOCKS,
      useMocks,
      MOCKED_RESPONSE: process.env.MOCKED_RESPONSE,
      mockedResponse
    });

    if (useMocks) {
      console.log(`[MOCK MODE] Simulating ${mockedResponse}...`);

      await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

      if (mockedResponse === 'failure' || mockedResponse === 'error') {
        return NextResponse.json(
          { verdict: 'ERROR', message: 'I quit being a bouncer', club },
          { status: 500 }
        );
      }

      const isAccept = mockedResponse === 'success-approve' || mockedResponse === 'accept';
      const verdict = isAccept ? 'ACCEPT' : 'REJECT';

      const mockResponse = {
        verdict: verdict,
        club: club,
        message: isAccept
          ? "Your vibe is impeccable. The darkness suits you. Enter."
          : "Not enough black. Too much joy. Go home and rethink your life.",
      };

      return NextResponse.json(mockResponse);
    }
    // -----------------------------

    // Get n8n webhook URL from environment variable
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      return NextResponse.json(
        { verdict: 'ERROR', message: 'System configuration error: N8N_WEBHOOK_URL missing', club },
        { status: 500 }
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
        message: 'The bouncer is having a bad day. Try again later.',
        club: 'Unknown',
      },
      { status: 500 }
    );
  }
}
