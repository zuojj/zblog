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

// publish blog
$ zblog build

// preview blog
$ zblog server

// publish blog to specify dir
$ zblog build -o ./output
```

## 待开发
* 编译缓存
* 资源定位
* 文件变动自动刷新

## Stack
nodejs + koa2 + markdown + ejs + sass + es6 + webpack