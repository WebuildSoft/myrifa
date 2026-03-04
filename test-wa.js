const { sendWhatsAppMessage } = require('./lib/evolution');
require('dotenv').config();

async function testWA() {
    const adminPhone = process.env.ADMIN_ALERT_PHONE;
    console.log(`Sending test message to ${adminPhone}...`);
    try {
        const res = await sendWhatsAppMessage(
            adminPhone,
            "🚀 *Teste de Conexão MyRifa* 🚀\n\nSe você recebeu isso, a API de WhatsApp está funcionando perfeitamente!"
        );
        console.log("Send result:", res);
        process.exit(0);
    } catch (e) {
        console.error("Error sending message:", e);
        process.exit(1);
    }
}

testWA();
