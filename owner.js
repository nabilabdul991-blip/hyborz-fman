let owner = ["6287825121119"];

module.exports = {
    addOwner: (num) => owner.push(num),
    delOwner: (num) => owner = owner.filter(v => v !== num),
    isOwner: (num) => owner.includes(num),
    listOwner: () => owner
};
