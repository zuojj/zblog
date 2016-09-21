/**
 *
 * @authors Benjamin (zuojj.com@gmail.com)
 * @date    2016-09-02 23:20:13
 * @version $Id$
 */

const PATH   = require('path');
const fset   = require('fs-extra');
const md5    = require('md5');
const rd     = require('rd');
const moment = require('moment')();
const iconv  = require('iconv-lite');
const child_process = require('child_process');
const tmpPath = PATH.resolve(__dirname, '../', '\.zblog-tmp');

module.exports =  {

    tmpPath: tmpPath,

    www: PATH.resolve(tmpPath, 'www'),

    pid: PATH.resolve(tmpPath, 'server/pid'),

    /**
     * [isWin 是否是windows]
     * @type {Boolean}
     */
    isWin: process.platform.indexOf('win') === 0,

    /**
     * [exsits 路径是否存在]
     * @type {function}
     */
    exsits: fset.existsSync,

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
    write: function(path, content, noLog) {
        try {
            !noLog && console.log('[info] Generate file [%s]', path);
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
     * [escapeShell shell编码转义]
     * @param  {[type]} cmd [description]
     * @return {[type]}     [description]
     */
    escapeShell: function(cmd) {
        return '"' + cmd + '"';
    },

    /**
     * [server_info 输出服务器信息]
     * @return {[type]} [description]
     */
    server_info: function() {
        return require('./config')().server;
    },

    /**
     * [server_pid setter/getter pid]
     * @return {[type]} [description]
     */
    server_pid: function(value) {
        let me = this;
        let path = PATH.resolve(tmpPath, 'server/pid');

        if(arguments.length) {
            return value ? me.write(path, value, true) : me.remove(path);
        }else {
            return me.exsits(path) ? me.read(path) : 0;
        }
    },

    /**
     * [server_check_pid 检查进程pid是否存在]
     * @param  {[type]}   pid      [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    server_check_pid: function(pid, callback) {
        let list,
            msg = '',
            me = this,
            spawn = child_process.spawn;

        list = me.isWin ? spawn('tasklist') : spawn('ps', ['-A']);

        list.stdout.on('data', function(data) {
            msg += data.toString('utf-8').toLowerCase();
        });

        list.on('exit', function() {
            var flag = false;

            msg.split(/[\r\n]+/).forEach(function(item) {
                if (process.platform !== 'darwin') {
                    let m = item.match(/\d+/);

                    if (m && m[0] == pid) {
                        flag = true;
                    }
                }
            });

            callback(flag);
        });

        list.on('error', function(e) {
            console.error(
                me.isWin
                ? 'fail to execute `tasklist` command, please add your system path (eg: C:\\Windows\\system32, you should replace `C` with your system disk) in %PATH%'
                : 'fail to execute `ps` command.'
            );
        });
    },

    /**
     * [server_start 开启服务]
     * @return {[type]} [description]
     */
    server_start: function() {
        let me = this,
            server = me.server_info(),
            address = server.protocol + '://' + server.hostname + ':' + server.port;

        me.open(address, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            me.server_pid(process.pid);

            console.log(`[info] open page ${address} in ${server.browser} on process ${process.pid}`);
        });
    },
    /**
     * [server_stop 停止服务]
     * @return {[type]} [description]
     */
    server_stop: function(callback) {
        let me = this;
        let pid = me.server_pid();

        if(!pid) {
            console.log('[Warning] The server is not runing.');
            return;
        }
        me.server_check_pid(pid, (exist) => {
            if(exist) {
                // 关闭进程
                me.isWin
                ? child_process.exec('taskkill /PID ' + pid + ' /T /F')
                : process.kill(pid, 'SIGTERM');

                (function(done) {
                    let start = Date.now();
                    let timer = setTimeout(function() {
                        let fn = arguments.callee;
                        me.server_check_pid(pid, function(exist) {
                            if (exist) {
                                // 实在关不了，强制关闭。
                                if (Date.now() - start > 5000) {
                                    try {
                                        me.isWin ?
                                            child_process.exec('taskkill /PID ' + pid + ' /T /F') :
                                            process.kill(pid, 'SIGKILL');
                                    } catch (e) {
                                        // I dont care the error.
                                    }

                                    clearTimeout(timer);
                                    timer = null;
                                    done();
                                    return;
                                }
                                timer = setTimeout(fn, 500);
                            } else {
                                done();
                            }
                        });
                    }, 20);
                })(function() {
                    console.log('[Info] Shutdown with pid [%s]', pid);
                    me.server_pid(0);
                });
            }else {
                console.log('[Warning] The server is not runing.');
            }
        });
    },

    /**
     * [server_clean 清空服务器www目录]
     * @return {[type]} [description]
     */
    server_clean: function() {
        let me = this;
        let now = Date.now();

        process.stdout.write('\n');
        me.remove(me.server_info().root);

        process.stdout.write('clean success:' + (Date.now() - now + 'ms'));
    },

    /**
     * [server_open 打开服务器目录]
     * @return {[type]} [description]
     */
    server_open: function() {
        let me = this;
        let server = me.server_info();

        me.open(server.root);
    },

    /**
     * [open 打开命令]
     * @param  {String}   path     [路径]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    open: function(path, callback) {
        let me = this;
        let cmd = me.escapeShell(path);

        if (me.isWin) {
            cmd = 'start "" ' + cmd;
        } else {
            // GNU/Linux
            if (process.env['XDG_SESSION_COOKIE'] ||
                process.env['XDG_CONFIG_DIRS'] ||
                process.env['XDG_CURRENT_DESKTOP']) {
                cmd = 'xdg-open ' + cmd;
            } else if (process.env['GNOME_DESKTOP_SESSION_ID']) {
                cmd = 'gnome-open ' + cmd;
            } else {
                cmd = 'open ' + cmd;
            }
        }

        child_process.exec(cmd, callback);
    },

    /**
     * [readJSON 读取JSON文件]
     * @param  {String} path [文件路径]
     * @return {Object}      [JSON对象]
     */
    readJSON: function(path) {
        let content = this.read(path), result = {};

        try {
            result = JSON.parse(content);
        } catch(e) {
            console.log('parse json file[%s] fail, error [%s]', path, e.message);
        }
        return result;
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
     * [md5 生成指定位数MD5串]
     * @param  {String} data [文件内容]
     * @param  {Number} len  [长度，default: 7]
     * @return {String}      [md5串]
     */
    md5: function(data, len) {
        let str = md5(data);

        len = len || 7;
        return str.substring(0, len);
    }
};
