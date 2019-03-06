/**
 * 消息管理
 */

const { AccessToken } = require('./accessToken');

class Message extends AccessToken {
    constructor() {
        //初始化父类的this对象
        super();
        this.api = {
            //上传图文消息素材
            uploadnews: `${this.preix}media/uploadnews?`,
            batchSendByTag: `${this.preix}message/mass/sendall?`,
            batchSendByOpenIdList: `${this.preix}message/mass/send?`,
            del: `${this.preix}message/mass/delete?`,
            preview: `${this.preix}message/mass/preview?`,
            check: `${this.preix}message/mass/get?`,
        };
    }

    /**
     * 上传图文消息素材
     * @param {*} articles 
     */
    async uploadnews(articles) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.uploadnews}access_token=${access_token}`;
        let options = {
            method: 'POST',
            json: true,
            url,
            body: articles
        };
        let response = await this.request(options);
        return response.body;
    }


    /**
     * 预览
     * @param {*} articles 
     */
    async preview(content) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.preview}access_token=${access_token}`;
        let options = {
            method: 'POST',
            json: true,
            url,
            body: content
        };
        let response = await this.request(options);
        return response.body;
    }

    /**
    * 根据标签进行推送
    * @param {*} articles 
    */
    async batchSendByTag(content) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.batchSendByTag}access_token=${access_token}`;
        let options = {
            method: 'POST',
            json: true,
            url,
            body: content
        };
        let response = await this.request(options);
        return response.body;
    }
}

module.exports = new Message();
