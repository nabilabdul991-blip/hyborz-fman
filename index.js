const { default: makeWASocket } = require("@whiskeysockets/baileys");
const config = require("./settings");

// import fitur
const antilink = require("./lib/antilink");

async function startBot() {
    const sock = makeWASocket();

    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        const text = msg.message.conversation || "";
        const from = msg.key.remoteJid;

        // 🔥 ANTI LINK
        await antilink(sock, msg);

        // contoh command simple
        if (text === ".menu") {
            await sock.sendMessage(from, { text: "Menu Bot Aktif" });
        }
    });
}

startBot();
const adzan = require("./plugins/adzan");

// ambil semua grup
sock.ev.on("connection.update", async () => {
    setInterval(async () => {
        const groups = await sock.groupFetchAllParticipating();

        for (let jid in groups) {
            await adzan(sock, jid);
        }
    }, 60000); // cek tiap 1 menit
});
