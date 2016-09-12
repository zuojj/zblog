/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-02 23:20:13
 * @version $Id$
 */

const PATH       = require('path');
const fset       = require('fs-extra');
const ejs        = require('ejs');
const markdownIt = require('markdown-it');
const rd         = require('rd');
const moment     = require('moment')();
const iconv      = require('iconv-lite');
const md         = new markdownIt({
    html: true,
    langPrefix: 'language-'
});

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
     * [parseContent 解析markdown 文档]
     * @param  {String} content [文档内容]
     * @return {Object}         [格式化后对象]
     */
    parseContent: function(content) {
        let me = this;
        let article = content.split(/---\r?\n+/m);

        article = me.filterArray(article);

        let header = article[0];
        let body = article[1];
        let info = {};

        let userinfo = header.split(/\n+/);

        userinfo = me.filterArray(userinfo);

        for(var i = 0, ilen = userinfo.length; i < ilen; i ++) {
            var items = userinfo[i].split(/\s*:(.+)/);

            items = me.filterArray(items);

            info[items[0]] = items[1];
        }

        info.body = body;

        return info;
    },

    /**
     * [markdownToHtml 将markdown转换为html]
     * @param  {String} content [markdown内容]
     * @return {Sting}          [html内容]
     */
    markdownToHtml: function(content) {
        return md.render(content || '');
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
    },

    /**
     * [replaceExtname 替换后缀.md to .html]
     * @param  {String} path      [原路径]
     * @param  {String} newSuffix [新后缀]
     * @return {String}           [新路径]
     */
    replaceExtname: function(path, oldSuffix, newSuffix) {
        return path && path.replace(new RegExp('\\.'+ (oldSuffix || 'md') +'$'), '.' + (newSuffix || 'html') );
    },

    /**
     * [renderFile 渲染文件]
     * @param  {String} path [文件路径]
     * @param  {Object} data [article info]
     * @return {String}      [渲染后模板]
     */
    renderFile: function(path, data) {
        return ejs.render(this.read(path), data);
    },

    /**
     * [eachSrcFile 遍历所有文章]
     * @param  {[type]}   srcDir   [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    eachSrcFile: function(srcDir, callback) {
        rd.eachFileFilterSync(srcDir, /\.md$/, callback);
    },

    /**
     * [renderLists 渲染列表]
     * @param  {String} dir [目录]
     * @return {[type]}     [description]
     */
    renderLists: function(dir) {
        let me = this;
        let pages = [];
        let srcDir = PATH.resolve(dir, '_archives');
        let html;

        me.eachSrcFile(srcDir, (path, s) => {
            let content = me.read(path);
            let page = me.parseContent(content);

            page.timestamp = new Date(page.date);
            page.url = '/archives/' + me.replaceExtname(path.slice(srcDir.length + 1));

            pages.push(page);
        });

        pages.sort((a,b) => {
            return b.timestamp - a.timestamp;
        });

        html = me.renderFile(PATH.resolve(dir, '_layout', 'index.ejs'), {
            config: me.config,
            pages: pages,
            filename: PATH.resolve(dir, '_layout', 'widget', 'index.ejs')
        });

        return html;
    },

    /**
     * [renderPost 渲染文章]
     * @param  {String} dir  [description]
     * @param  {String} path [description]
     * @return {String}      [description]
     */
    renderPost: function(dir, path) {
        let me = this;
        let content = me.read(path);
        let page = me.parseContent(content);
        let html;

        page.body = me.markdownToHtml(page.body);

        page.layout = page.layout || 'archive';

        html = me.renderFile(PATH.resolve(dir, '_layout', page.layout + '.ejs'), {
            config: me.config,
            page: page,
            filename: PATH.resolve(dir, '_layout', 'widget', page.layout + '.ejs')
        });

        return html;
    }
};
