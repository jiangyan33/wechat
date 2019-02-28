const { request } = require('./method');
const config = require('config');
const path = require('path');
const fs = require('fs');
const preix = config.get('app').preix;
const api = {
    accessToken: `${preix}token?`,
    temporary: {
        upload: `${preix}media/upload?`
    },
    permanent: {
        upload: `${preix}material/add_material?`,
        uploadNews: `${preix}material/add_news?`,
        uploadNewsPic: `${preix}material/uploadimg?`
    }
}

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
        let url = `${api.accessToken}grant_type=client_credential&appid=${this.appID}&secret=${this.appsecret}`;
        let response = await request({ url, json: true });
        let data = response.body;
        let now = new Date().getTime();
        data.expires_in = (data.expires_in - 20) * 1000 + now;
        fs.writeFileSync(path.join(__dirname, '../config/data.json'), JSON.stringify(data));
        return data['access_token'];
    }

    //上传素材
    async  uploadMaterials(type, material, permanent) {
        let access_token = await this.getAccessToken();
        let form = {};
        //默认素材为临时素材
        let uploadUrl = api.temporary.upload;
        //如果上传的为永久素材，图片,语音,视频，缩略图，
        if (permanent) {
            //修改上传的url地址
            uploadUrl = api.permanent.upload;
            //重新赋值form
            form = permanent;
        }
        //如果素材类型为pic，作为图文消息的图片上传，返回的是一个图片的url地址
        if (type === 'pic') {
            uploadUrl = api.permanent.uploadNewsPic;
        }
        //如果素材类型为图文消息
        type === 'news' ? uploadUrl = api.permanent.uploadNews : form.media = fs.createReadStream(material);
        let url = `${uploadUrl}access_token=${access_token}&type=${type}`;
        let options = { method: 'POST', url, json: true };
        type === 'news' ? options.body = form : options.formData = form;
        let response = await request(options);
        return response.body;
    }
}

module.exports = new AccessToken(config.app);