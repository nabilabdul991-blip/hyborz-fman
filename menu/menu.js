module.exports = async (sock, from, config) => {

    const menuText = `
🤖 *${config.botName} MENU*

📌 menu
📌 allmenu
📌 ai
📌 sticker
📌 download
📌 adzan

🔥 Bot aktif
`;

    await sock.sendMessage(from, { text: menuText });
};
