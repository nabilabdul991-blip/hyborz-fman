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

// ================= MENU AKAR =================
async function menuAkar(sock, jid) {
    const teks = `
🌳 *AKAR BOT MENU*

🤖 MENU
- menu
- allmenu

⚡ INFO
- ping
- profile

🛒 STORE
- store
- buy

👑 OWNER
- addowner
- delowner
`;

    await sock.sendMessage(jid, { text: teks });
}

// ================= START BOT =================
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
        const number = await question("📱 Masukkan nomor (62xxxx): ");

        const code = await sock.requestPairingCode(number.trim());

        console.log("\n🔑 KODE PAIRING:");
        console.log(code);
        console.log("\n👉 Masukkan di WhatsApp > Perangkat Tertaut");
    }

    // ================= CONNECT =================
    sock.ev.on("connection.update", (update) => {
        if (update.connection === "open") {
            console.log("🤖 BOT AKTIF");
        }
    });

    // ================= MESSAGE HANDLER =================
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

            // ================= MENU =================
            if (body === "menu" || body === "allmenu") {
                await menuAkar(sock, from);
            }

            // ================= PING =================
            if (body === "ping") {
                const start = Date.now();
                await sock.sendMessage(from, { text: "🏓 Pong!" });
                const end = Date.now();

                await sock.sendMessage(from, {
                    text: `⚡ Speed: ${end - start}ms`
                });
            }

            // ================= PROFILE =================
            if (body === "profile") {
                const sender = msg.key.participant || from;

                await sock.sendMessage(from, {
                    text: `👤 USER ID:\n${sender}`
                });
            }

            // ================= STORE SIMPLE =================
            if (body === "store") {
                await sock.sendMessage(from, {
                    text: "🛒 Store belum diisi produk"
                });
            }

            if (body.startsWith("buy ")) {
                await sock.sendMessage(from, {
                    text: "❌ Produk belum tersedia"
                });
            }

        } catch (e) {
            console.log("ERROR:", e);
        }
    });

}

startBot();
