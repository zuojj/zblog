/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-02 23:20:13
 * @version $Id$
 */

const express     = require('express');
const serveStatic = require('serve-static');
const PATH        = require('path');
const util        = require('./util');
const build       = require('./build');

module.exports = function(dir) {
    let operate = util['server_' + dir];
    if(dir !== 'start' && operate && 'function' === typeof operate) {
        operate.call(util);
        return;
    }

    const config = require('./config')();

    let port = config.server.port;
    let serverPath = config.server.root;
    let app = express();
    let router = express.Router();

    dir = dir || '.';

    app.use('/static', serveStatic(PATH.resolve(serverPath, 'static') ) );

    app.use(router);

    // 渲染文章
    router.get('/archives', (req, res, next) => {
        let path = PATH.resolve(serverPath, 'archives', 'index.html');

        let html = util.read(path);

        res.end(html);
    });

    // 渲染文章
    router.get('/archives/*', (req, res, next) => {
        let path = PATH.resolve(serverPath, 'archives', req.params[0]);

        let html = util.read(path);

        res.end(html);
    });

    // 渲染文章
    router.get('/categories', (req, res, next) => {
        let path = PATH.resolve(serverPath, 'categories', 'index.html');

        let html = util.read(path);

        res.end(html);
    });

    // 渲染文章
    router.get('/tags', (req, res, next) => {
        let path = PATH.resolve(serverPath, 'tags', 'index.html');

        let html = util.read(path);

        res.end(html);
    });

    // 渲染文章
    router.get('/about', (req, res, next) => {
        let path = PATH.resolve(serverPath, 'about', 'index.html');

        let html = util.read(path);

        res.end(html);
    });

    // 渲染列表
    router.get('/', (req, res, next) => {
        let html = util.read(PATH.resolve(serverPath, 'index.html'));

        res.end(html);
    });

    app.listen(port);

    util.server_start();
}
















