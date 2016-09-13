/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-02 23:20:13
 * @version $Id$
 */

const PATH       = require('path');
const fset       = require('fs-extra');


const rd         = require('rd');
const moment     = require('moment')();
const iconv      = require('iconv-lite');


module.exports =  {
    isWin: process.platform.indexOf('win') === 0,

    exsits: fset.existsSync,


    config: require('./config'),
    /**
     * [now 当前时间]
     * @return {String} [当前时间]
     */
    now: function() {
        return moment.format('YYYY-MM-DD HH:mm:ss');
    },

    date: function(format) {
        return moment.format(format);
    },

    /**
     * [log 打印日志]
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    log: function(str) {
        console.log('[info] ' + (str || ''));
    },

    /**
     * [mkdir 递归创建目录]
     * @param  {String} path [文件路径]
     * @return {[type]}      [description]
     */
    mkdir: function(path) {
        if(!this.exsits(path)) {
            try{
                fset.mkdirSync(path);
            }catch(err) {
                console.error(err);
            }
        }else {
            console.error('[waring] file already exsits %s', path);
        }
    },

    /**
     * [read 读取文件]
     * @param  {String} path [文件路径]
     * @return {String}      [文件内容]
     */
    read: function(path) {
        var me = this,
            content = false;

        if(me.exsits(path)) {
            content = fset.readFileSync(path).toString();
        } else {
            console.error('unable to read file [%s]: No such file or directory.', path);
        }

        return content;
    },

    /**
     * [write 写文件]
     * @param  {String} path    [文件路径]
     * @param  {String} content [写入内容]
     * @return {[type]}         [description]
     */
    write: function(path, content) {
        try {
            console.log('[info] Generate file [%s]', path);
            fset.outputFileSync(path, content);
        }catch(err) {
            console.error(err);
        }
    },

    /**
     * [copy 拷贝目录]
     * @param  {String} srcDir  [源目录]
     * @param  {String} destDir [目的目录]
     * @return {[type]}         [description]
     */
    copy: function(srcDir, destDir) {
        try {
            fset.copySync(srcDir, destDir);
        }catch(err) {
            console.error(err);
        }
    },

    /**
     * [remove 删除文件或目录]
     * @param  {String} dir [路径]
     * @return {[type]}     [description]
     */
    remove: function(dir) {
        if(this.exsits(dir)) {
            fset.removeSync(dir)
        }else {
            console.error('unable to read file [%s]: No such file or directory.', dir);
        }
    },

    /**
     * [filterArray 过滤数组]
     * @param  {Array} arr [old array]
     * @return {Array}     [new array]
     */
    filterArray: function(arr) {
        return (arr || []).map((item) => {
            return item.trim();
        }).filter((item) => {
            return item.length > 0;
        });
    }
};
