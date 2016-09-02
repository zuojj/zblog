const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const util = require('./util');

module.exports = function(dir) {
    dir = dir || '.';

    let app = express();
    let router = express.Router();

    app.use('/static', serveStatic(path.resolve('dir', 'static') ) );

    app.use(router);

    // 渲染文章
    router.get('/posts/*', (req, res, next) => {
        let name = util.replaceExtname(req.params[0], 'html', 'md');
        let file = path.resolve(dir, '_posts', name);
        let html = util.renderPost(dir, file);

        res.end(html);
    })

    // 渲染列表
    router.get('/', (req, res, next) => {
        let html = util.renderLists(dir);

        res.end(html);
    });

    app.listen(3000);
}
















