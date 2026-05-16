module.exports = async (sock, msg) => {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;

    const text = msg.message?.conversation || "";

    // hanya untuk grup
    if (!jid.endsWith("@g.us")) return;

    // cek apakah admin (sederhana)
    const metadata = await sock.groupMetadata(jid);
    const admins = metadata.participants
        .filter(v => v.admin !== null)
        .map(v => v.id);

    const isAdmin = admins.includes(sender);

    if (!isAdmin) {
        return sock.sendMessage(jid, {
            text: "❌ Hanya admin yang bisa pakai fitur ini"
        });
    }

    // command: .setprofilgrup (dengan gambar)
    if (text.startsWith(".setprofilgrup")) {
        if (!msg.message.imageMessage) {
            return sock.sendMessage(jid, {
                text: "⚠️ Kirim gambar dengan caption .setprofilgrup"
            });
        }

        const media = msg.message.imageMessage;

        const buffer = await sock.downloadMediaMessage(msg);

        await sock.updateProfilePicture(jid, buffer);

        await sock.sendMessage(jid, {
            text: "✅ Profil grup berhasil diubah"
        });
    }
};
