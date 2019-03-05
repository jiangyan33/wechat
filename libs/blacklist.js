/**
 * 黑名单管理
 */

const { AccessToken } = require('./accessToken');

class UserManage extends AccessToken {
    constructor() {
        //初始化父类的this对象
        super();
        this.api = {
            fetch: `${this.preix}tags/members/getblacklist?`,
            ban: `${this.preix}tags/members/batchblacklist?`,
            cancel: `${this.preix}tags/members/batchunblacklist?`
        };
    }

    /**
     * 获取黑名单列表
     * @param {*} name 
     */
    async fetchList(begin_openid) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.fetch}access_token=${access_token}`;
        let options = {
            method: 'POST',
            json: true,
            url,
            body: {
                begin_openid
            }
        };
        let response = await this.request(options);
        return response.body;
    }

    /**
     * 拉黑/取消拉黑用户 type存在为取消拉黑
     * @param {*} openid_list 
     * @param {*} type 
     */
    async batchFetchUserList(openid_list, type) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.ban}access_token=${access_token}`;
        if (type) {
            url = `${this.api.cancel}access_token=${access_token}`;
        }
        //如果素材类型为video
        let options = {
            method: 'POST',
            json: true,
            url,
            body: openid_list
        };
        let response = await this.request(options);
        return response.body;
    }
}

module.exports = new UserManage();