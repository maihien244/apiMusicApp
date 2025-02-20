
module.exports = {
    toObjectLiteral: (obj) => obj.toObject(),
    toMultiObjectLiteral: (arr) => {
        // console.log(typeof arr)
        return arr.map((obj) => obj.toObject())
    }
}