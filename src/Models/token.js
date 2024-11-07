const { Types, model, Schema } = require("mongoose");

const tokenSchema = new Schema({
    userId: { type: Types.ObjectId, required: true, ref: "User", index: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 1800 }
});

const TokenModel = model("Token", tokenSchema);
module.exports = TokenModel;