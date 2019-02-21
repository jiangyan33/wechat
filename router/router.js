const router = require('express').Router();
const config = require('config');
const sha1 = require('sha1');
const accessToken = require('../libs/accessToken');

router.get('/', (req, res) => {
    let { signature, timestamp, nonce, echostr } = req.query;
    let sortStr = [timestamp, nonce, config.app.token].sort().join('');
    sha1(sortStr) === signature ? res.send(echostr) : res.send('wrong');
})

module.exports = router;