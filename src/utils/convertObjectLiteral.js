
module.exports = {
    toObjectLiteral: (obj) => obj.toObject(),
    toMultiObjectLiteral: (arr) => arr.map((obj) => obj.toObject())
}