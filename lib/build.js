/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-03 10:05:02
 * @version $Id$
 */

const PATH = require('path');
const rd   = require('rd');
const sass = require('node-sass');
const util = require('./util');


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

    // generate index
    let indexHtml = util.renderLists(dir);
    let indexPath = PATH.resolve(destDir, 'index.html');
    util.write(indexPath, indexHtml);


    // generate categories

/* SASS 处理 */
    let cssSrcPath  = PATH.resolve(dir, 'static', '_scss');
    rd.eachFileFilterSync(cssSrcPath, /.*/, (path, s) => {
        let basename = PATH.basename(path),
            pos,
            filename = (pos = basename.indexOf('.')) > -1 ? basename.substring(0, pos) : basename;
            destPath = path.replace('_scss', 'css');

        // 非scss/sass文件，拷贝
        if(!/\.(?:scss|sass)/.test(basename)) {
            util.copy(path, destPath);
        }else {
            if(basename.indexOf('_') !== 0) {
                let ret = sass.renderSync({
                    file: path,
                    data: util.read(path) || '',
                    outputStyle: 'expanded',
                    indentWidth: 4
                });

                let content = ret.css.toString('utf8');
                
                util.write(destPath.replace(/\.(?:scss|sass)/, '.css'), content);
            }
        }
    });

    function generate_archives(archiveName) {
        
    }

    function generate_categories(cateName) {

    }

    function generate_tags(tagName) {

    }

    function compile_scss() {

    }
};