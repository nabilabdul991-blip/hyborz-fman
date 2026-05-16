module.exports = async (sock, msg) => {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const text = msg.message?.conversation || "";

    if (!jid.endsWith("@g.us")) return;

    const metadata = await sock.groupMetadata(jid);
    const admins = metadata.participants
        .filter(v => v.admin !== null)
        .map(v => v.id);

    const isAdmin = admins.includes(sender);

    if (!isAdmin) {
        return sock.sendMessage(jid, {
            text: "❌ Hanya admin yang bisa sematkan chat"
        });
    }

    // 📌 PIN CHAT (sematkan pesan terakhir)
    if (text.toLowerCase() === "pin") {
        try {
            await sock.sendMessage(jid, {
                text: "📌 Pesan disematkan"
            });

            // WhatsApp pin message (butuh message key)
            await sock.groupPinMessage(jid, msg.key);
        } catch (e) {
            await sock.sendMessage(jid, {
                text: "⚠️ Gagal menyematkan pesan"
            });
        }
    }

    // 📍 UNPIN CHAT
    if (text.toLowerCase() === "unpin") {
        try {
            await sock.groupUnpinMessage(jid, msg.key);

            await sock.sendMessage(jid, {
                text: "📍 Pesan dilepas dari sematan"
            });
        } catch (e) {
            await sock.sendMessage(jid, {
                text: "⚠️ Gagal melepas sematan"
            });
        }
    }
};
