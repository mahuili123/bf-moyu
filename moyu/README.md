# gulp空白项目
##### 如何使用
    //开发使用
    gulp
    
    //该命令运行的任务
    delTemp: 删除临时目录.tmp
    devWiredep：载入bower资源, 
    devFileinclude：替换公共模板
    devSvg：按目录拼贴svg
    devJshint：js校检
    以及实时监测文件变化，自动刷新浏览器
    
    //打包使用
    gulp b
    //该命令运行一下任务
    buildWiredep：载入bower资源
    buildUseref：处理模板中的css和js文件，处理文件的合并和压缩，并生成sourcemap
    buildSvg：按目录拼贴svg
    buildFileinclude：替换公共模板
    buildCss：生成min css
    buildJs：生成min js
    buildSourcemaps：复制Sourcemaps到dist目录
    buildFromapp：复制不需要处理的文件到dist目录
    buildFavicon：复制ico到dist目录
    creatFile：生成配置文件
    delBuild：删除临时目录 .build
    
    //其他
    gulp bs
    //以http方式查看build过后的效果

##### config配置文件说明

    {
        "folders": {
            "app": "app", //项目目录
            "temp": ".tmp", //临时文件目录
            "dist": "dist", //打包目录
            "inc": "inc", //公共模板目录
            "static": "static", //静态资源目录(css, js, image等前端资源)
			"sourcemaps": "sourcemaps", //sourcemap保存目录 [dist/sourcemaps] 子目录的结构与static一致
            "ignore": ["plugins"] //忽略目录列表（该目录下文件不做处理）
        },
        "server": { //http环境配置
            "dev": { //开发环境
                "port": 9000, //端口号
                "notify": false,
                "scrollProportionally": false,
                "server": {
                    "baseDir": [], //根目录，默认会把app和.tmp加进去
                    "index": "index.html", //首页文件
                    "routes": { //路由配置 key是请求地址，val是转发地址
                        "/bower_components": "bower_components",
    					"/search/list/": "app/static/data/succ.json" //前面是线上接口地址，后面是本地模拟数据，本地开发非常方便
                    }
                }
            },
            "dist": { //打包环境 routes将和dev下的routes一致
                "port": 9001,
                "notify": false,
                "scrollProportionally": false,
                "server": {
                    "baseDir": [], //根目录，默认会把dist加进去
                    "index": "index.html"
                }
            }
        },
        "fileinclude": { //模板替换配置
            "prefix": "<!--@@ ", //前缀
            "suffix": " -->", //后缀
            "basepath": "@file", //这个一般不用变，根目录
            "context": {
                "sitename": "意思通 estorm.cn", //站点名称
                "separator": " - " //<title></title>分隔符
            }
        },
		"config_static": { //配置文件相关配置
			"file_name": "config.json", //配置文件名 dist/static/config.json 
			"api_name": "api.json",	//接口配置文件名 dist/static/api.json
			"host": "http://www.estorm.cn/", //静态资源域名 （暂未做处理）
			"dev": ["http://localhost:9000/", "http://192.168.81.78:9000/", "http://www.estorm.cn:9000/"] //开发环境域名配置，联合js_debug线上线下调试功能
		}
    }


##### 项目中所使用的插件
nodejs，gulp，bower

gulp插件

    "browser-sync": "^2.12.5", //http服务以及自动刷新功能
    "del": "^2.2.0", //删除
    "fs": "0.0.2", //文件
    "gulp": "^3.9.1",
    "gulp-changed": "^1.3.0", //只有修改过的文件能通过
    "gulp-clean-css": "^2.0.7", //css min
    "gulp-concat": "^2.6.0", //多文件拼贴
    "gulp-file-include": "^0.13.7", //替换公共模板
    "gulp-if": "^2.0.1", //条件执行
    "gulp-jshint": "^2.0.0", //js校检
    "gulp-load-plugins": "^1.2.2", //自动载入gulp插件，不用var require 以$.的方式使用
    "gulp-newer": "^1.1.0", //未用
    "gulp-rename": "^1.2.2", //重命名
    "gulp-sourcemaps": "^1.6.0", //sourcemaps
    "gulp-svg-symbols": "^1.0.0", //拼贴svg
    "gulp-uglify": "^1.5.3", //js混淆压缩
    "gulp-useref": "^3.1.0", //从html模板中提取合并css和js文件
    "jshint": "^2.9.2", //jshint
    "jshint-stylish": "^2.2.0", //校检结果展示
    "lazypipe": "^1.0.1", //这个不知道怎么说了 反正挺好用
    "map-stream": "0.0.6", //遍历流，可以处理任何文件
    "merge-stream": "^1.0.0", //异步合并任务
    "path": "^0.12.7", //文件路径
    "wiredep": "^4.0.0" //bower辅助

