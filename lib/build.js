/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-03 10:05:02
 * @version $Id$
 */

const path = require('path');
const util = require('./util');

module.exports = function(dir, options) {
    dir = dir || '.';

    let destDir = path.resolve(options.output || dir);
    let srcDir = path.resolve(dir, '_posts');
    let relativePath = util.replaceExtname();

    // 生成各文章页
    util.eachSrcFile(srcDir, (f, s) => {
        let html = util.renderPost(dir, f);
        let file = path.resolve(destDir, 'posts', util.replaceExtname(f.slice(srcDir.length + 1)));
        util.createFile(file, html);
    });

    // 生成首页
    let indexHtml = util.renderLists(dir);
    let file = path.resolve(destDir, 'index.html');

    util.createFile(file, indexHtml);
}