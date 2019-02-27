const { request } = require('./method');
const config = require('config');
const path = require('path');
const fs = require('fs');


class AccessToken {
    constructor(opt) {
        this.appID = opt.appID;
        this.appsecret = opt.appsecret;
    }

    async  getAccessToken() {
        let data = fs.readFileSync(path.join(__dirname, '../config/data.json')).toString();
        if (this.isValidAccessToken(JSON.parse(data))) {
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
        let url = `${config.app.preix}token?grant_type=client_credential&appid=${this.appID}&secret=${this.appsecret}`;
        let response = await request({ url, json: true });
        let data = response.body;
        let now = new Date().getTime();
        data.expires_in = (data.expires_in - 20) * 1000 + now;
        fs.writeFileSync(path.join(__dirname, '../config/data.json'), JSON.stringify(data));
        return data['access_token'];
    }

    //上传素材
    async  uploadTemp(type, filePath) {
        let access_token = await this.getAccessToken();
        let url = `${config.get('app').preix}media/upload?access_token=${access_token}&type=${type}`;
        let formData = {
            media: fs.createReadStream(filePath)
        };
        let response = await request({ method: 'POST', url, formData, json: true });
        return response.body;
    }
}

module.exports = new AccessToken(config.app);