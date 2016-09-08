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

module.exports = function(dir) {
    dir = dir || '.';

    let config = util.parseConfig(dir);
    let port = config.port || 3000;
    let app = express();
    let router = express.Router();

    app.use('/static', serveStatic(PATH.resolve(dir, 'static') ) );

    app.use(router);

    // 渲染文章
    router.get('/archives/*', (req, res, next) => {
        let path = PATH.resolve(dir, 'public', 'archives', req.params[0]);

        let html = util.read(path);

        res.end(html);
    });

    // 渲染列表
    router.get('/', (req, res, next) => {
        console.log(dir);
        let html = util.read(PATH.resolve(dir, 'public', 'index.html'));

        res.end(html);
    });

    app.listen(port);
    
    open('http://127.0.0.1:' + port);
}
















