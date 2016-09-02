const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const markdownIt = require('markdown-it');
const md = new markdownIt({
    html: true,
    langPrefix: 'code-'
});

const rd = require('rd');


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
            let info = parseContent(content.toString());

            info.body = markdownToHtml(info.body);
            info.layout = info.layout || 'template';

            let html = renderFile(path.resolve(dir, '_layout', info.layout + '.html'), {
                post: info
            });

            res.end(html);
        });
    })

    // 渲染列表
    router.get('/', (req, res, next) => {
        var lists = [];
        var srcDir = path.resolve(dir, '_posts');

        rd.eachFileFilterSync(srcDir, /\.md$/, (f, s) => {
            var content = fs.readFileSync(f).toString();

            var info = parseContent(content);

            info.timestamp = new Date(info.date);
            info.url = '/posts/' + stripExtname(f.slice(srcDir.length + 1)) + '.html';
            lists.push(info);
        });

        lists.sort((a,b) => {
            return b.timestamp - a.timestamp;
        });

        var html = renderFile(path.resolve(dir, '_layout', 'index.html'), {
            lists: lists
        });

        res.end(html);
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
    return md.render(content || '');
}

/**
 * [parseContent 解析markdown 文档]
 * @param  {String} content [文档内容]
 * @return {Object}         [格式化后对象]
 */
function parseContent(content) {
    let article = content.split(/---\n+/m);

    article = filterArray(article);

    let header = article[0];
    let body = article[1];
    let info = {};

    let userinfo = header.split(/\n+/);

    userinfo = filterArray(userinfo);

    for(var i = 0, ilen = userinfo.length; i < ilen; i ++) {
        var items = userinfo[i].split(/\s*:\s*/);

        items = items.map((item) => {
            return item.trim();
        });

        info[items[0]] = items[1];
    }

    info.body = body;

    return info;
}

/**
 * [filterArray 过滤数组]
 * @param  {Array} arr [old array]
 * @return {Array}     [new array]
 */
function filterArray(arr) {
    return (arr || []).map((item) => {
        return item.trim();
    }).filter((item) => {
        return item.length > 0;
    })
}


// 增加模板
function renderFile(file, data) {
    return ejs.render(fs.readFileSync(file).toString(), data);
}




















