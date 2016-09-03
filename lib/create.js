/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-02 23:20:13
 * @version $Id$
 */


const path = require('path');
const fset = require('fs-extra');
const util = require('./util');

module.exports = function(dir) {
    // create base directory

    let _dir = function(dirname) {
        console.log('zblog: create a directory ' + dirname);
        return path.resolve(dir, dirname);
    };

    let tplDir = path.resolve(__dirname, '../src');

    // copy src file
    fset.copySync(tplDir, dir);

    util.newPost(dir, 'Hello-world', '# welcome to use zblog: a static blog system');

    console.log('You created a blog, the directory is ' + path.resolve(dir));
}