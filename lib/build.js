/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-03 10:05:02
 * @version $Id$
 */

const PATH = require('path');
const rd   = require('rd');
const sass = require('node-sass');
const ejs        = require('ejs');
const markdownIt = require('markdown-it');
const md         = new markdownIt({
    html: true,
    langPrefix: 'language-'
});

const util = require('./util');


module.exports = function(dir, options) {
    var pages = [],
        destDir, srcDir;

    dir = dir || '.';

    destDir = PATH.resolve(options.output || dir, 'public');
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
            let cate = page.categories;
            let tag = page.tags;
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

            cate.forEach((item, index) => {
                if(item in categories) {
                    categories[item].push(page);
                }else {
                    categories[item] = [];
                }
            });

            tag.forEach((item, index) => {
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



    function parse_markdown(path) {
        let markdown, mdInfo, mdContent, page = {};

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

        page.timestamp = new Date(page.date);
        page.year = page.timestamp.getFullYear();
        page.month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][page.timestamp.getMonth()];
        page.url = '/archives/' + path.slice(srcDir.length + 1).replace(/\\/g, '/').replace(/\.md$/, '.html') ;

        page.path = path;
        page.body = md.render(mdContent || '');
        return page;
    }

    function generate_archive(page) {
        let html, path;

        page.layout = page.layout || 'archive';

        html = ejs.render(util.read(PATH.resolve(dir, '_layout', page.layout + '.ejs')), {
            config: util.config,
            page: page,
            filename: PATH.resolve(dir, '_layout', 'widget', page.layout + '.ejs')
        });

        path = page.path.replace(/_archives/, 'public/archives').replace(/.md$/, '.html');

        util.write(path, html);
    }


    function generate_archives(archives) {
        let html, path;

        html = ejs.render(util.read(PATH.resolve(dir, '_layout', 'archives.ejs')), {
            config: util.config,
            archives: archives,
            filename: PATH.resolve(dir, '_layout', 'widget', 'archives.ejs')
        });

        path = PATH.resolve(destDir, 'archives', 'index.html');
        util.write(path, html);
    }

    function generate_index(pages) {
        let html;

        html = ejs.render(util.read(PATH.resolve(dir, '_layout', 'index.ejs')), {
            config: util.config,
            pages: pages,
            filename: PATH.resolve(dir, '_layout', 'widget', 'index.ejs')
        });

        path = PATH.resolve(destDir, 'index.html');

        util.write(path, html);
    }

    function generate_categories(categories) {
        let html, path;

        html = ejs.render(util.read(PATH.resolve(dir, '_layout', 'categories.ejs')), {
            config: util.config,
            categories: categories,
            filename: PATH.resolve(dir, '_layout', 'widget', 'categories.ejs')
        });

        path = PATH.resolve(destDir, 'categories', 'index.html');
        util.write(path, html);
    }

    function generate_tags(tags) {
        let html, path;

        html = ejs.render(util.read(PATH.resolve(dir, '_layout', 'tags.ejs')), {
            config: util.config,
            tags: tags,
            filename: PATH.resolve(dir, '_layout', 'widget', 'tags.ejs')
        });

        path = PATH.resolve(destDir, 'tags', 'index.html');
        util.write(path, html);
    }

    function generate_about() {
        let html, path;

        html = ejs.render(util.read(PATH.resolve(dir, '_layout', 'about.ejs')), {
            config: util.config,
            filename: PATH.resolve(dir, '_layout', 'widget', 'about.ejs')
        });

        path = PATH.resolve(destDir, 'about', 'index.html');
        util.write(path, html);
    }

    function generate_css() {
        let cssSrcPath  = PATH.resolve(dir, 'static', '_scss');

        rd.eachFileFilterSync(cssSrcPath, /.*/, (path, s) => {
            let basename = PATH.basename(path),
                pos,
                filename = (pos = basename.indexOf('.')) > -1 ? basename.substring(0, pos) : basename;
                destPath = path.replace('_scss', 'css');

            // 非scss/sass文件，拷贝
            if(!/\.(?:scss|sass)/.test(basename)) {
                util.copy(path, destPath);
            }else {
                if(basename.indexOf('_') !== 0) {
                    let ret = sass.renderSync({
                        file: path,
                        data: util.read(path) || '',
                        outputStyle: 'expanded',
                        indentWidth: 4
                    });

                    let content = ret.css.toString('utf8');
                    
                    util.write(destPath.replace(/\.(?:scss|sass)/, '.css'), content);
                }
            }
        });
    }
};