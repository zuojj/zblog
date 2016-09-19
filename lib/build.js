/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-03 10:05:02
 * @version $Id$
 * @description 暂时不做资源定位，所有静态资源相对于站点根目录
 */

const PATH         = require('path');
const rd           = require('rd');
const sass         = require('node-sass');
const ejs          = require('ejs');
const autoprefixer = require('autoprefixer');
const cssnano      = require('cssnano');
const uglifyJS     = require('uglify-js');
const postcss      = require('postcss');
const markdownIt   = require('markdown-it');
const md           = new markdownIt({
    html: true,
    langPrefix: 'language-'
});

const util = require('./util');

module.exports = function(options) {
    const config = require('./config')();
    var pages = [], destDir, srcDir;

    destDir = options.output;

    if(!destDir) {
        destDir = PATH.resolve(__dirname, '../', 'www');
    }else if(/^\.\.?\/?$/.test(destDir)) {
        destDir = PATH.resolve(destDir, 'output_prod');
    }

    dir = '.';

    destDir = PATH.resolve(destDir);

    srcDir = PATH.resolve(dir, '_archives');

    util[util.exsits(destDir) ? 'remove' : 'mkdir'](destDir);

    // genarate
    rd.eachFileFilterSync(srcDir, /\.md$/, (path, s) => {
        let page;

        page = parse_markdown(path);
        pages.push(page);

        // generate archive
        generate_archive(page);
    });

    // sort
    pages.sort((a,b) => {
        return b.timestamp - a.timestamp;
    });

    // generate index
    generate_index(pages);

    const {archives, categories, tags} = (function() {
        var categories = {}, tags = {}, archives = {};

        pages.forEach((page, index) => {
            let _categories = page.categories;
            let _tags = page.tags;
            let year = page.year;
            let month = page.month;

            if(year in archives) {
                if(month in archives[year]) {
                    archives[year][month].push(page);
                }else {
                    archives[year][month] = [page];
                }
            }else {
                archives[year] = {};
                archives[year][month] = [page];
            }
            
            _categories.forEach((item, index) => {
                if(item in categories) {
                    categories[item].push(page);
                }else {
                    categories[item] = [];
                }
            });

            _tags.forEach((item, index) => {
                if(item in tags) {
                    tags[item].push(page);
                }else {
                    tags[item] = [];
                }
            });
        });

        return {
            categories: categories,
            tags: tags,
            archives: archives
        }
    })();

    // generate archives
    generate_archives(archives);

    // generate categories
    generate_categories(categories);

    // generate tags
    generate_tags(tags);

    // generate about
    generate_about();

    // generate css/js/img
    compile_static();

    /**
     * [parse_markdown 解析markdown 内容]
     * @param  {String} path [路径]
     * @return {Object}      [page对象]
     */
    function parse_markdown(path) {
        let markdown, mdInfo, mdContent, date, year, month, day, page = {};

        markdown = util.read(path);
        markdown = markdown.split(/---\r?\n+/m);
        markdown = util.filterArray(markdown);

        mdInfo = markdown[0];
        mdContent = markdown[1];

        mdInfo = mdInfo.split(/(\r?\n)+/);
        mdInfo = util.filterArray(mdInfo);

        mdInfo.forEach((item, index) => {
            item = item.split(/\s*:(.+)/);
            item = util.filterArray(item);

            page[item[0]] = item[1];
        });

        ['categories', 'tags'].forEach((item, index) => {
            page[item] = page[item] 
            ? page[item].split(',').map((current, index) => {
                return current.trim();
            })
            : '';
        });

        date = new Date(page.date);
        year = date.getFullYear();
        month = date.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        day = date.getDate();
        day = day < 10 ? '0' + day : day;

        page.timestamp = date;
        page.year      = year;
        page.month     = month;
        page.day       = day;
        page.url = '/archives/' + path.slice(srcDir.length + 1).replace(/\.md$/, '.html') ;
        page.path = path;
        page.body = md.render(mdContent || '');

        return page;
    }

    /**
     * [generate_archive 生成文档]
     * @param  {Object} page [page对象]
     * @return {[type]}      [description]
     */
    function generate_archive(page) {
        let html, path;

        path = page.path;
        page.layout = page.layout || 'archive';

        html = ejs.render(util.read(PATH.resolve(dir, '_layout', page.layout + '.ejs')), {
            config: config,
            page: page,
            filename: PATH.resolve(dir, '_layout', 'widget', page.layout + '.ejs')
        });

        path = PATH.resolve(destDir, 'archives', path.slice(srcDir.length + 1) );

        path = path.replace(/.md$/, '.html');
        util.write(path, html);
    }

    /**
     * [generate_archives 生成文档列表]
     * @param  {Object} archives [文档对象集合]
     * @return {[type]}          [description]
     */
    function generate_archives(archives) {
        let html, path;

        html = ejs.render(util.read(PATH.resolve(dir, '_layout', 'archives.ejs')), {
            config: config,
            archives: archives,
            filename: PATH.resolve(dir, '_layout', 'widget', 'archives.ejs')
        });

        path = PATH.resolve(destDir, 'archives', 'index.html');
        util.write(path, html);
    }

    /**
     * [generate_index 生成首页]
     * @param  {Object} pages [文档对象集合]
     * @return {[type]}       [description]
     */
    function generate_index(pages) {
        let html;

        html = ejs.render(util.read(PATH.resolve(dir, '_layout', 'index.ejs')), {
            config: config,
            pages: pages,
            filename: PATH.resolve(dir, '_layout', 'widget', 'index.ejs')
        });

        path = PATH.resolve(destDir, 'index.html');

        util.write(path, html);
    }

    /**
     * [generate_categories 生成分类页面]
     * @param  {Object} categories [分类对象]
     * @return {[type]}            [description]
     */
    function generate_categories(categories) {
        let html, path;

        html = ejs.render(util.read(PATH.resolve(dir, '_layout', 'categories.ejs')), {
            config: config,
            categories: categories,
            filename: PATH.resolve(dir, '_layout', 'widget', 'categories.ejs')
        });

        path = PATH.resolve(destDir, 'categories', 'index.html');
        util.write(path, html);
    }

    /**
     * [generate_tags 生成Tags页面]
     * @param  {Object} tags [tags对象集合]
     * @return {[type]}      [description]
     */
    function generate_tags(tags) {
        let html, path;

        html = ejs.render(util.read(PATH.resolve(dir, '_layout', 'tags.ejs')), {
            config: config,
            tags: tags,
            filename: PATH.resolve(dir, '_layout', 'widget', 'tags.ejs')
        });

        path = PATH.resolve(destDir, 'tags', 'index.html');
        util.write(path, html);
    }

    /**
     * [generate_about 生成关于我们]
     * @return {[type]} [description]
     */
    function generate_about() {
        let html, path;

        html = ejs.render(util.read(PATH.resolve(dir, '_layout', 'about.ejs')), {
            config: config,
            filename: PATH.resolve(dir, '_layout', 'widget', 'about.ejs')
        });

        path = PATH.resolve(destDir, 'about', 'index.html');
        util.write(path, html);
    }

    /**
     * [compile_static 编译静态资源]
     * @return {[type]} [description]
     */
    function compile_static() {
        let srcPath = PATH.resolve(dir, 'static');
        let dirPath = PATH.resolve(dir);

        rd.eachFileFilterSync(srcPath, /.*/, (path, s) => {
            let {root, dir, base, ext, name} = PATH.parse(path);

            let dpath = PATH.resolve(destDir , path.slice(dirPath.length + 1) );
            
            if(/\.(?:scss|sass)$/.test(ext)) {
                if(name.indexOf('_') !== 0) {
                    let ret = sass.renderSync({
                        file: path,
                        data: util.read(path) || '',
                        outputStyle: 'expanded',
                        indentWidth: 4
                    });

                    let plugins = [autoprefixer];
                    let content = ret.css.toString('utf8');

                    dpath = dpath.replace(/\.(?:scss|sass)$/, '.css');

                    if(config.compile.css.uglify) {
                        plugins.push(cssnano());
                    }

                    // 自动前缀级压缩
                    postcss(plugins)
                    .process(content)
                    .then(function(result) {
                        if (result.css) {
                            util.write(dpath, result.css);
                        }
                        if (result.map) {
                            util.write(dpath + '.map', result.map);
                        }
                    });
                }
            }else if(/\.js/.test(ext)) {
                if(/\.min.js/.test(ext)) {
                    util.copy(path, dpath);
                }else {
                    let result = uglifyJS.minify(path, {
                        mangle: {
                            except: ['require', 'define']
                        }
                    });
                    util.write(dpath, result.code);
                }

            }else if(/\.(?:png|jpeg|jpg|gif|bmp)/.test(ext)) {
                // 待处理
                util.copy(path, dpath);
            }else {
                util.copy(path, dpath);
            }
        });
    }
};