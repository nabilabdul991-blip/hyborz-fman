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
const menu = require("./plugins/menu");
const sound = require("./plugins/sound");

sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const text = msg.message.conversation || "";

    const cmd = text.toLowerCase();

    // 🔥 MENU & ALLMENU TRIGGER
    if (cmd === "menu" || cmd === "allmenu") {

        // ⌨️ typing effect
        await sock.sendPresenceUpdate('composing', from);
        await new Promise(r => setTimeout(r, 1500));

        // 📋 kirim menu
        await menu(sock, from, config);

        // 🔊 kirim sound
        await sound(sock, from, "./media/menu.mp3");

        await sock.sendPresenceUpdate('available', from);
    }
});
const owner = require("./plugins/owner");

sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const text = msg.message.conversation || "";

    // ➕ ADD OWNER
    if (text.startsWith(".addowner ")) {
        let num = text.replace(".addowner ", "");
        let res = owner.addOwner(num);

        await sock.sendMessage(from, { text: res });
    }

    // ➖ DEL OWNER
    if (text.startsWith(".delowner ")) {
        let num = text.replace(".delowner ", "");
        let res = owner.delOwner(num);

        await sock.sendMessage(from, { text: res });
    }
});
