const router = require('express').Router();
const config = require('config');
const sha1 = require('sha1');
const weChat = require('../libs/weChat');
const { tmp } = require('../libs/method');
const path = require('path');
const accessToken = require('../libs/accessToken');

router.get('/', (req, res) => {
    let { signature, timestamp, nonce, echostr } = req.query;
    let sortStr = [timestamp, nonce, config.app.token].sort().join('');
    console.log('--------校验签名');
    sha1(sortStr) === signature ? res.send(echostr) : res.send('wrong');
});

router.post('/', async (req, res) => {
    let message = await weChat.mxlToObject(req.body.toString());
    console.log(message);
    let response = undefined;
    let content = undefined;
    if (message.MsgType === 'event') {
        switch (message.Event) {
            case 'subscribe':
                console.log(`扫描二维码进来:${message.EventKey} ${message.Ticket}`);
                content = '哈哈，很高兴认识你，希望你每天开心快乐!';
                break;
            case 'unsubscribe':
                console.log('无情取关!');
                return;
            case 'LOCATION':
                if (message.EventKey) {
                    console.log(`扫描二维码进来:${message.EventKey} ${message.Ticket}`);
                }
                content = '哈哈，很高兴认识你，希望你每天开心快乐!';
                break;
            case 'CLICK':
                content = `您点击了菜单:${message.EventKey}`;
                break;
            case 'SCAN':
                console.log(`您关注后扫描了二维码:${message.EventKey} ${message.Ticket}`);
                content = '看到您扫了一下哦';
                break;
            case 'VIEW':
                content = `您点击了菜单中的链接：${message.EventKey}`;
                break;
            default:
                break;
        }
    } else if (message.MsgType === 'text') {
        let _content = message.Content;
        switch (_content) {
            case '1': content = '天下第一吃大米';
                break;
            case '2': content = '天下第二吃豆腐';
                break;
            case '3': content = '天下第三吃仙丹';
                break;
            case '4': content = [{
                title: "技术改变世界",
                description: "只是个描述而已",
                picUrl: "https://avatars1.githubusercontent.com/u/26317926?v=4&s=120",
                url: "https://github.com/"
            },
            {
                title: "NodeJs开发微信公众号",
                description: "非常简单",
                picUrl: "https://avatars3.githubusercontent.com/u/35300813?v=4&s=120",
                url: "https://cnodejs.org/"
            }];
                break;
            case '5':
                response = await accessToken.uploadTemp('image', path.join(__dirname, '../public/image/3.jpg'));
                content = {
                    type: 'image',
                    mediaId: response.media_id
                };
                break;
            case '6':
                response = await accessToken.uploadTemp('video', path.join(__dirname, '../public/video/1.mp4'));
                content = {
                    type: 'video',
                    title: '导读',
                    description: '第一章，nodejs开发微信公众号介绍',
                    mediaId: response.media_id
                };
                break;
            default:
                content = `额，你说的【${message.Content}】太复杂了!`
                break;
        }
    } else {
        content = '你好，我是小爱同学，请问有什么可以帮助你的吗？';
    }
    let result = tmp(content, message);
    res.type('application/xml');
    res.status(200);
    return res.send(result);
})

module.exports = router;