#!/usr/bin/env node

/**
 * Test script for n8n Berlin Bouncer webhook
 * Usage: node test-webhook.js [club] [image-path]
 * Example: node test-webhook.js Berghain ./test-images/outfit.jpg
 */

const fs = require('fs');
const path = require('path');

// Configuration
const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://dpitt.app.n8n.cloud/webhook-test/berlin-bouncer';
const CLUBS = ['Berghain', 'KitKat', 'Sisyphus'];

// Parse command line arguments
const args = process.argv.slice(2);
const club = args[0] || 'Berghain';
const imagePath = args[1];

// Validate club
if (!CLUBS.includes(club)) {
    console.error(`❌ Invalid club: ${club}`);
    console.error(`   Valid clubs: ${CLUBS.join(', ')}`);
    process.exit(1);
}

// Function to create a test payload with a real image
async function createPayloadWithImage(imagePath) {
    if (!imagePath || !fs.existsSync(imagePath)) {
        console.log('⚠️  No image provided, using 1x1 test pixel');
        return {
            club,
            image: {
                data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                mimeType: 'image/png',
                filename: 'test.png'
            }
        };
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const ext = path.extname(imagePath).toLowerCase();

    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    };

    return {
        club,
        image: {
            data: base64Image,
            mimeType: mimeTypes[ext] || 'image/jpeg',
            filename: path.basename(imagePath)
        }
    };
}

// Main test function
async function testWebhook() {
    console.log('🎭 Berlin Bouncer Webhook Test');
    console.log('================================');
    console.log(`🏢 Club: ${club}`);
    console.log(`🔗 Webhook: ${WEBHOOK_URL}`);

    if (imagePath) {
        console.log(`📸 Image: ${imagePath}`);
    }
    console.log('');

    try {
        const payload = await createPayloadWithImage(imagePath);

        console.log('📤 Sending request...');
        const startTime = Date.now();

        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const duration = Date.now() - startTime;

        console.log(`⏱️  Response time: ${duration}ms`);
        console.log(`📊 Status: ${response.status} ${response.statusText}`);
        console.log('');

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error Response:');
            console.error(errorText);
            process.exit(1);
        }

        const result = await response.json();

        console.log('✅ Response:');
        console.log('================================');
        console.log(JSON.stringify(result, null, 2));
        console.log('================================');
        console.log('');

        // Pretty print the verdict
        if (result.verdict === 'ACCEPT') {
            console.log('🎉 VERDICT: ACCEPTED!');
        } else if (result.verdict === 'REJECT') {
            console.log('🚫 VERDICT: REJECTED');
        }

        if (result.message) {
            console.log(`💬 Message: ${result.message}`);
        }

    } catch (error) {
        console.error('❌ Test failed:');
        console.error(error.message);
        process.exit(1);
    }
}

// Show usage if --help
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🎭 Berlin Bouncer Webhook Test Script

Usage:
  node test-webhook.js [club] [image-path]

Arguments:
  club        Club name (default: Berghain)
              Options: ${CLUBS.join(', ')}
  image-path  Path to image file (optional)
              Supported: .jpg, .jpeg, .png, .gif, .webp

Examples:
  node test-webhook.js
  node test-webhook.js Berghain
  node test-webhook.js KitKat ./my-outfit.jpg
  node test-webhook.js Sisyphus ~/Downloads/rave-outfit.png

Environment:
  N8N_WEBHOOK_URL  Override webhook URL (default: test webhook)
  `);
    process.exit(0);
}

// Run the test
testWebhook();
