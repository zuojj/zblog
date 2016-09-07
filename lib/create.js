/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-02 23:20:13
 * @version $Id$
 */

const path = require('path');
const fset = require('fs-extra');
const util = require('./util');

module.exports = function(dir, options) {
    dir = dir || '.';

    // 此处待增加路径不存在处理
    let tplDir = path.resolve(__dirname, '../themes', options.theme || 'simplestyle');

    // copy src file
    try {
        fset.copySync(tplDir, dir);
    }catch(err) {
        console.error(err);
    }

    util.newPost(dir, 'Hello-world', '# welcome to use zblog: a static blog system', 'Hello-world');

    util.log('You created a blog at '+ util.now +', the directory is ' + path.resolve(dir));
}