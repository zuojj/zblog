/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-02 23:20:13
 * @version $Id$
 */

const express     = require('express');
const serveStatic = require('serve-static');
const PATH        = require('path');
const open        = require('open');
const util        = require('./util');
const build       = require('./build');

module.exports = function(dir) {
    dir = dir || '.';

    let port = util.config.server.port;
    let app = express();
    let router = express.Router();

    app.use('/static', serveStatic(PATH.resolve(dir, 'static') ) );

    app.use(router);

    // 渲染文章
    router.get('/archives', (req, res, next) => {
        build(dir, {output: '.'});
        
        let path = PATH.resolve(dir, 'archives', 'index.html');

        let html = util.read(path);

        res.end(html);
    });

    // 渲染文章
    router.get('/archives/*', (req, res, next) => {
        build(dir, {output: '.'});

        let path = PATH.resolve(dir, 'archives', req.params[0]);

        let html = util.read(path);

        res.end(html);
    });

    // 渲染文章
    router.get('/categories', (req, res, next) => {
        build(dir, {output: '.'});

        let path = PATH.resolve(dir, 'categories', 'index.html');

        let html = util.read(path);

        res.end(html);
    });

    // 渲染文章
    router.get('/tags', (req, res, next) => {
        build(dir, {output: '.'});

        let path = PATH.resolve(dir, 'tags', 'index.html');

        let html = util.read(path);

        res.end(html);
    });

    // 渲染文章
    router.get('/about', (req, res, next) => {
        build(dir, {output: '.'});

        let path = PATH.resolve(dir, 'about', 'index.html');

        let html = util.read(path);

        res.end(html);
    });

    // 渲染列表
    router.get('/', (req, res, next) => {
        build(dir, {output: '.'});
        
        let html = util.read(PATH.resolve(dir, 'index.html'));

        res.end(html);
    });

    app.listen(port);
    
    open('http://127.0.0.1:' + port);
}
















