/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-03 10:05:02
 * @version $Id$
 */

const PATH = require('path');
const rd   = require('rd');
const util = require('./util');
const sass = require('node-sass');

module.exports = function(dir, options) {
    dir = dir || '.';

    let destDir = PATH.resolve(options.output || dir, 'public');

    // 存在删除目录
    if(util.exsits(destDir)) {
        util.remove(destDir);
    }

    let srcDir = PATH.resolve(dir, '_archives');
    let relativePath = util.replaceExtname();

    util.mkdir(destDir);

    // 生成各文章页
    util.eachSrcFile(srcDir, (f, s) => {
        let html = util.renderPost(dir, f);
        let path = PATH.resolve(destDir, 'archives', util.replaceExtname(f.slice(srcDir.length + 1)));

        util.write(path, html);
    });

    // 生成首页
    let indexHtml = util.renderLists(dir);
    let indexPath = PATH.resolve(destDir, 'index.html');
    util.write(indexPath, indexHtml);


/* SASS 处理 */
    let cssSrcPath  = PATH.resolve(dir, 'static', '_scss');
    rd.eachFileFilterSync(cssSrcPath, /\.scss$/, (path, s) => {
        let basename = PATH.basename(path),
            pos,
            filename = (pos = basename.indexOf('.')) > -1 ? basename.substring(0, pos) : basename,
            destPath = PATH.resolve(cssSrcPath, '..', 'css', filename +'.css');

        if(basename.indexOf('_') !== 0) {
            let ret = sass.renderSync({
                file: path,
                data: util.read(path) || '',
                outputStyle: 'expanded',
                indentWidth: 4
            });

            let content = ret.css.toString('utf8');
            
            util.write(destPath, content);
        }
    });
};