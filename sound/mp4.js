const fs = require("fs");

module.exports = async (sock, jid, filePath) => {
    const audio = fs.readFileSync(filePath);

    await sock.sendMessage(jid, {
        audio: audio,
        mimetype: "audio/mp4",
        ptt: true
    });
};
