// Environment variable checker for Next.js
// Run this to check which env vars are loaded

console.log('\n🔍 Environment Variables Check:');
console.log('================================');

// Check for our specific variables
const envVars = {
    'N8N_WEBHOOK_URL': process.env.N8N_WEBHOOK_URL,
};

Object.entries(envVars).forEach(([key, value]) => {
    const status = value ? '✅ SET' : '❌ NOT SET';
    console.log(`${status} - ${key}`);
    if (value) {
        console.log(`   Value starts with: ${value.substring(0, 4)}...`);
    }
});

// Show all NEXT_PUBLIC_ variables
const publicVars = Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'));
if (publicVars.length > 0) {
    console.log('\n📢 Public Variables (NEXT_PUBLIC_*):');
    publicVars.forEach(key => {
        console.log(`  ✅ ${key}`);
    });
} else {
    console.log('\n📢 No NEXT_PUBLIC_* variables found');
}

console.log('================================\n');
