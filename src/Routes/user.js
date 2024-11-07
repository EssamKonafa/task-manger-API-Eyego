const express = require("express");
const router = express.Router();
const user = require('../controllers/users');

router.post("/", user.addUser);
router.post("/sign-in",user.signIn);
router.post("/sign-out",user.signOut);

module.exports = router;