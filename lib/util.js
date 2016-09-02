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
const md = new markdownIt({
    html: true,
    langPrefix: 'code-'
});

const rd = require('rd');

var util = {

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
            var items = userinfo[i].split(/\s*:\s*/);

            items = items.map((item) => {
                return item.trim();
            });

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
     * [renderLists 渲染列表]
     * @param  {String} dir [目录]
     * @return {[type]}     [description]
     */
    renderLists: function(dir) {
        let me = this;
        let lists = [];
        let srcDir = path.resolve(dir, '_posts');
        let html;

        rd.eachFileFilterSync(srcDir, /\.md$/, (f, s) => {
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
            post: info
        })

        return html;
    }
}


module.exports = util;