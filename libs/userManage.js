/**
 * 用户管理
 */

const { AccessToken } = require('./accessToken');

class UserManage extends AccessToken {
    constructor() {
        //初始化父类的this对象
        super();
        this.api = {
            batchFetchUserInfo: `${this.preix}user/info/batchget?`,
            batchFetchUserList: `${this.preix}user/get?`
        };
    }

    /**
     * 批量获取用户信息
     * @param {*} name 
     */
    async batchFetchUserInfo(user_list) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.batchFetchUserInfo}access_token=${access_token}`;
        let options = {
            method: 'POST',
            json: true,
            url,
            body: user_list
        };
        let response = await this.request(options);
        return response.body;
    }

    /**
    * 批量获取用户列表
    * @param {*} name 
    */
    async batchFetchUserList(next_openid) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.batchFetchUserList}access_token=${access_token}`;
        if (next_openid) {
            url += `&next_openid=${next_openid}`;
        }
        let options = {
            json: true,
            url
        };
        let response = await this.request(options);
        return response.body;
    }


}

module.exports = new UserManage();