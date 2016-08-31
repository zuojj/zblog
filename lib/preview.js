const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');


module.exports = function(dir) {
    dir = dir || '.';

    let app = express();
    let router = express.Router();

    app.use('/static', serveStatic(path.resolve('dir', 'static') ) );

    app.use(router);

    // 渲染文章
    router.get('/posts/*', (req, res, next) => {
        console.log(req.params);
        res.end(req.params[0]);
    })

    // 渲染列表
    router.get('/', (req, res, next) => {
        res.end('文章列表');
    });

    app.listen(3000);
}