const axios = require("axios");
const config = require("../settings");

module.exports = async (text) => {
    const res = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: text }]
    }, {
        headers: {
            Authorization: `Bearer ${config.openaiKey}`
        }
    });

    return res.data.choices[0].message.content;
};
