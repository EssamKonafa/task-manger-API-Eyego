const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
    try {
        const token = req.cookies.refreshToken ? req.cookies.refreshToken : req.cookies['access-token'];
        if (!token) return res.status(400).json({ message: "Authorization token missing" });
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET||"mySecretToken");
        req.token = decoded;
        console.log('this user is authenticated');
        next();
    } catch (error) {
        return res.status(401).send({ error: 'Unauthorized', message: 'Please provide a valid authentication token' });
    }
};

module.exports = auth;