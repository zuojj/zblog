# zblog
It is a static blog system based on markdown and nodejs

## Installation

``` bash
$ npm install -g zblog
```

## Usage

``` bash
$ zblog -h
```

Usage: zblog [options] [command]

Commands:

help                         显示使用帮助
init [options] [dir]         创建一个新的博客
server [dir]                 实时预览
build [options] [dir]        生成静态HTML
new [options] [articleName]  新建一篇文章

Options:

-h, --help     output usage information
-V, --version  output the version number


> Init a blog
``` bash
$ zblog init <blog-folder-name>
```
Example:

``` bash
$ zblog init myFirstBlog
```

> Build a blog
``` bash
$ cd myFirstBlog
$ zblog build 
```

> Local preview
``` bash
$ cd myFirstBlog
$ zblog server start
$ zblog server stop
```

> Open build folder
``` bash
$ cd myFirstBlog
$ zblog server open
```

> Production Release
``` bash
$ cd myFirstBlog
$ zblog build -o ./output-prod
```

> Create a new article
``` bash
$ cd myFirstBlog
$ zlog new <file-name>
```
