/**
 * 菜单管理
 */
const { AccessToken } = require('./accessToken');

class Menu extends AccessToken {
    constructor() {
        //初始化父类的this对象
        super();
        this.api = {
            create: `${this.preix}menu/create?`,
            get: `${this.preix}menu/get?`,
            del: `${this.preix}menu/delete?`,
        };
    }

    /**
     * 创建菜单
     * @param {*}  menu
     */
    async create(menu) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.create}access_token=${access_token}`;
        let options = {
            method: 'POST',
            json: true,
            url,
            body: menu
        };
        let response = await this.request(options);
        return response.body;
    }

    /**
    * 获取菜单
    * @param {*} name 
    */
    async get() {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.get}access_token=${access_token}`;
        let options = {
            json: true,
            url
        };
        let response = await this.request(options);
        return response.body;
    }

    /**
        * 删除菜单
        * @param {*} name 
        */
    async del() {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.del}access_token=${access_token}`;
        let options = {
            json: true,
            url
        };
        let response = await this.request(options);
        return response.body;
    }

}

module.exports = new Menu();