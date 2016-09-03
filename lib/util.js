/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-02 23:20:13
 * @version $Id$
 */

const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const markdownIt = require('markdown-it');
const rd = require('rd');
const fset = require('fs-extra');
const moment = require('moment')();

const md = new markdownIt({
    html: true,
    langPrefix: 'code-'
});

var util = {
    /**
     * [parseConfig 解析配置文件]
     * @return {Object} [description]
     */
    parseConfig: function(dir) {
        let content = fs.readFileSync(path.resolve(dir, 'config.json')).toString();
        let config;

        return JSON.parse(content);
    },

    /**
     * [parseContent 解析markdown 文档]
     * @param  {String} content [文档内容]
     * @return {Object}         [格式化后对象]
     */
    parseContent: function(content) {
        let me = this;
        let article = content.split(/---\n+/m);

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
     * @param  {String} file [文件路径]
     * @param  {Object} data [article info]
     * @return {String}      [渲染后模板]
     */
    renderFile: function(file, data) {
        return ejs.render(fs.readFileSync(file).toString(), data);
    },

    /**
     * [funciton 创建文件]
     * @param  {[type]} file    [description]
     * @param  {[type]} content [description]
     * @return {[type]}         [description]
     */
    createFile: function(file, content) {
        console.log('create page: %s', file);
        fset.outputFileSync(file, content);
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
        let lists = [];
        let srcDir = path.resolve(dir, '_posts');
        let html;

        me.eachSrcFile(srcDir, (f, s) => {
            let content = fs.readFileSync(f).toString();
            let info = me.parseContent(content);

            info.timestamp = new Date(info.date);
            info.url = '/posts/' + me.replaceExtname(f.slice(srcDir.length + 1));

            lists.push(info);
        });

        lists.sort((a,b) => {
            return b.timestamp - a.timestamp;
        });

        html = me.renderFile(path.resolve(dir, '_layout', 'index.html'), {
            config: me.parseConfig(dir),
            lists: lists
        });

        return html;
    },

    /**
     * [renderPost 渲染文章]
     * @param  {String} dir  [description]
     * @param  {String} file [description]
     * @return {String}      [description]
     */
    renderPost: function(dir, file) {
        let me = this;
        let content = fs.readFileSync(file).toString();
        let info = me.parseContent(content);
        let html;

        info.body = me.markdownToHtml(info.body);
        info.layout = info.layout || 'template';

        html = me.renderFile(path.resolve(dir, '_layout', info.layout + '.html'), {
            config: me.parseConfig(dir),
            post: info
        })

        return html;
    },

    /**
     * [netPost 新建文章]
     * @param  {[type]} dir     [description]
     * @param  {[type]} title   [description]
     * @param  {[type]} content [description]
     * @return {[type]}         [description]
     */
    newPost: function(dir, title, content) {
        content = [
            '---',
            'title: ' + title,
            'author: ' + (this.parseConfig(dir).author || 'zblog'),
            'date: ' + moment.format('YYYY-MM-DD HH:mm:ss'),
            '---',
            content
        ].join('\n');

        let file = path.resolve(dir, '_posts', moment.format('YYYY-MM') + '/hello-world.md');

        fset.outputFileSync(file, content);
    }
}

module.exports = util;

