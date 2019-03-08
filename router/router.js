const router = require('express').Router();
const config = require('config');
const sha1 = require('sha1');
const weChat = require('../libs/weChat');
const { tmp } = require('../libs/method');
// const path = require('path');
// const temporary = require('../libs/temporary');
// const permanent = require('../libs/permanent');
// const tag = require('../libs/tag');
// const userManage = require('../libs/userManage');
// const messageManage = require('../libs/message');
// const menu = require('../libs/menu');
// const menuConfig = require('../config/menu');



// const accessToken = require('../libs/accessToken');

router.get('/', (req, res) => {
    let { signature, timestamp, nonce, echostr } = req.query;
    let sortStr = [timestamp, nonce, config.app.token].sort().join('');
    sha1(sortStr) === signature ? res.send(echostr) : res.send('wrong');
});

router.post('/', async (req, res) => {
    let message = await weChat.mxlToObject(req.body.toString());
    console.log(message);
    // let response = undefined;
    // let content = 'aaa';
    // let temp = undefined;
    if (message.MsgType === 'event') {
        switch (message.Event) {
            case 'subscribe':
                console.log(`扫描二维码关注该公众号:${message.EventKey} ${message.Ticket}`);
                content = '哈哈，很高兴认识你，希望你每天开心快乐!';
                break;
            case 'unsubscribe':
                console.log('无情取关!');
                return;
            case 'LOCATION':
                content = `您上报的位置是:${message.Latitude}/${message.Longitude}-${message.EventKey}`;
                break;
            // case 'CLICK':
            //     content = `您点击了菜单:${message.EventKey}`;
            //     break;
            // case 'SCAN':
            //     console.log(`您关注后扫描了二维码:${message.EventKey} ${message.Ticket}`);
            //     content = '看到您扫了一下哦';
            //     break;
            // case 'scancode_push':
            //     console.log(`您关注后扫描了二维码:${message.EventKey} ${message.Ticket}`);
            //     content = '看到您扫了一下哦';
            //     break;
            // case 'scancode_waitmsg':
            //     console.log(`您关注后扫描了二维码:${message.EventKey} ${message.Ticket}`);
            //     content = '看到您扫了一下哦';
            //     break;
            // case 'pic_sysphoto':
            //     console.log(`您关注后扫描了二维码:${message.EventKey} ${message.Ticket}`);
            //     content = '看到您扫了一下哦';
            //     break;
            // case 'pic_photo_or_album':
            //     console.log(`您关注后扫描了二维码:${message.EventKey} ${message.Ticket}`);
            //     content = '看到您扫了一下哦';
            //     break;
            // case 'location_select':
            //     console.log(`您关注后扫描了二维码:${message.EventKey} ${message.Ticket}`);
            //     content = '看到您扫了一下哦';
            //     break;
            // case 'pic_weixin':
            //     console.log(`您关注后扫描了二维码:${message.EventKey} ${message.Ticket}`);
            //     content = '看到您扫了一下哦';
            //     break;
            // case 'VIEW':
            //     content = `您点击了菜单中的链接：${message.EventKey}`;
            //     break;
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
            // case '4': content = [{
            //     title: "技术改变世界",
            //     description: "只是个描述而已",
            //     picUrl: "https://avatars1.githubusercontent.com/u/26317926?v=4&s=120",
            //     url: "https://github.com/"
            // },
            // {
            //     title: "NodeJs开发微信公众号",
            //     description: "非常简单",
            //     picUrl: "https://avatars3.githubusercontent.com/u/35300813?v=4&s=120",
            //     url: "https://cnodejs.org/"
            // }];
            //     break;
            // case '5':
            //     //测试上传临时素材
            //     response = await temporary.uploadMaterials('thumb', path.join(__dirname, '../public/thumb/yifu.jpg'));
            //     // content = {
            //     //     type: 'image',
            //     //     mediaId: response.media_id
            //     //     // mediaId: "2O3D8apoZXiJYH3A9hnvzPlWLm4oY2UNn_PUjTu8NyeEO6x1-TlbRbzNqiiY-8K-"
            //     // };
            //     // console.log(JSON.stringify(response));
            //     // response = await temporary.fetchMaterials(content.mediaId);
            //     // response = await temporary.fetchMaterials('aznAo72yCr0NgHTeRb11bVN3Qqjyr6WjCoyugRX8Jxn9L4a7NIf7-xS4oTG6BquE');
            //     console.log(JSON.stringify(response));
            //     break;
            // case '6':
            //     //  测试上传永久素材
            //     // response = await permanent.uploadMaterials('image', path.join(__dirname, '../public/image/3.jpg'));
            //     // fKAtaphUUoGswdfJ8xVXDtCOfxiKoIRzoErsIzYSM4o

            //     // response = await permanent.uploadMaterials('voice', path.join(__dirname, '../public/voice/zifubao.mp3'));
            //     //fKAtaphUUoGswdfJ8xVXDuB1BJV9yE_QbuKxd6Q_C5M   仅有media_id

            //     // response = await permanent.uploadMaterials('thumb', path.join(__dirname, '../public/thumb/yifu.jpg'));
            //     // fKAtaphUUoGswdfJ8xVXDmah20GY-W6c6jSWQRsny_I

            //     // response = await permanent.uploadMaterials('video', path.join(__dirname, '../public/video/1.mp4'), {
            //     //     description: `{"title":"导读","introduction":"第一章，nodejs开发微信公众号介绍"}`
            //     // });
            //     //只有一个media_id
            //     // fKAtaphUUoGswdfJ8xVXDvs_UcHomLPq89VhUGWDzH0   fKAtaphUUoGswdfJ8xVXDi44neS_wtxbp4ecEU2vkDk  fKAtaphUUoGswdfJ8xVXDtMnxpAihPmLhaZTT2FNFNg
            //     temp = {
            //         "articles": [{
            //             "title": '图文消息标题',
            //             "thumb_media_id": "fKAtaphUUoGswdfJ8xVXDtCOfxiKoIRzoErsIzYSM4o",
            //             "author": 'jiangyan',
            //             "digest": '测试摘要信息',
            //             "show_cover_pic": 1,
            //             "content": '测试内容信息',
            //             "content_source_url": 'www.baidu.com'
            //         }
            //             //若新增的是多图文素材，则此处应还有几段articles结构
            //         ]
            //     };
            //     response = await permanent.uploadMaterials('news', temp);
            //     // fKAtaphUUoGswdfJ8xVXDrRmyqnSzBXyAoIEdK7xVY0  仅有一个media_id

            //     // response = await permanent.uploadMaterials('pic', path.join(__dirname, '../public/image/3.jpg'));
            //     //    url http://mmbiz.qpic.cn/mmbiz_jpg/xxCqtUibFmxDlaLbNiafvvxxmibjLMKR3fErQn4ae9uelkTsXdZBd6icRqpxs8XwYaxd35JvUKnSHJaI2BiaE3vc9Ug/0
            //     console.log(JSON.stringify(response));
            //     break;
            // case '7':
            //     //测试获取永久素材
            //     response = await permanent.fetchMaterials('fKAtaphUUoGswdfJ8xVXDj14t2aRrA9dz4ogE-IdHBs');
            //     console.log(JSON.stringify(response));

            //     // response = await permanent.fetchMaterials('fKAtaphUUoGswdfJ8xVXDvs_UcHomLPq89VhUGWDzH0');
            //     // console.log(JSON.stringify(response));

            //     // response = await permanent.fetchMaterials('fKAtaphUUoGswdfJ8xVXDuB1BJV9yE_QbuKxd6Q_C5M');
            //     // console.log(JSON.stringify(response));
            //     break;
            // case '8':
            //     //删除永久素材
            //     response = await permanent.del('fKAtaphUUoGswdfJ8xVXDmah20GY-W6c6jSWQRsny_I');
            //     console.log(JSON.stringify(response));
            //     break;
            // //获取永久素材总数
            // case '9':
            //     response = await permanent.count();
            //     console.log(JSON.stringify(response));
            //     break;
            // case '10':
            //     //获取素材列表
            //     //先上传永久图片
            //     response = await permanent.batch('image', 0, 10);
            //     console.log(JSON.stringify(response));
            //     break;
            // case '11':
            //     //修改图文素材
            //     temp = {
            //         "title": '图文消息标题1',
            //         "thumb_media_id": "fKAtaphUUoGswdfJ8xVXDtCOfxiKoIRzoErsIzYSM4o",
            //         "author": 'jiangyan',
            //         "digest": '测试摘要信息',
            //         "show_cover_pic": 1,
            //         "content": '测试内容信息1',
            //         "content_source_url": 'www.baidu.com'
            //     }
            //     //若新增的是多图文素材，则此处应还有几段articles结构
            //     response = await permanent.updateNewsMaterials('fKAtaphUUoGswdfJ8xVXDj14t2aRrA9dz4ogE-IdHBs', 0, temp);
            //     console.log(JSON.stringify(response));
            //     break;
            // case '12':
            //     //测试标签
            //     // response = await tag.get();
            //     // console.log(JSON.stringify(response));
            //     //{"tags":[{"id":2,"name":"星标组","count":0}]}

            //     // response = await tag.getUserTags('osck56IGPNFlSEGUkXhRDy1v1plM');
            //     // console.log(JSON.stringify(response));
            //     //{"tagid_list":[]}

            //     //创建标签


            //     // response = await tag.create('北京');
            //     // console.log(JSON.stringify(response));
            //     // {"tag":{"id":100,"name":"北京"}}

            //     //  修改标签
            //     // response = await tag.update(100, '中国');
            //     // console.log(JSON.stringify(response));

            //     //删除标签
            //     // response = await tag.del(100);
            //     // console.log(JSON.stringify(response));

            //     //为用户添加标签
            //     response = await tag.userTags(['osck56IGPNFlSEGUkXhRDy1v1plM'], 2);
            //     console.log(JSON.stringify(response));

            //     //测试标签
            //     response = await tag.get();
            //     console.log(JSON.stringify(response));

            //     break;
            // case '13':
            //     // response = await userManage.batchFetchUserList();
            //     // console.log(JSON.stringify(response));
            //     temp = {
            //         user_list:
            //             [{
            //                 openid: 'osck56IGPNFlSEGUkXhRDy1v1plM',
            //                 lang: "zh_CN"
            //             }]
            //     }
            //     response = await userManage.batchFetchUserInfo(temp);
            //     console.log(JSON.stringify(response));
            //     break;
            // case '14':
                //  测试上传永久素材
                // response = await permanent.uploadMaterials('thumb', path.join(__dirname, '../public/thumb/yifu.jpg'));
                //fKAtaphUUoGswdfJ8xVXDnwfrVuYzDIfQqNdRgBlNdY
                // temp = {
                //     "articles": [{
                //         "thumb_media_id": "aAPbQ0m27Vf_7BKEx9ixtQujTGlDUcWr54sKWbeotOz3Fd1fqf_S1HKpahrIjJNG",
                //         "author": 'jiangyan',
                //         "title": 'js中bind方法的使用',
                //         "content_source_url": 'http://62.234.108.185:3000/',
                //         "content": `<h2 id="h2-u6982u8FF0"><a name="概述" class="reference-link"></a><span class="header-link octicon octicon-link"></span>概述</h2><blockquote>
                //         <p>javascript语言中有String,Number,Date,Regex,Array,Object,Symbol,<strong>Function</strong>，本文说到的bind方法就是针对function而说的。<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind">bind方法详解</a></p>
                //         </blockquote>
                //         <p>bind既然是方法，就少不了它的调用者，方法的参数，返回值。关于bind方法的实现这里不做学习，因为我没有了解到。首先bind方法只能被方法调用，方法的参数为this,args(一个可变参数)。返回值是bind方法的调用者的一个copy，还是一个方法，多的东西是this参数指定方法执行的作用域和agrs参数提供的默认参数。下面说一下bind的基本用法和使用场景</p>
                //         <ol>
                //         <li><p>基本使用</p>
                //         <pre><code class="lang-javascript">// 初始化一个对象，包含一个字符串和一个方法
                //          let person = {
                //              name: '小明',
                //              getName: function () {
                //                  return this.name;
                //              }
                //          };
                //          console.log(person.getName());//小明

                //          //将person中的getName方法赋值给一个变量,此时执行getName方法时，默认的作用域为变量getName所在的作用域
                //          let getName = person.getName;
                //          console.log(getName());//undefined

                //          //使用bind方法，返回一个新的getName方法，传递的第一参数为person，将person中的作用域当作新方法执行的作用域
                //          let getNameBind = person.getName.bind(person);
                //          console.log(getNameBind()); //小明
                //         </code></pre>
                //         </li><li>偏函数<pre><code class="lang-javascript">//给一个方法绑定默认参数
                //          let add = function () {
                //              let arr = [...arguments];
                //              console.log(arr);//[ 10, 1, 100, 1000 ]
                //              let temp = 0;
                //              for (let it of arr) {
                //                  temp += it;
                //              }
                //              return temp;
                //          };
                //          //给add方法绑定一个默认参数,方法被调用时，该参数默认在第一位
                //          let addBind = add.bind(this, 10);
                //          //调用addBind方法
                //          let result = addBind(1, 100, 1000);
                //          console.log(result);//1111
                //         </code></pre>
                //         </li><li>在setTimeout方法中使用<pre><code class="lang-javascript"> /**
                //           * setTimeout方法类似一个异步方法，简单说下nodejs中的回调函数，方法由上至下执行，遇到有回调函数的地方，不等待，继续往下，同时将回调函数
                //           *挂载到事件队列中，最后执行，此时回调函数中的上下文为global,使用bind方法可以绑定方法执行的上下文,也就是this对象 
                //          * */
                //          let Flower = function () {
                //              //在flower对象中定义一个time变量，值为一个随机数
                //              this.time = (Math.random() + 1) * 10;
                //          };
                //          //在Flower的原型链上添加一个方法run,其中有一个setTimeout方法
                //          Flower.prototype.run = function () {
                //              //创建一个Flower的实例，调用flowering方法的bind方法，因为run方法为Flower原型链上的方法，this为该对象的实例
                //              setTimeout(this.flowering.bind(this), 1000);//2 flower is bind,time is 16.19463530267282
                //              setTimeout(this.flowering, 1000);//3 flower is bind,time is undefined
                //              console.log('----------------');//1 ----------------
                //          }
                //          //在Flower的原型链上添加一个方法flowering，返回的字符串中包含this对象中的属性
                //          Flower.prototype.flowering = function () {
                //              console.log(flower is bind,time is this.time);
                //          }
                //          //执行
                //          new Flower().run();
                //         </code></pre>
                //         <h2 id="h2-u7ED3u8BED"><a name="结语" class="reference-link"></a><span class="header-link octicon octicon-link"></span>结语</h2>这里只是说下javaScript中bind方法的简单用法，虽然在平常的开发过程中也行用到的场景比较少，但是在一个封装的公共方法或者是一些开源类库中经常被使用。</li></ol>
                //         `,
                //         "digest": '暂时没有摘要信息',
                //         "show_cover_pic": 1,
                //     }
                //         //若新增的是多图文素材，则此处应还有几段articles结构
                //     ]
                // };
                //6_lVDZvy4-qHtTlsHaTYg_cgm-MyqSvMyG-TmhBvySxo5hQTbQ99qxsw8-DCCa2O
                // response = await messageManage.uploadnews(temp);
            //     console.log(JSON.stringify(response));
            // case '15':
            //     //6_lVDZvy4-qHtTlsHaTYg_cgm-MyqSvMyG-TmhBvySxo5hQTbQ99qxsw8-DCCa2O
            //     //tEN6qEKn2cwBIhkD31S2Hw2fiCb-B6zCQ_pO2OVOMrgr5jDMtvE12a-OLuwyi0kp
            //     temp = {
            //         "touser": "osck56IGPNFlSEGUkXhRDy1v1plM",
            //         "mpnews": {
            //             "media_id": "6_lVDZvy4-qHtTlsHaTYg_cgm-MyqSvMyG-TmhBvySxo5hQTbQ99qxsw8-DCCa2O"
            //         },
            //         "msgtype": "mpnews"
            //     }
            //     response = await messageManage.preview(temp);
            //     console.log(JSON.stringify(response));
            // case '16':
            //     //6_lVDZvy4-qHtTlsHaTYg_cgm-MyqSvMyG-TmhBvySxo5hQTbQ99qxsw8-DCCa2O
            //     //tEN6qEKn2cwBIhkD31S2Hw2fiCb-B6zCQ_pO2OVOMrgr5jDMtvE12a-OLuwyi0kp
            //     temp = {
            //         "filter": {
            //             "is_to_all": false,
            //             "tag_id": 2
            //         },
            //         "mpnews": {
            //             "media_id": "6_lVDZvy4-qHtTlsHaTYg_cgm-MyqSvMyG-TmhBvySxo5hQTbQ99qxsw8-DCCa2O"
            //         },
            //         "msgtype": "mpnews",
            //         "send_ignore_reprint": 0
            //     };
            //     response = await messageManage.batchSendByTag(temp);
            //     console.log(JSON.stringify(response));
            // case '17':
                //创建菜单
                //6_lVDZvy4-qHtTlsHaTYg_cgm-MyqSvMyG-TmhBvySxo5hQTbQ99qxsw8-DCCa2O
                //tEN6qEKn2cwBIhkD31S2Hw2fiCb-B6zCQ_pO2OVOMrgr5jDMtvE12a-OLuwyi0kp
                // temp = {
                //     "filter": {
                //         "is_to_all": false,
                //         "tag_id": 2
                //     },
                //     "mpnews": {
                //         "media_id": "6_lVDZvy4-qHtTlsHaTYg_cgm-MyqSvMyG-TmhBvySxo5hQTbQ99qxsw8-DCCa2O"
                //     },
                //     "msgtype": "mpnews",
                //     "send_ignore_reprint": 0
                // };
                // response = await menu.create(menuConfig);
                // response = await menu.del();
                // console.log(JSON.stringify(response));
                // response = await menu.get();
                // console.log(JSON.stringify(response));
                // console.log(menuConfig);
            default:
                content = `额，你说的【${message.Content}】太复杂了!`;
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