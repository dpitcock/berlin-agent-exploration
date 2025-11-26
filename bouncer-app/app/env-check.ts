// Environment variable diagnostic utility
export function logEnvKeys() {
    console.log('\n🔍 ENV CHECK - Server Side');
    console.log('================================');
    console.log('N8N_WEBHOOK_URL:', process.env.N8N_WEBHOOK_URL ? '✅ SET' : '❌ NOT SET');
    console.log('USE_MOCKS:', process.env.USE_MOCKS ? '✅ SET' : '❌ NOT SET');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('================================\n');
}
