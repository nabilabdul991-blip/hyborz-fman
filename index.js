const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const readline = require("readline");

// ================= INPUT NOMOR =================
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

    // ================= SESSION =================
    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        auth: state,
        version
    });

    sock.ev.on("creds.update", saveCreds);

    // ================= PAIRING CODE =================
    if (!sock.authState.creds.registered) {
        const number = await question("📱 Masukkan nomor (62xxxx): ");

        const code = await sock.requestPairingCode(number.trim());

        console.log("\n🔑 KODE PAIRING:");
        console.log(code);
        console.log("\n👉 Masukkan di WhatsApp > Perangkat Tertaut");
    }

    // ================= CONNECTION =================
    sock.ev.on("connection.update", (update) => {
        const { connection } = update;

        if (connection === "open") {
            console.log("🤖 BOT CONNECTED");
        }
    });

    // ================= MESSAGE HANDLER (INTI BOT) =================
    sock.ev.on("messages.upsert", async (m) => {
        try {

            const msg = m.messages?.[0];
            if (!msg || !msg.message) return;

            const from = msg.key.remoteJid;

            const text =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                msg.message.imageMessage?.caption ||
                msg.message.videoMessage?.caption ||
                "";

            const body = text.toLowerCase().trim();

            console.log("📩:", body);

            // ================= COMMAND =================

            if (body === "menu") {
                await sock.sendMessage(from, {
                    text: "🤖 MENU BOT AKTIF\n\n✔ menu\n✔ allmenu\n✔ store\n✔ ping
