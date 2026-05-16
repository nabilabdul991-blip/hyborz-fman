await sock.sendMessage(jid, {
    audio: { url: "https://s.neoxr.eu/get/KHqteG.m4a" },
    mimetype: "audio/mp4",
    ptt: true
});
sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    const from = msg.key.remoteJid;
    const text = msg.message.conversation || "";

    if (text === "menu") {

        await sock.sendMessage(from, {
            text: "Menu bot"
        });

        // 🔊 ini bagian audio (link)
        await sock.sendMessage(from, {
            audio: { url: "https://s.neoxr.eu/get/KHqteG.m4a" },
            mimetype: "audio/mp4",
            ptt: true
        });
    }
});
