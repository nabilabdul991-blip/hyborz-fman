module.exports = async (sock, msg) => {
    const text = msg.message?.conversation || "";
    const jid = msg.key.remoteJid;

    const linkRegex = /(https?:\/\/|www\.)/gi;

    if (linkRegex.test(text)) {
        await sock.sendMessage(jid, {
            text: "⚠️ Link terdeteksi, pesan dihapus!"
        });

        try {
            await sock.sendMessage(jid, {
                delete: msg.key
            });
        } catch (e) {
            console.log("Gagal hapus pesan");
        }
    }
};
