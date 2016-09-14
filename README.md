# zblog
It is a tatic blog system based on markdown and nodejs

# operate
```
// install
$ npm install -g zblog

// help
zblog -h

// init a blog
$ zblog init newblog
$ cd newblog

// preview blog, publish to www folder
$ zblog server

// pubish blog, default: output_prod
$ zblog build
```

## Stack
nodejs + koa2 + markdown + ejs + sass + es6 + webpack