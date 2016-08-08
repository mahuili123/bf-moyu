(function(){
    'use strict';
    var gulp = require('gulp');
    var $ = require('gulp-load-plugins')();
    var browserSync = require('browser-sync').create();
    var reload = browserSync.reload;
    var map = require('map-stream');
    var del = require('del');
    var wiredep = require('wiredep').stream;
    var merge = require('merge-stream');
    var path = require('path');
    var fs = require('fs');
    var lazypipe = require('lazypipe');
    //处理配置参数
    var ConfigData = function(){
        var self = this;
        var data = require('./config.json');

        //初始化数据
        this.init = function(){
            data.server.dev.server.baseDir.unshift(self.getFolders('temp'), self.getFolders('app'));
            data.server.dist.server.baseDir.unshift(self.getFolders('dist'));
            data.server.dist.server.routes = data.server.dev.server.routes;
        };

        //获取接口配置
        this.getRoots = function(){
            return data.server.dev.server.routes;
        };

        //获取文件夹名
        this.getFolders = function(type){
            var folders = data.folders;
            var temp = folders[type];
            var res = typeof(temp) === 'string' ? temp +'/' : temp;
            return res;
        };

        this.getIgnore = function(suffix){
            var app = self.getFolders('app');
            var ignore = self.getFolders('ignore');
            var res = [];
            for(var i in ignore){
                res.push('!'+ app + '**/' + ignore[i] +'/**/*.'+ suffix);
            }
            return res;
        };

        //获取模板html文件
        this.getHtmlFile = function(hasInc, prev){
            var app = prev ? prev : self.getFolders('app');
            var ignore = self.getIgnore('html');
            var src = [app +'**/*.html'];
            if(hasInc === false){
                src.push('!'+ app + self.getFolders('inc') +'**/*.html')
            }
            for(var i in ignore){
                src.push(ignore[i]);
            }
            return src;
        };

        //公共html模块
        this.getIncHtml = function(){
            return self.getFolders('app') + self.getFolders('inc') +'**/*.html';
        };

        //获取fileinclude配置
        this.getFileinclude = function(){
            return data.fileinclude;
        };

        //获取browserSync配置
        this.getServer = function(type){
            return data.server[type];
        };

        //js文件
        this.getJsFile = function(prev){
            var res = [];
            var prefix = prev ? prev : self.getFolders('app');
            var ignore = self.getIgnore('js');
            prefix = prefix + self.getFolders('static');
            res[0] = prefix +'**/*.js';
            for(var i in ignore){
                res.push(ignore[i]);
            }
            return res;
        };

        //css文件
        this.getCssFile = function(prev){
            var res = [];
            var prefix = prev ? prev : self.getFolders('app');
            var ignore = self.getIgnore('css');
            prefix = prefix + self.getFolders('static');
            res[0] = prefix +'**/*.css';
            for(var i in ignore){
                res.push(ignore[i]);
            }
            return res;
        };

        //配置文件
        this.getConfigStatic = function(){
            return data.config_static;
        };

        //初始化
        this.init();
    };
    var config = new ConfigData();
    var dist = config.getFolders('dist');
    var app = config.getFolders('app');
    var temp = config.getFolders('temp');
    var resource = config.getFolders('static');
    var html = config.getHtmlFile(false); //页面模板 不包含inc和ignore下的html文件
    var js = config.getJsFile(); //js文件 不包含ignore下的js文件
    var css = config.getCssFile(); //js文件 不包含ignore下的js文件
    var dev = {
        html: null
    };
    var build = {
        temp: '.build/'
    };
    var svg = resource +'images/svg/';
    var act = {
        getFolders: function(dir){
            var res = [];
            if(fs.existsSync(dir)){
                res =  fs.readdirSync(dir)
                    .filter(function(file) {
                        return fs.statSync(path.join(dir, file)).isDirectory();
                    });
            }
            return res;
        },
        zeroFill: function(num){
            return parseInt(num) < 10 ? '0'+ num : num.toString();
        },
        formatDate: function(timestamp){
            var tt = timestamp ? parseInt(timestamp) : new Date().getTime();
            var date = new Date(tt);
            var year = date.getFullYear();
            var mon = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();
            var res = act.zeroFill(year) +'/'+ act.zeroFill(mon) +'/'+ act.zeroFill(day) +' '+ act.zeroFill(hour) +':'+ act.zeroFill(min) +':'+ act.zeroFill(sec);
            return res;
        }
    };


    //替换所有公共模板
    dev.fileinclude = function(){
        return gulp.src(html)
            .pipe($.fileInclude(config.getFileinclude()))
            .pipe(gulp.dest(temp))
            .pipe(reload({ stream: true }));
    };
    gulp.task('devFileinclude', dev.fileinclude);

    //单个模板
    dev.fileincludeSingal = function(){
        if(!dev.html){
            return false;
        }
        return gulp.src(path.relative(__dirname, dev.html),{ base: app})
            .pipe($.changed(temp))
            .pipe($.fileInclude(config.getFileinclude()))
            .pipe(gulp.dest(temp))
            .pipe(reload({ stream: true }));
    };
    gulp.task('devFileincludeSingal', dev.fileincludeSingal);

    //jshint
    dev.jshint = function(){
        return gulp.src(js)
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish'))
            .pipe(reload({ stream: true }));
    };
    gulp.task('devJshint', dev.jshint);

    //bower资源管理
    dev.wiredep = function(){
        return gulp.src(config.getIncHtml())
            .pipe(wiredep({
                exclude: [],
                ignorePath: /^(\.\.\/)*\.\./
            }))
            .pipe(gulp.dest(app + config.getFolders('inc')));
    };
    gulp.task('devWiredep', dev.wiredep);

    //svg合并
    dev.svg = function(){
        var svgFolders = app + svg;
        var saveFolders = temp + svg;
        var folders = act.getFolders(svgFolders);
        var tasks = folders.map(function(folder) {
            var src = [path.join(svgFolders, folder, '/*.svg')];
            var dist = path.join(saveFolders);
            return gulp.src(src)
                .pipe($.changed(dist))
                .pipe($.svgSymbols({
                    id: 'svgicon-%f',
                    templates: ['default-svg']
                }))
                .pipe(map(function(file, cb){
                    file.path = 'icon_svg_'+ folder +'.svg';
                    cb(null, file);
                }))
                .pipe(gulp.dest(dist))
                .pipe(reload({ stream: true }));
       });
       if(tasks.length > 0){
           return merge(tasks);
       }
    };
    gulp.task('devSvg', dev.svg);

    //开发环境 http服务
    gulp.task('server', ['devWiredep', 'devFileinclude', 'devSvg', 'devJshint'], function(){
        browserSync.init(config.getServer('dev'));
        //监听文件变化

        //公共模板
        gulp.watch(config.getIncHtml(), ['devFileinclude']);

        //除公共模板外的资源
        gulp.watch(html, function(event){
            dev.html = event.path;
            gulp.start('devFileincludeSingal');
        });

        //无需处理的资源
        gulp.watch([app + resource +'**/*.{jpg,png,gif,json,css,txt,html}'], reload);

        //js文件的处理
        gulp.watch(js, ['devJshint']);
    });

    //删除临时文件目录
    gulp.task('delTemp', function(){
        del([temp]).then(function(){
            gulp.start('server');
        }, function(){
            console.log('删除'+ temp +'目录失败！');
        });
    });

    /*********** Build Task ***********/

    //bower资源管理
    build.wiredep = function(){
        var f = app + config.getFolders('inc');
        return gulp.src(config.getIncHtml())
            .pipe($.changed(f))
            .pipe(wiredep({
                exclude: [],
                ignorePath: /^(\.\.\/)*\.\./
            }))
            .pipe(gulp.dest(f));
    };
    gulp.task('buildWiredep', build.wiredep);

    //useref
    build.useref = function(){
        return gulp.src(config.getHtmlFile(true))
            .pipe($.useref({
                searchPath: ['./', temp, app]
            }, lazypipe().pipe($.sourcemaps.init, {loadMaps: false})))
            .pipe($.sourcemaps.write(config.getFolders('sourcemaps'), {includeContent: false}))
            .pipe(gulp.dest(build.temp));
    };
    gulp.task('buildUseref', ['buildWiredep'], build.useref);

    //svg合并
    build.svg = function(){
        var svgFolders = app + svg;
        var saveFolders = dist + svg;
        var folders = act.getFolders(svgFolders);
        var tasks = folders.map(function(folder) {
            var src = [path.join(svgFolders, folder, '/*.svg')];
            var dist = path.join(saveFolders);
            return gulp.src(src)
                .pipe($.changed(dist))
                .pipe($.svgSymbols({
                    id: 'svgicon-%f',
                    templates: ['default-svg']
                }))
                .pipe(map(function(file, cb){
                    file.path = 'icon_svg_'+ folder +'.svg';
                    cb(null, file);
                }))
                .pipe(gulp.dest(dist))
                .pipe(reload({ stream: true }));
       });
       if(tasks.length > 0){
           return merge(tasks);
       }
    };
    gulp.task('buildSvg', build.svg);

    //html模板
    build.fileinclude = function(){
        var bhtml = config.getHtmlFile(false, build.temp);
        return gulp.src(bhtml)
            .pipe($.changed(dist))
            .pipe($.fileInclude(config.getFileinclude()))
            .pipe(gulp.dest(dist));
    };
    gulp.task('buildFileinclude', build.fileinclude);

    //css
    build.css = function(){
        var f = dist + resource;
        return gulp.src(config.getCssFile(build.temp))
            .pipe($.changed(f))
            .pipe(gulp.dest(f))
            .pipe($.rename(function(file){
                file.basename = file.basename + '.min';
            }))
            .pipe($.cleanCss())
            .pipe(gulp.dest(f));
    };
    gulp.task('buildCss', build.css);

    //js
    build.js = function(){
        var f = dist + resource;
        return gulp.src(config.getJsFile(build.temp))
            .pipe($.changed(f))
            .pipe(gulp.dest(f))
            .pipe($.rename(function(file){
                file.basename = file.basename + '.min';
            }))
            .pipe($.uglify())
            .pipe(gulp.dest(f));
    };
    gulp.task('buildJs', build.js);

    //sourcemaps
    build.sourcemaps = function(){
        var f = dist + config.getFolders('sourcemaps');
        return gulp.src(build.temp + config.getFolders('sourcemaps') +'**/*.map')
            .pipe($.changed(f))
            .pipe(gulp.dest(f));
    };
    gulp.task('buildSourcemaps', build.sourcemaps);

    //不需要处理的资源
    build.fromapp = function(){
        var f = dist + resource;
        return gulp.src(app + resource +'**/*.{eot,ttf,woff,woff2,gif,png,jpg,jpeg,bmp,json}')
            .pipe($.changed(f))
            .pipe(gulp.dest(f));
    };
    gulp.task('buildFromapp', build.fromapp);

    //favicon
    build.favicon = function(){
        return gulp.src(app +'favicon.ico')
            .pipe($.changed(dist))
            .pipe(gulp.dest(dist));
    };
    gulp.task('buildFavicon', build.favicon);

    gulp.task('buildAfterUseref', ['buildUseref'], function(){
        gulp.start('buildFileinclude');
        gulp.start('buildCss');
        gulp.start('buildJs');
        gulp.start('buildSourcemaps');
    });

    //生成配置文件
    gulp.task('creatFile', ['buildFavicon', 'buildFromapp', 'buildSvg', 'buildAfterUseref'], function(){
    //gulp.task('creatFile', function(){
        var f = dist + resource;
        var d = config.getConfigStatic();
        var api = f + d.api_name;
        var apiContent = JSON.stringify(config.getRoots(), null, 4);
        var configFile = f + d.file_name;
        var sourcemaps = dist + config.getFolders('sourcemaps') + resource;
        var configFileData = d;
        var replacePrev = function(str){
            var res = str.replace(/^(\.\.\/)+/, '');
            return res;
        };
        var readPath = function(filePath){
            var fileDir = sourcemaps + filePath;
            var files = fs.readdirSync(fileDir);
            var len = files.length;
            var res = {};
            for(var i=0; i<len; i++){
                var data = fs.readFileSync(fileDir + files[i]);
                data = JSON.parse(String(data));

                var key = data.file.replace(/\.(js|css)$/, '.min.$1');
                key = replacePrev(key);

                var sources = [];
                for(var j=0; j<data.sources.length; j++){
                    sources[j] = replacePrev(data.sources[j]);
                }

                res[key] = {
                    "ori": replacePrev(data.file),
                    "concat": sources
                }
            }
            return res;
        };
        configFileData.js = readPath('scripts/');
        configFileData.css = readPath('styles/');
        configFileData.update = act.formatDate();

        fs.writeFile(api, apiContent, 'utf-8', function(err){
            if(err){
                console.log('写入'+ api +'文件失败！');
            } else {
                console.log('写入'+ api +'文件成功！');
            }
        });

        fs.writeFile(configFile, JSON.stringify(configFileData, null, 4), 'utf-8', function(err){
            if(err){
                console.log('写入'+ configFile +'文件失败！');
            } else {
                console.log('写入'+ configFile +'文件成功！');
            }
        });
    });

    //Build
    gulp.task('build', ['creatFile']);

    //删除临时文件目录
    gulp.task('delBuild', function(){
        del([build.temp]).then(function(){
            gulp.start('build');
        }, function(){
            console.log('删除'+ build.temp +'目录失败！');
        });
    });

    //build http服务
    gulp.task('bs', ['delBuild'], function(){
        browserSync.init(config.getServer('dist'));
    });

    gulp.task('default', ['delTemp']);
    gulp.task('b', ['delBuild']);
}());
