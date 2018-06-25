# 在此记录一些开发中遇到的问题及个人解决方案

## ios下首次点击无法播放音乐
这是因为ios有安全限制
```
tools.fetch(
        {
            url:'http://'+domian+':3001/apis/vkey?id='+song.id,
            dataType:"json",
        }
    ).then(response=>{
        player.src = response.url;
        if(immediate==true && player.firstPlay===false){

            player.play();
            status = TYPE.STATUS_PLAYING;
        }
        else{
            status = TYPE.STATUS_PAUSE;
            player.pause();
        }

        // immediate==false?player.pause():"";


    })

```
倘若我们通过上述方式去点击按钮播放音乐是不会成功的，因为播放是在网络请求的回调任务中，与点击事件不是在同一次事件循环中

解决方法是 先给player一个失效的播放地址，一个标记变量判断是否是首次播放，是的话先在网络请求前播放失效地址的，然后再进行网络请求回调播放真正请求后的音乐地址

## 歌词滚动
采用 alloytouch.js 和 transform.js

数据格式，解析歌词文件
每一行对应数组一个元素
数组内 对象格式 

{
    time:时间,
    context:歌词
}

修改了alloytouch/alloy_touch.css文件中的line 130

```
bind(document, "touchmove", this._moveHandler);
```
因为window监听的话会影响slider的监听move事件，会造成一些问题，比如歌词上下滚动的同时还可以左右滚动slider，因为react事件机制全都是代理到document上的

修改了alloytouch/alloy_touch.css文件中的line 68

```
 function preventDefaultTest(el, exceptions) {
        //修改这个防止warning
        if(event.defaultPrevented)
            return true;
        ///
        for (var i in exceptions) {
            if (exceptions[i].test(el[i])) {
                return true;
            }
        }
        return false;
    }
```


## 服务端try_files转发
>确保在线上使用Router4 BrowserRouter方式正确渲染页面以及刷新正常

>使用browserHistory时，会创建真实的URL，处理初始/请求没有问题，但是对于跳转路由后，刷新页面或者直接访问该URL时，会发现无法正确相应，更多信息查看参考文档
```
#http://140.143.62.133/my-app-music/home
location /my-app-music/{
             try_files $uri  /my-app-music/index.html;

        }
        
location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
        {
            expires      30d;
        }

location ~ .*\.(js|css)?$
        {
            expires      12h;

        }
```


## ios下无法暂停cd动画解决办法
```
<div class="wrap">
    <img />此为转动元素
</div>
```


每次暂停，通过getComputeStyle(img).transform获取当前转动元素的transform,
然后将这个值加到他的容器元素wrap的transform中

具体例子可参考
https://codepen.io/HaoyCn/pen/BZZrLd

## 抽离vendor
> 打包过程中发现，文件其实不小，每次更改只生成成一个main.js，其实这里面包含了许多三方库，但是我们并不需要更改他们，所以应该抽离出来，改业务逻辑那么只需要业务逻辑文件的hash发生变化，react等三方库文件应该不变，对用户应用缓存加速用户二次打开速度.

![image](https://volankey.github.io/React-Music/MYLOG/vendor1.png)

![image](https://volankey.github.io/React-Music/MYLOG/vendor2.png)

## 配置P2V


```
确保安装了postcss
```
```
cnpm install postcss-px-to-viewports
```


```
module: {
        strictExportPresence: true,
        rules: [
            ...
            {
                // "oneOf" will traverse all following loaders until one will
                // match the requirements. When no loader matches it will fall
                // back to the "file" loader at the end of the loader list.
                oneOf: [
                    ...
                    // Process JS with Babel.
                    ...
                    {
                        test: /\.css$/,
                        loader: ExtractTextPlugin.extract(
                            Object.assign(
                                {
                                    fallback: {
                                        loader: require.resolve('style-loader'),
                                        options: {
                                            hmr: false,
                                        },
                                    },
                                    use: [
                                        {
                                            loader: require.resolve('css-loader'),
                                            options: {
                                                importLoaders: 1,
                                                minimize: true,
                                                sourceMap: shouldUseSourceMap,
                                            },
                                        },
                                        {
                                            loader: require.resolve('postcss-loader'),
                                            options: {
                                                // Necessary for external CSS imports to work
                                                // https://github.com/facebookincubator/create-react-app/issues/2677
                                                ident: 'postcss',

                                                plugins: () => [
                                                    require('postcss-flexbugs-fixes'),
                                                    //重点在这里
                                                    P2V({
                                                        viewportWidth: 750,     // (Number) The width of the viewport.
                                                        viewportHeight: 1334,    // (Number) The height of the viewport.
                                                        unitPrecision: 3,       // (Number) The decimal numbers to allow the REM units to grow to.
                                                        viewportUnit: 'vw',     // (String) Expected units.
                                                        selectorBlackList: ['.ignore', '.hairlines'],  // (Array) The selectors to ignore and leave as px.
                                                        minPixelValue: 1,       // (Number) Set the minimum pixel value to replace.
                                                        mediaQuery: false       // (Boolean) Allow px to be converted in media queries.
                                                    }),
                                                    autoprefixer({
                                                        browsers: [
                                                            '>1%',
                                                            'last 4 versions',
                                                            'Firefox ESR',
                                                            'not ie < 9', // React doesn't support IE8 anyway
                                                        ],
                                                        flexbox: 'no-2009',
                                                    }),
                                                ],
                                            },
                                        },
                                    ],
                                },
                                extractTextPluginOptions
                            )
                        ),
                    // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
                    },
```





