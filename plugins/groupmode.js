module.exports = async (sock, msg) => {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;

    const text = msg.message?.conversation || "";

    // hanya untuk grup
    if (!jid.endsWith("@g.us")) return;

    const metadata = await sock.groupMetadata(jid);
    const admins = metadata.participants
        .filter(v => v.admin !== null)
        .map(v => v.id);

    const isAdmin = admins.includes(sender);

    if (!isAdmin) {
        return sock.sendMessage(jid, {
            text: "❌ Hanya admin yang bisa menggunakan fitur ini"
        });
    }

    // 🔓 OPEN GROUP
    if (text.toLowerCase() === "open") {
        await sock.groupSettingUpdate(jid, "not_announcement");

        await sock.sendMessage(jid, {
            text: "🟢 Grup dibuka (OPEN)\nSemua member bisa mengirim pesan"
        });
    }

    // 🔒 CLOSE GROUP
    if (text.toLowerCase() === "close") {
        await sock.groupSettingUpdate(jid, "announcement");

        await sock.sendMessage(jid, {
            text: "🔴 Grup ditutup (CLOSE)\nHanya admin yang bisa mengirim pesan"
        });
    }
};
