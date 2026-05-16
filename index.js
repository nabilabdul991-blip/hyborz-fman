const { default: makeWASocket } = require("@whiskeysockets/baileys");

async function startBot() {
    const sock = makeWASocket();

    console.log("🤖 Bot berhasil dijalankan");

    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg || !msg.message) return;

        const from = msg.key.remoteJid;
        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        console.log("Pesan masuk:", text);

        if (text === "menu") {
            await sock.sendMessage(from, {
                text: "✅ Bot aktif & index.js tidak error"
            });
        }
    });
}

startBot();
