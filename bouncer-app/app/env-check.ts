// Environment variable checker
// This logs which env vars are loaded (keys only, not values for security)

export function logEnvKeys() {
    console.log('\n🔍 Environment Variables Check:');
    console.log('================================');

    // Check for our specific variables
    const envVars = {
        'N8N_WEBHOOK_URL': process.env.N8N_WEBHOOK_URL,
    };

    Object.entries(envVars).forEach(([key, value]) => {
        const status = value ? '✅ SET' : '❌ NOT SET';
        console.log(`${status} - ${key}`);
    });

    // Show all NEXT_PUBLIC_ variables (these are safe to show)
    const publicVars = Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'));
    if (publicVars.length > 0) {
        console.log('\n📢 Public Variables (NEXT_PUBLIC_*):');
        publicVars.forEach(key => {
            console.log(`  ✅ ${key}`);
        });
    }

    console.log('================================\n');
}
