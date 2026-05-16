const axios = require("axios");

module.exports = async (url) => {
    const res = await axios.get(`https://api.tiklydown.me/api/download?url=${url}`);
    return res.data;
};
