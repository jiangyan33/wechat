/**
 * 用户标签管理
 */

const { AccessToken } = require('./accessToken');

class Tag extends AccessToken {
    constructor() {
        //初始化父类的this对象
        super();
        this.api = {
            create: `${this.preix}tags/create?`,
            fetch: `${this.preix}tags/get?`,
            update: `${this.preix}tags/update?`,
            del: `${this.preix}tags/delete?`,
            fetchUser: `${this.preix}user/tag/get?`,
            batchAddUser: `${this.preix}tags/members/batchtagging?`,
            batchCancelUser: `${this.preix}tags/members/batchuntagging?`,
            getUserTag: `${this.preix}tags/getidlist?`,
        };
    }

    /**
     * 创建标签
     * @param {*} name 
     */
    async create(name) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.create}access_token=${access_token}`;
        let options = {
            method: 'POST',
            json: true,
            url,
            body: {
                "tag": { name }
            }
        };
        let response = await this.request(options);
        return response.body;
    }

    /**
     * 获取已经创建的标签
     */
    async get() {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.fetch}access_token=${access_token}`;
        let options = {
            json: true,
            url
        };
        let response = await this.request(options);
        return response.body;
    }

    /**
     * 编辑标签
     * @param {*} id 
     * @param {*} name 
     */
    async update(id, name) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.update}access_token=${access_token}`;
        let options = {
            method: 'POST',
            json: true,
            url,
            body: {
                "tag": { id, name }
            }
        };
        let response = await this.request(options);
        return response.body;
    }

    /**
     * 删除已经创建的标签
     * @param {*} id 
     */
    async del(id) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.del}access_token=${access_token}`;
        let options = {
            method: 'POST',
            json: true,
            url,
            body: {
                "tag": { id }
            }
        };
        let response = await this.request(options);
        return response.body;
    }

    /**
     * 获取标签下的用户列表
     * @param {*} tagid 
     * @param {*} next_openid 
     */
    async  getUser(tagid, next_openid) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.fetchUser}access_token=${access_token}`;
        let options = {
            method: 'POST',
            json: true,
            url,
            body: { tagid, next_openid }
        };
        let response = await this.request(options);
        return response.body;
    }

    /**
     * 批量为用户打/取消标签
     * type存在时为取消标签
     * @param {*} openid_list 
     * @param {*} tagid 
     * @param {*} type  
     */
    async  userTags(openid_list, tagid, type) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.batchAddUser}access_token=${access_token}`;
        if (type || type === 0) {
            url = `${this.api.batchCancelUser}access_token=${access_token}`;
        }
        let options = {
            method: 'POST',
            json: true,
            url,
            body: { tagid, openid_list }
        };
        let response = await this.request(options);
        return response.body;
    }

    /**
     * 获取用户身上的标签
     * @param {*} openid 
     */
    async  getUserTags(openid) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.getUserTag}access_token=${access_token}`;
        let options = {
            method: 'POST',
            json: true,
            url,
            body: { openid }
        };
        let response = await this.request(options);
        return response.body;
    }
}

module.exports = new Tag();