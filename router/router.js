const router = require('express').Router();
const config = require('config');
const sha1 = require('sha1');
const accessToken = require('../libs/accessToken');
const weChat = require('../libs/weChat');

router.get('/', (req, res) => {
    let { signature, timestamp, nonce, echostr } = req.query;
    let sortStr = [timestamp, nonce, config.app.token].sort().join('');
    console.log('--------娇艳签名');
    sha1(sortStr) === signature ? res.send(echostr) : res.send('wrong');
});

router.post('/', async (req, res) => {
    let message = await weChat.mxlToObject(req.body.toString());
    console.log(message);
    let createTime = new Date().getTime();
    let result = '';
    if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
            result = `<xml>
                        <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                        <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                        <CreateTime>${createTime}</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[你好，欢迎关注]]></Content>
                    </xml>`;
        }
    } else {
        result = `<xml>
                    <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                    <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                    <CreateTime>${createTime}</CreateTime>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[你好，我是小爱同学，请问有什么可以帮助你的吗？]]></Content>
                </xml>`;
    }
    console.log(result);
    res.type('application/xml');
    res.status(200);
    return res.end(result);
})

module.exports = router;