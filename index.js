process.removeAllListeners("warning");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

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

    if (!sock.authState.creds.registered) {
        const number = await question("Masukkan nomor 62xxxx: ");
        const code = await sock.requestPairingCode(number.trim());

        console.log("PAIRING CODE:");
        console.log(code);
    }

    sock.ev.on("connection.update", (update) => {
        if (update.connection === "open") {
            console.log("BOT CONNECTED");
        }
    });

    sock.ev.on("messages.upsert", async (m) => {
        try {

            const msg = m.messages?.[0];
            if (!msg || !msg.message) return;

            const from = msg.key.remoteJid;

            const text =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                "";

            const body = text.toLowerCase().trim();

            if (body === "menu") {
                await sock.sendMessage(from, {
                    text: "BOT AKTIF"
                });
            }

        } catch (e) {
            console.log(e);
        }
    });

}

startBot();
