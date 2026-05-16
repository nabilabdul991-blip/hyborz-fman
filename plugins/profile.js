module.exports = async (sock, msg) => {
    const jid = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;

    const text = `
👤 *USER INFO*

📱 ID: ${sender}
📍 Chat: ${jid}
`;

    await sock.sendMessage(jid, { text });
};
