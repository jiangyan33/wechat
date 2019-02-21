const request = require('./method');
const config = require('config');
const path = require('path');
const fs = require('fs');


class AccessToken {
    constructor(opt) {
        this.appID = opt.appID;
        this.appsecret = opt.appsecret;
    }

    async  getAccessToken() {
        let data = fs.readFileSync(path.join(__dirname, '../config/data.json'));
        if (this.isValidAccessToken(data)) {
            return data;
        }
        await this.updateAccessToken();
    }

    saveAccessToken(data) {
        fs.writeFileSync(path.join(__dirname, '../config/data.json'), JSON.stringify(data));
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
        this.saveAccessToken(data);
    }
}

module.exports = new AccessToken(config.app);