/**
 * 
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-08 15:05:52
 * @version $Id$
 */

const PATH = require('path');
const util = require('./util');


module.exports = function(filename, options) {
    let path,pos,dir,content;

    if(typeof options === 'string') {
        dir = options;
    }else if(typeof options === 'object') {
        dir = options.ouput;
    }

    dir = dir || '.';

    filename = (pos = filename.lastIndexOf('.') > -1) ? filename.substring(0, pos) : filename;

    content = [
        '---',
        'title: ' + util.parseConfig(dir).title,
        'author: ' + (util.parseConfig(dir).author || 'zblog'),
        'date: ' + util.now(),
        '---',
        '# Hello Zblog'
    ].join('\n');

    path = PATH.resolve(dir, '_archives', util.date('YYYY/MM/DD'), filename +'.md');

    util.write(path, content);
};