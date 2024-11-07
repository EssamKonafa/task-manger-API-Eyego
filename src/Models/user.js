const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    name: { type: String, required: true, },
    email: { type: String, required: true, index: true, unique:true },
    password: { type: String, required: true, minlength: 8 },
    refreshToken: { type: String },
},
    { timestamps: true }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next();
    } catch (error) {
        throw error
    }
})

const UserModel = model("User", userSchema);
module.exports = UserModel;