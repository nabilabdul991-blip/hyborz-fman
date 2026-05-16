let owners = ["6287825121119"]; // default owner

module.exports = {
    
    addOwner: (number) => {
        if (!owners.includes(number)) {
            owners.push(number);
            return "✅ Owner berhasil ditambahkan";
        }
        return "⚠️ Nomor sudah menjadi owner";
    },

    delOwner: (number) => {
        if (owners.includes(number)) {
            owners = owners.filter(v => v !== number);
            return "✅ Owner berhasil dihapus";
        }
        return "⚠️ Nomor tidak ditemukan";
    },

    isOwner: (number) => {
        return owners.includes(number);
    },

    getOwners: () => {
        return owners;
    }
};
