const TokenModel = require("../models/token");
const UserModel = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function addUser(req, res) {
    const { name, email, password } = req.body;
    if (!name) return res.status(400).json({ message: "user name not found" });
    if (!email) return res.status(400).json({ message: "email not found" });
    if (!password) return res.status(400).json({ message: "user password not found" });
    try {
        const user = new UserModel({ name, email, password })
        const token = new TokenModel({
            userId: user.id,
            token: crypto.randomBytes(32).toString('hex')
        });
        await user.save();
        await token.save();
        return res.status(201).json(user);
    } catch (error) {
        console.error("error while creating user", error);
        return res.status(500).json({ message: "internal server error" })
    }
}

async function signIn(req, res) {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ message: "email not found" });
    if (!password) return res.status(400).json({ message: "user password not found" });
    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "invalid email" })
        if (!user.password) return res.status(500).json({ message: "user password is missing" });
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(401).json({ message: 'invalid password' })
        const accessToken = jwt.sign(
            { id: user.id, name: user.name },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' });

        const refreshToken = jwt.sign(
            { id: user.id, name: user.name },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' });

        // Store refresh token in user document
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: "lax",
        });
        return res.status(200).json({ message: "logged successfully", id: user.id })
    } catch (error) {
        console.error('error while signing user in', error);
        return res.status(500).json({ message: "internal server error" })
    }
}

async function signOut(req, res) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(204).json({ message: "No refresh Token found" });
    try {
        const user = await UserModel.findOne({ refreshToken });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.refreshToken = '';
        await user.save();

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: false,
        });

        return res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        console.error('error while signing user out', error);
        return res.status(500).json({ message: "internal server error" })
    }
}

async function refreshToken(req, res) {
    const cookies = req.cookies;
    if (cookies) return res.status(400).json({ message: "refresh token not found" });
    try {
        if (!cookies.refreshToken) return res.status(401).json({ message: "No refresh token found" });
        const refreshToken = cookies.refreshToken;
        const user = await UserModel.findOne({ refreshToken });
        if (!user) return res.status(403).json({ message: "Invalid refresh token" });
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (error, decoded) => {
                if (error || user.id !== decoded.id) return res.status(403).json({ message: "Forbidden" });
                const accessToken = jwt.sign(
                    { id: decoded.id, name: decoded.name },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '7d' }
                );
                return res.status(200).json({ message: "Access token refreshed successfully", userId: user.id });
            }
        );
    } catch (error) {
        console.error('Error occurred during token refresh', error);
        return res.status(500).json({ message: "Internal server fkn error" });
    }
};

module.exports = { addUser, signIn, signOut, refreshToken }