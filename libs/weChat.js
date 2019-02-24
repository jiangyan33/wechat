const { parseXML, formatMessage } = require('./method');

class WeChat {

    async mxlToObject(xml) {
        console.log(xml);
        let result = {};
        result = (await parseXML(xml))['xml'];
        console.log(result);
        return formatMessage(result);
    }
}

module.exports = new WeChat();