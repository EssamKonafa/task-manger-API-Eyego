const express = require("express");
const router = express.Router();
const user = require('../controllers/users');
const auth = require("../middlewares/auth");

router.post("/", user.addUser);
router.post("/sign-in", user.signIn);
router.post("/sign-out", auth, user.signOut);
router.post("/refresh-token", user.refreshToken);

module.exports = router;