const axios = require("axios");

module.exports = async (sock, msg) => {
    const jid = msg.key.remoteJid;
    const text = msg.message?.conversation || "";

    if (!text.startsWith("google ")) return;

    const query = text.replace("google ", "");

    try {
        const res = await axios.get(`https://api.duckduckgo.com/?q=${query}&format=json`);

        await sock.sendMessage(jid, {
            text: `🔍 Hasil pencarian:\n\n${res.data.AbstractText || "Tidak ditemukan"}`
        });

    } catch (e) {
        await sock.sendMessage(jid, {
            text: "❌ Gagal mencari"
        });
    }
};
