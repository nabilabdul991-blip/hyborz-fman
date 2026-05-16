let products = [
    { id: 1, name: "Premium Bot", price: 10000 },
    { id: 2, name: "VIP Feature", price: 20000 },
    { id: 3, name: "Panel Bot", price: 50000 }
];

module.exports = {
    list: async (sock, jid) => {
        let text = "🛒 *STORE LIST*\n\n";
        products.forEach(p => {
            text += `📦 ${p.id}. ${p.name}\n💰 Rp${p.price}\n\n`;
        });

        await sock.sendMessage(jid, { text });
    },

    buy: async (sock, jid, id) => {
        const item = products.find(p => p.id == id);

        if (!item) {
            return sock.sendMessage(jid, {
                text: "❌ Produk tidak ditemukan"
            });
        }

        await sock.sendMessage(jid, {
            text: `🛒 *ORDER DITERIMA*\n\n📦 ${item.name}\n💰 Rp${item.price}\n\nSilakan hubungi owner untuk pembayaran.`
        });
    }
};
