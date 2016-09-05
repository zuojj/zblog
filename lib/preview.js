/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-02 23:20:13
 * @version $Id$
 */

const express     = require('express');
const serveStatic = require('serve-static');
const path        = require('path');
const open        = require('open');
const util        = require('./util');

module.exports = function(dir) {
    dir = dir || '.';

    let config = util.parseConfig(dir);
    let port = config.port || 3000;
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

    app.listen(port);
    open('http://127.0.0.1:' + port);
}
















