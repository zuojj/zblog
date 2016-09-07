/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-03 10:05:02
 * @version $Id$
 */

const path = require('path');
const fset = require('fs-extra');
const util = require('./util');
const sass = require('node-sass');


module.exports = function(dir, options) {
    dir = dir || '.';

    let destDir = path.resolve(options.output || dir, 'public');

    let srcDir = path.resolve(dir, '_posts');
    let relativePath = util.replaceExtname();


    fset.mkdirsSync(destDir);

    // 生成各文章页
    util.eachSrcFile(srcDir, (f, s) => {
        let html = util.renderPost(dir, f);
        let file = path.resolve(destDir, 'archives', util.replaceExtname(f.slice(srcDir.length + 1)));
        util.createFile(file, html);
    });

    // 生成首页
    let indexHtml = util.renderLists(dir);
    let file = path.resolve(destDir, 'index.html');
    util.createFile(file, indexHtml);




/* SASS 处理 */
    let cssSrcPath  = path.resolve(dir, 'static', 'css', 'index.scss');
    let cssDestPath = path.resolve(destDir, 'static', 'css', 'index.css');
    /*
     * compacted, nested, expanded, compressed
     */
    let ret = sass.renderSync({
        file: cssSrcPath,
        data: fset.readFileSync(cssSrcPath).toString('utf8'),
        outputStyle: 'expanded',
        indentWidth: 4,
        outFile: cssDestPath,
        sourceMap: true
    });

    let content = ret.css.toString('utf8');
    
    util.createFile(cssDestPath, content);

};