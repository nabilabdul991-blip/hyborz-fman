const { default: makeWASocket } = require("@whiskeysockets/baileys");
const config = require("./settings");

// ================= PLUGINS =================
const antilink = require("./lib/antilink");

const menu = require("./plugins/menu");
const sound = require("./plugins/sound");

const owner = require("./plugins/owner");

const groupMode = require("./plugins/groupmode");
const pinChat = require("./plugins/pinchat");

const toimg = require("./plugins/toimg");
const brat = require("./plugins/brat");

const store = require("./plugins/store");

const ping = require("./plugins/ping");
const profile = require("./plugins/profile");
const google = require("./plugins/google");

const adzan = require("./plugins/adzan");

// ================= START BOT =================
async function startBot() {
    const sock = makeWASocket();

    // ================= MESSAGE HANDLER =================
    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!msg || !msg.message) return;

        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        const cmd = text.toLowerCase();

        // ================= ANTI LINK =================
        await antilink(sock, msg);

        // ================= MENU =================
        if (cmd === "menu" || cmd === "allmenu") {
            await sock.sendPresenceUpdate("composing", from);
            await new Promise((r) => setTimeout(r, 1500));

            await menu(sock, from, config);
            await sound(sock, from, "./media/menu.mp3");

            await sock.sendPresenceUpdate("available", from);
        }

        // ================= OWNER =================
        if (text.startsWith(".addowner ")) {
            let num = text.replace(".addowner ", "").trim();
            let res = owner.addOwner(num);
            await sock.sendMessage(from, { text: res });
        }

        if (text.startsWith(".delowner ")) {
            let num = text.replace(".delowner ", "").trim();
            let res = owner.delOwner(num);
            await sock.sendMessage(from, { text: res });
        }

        // ================= STORE =================
        if (cmd === "store" || cmd === "list") {
            await store.list(sock, from);
        }

        if (text.startsWith("buy ")) {
            let id = text.replace("buy ", "").trim();
            await store.buy(sock, from, id);
        }

        // ================= GROUP CONTROL =================
        await groupMode(sock, msg);

        // ================= PIN CHAT =================
        await pinChat(sock, msg);

        // ================= MEDIA FEATURES =================
        await toimg(sock, msg);
        await brat(sock, msg);

        // ================= INFO FEATURES =================
        await ping(sock, msg);
        await profile(sock, msg);
        await google(sock, msg);
    });

    // ================= ADZAN LOOP =================
    setInterval(async () => {
        try {
            const groups = await sock.groupFetchAllParticipating();

            for (let jid in groups) {
                await adzan(sock, jid);
            }
        } catch (e) {
            console.log("Adzan error:", e);
        }
    }, 60000);
}

startBot();
