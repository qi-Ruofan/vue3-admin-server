var express = require('express');
var router = express.Router();
let { login, register, captcha } = require('../controller/users.js');

router.post('/login', login)
router.post('/register', register)
router.get('/captcha', captcha)

module.exports = router;
