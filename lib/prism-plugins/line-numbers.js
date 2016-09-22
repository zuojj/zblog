const Prism = require('prismjs');

Prism.highlight_linenum = function(code, grammer, language) {
    let html     = Prism.highlight(code, grammer, language);
    let match    = html.match(/\n(?!$)/g);
    let linesNum = match ? match.length + 1 : 1;
    let lines    = new Array(linesNum + 1);
    let result   = [];

    result.push('<span class="line-numbers-rows">');
    result.push(lines.join('<span></span>'));
    result.push('</span>');

    return html + result.join('');
};

module.exports = Prism;