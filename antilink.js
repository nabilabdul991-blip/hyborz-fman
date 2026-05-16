module.exports = async (sock, msg) => {
    const text = msg.message?.conversation || "";

    if (text.includes("http://") || text.includes("https://")) {
        await sock.sendMessage(msg.key.remoteJid, {
            text: "⚠️ kalo buta rules usahakan jangan bego!"
        });
    }
};
