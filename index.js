const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

async function startBot() {

    // 🔐 SESSION AUTH (INI YANG KURANG DI KAMU)
    const { state, saveCreds } = await useMultiFileAuthState("./session");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    // simpan session otomatis
    sock.ev.on("creds.update", saveCreds);

    console.log("🤖 Bot jalan... scan QR kalau diminta");

    // ================= MESSAGE =================
    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg || !msg.message) return;

        const from = msg.key.remoteJid;
        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        if (text === "menu") {
            await sock.sendMessage(from, { text: "✅ Bot sudah FIX dan jalan" });
        }
    });
}

startBot();
