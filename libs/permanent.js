/**
 * 临时素材管理
 */
const { AccessToken } = require('./accessToken');
const fs = require('fs');

class Permanent extends AccessToken {
    constructor() {
        //初始化父类的this对象
        super();
        this.api = {
            upload: `${this.preix}material/add_material?`,
            uploadNews: `${this.preix}material/add_news?`,
            uploadNewsPic: `${this.preix}media/uploadimg?`,
            fetch: `${this.preix}material/get_material?`,
            del: `${this.preix}material/del_material?`,
            updateNews: `${this.preix}material/update_news?`,
            count: `${this.preix}material/get_materialcount?`,
            batch: `${this.preix}material/batchget_material?`,
        };
    }

    /**
     * 上传永久素材,支持image，voice，video，thumb
     * @param {*} type 
     * @param {*} material 
     */
    async  uploadMaterials(type, material, option = {}) {
        let access_token = await this.getAccessToken();
        //构建请求参数
        let options = {
            method: 'POST',
            json: true,
        };
        //默认url为普通素材
        let url = `${this.api.upload}access_token=${access_token}&type=${type}`;
        //图文消息(不是图文素材)中的图片,返回url
        if (type === 'pic') {
            url = `${this.api.uploadNewsPic}access_token=${access_token}`;
            options.formData = {
                media: fs.createReadStream(material)
            };
        } else if (type === 'news') {
            url = `${this.api.uploadNews}access_token=${access_token}`;
            options.body = material;
        } else {
            options.formData = {
                media: fs.createReadStream(material)
            };
            //属性复制
            Object.assign(options.formData, option);
        }
        options.url = url;
        let response = await this.request(options);
        return response.body;
    }

    //  获取素材 TODO:接口上线达到最大，待测试
    async  fetchMaterials(media_id) {
        let access_token = await this.getAccessToken();
        //拼接url
        let url = `${this.api.fetch}access_token=${access_token}`;
        //构建请求参数
        let options = {
            method: 'POST',
            url,
            body: {
                media_id
            },
            json: true
        };
        let response = await this.request(options);
        //除了视频和图文，其他返回的直接是一个二进制文件
        return response.body;
    }

    //删除永久素材
    async del(media_id) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.del}access_token=${access_token}`;
        //如果素材类型为video
        let options = {
            method: 'POST',
            json: true,
            url,
            body: {
                media_id
            }
        };
        let response = await this.request(options);
        return response.body;
    }

    //修改图文素材
    async updateNewsMaterials(media_id, index, articles) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.updateNews}access_token=${access_token}`;
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
        let response = await this.request(options);
        return response.body;
    }

    //获取素材总数
    async count() {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.count}access_token=${access_token}`;
        let response = await this.request({ url, json: true });
        return response.body;
    }

    //获取素材列表
    async batch(type = 'image', offset = 0, count = 10) {
        let access_token = await this.getAccessToken();
        //请求的url
        let url = `${this.api.batch}access_token=${access_token}`;
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
        let response = await this.request(options);
        return response.body;
    }
}

module.exports = new Permanent();