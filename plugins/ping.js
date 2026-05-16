module.exports = async (sock, msg) => {
    const jid = msg.key.remoteJid;
    const start = Date.now();

    await sock.sendMessage(jid, { text: "🏓 Pinging..." });

    const end = Date.now();
    const speed = end - start;

    await sock.sendMessage(jid, {
        text: `⚡ Speed Bot: ${speed}ms`
    });
};
