/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-18 15:42:51
 * @version $Id$
 */

(function(window, undefined) {
    var iconDir = new Vue({
        el: '#app',
        methods: {
            clickIconDir: function(event) {
                var nav = document.querySelector('.simple-header-nav');
                nav.style.display = nav.style.display == 'none' ? 'block' : 'none';
            }
        }
    });
})(window);