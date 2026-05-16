module.exports = async (sock, msg) => {
    const jid = msg.key.remoteJid;
    const text = msg.message?.conversation || "";

    if (text.toLowerCase() !== "toimg") return;

    if (!msg.message?.stickerMessage) {
        return sock.sendMessage(jid, {
            text: "⚠️ Kirim sticker dengan caption: toimg"
        });
    }

    try {
        const buffer = await sock.downloadMediaMessage(msg);

        await sock.sendMessage(jid, {
            image: buffer,
            caption: "✅ Hasil convert sticker ke image"
        });

    } catch (e) {
        await sock.sendMessage(jid, {
            text: "❌ Gagal convert sticker"
        });
    }
};
