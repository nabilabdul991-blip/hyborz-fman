const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = async (sock, msg) => {
    const jid = msg.key.remoteJid;

    const media = msg.message.imageMessage || msg.message.videoMessage;
    if (!media) return;

    const stream = await downloadContentFromMessage(media, "image");

    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    await sock.sendMessage(jid, {
        sticker: buffer
    });
};
