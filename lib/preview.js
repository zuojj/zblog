const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const fs   = require('fs');
const markdownIt = require('markdown-it');
const md = new markdownIt({
    html: true,
    langPrefix: 'code-'
});


module.exports = function(dir) {
    dir = dir || '.';

    let app = express();
    let router = express.Router();

    app.use('/static', serveStatic(path.resolve('dir', 'static') ) );

    app.use(router);

    // 渲染文章
    router.get('/posts/*', (req, res, next) => {

        let name = stripExtname(req.params[0]);
        let file = path.resolve(dir, '_posts', name + '.md');

        fs.readFile(file, (err, content) => {

            if(err) {
                throw err;
                return next(err);
            }
            let con = parseContent(content.toString());

            let html = markdownToHtml(content.toString());
            res.end(html);
        })
    })

    // 渲染列表
    router.get('/', (req, res, next) => {
        res.end('文章列表');
    });

    app.listen(3000);
}


/**
 * [stripExtname 去掉文件名中的扩展名]
 * @param  {String} name [文件名]
 * @return {String}      [路径名]
 */
function stripExtname(name) {
    var index = 0 - path.extname(name).length;

    index = index === 0 ? name.length : index;

    return name.slice(0, index);
}

/**
 * [markdownToHtml 将markdown转换为html]
 * @param  {String} content [markdown内容]
 * @return {Sting}          [html内容]
 */
function markdownToHtml(content) {
    console.log(content);
    return md.render(content || '');
}


function parseContent(content) {
    let pattern = /---(\\r)?\\n/m;

    content = content.split(pattern);

    console.log(content);

}


