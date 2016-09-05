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
    let tplDir = path.resolve(__dirname, '../theme', options.theme || 'default');

    // copy src file
    fset.copySync(tplDir, dir);

    util.newPost(dir, 'Hello-world', '# welcome to use zblog: a static blog system', 'Hello-world');

    console.log('You created a blog, the directory is ' + path.resolve(dir));
}