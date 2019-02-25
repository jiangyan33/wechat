const Promise = require('bluebird');
const request = require('request');
const parseString = require('xml2js').parseString;
const { compiled } = require('./tmp');

function formatMessage(result) {
    let message = {};
    //先判断result是否为对象
    if (typeof result === 'object') {
        let keys = Object.keys(result);
        //遍历result
        for (let key of keys) {
            let item = result[key]
            //如果该元素不是数组，可能为字符串
            if (!item instanceof Array) {
                message[key] = item;
            }
            //  如果数组长度为0
            if (item.length === 0) {
                continue;
            }
            //如果数组长度为1，大部分都是这种情况
            if (item.length === 1) {
                let val = item[0];
                //判断数组元素是否为对象，
                if (typeof val === 'object') {
                    message[key] = formatMessage(val);
                } else {
                    //字符串
                    message[key] = (val || '').trim();
                }
            } else {
                //该元素不为数组，长度不为0，1
                message[key] = [];
                for (let it of item) {
                    message[key].push(formatMessage(it));
                }
            }

        }
    }
    return message;
}
function tmp(content, message) {
    let info = {};
    let type = 'text';
    if (conent instanceof Array) {
        types = 'news';
    }
    type = content.type || type;
    info.conent = content;
    info.createTime = new Date().getTime();
    info.msgType = type;
    info.toUserName = message.fromUserName;
    info.fromUserName = message.toUserName;
    return compiled(info);
}
module.exports = {
    request: Promise.promisify(request),
    parseXML: Promise.promisify(parseString),
    formatMessage,
    tmp
}
