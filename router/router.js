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
                response = await accessToken.uploadMaterials('image', path.join(__dirname, '../public/image/3.jpg'));
                content = {
                    type: 'image',
                    mediaId: response.media_id
                };
                break;
            case '6':
                response = await accessToken.uploadMaterials('video', path.join(__dirname, '../public/video/1.mp4'));
                content = {
                    type: 'video',
                    title: '导读',
                    description: '第一章，nodejs开发微信公众号介绍',
                    mediaId: response.media_id
                };
                break;
            case '7':
                //上传图片作为音乐封面信息
                response = await accessToken.uploadMaterials('image', path.join(__dirname, '../public/image/4.jpg'));
                content = {
                    type: 'music',
                    title: '传奇--王菲',
                    description: `只是因为在人群中多看了你一眼
                                  再也没能忘掉你容颜`,
                    musicUrl: 'http://fs.w.kugou.com/201902281131/7d33fe2254776f082d56bbe3645cdb39/G003/M07/06/15/o4YBAFT598uAASz9AEhIQDR59S8377.mp3',
                    thumbMediaId: response.media_id
                };
                break;
            case '8':
                //上传永久图片，回复用户图片消息
                response = await accessToken.uploadMaterials('image', path.join(__dirname, '../public/image/5.jpg'), {});
                content = {
                    type: 'image',
                    mediaId: response.media_id
                };
                break;
            //上传永久视频素材，回复用户视频消息
            case '9':
                response = await accessToken.uploadMaterials('video', path.join(__dirname, '../public/video/1.mp4'), {
                    description: `{"title":"导读","introduction":"第一章，nodejs开发微信公众号介绍"}`
                });
                content = {
                    type: 'video',
                    title: '导读',
                    description: '第一章，nodejs开发微信公众号介绍',
                    mediaId: response.media_id
                };
                break;
            //上传图文素材，然后返回
            case '10':
                //先上传永久图片
                temp = await accessToken.uploadMaterials('image', path.join(__dirname, '../public/image/5.jpg'), {});
                content = {
                    "articles": [{
                        "title": '图文消息标题',
                        "thumb_media_id": temp.media_id,
                        "author": 'jiangyan',
                        "digest": '测试摘要信息',
                        "show_cover_pic": 1,
                        "content": '测试内容信息',
                        "content_source_url": 'www.baidu.com',
                        "need_open_comment": 1,
                        "only_fans_can_comment": 1
                    }
                        //若新增的是多图文素材，则此处应还有几段articles结构
                    ]
                };
                //上传永久图文素材
                response = await accessToken.uploadMaterials('news', content, {});
                //根据返回的素材id获取图文素材内容
                response = await accessToken.fetchMaterials(response.media_id, 'news', {});
                //设置回复内容
                content = [];
                response.news_item.forEach(it => {
                    content.push({
                        title: it.title,
                        description: it.description,
                        picUrl: temp.url,
                        url: it.url
                    })
                });
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