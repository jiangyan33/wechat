const { request } = require('./method');
const config = require('config');
const path = require('path');
const fs = require('fs');

// const api = {
//     accessToken: `${preix}token?`,
//     temporary: {
//         upload: `${preix}media/upload?`,
//         fetch: `${preix}media/get?`,
//     },
//     permanent: {
//         upload: `${preix}material/add_material?`,
//         uploadNews: `${preix}material/add_news?`,
//         uploadNewsPic: `${preix}material/uploadimg?`,
//         fetch: `${preix}material/get_material?`,
//         del: `${preix}material/del_material?`,
//         updateNews: `${preix}material/update_news?`,
//         count: `${preix}material/get_materialcount?`,
//         batch: `${preix}material/batchget_material?`
//     }
// }

class AccessToken {
    constructor() {
        this.appID = config.app.appID;
        this.appsecret = config.app.appsecret;
        this.preix = config.app.preix;
        this.api = `${this.preix}token?`;
        this.request = request;
    }

    async  getAccessToken() {
        let data = fs.readFileSync(path.join(__dirname, '../config/data.json')).toString();
        if (this.isValidAccessToken(data ? JSON.parse(data) : '')) {
            console.log('token有效，使用本地token');
            return JSON.parse(data).access_token;
        }
        return await this.updateAccessToken();
    }

    isValidAccessToken(data) {
        if (!data || !data.access_token) {
            return false;
        }
        let now = new Date().getTime();
        if (data.expires_in > now) {
            return true;
        }
        return false;
    }

    async  updateAccessToken() {
        let url = `${this.api}grant_type=client_credential&appid=${this.appID}&secret=${this.appsecret}`;
        let response = await this.request({ url, json: true });
        console.log('token无效，发送请求重新获取token');
        let data = response.body;
        let now = new Date().getTime();
        data.expires_in = (data.expires_in - 20) * 1000 + now;
        fs.writeFileSync(path.join(__dirname, '../config/data.json'), JSON.stringify(data));
        return data['access_token'];
    }
}

module.exports = {
    accessToken: new AccessToken(config.app),
    AccessToken: AccessToken
}
