const axios = require("axios");

let lastSent = {};

module.exports = async (sock, jid) => {
    try {
        // 📍 lokasi (bisa kamu ganti kota kamu)
        const city = "Jakarta";
        const country = "Indonesia";

        const res = await axios.get(
            `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=8`
        );

        const timings = res.data.data.timings;

        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, "0") + ":" +
                            now.getMinutes().toString().padStart(2, "0");

        const sholat = {
            Subuh: timings.Fajr,
            Dzuhur: timings.Dhuhr,
            Ashar: timings.Asr,
            Maghrib: timings.Maghrib,
            Isya: timings.Isha
        };

        for (let name in sholat) {
            if (sholat[name] === currentTime && !lastSent[name]) {
                await sock.sendMessage(jid, {
                    text: `🕌 Waktu ${name} telah tiba\n\nSegera laksanakan sholat.`
                });

                lastSent[name] = true;
            }
        }

        // reset tiap jam
        if (now.getMinutes() === 0) {
            lastSent = {};
        }

    } catch (e) {
        console.log("Adzan error:", e);
    }
};
