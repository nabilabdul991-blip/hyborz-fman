const axios = require("axios");

module.exports = async (sock, msg) => {
    const jid = msg.key.remoteJid;
    const text = msg.message?.conversation || "";

    if (!text.startsWith("brat ")) return;

    const query = text.replace("brat ", "");

    try {
        const url = `https://api.popcat.xyz/brat?text=${encodeURIComponent(query)}`;

        await sock.sendMessage(jid, {
            image: { url: url },
            caption: "🧨 BRAT TEXT GENERATED"
        });

    } catch (e) {
        await sock.sendMessage(jid, {
            text: "❌ Gagal membuat BRAT image"
        });
    }
};
