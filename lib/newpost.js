/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-08 15:05:52
 * @version $Id$
 */

const PATH = require('path');
const util = require('./util');

module.exports = function(filename, options, index) {
    let path,pos,dir,content;

    if(typeof options === 'string') {
        dir = options;
    }else if(typeof options === 'object') {
        dir = options.ouput;
    }

    dir = dir || '.';

    filename = (pos=filename.lastIndexOf('.')) > -1 ? filename.substring(0, pos) : filename;

    content = util.read(PATH.resolve(dir, '_draft', 'template.md'));

    path = PATH.resolve(dir, '_archives', util.date('YYYY-MM-DD-') + filename +'.md');


    content = [
        '---',
        'title: React 教程-'+ filename,
        'author: Benjamin',
        'date: ' + util.now(),
        'picName: city-0' + (index || 1) +'.jpg',
        'categories: React, Javascript, FE',
        'tags: React,Web',
        '---',
        ''
    ].join('\n') + content;
    util.write(path, content);
};