const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } =
require("@whiskeysockets/baileys");

const readline = require("readline");

function question(text) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(text, answer => {
            rl.close();
            resolve(answer);
        });
    });
}

async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        auth: state,
        version
    });

    sock.ev.on("creds.update", saveCreds);

    // ================= PAIRING CODE =================
    if (!sock.authState.creds.registered) {

        const phoneNumber = await question("📱 Masukkan nomor (62xxxx): ");

        const code = await sock.requestPairingCode(phoneNumber.trim());

        console.log("\n🔑 PAIRING CODE ANDA:");
        console.log(code);
        console.log("\n👉 Masukkan kode ini di WhatsApp (Linked Devices)");
    }

    // ================= CONNECT STATUS =================
    sock.ev.on("connection.update", (update) => {
        const { connection } = update;

        if (connection === "open") {
            console.log("🤖 Bot berhasil connect!");
        }
    });

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
            await sock.sendMessage(from, { text: "✅ Bot aktif (pairing mode)" });
        }
    });
}

startBot();
