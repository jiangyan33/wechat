const { request } = require('./method');
const config = require('config');
const path = require('path');
const fs = require('fs');
const preix = config.get('app').preix;
const api = {
    accessToken: `${preix}token?`,
    temporary: {
        upload: `${preix}media/upload?`,
        fetch: `${preix}media/get?`,
    },
    permanent: {
        upload: `${preix}material/add_material?`,
        uploadNews: `${preix}material/add_news?`,
        uploadNewsPic: `${preix}material/uploadimg?`,
        fetch: `${preix}material/get_material?`,
        del: `${preix}material/del_material?`,
        updateNews: `${preix}material/update_news?`,
        count: `${preix}material/get_materialcount?`,
        batch: `${preix}material/batchget_material?`
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
        //如果上传的为永久素材，图片,语音,视频，缩略图，图文消息
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
        //如果不是图文素材，post请求体中需要media参数
        type === 'news' ? uploadUrl = api.permanent.uploadNews : form.media = fs.createReadStream(material);
        let url = `${uploadUrl}access_token=${access_token}&type=${type}`;
        let options = { method: 'POST', url, json: true };
        //如果不是图文素材需要formData(存储媒体数据)
        type === 'news' ? options.body = form : options.formData = form;
        let response = await request(options);
        return response.body;
    }

    //获取素材
    async fetchMaterials(media_id, type, permanent) {
        let access_token = await this.getAccessToken();
        //初始化url为临时素材的url
        let fetchUrl = permanent ? api.permanent.fetch : api.temporary.fetch;
        //请求的url
        let url = `${fetchUrl}access_token=${access_token}&media_id=${media_id}`;
        //如果素材类型为video
        let options = {
            method: 'GET',
            json: true,
        }
        //如果为永久素材
        if (permanent) {
            options['method'] = 'POST';
            options['url'] = url;
            options['body'] = {
                media_id
            }
            //如果为临时素材，并且type为video，修改url
        } else if (type === 'video') {
            //临时素材的video格式的视频，需要使用http方式访问,为get请求，永久素材使用post请求方式
            options['url'] = url.replace('https://', 'http://');
        }
        let response = await request(options);
        return response.body;
    }

    //删除永久素材
    async fetchMaterials(media_id) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${api.permanent.del}access_token=${access_token}`;
        //如果素材类型为video
        let options = {
            method: 'POST',
            json: true,
            url,
            body: {
                media_id
            }
        };
        let response = await request(options);
        return response.body;
    }

    //修改图文素材
    async updateNewsMaterials(media_id, index, articles) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${api.permanent.updateNews}access_token=${access_token}`;
        //如果素材类型为video
        let options = {
            method: 'POST',
            url,
            json: true,
            body: {
                media_id,
                index,
                articles
            }
        };
        let response = await request(options);
        return response.body;
    }

    //获取素材总数
    async count() {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${api.permanent.count}access_token=${access_token}`;
        let response = await request({ method: 'GET', url, json: true });
        return response.body;
    }

    //获取素材列表
    async batch(type = 'image', offset = 0, count = 10) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${api.permanent.batch}access_token=${access_token}`;
        let options = {
            method: 'POST',
            url,
            json: true,
            body: {
                type,
                offset,
                count
            }
        };
        let response = await request(options);
        return response.body;
    }
}

module.exports = new AccessToken(config.app);