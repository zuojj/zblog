# zblog
It is a tatic blog system based on markdown and nodejs

# Operate
```bash
// install
$ npm install -g zblog

// help
zblog -h

// init a blog
$ zblog init newblog

// change to newblog
$ cd newblog

/* 以下命令需要在newblog目录下操作 */

// publish blog
$ zblog build

// preview blog
$ zblog server start

// stop server
$ zblog server stop

// open server directory
$ zblog server open

// publish blog to specify directory
$ zblog build -o ./output

// create a new article
$ zblog new filename
```

## 待实现
* 实现资源定位
* 实现编译缓存
* 实现基本代码检测
* 实现hash戳
* 完善默认配置及合并处理
* 完善commander命令行
* 完善日志处理