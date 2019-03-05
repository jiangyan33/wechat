/**
 * 临时素材管理
 */
const { AccessToken } = require('./accessToken');
const fs = require('fs');

class Temporary extends AccessToken {
    constructor() {
        //初始化父类的this对象
        super();
        this.api = {
            upload: `${this.preix}media/upload?`,
            fetch: `${this.preix}media/get?`,
        };
    }

    /**
     * 上传临时素材,支持image，voice，video，thumb
     * @param {*} type 
     * @param {*} material 
     */
    async  uploadMaterials(type, material) {
        let access_token = await this.getAccessToken();
        //拼接url
        let url = `${this.api.upload}access_token=${access_token}&type=${type}`;
        //构建请求参数
        let options = {
            method: 'POST',
            url,
            json: true,
            formData: {
                media: fs.createReadStream(material)
            }
        };
        //缩略图返回的是thumb_media_id,其他都是media_id
        let response = await this.request(options);
        return response.body;
    }

    //  获取临时素材
    async  fetchMaterials(media_id, type = '') {
        let access_token = await this.getAccessToken();
        //拼接url
        let url = `${this.api.fetch}access_token=${access_token}&media_id=${media_id}`;
        if (type === 'video') {
            //临时素材的video格式的视频，需要使用http方式访问,为get请求
            url = url.replace('https://', 'http://');
        }
        //构建请求参数
        let options = {
            url,
            json: true
        };
        let response = await this.request(options);
        //除了视频，其他返回的直接是一个二进制文件
        return response.body;
    }
}

module.exports = new Temporary();