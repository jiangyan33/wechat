const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const http = require('http');
const router = require('./router/router');
const accessToken = require('./libs/accessToken');

(async () => {
    const app = express();
    const server = http.createServer(app);
    // body解析
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.raw({ type: 'text/xml' }));
    app.use((req, res, next) => {
        //跨域问题, 有个第三方库https://github.com/expressjs/cors
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "token,Content-Type");
        res.header("Access-Control-Max-Age", 1728000);
        if (req.method == 'OPTIONS') {
            res.send(true);
        } else {
            next();
        }
    });
    app.use(router);
    await accessToken.getAccessToken();
    // error事件监听
    server.on('error', console.error);

    // 启动服务
    server.listen(config.app.port, () => console.log(`listening on ${config.app.port}...`));

    // 进程事件的监听
    process.on('uncaughtException', error => { // 未捕获的异常事件
        console.log("[App] 发现一个未处理的异常: ", error);
    }).on('unhandledRejection', (reason, p) => { // 未处理的rejection事件
        console.log("[App] 发现一个未处理的rejection: ", p, "原因: ", reason);
    });
})();