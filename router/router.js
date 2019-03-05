const router = require('express').Router();
const config = require('config');
const sha1 = require('sha1');
const weChat = require('../libs/weChat');
const { tmp } = require('../libs/method');
const path = require('path');
const temporary = require('../libs/temporary');
const permanent = require('../libs/permanent');

// const accessToken = require('../libs/accessToken');

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
    let content = 'aaa';
    let temp = undefined;
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
                //测试上传临时素材
                response = await temporary.uploadMaterials('thumb', path.join(__dirname, '../public/thumb/yifu.jpg'));
                // content = {
                //     type: 'image',
                //     mediaId: response.media_id
                //     // mediaId: "2O3D8apoZXiJYH3A9hnvzPlWLm4oY2UNn_PUjTu8NyeEO6x1-TlbRbzNqiiY-8K-"
                // };
                console.log(JSON.stringify(response));
                // response = await temporary.fetchMaterials(content.mediaId);
                // response = await temporary.fetchMaterials('aznAo72yCr0NgHTeRb11bVN3Qqjyr6WjCoyugRX8Jxn9L4a7NIf7-xS4oTG6BquE');
                // console.log(JSON.stringify(response));
                break;
            case '6':
                //  测试上传永久素材
                // response = await permanent.uploadMaterials('image', path.join(__dirname, '../public/image/3.jpg'));
                // fKAtaphUUoGswdfJ8xVXDtCOfxiKoIRzoErsIzYSM4o

                // response = await permanent.uploadMaterials('voice', path.join(__dirname, '../public/voice/zifubao.mp3'));
                //fKAtaphUUoGswdfJ8xVXDuB1BJV9yE_QbuKxd6Q_C5M   仅有media_id

                // response = await permanent.uploadMaterials('thumb', path.join(__dirname, '../public/thumb/yifu.jpg'));
                // fKAtaphUUoGswdfJ8xVXDmah20GY-W6c6jSWQRsny_I

                // response = await permanent.uploadMaterials('video', path.join(__dirname, '../public/video/1.mp4'), {
                //     description: `{"title":"导读","introduction":"第一章，nodejs开发微信公众号介绍"}`
                // });
                //只有一个media_id
                // fKAtaphUUoGswdfJ8xVXDvs_UcHomLPq89VhUGWDzH0   fKAtaphUUoGswdfJ8xVXDi44neS_wtxbp4ecEU2vkDk  fKAtaphUUoGswdfJ8xVXDtMnxpAihPmLhaZTT2FNFNg
                temp = {
                    "articles": [{
                        "title": '图文消息标题',
                        "thumb_media_id": "fKAtaphUUoGswdfJ8xVXDtCOfxiKoIRzoErsIzYSM4o",
                        "author": 'jiangyan',
                        "digest": '测试摘要信息',
                        "show_cover_pic": 1,
                        "content": '测试内容信息',
                        "content_source_url": 'www.baidu.com'
                    }
                        //若新增的是多图文素材，则此处应还有几段articles结构
                    ]
                };
                response = await permanent.uploadMaterials('news', temp);
                // fKAtaphUUoGswdfJ8xVXDrRmyqnSzBXyAoIEdK7xVY0  仅有一个media_id

                // response = await permanent.uploadMaterials('pic', path.join(__dirname, '../public/image/3.jpg'));
                //    url http://mmbiz.qpic.cn/mmbiz_jpg/xxCqtUibFmxDlaLbNiafvvxxmibjLMKR3fErQn4ae9uelkTsXdZBd6icRqpxs8XwYaxd35JvUKnSHJaI2BiaE3vc9Ug/0
                console.log(JSON.stringify(response));
                break;
            case '7':
                //测试获取永久素材
                response = await permanent.fetchMaterials('fKAtaphUUoGswdfJ8xVXDj14t2aRrA9dz4ogE-IdHBs');
                console.log(JSON.stringify(response));

                // response = await permanent.fetchMaterials('fKAtaphUUoGswdfJ8xVXDvs_UcHomLPq89VhUGWDzH0');
                // console.log(JSON.stringify(response));

                // response = await permanent.fetchMaterials('fKAtaphUUoGswdfJ8xVXDuB1BJV9yE_QbuKxd6Q_C5M');
                // console.log(JSON.stringify(response));
                break;
            case '8':
                //删除永久素材
                response = await permanent.del('fKAtaphUUoGswdfJ8xVXDmah20GY-W6c6jSWQRsny_I');
                console.log(JSON.stringify(response));
                break;
            //获取永久素材总数
            case '9':
                response = await permanent.count();
                console.log(JSON.stringify(response));
                break;
            case '10':
                //获取素材列表
                //先上传永久图片
                response = await permanent.batch('video', 0, 10);
                console.log(JSON.stringify(response));
                break;
            case '11':
                //修改图文素材
                temp = {
                    "title": '图文消息标题1',
                    "thumb_media_id": "fKAtaphUUoGswdfJ8xVXDtCOfxiKoIRzoErsIzYSM4o",
                    "author": 'jiangyan',
                    "digest": '测试摘要信息',
                    "show_cover_pic": 1,
                    "content": '测试内容信息1',
                    "content_source_url": 'www.baidu.com'
                }
                //若新增的是多图文素材，则此处应还有几段articles结构
                response = await permanent.updateNewsMaterials('fKAtaphUUoGswdfJ8xVXDj14t2aRrA9dz4ogE-IdHBs', 0, temp);
                console.log(JSON.stringify(response));
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