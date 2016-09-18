/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-02 23:20:13
 * @version $Id$
 */

const PATH = require('path');
const util = require('./util');
const newpost = require('./newpost');

module.exports = function(dir, options) {
    dir = dir || '.';

    // 此处待增加路径不存在处理
    let srcDir = PATH.resolve(__dirname, '../themes', options && options.theme || 'simplestyle');

    // copy src file
    try {
        util.copy(srcDir, PATH.resolve(__dirname, '..', dir));
    }catch(err) {
        console.error(err);
    }

    util.log('You created a blog at '+ util.now() +', the directory is ' + PATH.resolve(dir));

    // create a new article
    [1,2,3,4].forEach((item) => {
        newpost('article-0' + item, dir);
    });
}