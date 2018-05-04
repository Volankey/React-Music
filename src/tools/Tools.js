export const  domain = "140.143.62.133";
export  const tools  =     {
    fetch :function (param) {
        // 做一些异步操作
        return new Promise((resolve, reject) => {




            let url = param.url;
            let type = param.type || "get";
            let data = param.data || {};
            let headers = param.headers || {};

            //构造表单数据
            var formData = new FormData();


            for (let key in data)
            {
                formData.append(key,param[key]);
            }
            
            //创建xhr对象
            var xhr = new XMLHttpRequest();
            //设置xhr请求的超时时间
            xhr.timeout = param.timeout || 0;
            //设置响应返回的数据格式
            xhr.responseType = param.dataType;
            //创建一个 post 请求，采用异步
            xhr.open(type, url, true);
            //构造请求头部信息
            for(let key in headers)
            {
                xhr.setRequestHeader(key, headers[key]);
            }
            //
            xhr.responseType = param.dataType || "text";
            //跨域设置
            xhr.withCredentials=param.cors||false;
            //注册相关事件回调处理函数
            xhr.onload = function(e) {
                if(this.status == 200||this.status == 304){
                    // alert(this.responseText);
                    // param.onsuccess && param.onsuccess(this.response);
                    resolve(this.response)
                }
                else {
                    reject(e,this.response);
                    // param.failed && param.failed(e,this.responseText);
                }
            };
            xhr.ontimeout = function(e) {
                // param.ontimeout && param.ontimeout(e);
                reject(e);
            };
            xhr.onerror = function(e) {
                // param.onerror && param.onerror(e);
                reject(e);
            };
            xhr.upload.onprogress = function(e) {
                param.onprogress && param.onprogress(e);
                // reject(e);
            };

            xhr.onloadend=function (e) {
                param.onloadend && param.onloadend(e);

            };
            // 调用xhr.send()方法后立即触发，若xhr.send()未被调用则不会触发此事件。
            xhr.onloadstart=function (e) {
                // param.onloadstart && param.onloadstart(e);
                // reject(e);
            };
            xhr.upload.ontimeout=function (e) {
                // param.ontimeout && param.ontimeout(e);
                reject(e);
            };
            try{
                //发送数据
                xhr.send(formData);
            }catch(e) {
                //doSomething...
                xhr.onerror();
            };
        });






    },

    setToLocal:function (key,data) {
        if(window.localStorage)
            window.localStorage.setItem(key,data);

    },
    getFromLocal:function (key) {
        if(window.localStorage)
             return window.localStorage.getItem(key);

    },
    getSinger:function (singerArray,symbol="/") {
        let singers = singerArray.map(function (singer) {
            return singer.name;
        });
        singers = singers.join(symbol);
        return singers;
    }

};

export var myplayer = (function () {
    function Player(src) {
        let audio = new Audio(src||null);
        //判断是否是第一次播放，IOS设备限制非点击的代码播放操作,解决办法是先播放一下
        //否则如果在then中进行播放操作，就无法被判定为按钮点击播放
        this.firstPlay = true;

        //判断资源是否在请求中 防止进度条跳动
        let loading = true;

        this.bufferedLen = function () {
            return audio.buffered;
        };
        this.duration = function () {
            return audio.duration;
        };

        this.pause = function () {
            audio.pause();
        };

        this.play =  function(){
            try{
                if(this.firstPlay===true){
                    if(this.src=="") this.src = "http://dl.stream.qqmusic.qq.com/xiaobai.m4a";
                    this.first_error=true;
                    audio.play();
                    audio.pause();
                    this.firstPlay=false;
                    return;
                }
                this.first_error=false;

                audio.play();
                loading=false;
            }
            catch (e){
                if(this.firstPlay===true)
                    this.firstPlay=false;
                else
                    console.log(e);
            }

        };

        // this.loadMusic = function (id) {
        //     if(firstPlay){
        //         console.log("first play");
        //         this.src = "http://dl.stream.qqmusic.qq.com/C400002ZnJAb2w8Ynn.m4a";
        //         this.play();
        //         this.pause();
        //     }
        //     //加锁,防止进度条跳动
        //     loading = true;
        //     audio.currentTime = 0;
        //     //////
        //
        //     //请求数据
        //     tools.fetch(
        //         {
        //             url:'http://'+domian+':3001/apis/vkey?id='+id,
        //             dataType:"json",
        //         }
        //     ).then(response=>{
        //
        //
        //         player.src = response.url;
        //
        //
        //         player.play();
        //
        //
        //     }).catch(e=>{
        //         // alert("播放错误");
        //     });
        // };

        this.bind = function (evt,fn) {
            // fn = fn.bind(this);
            audio.addEventListener(evt, fn, false);
        };
        this.unbind = function (evt,fn) {
            // fn = fn.bind(this);
            audio.removeEventListener(evt, fn, false);
        };
        this.currentTime = function () {
            // console.log("获取时间");
            if(loading===true) return 0;

            return  audio.currentTime;
        };
        this.setPos = function(seconds){
            if(isNaN(seconds))
                return;
            audio.currentTime = seconds;
        };

        this.src = "";
        this.relAudio = audio;
        this.timer = 0;

        function _addSetListen(obj,key,val,fn) {


            Object.defineProperty(obj, key, {
                enumerable: true, // 可枚举
                configurable: false, // 不能再define
                get: function() {

                    return val;

                },
                set: function(newVal) {
                    console.log('地址发生变化', val, ' --> ', newVal);
                    val = newVal;
                    fn && fn(newVal);
                }

            });

        }

        _addSetListen(this,"src",this.src,function (newVal) {
            console.log(newVal);
            audio.src = newVal;
        });






        // var onprogress = function () {
        //     function fn() {
        //         console.log(audio.buffered);
        //
        //         setTimeout(onprogress.bind(this),600);
        //     };
        //
        //     this.timer = setTimeout(fn,600)
        // };
        // this.bind("timeupdate",function (e) {
        //     this.onprogress && this.onprogress(e.target.currentTime);
        // });
        this.bind("error",function () {
            if(this.src!=="");
            // alert("请求错误");
        });

        this.bind("canplaythrough",function () {
            clearTimeout(this.timer);
        })


    }


    var player =  new Player();


    player.bind("canplay",()=> {
        console.log("可以播放"+player.duration());

    });




    return function () {
        return player;
    }

}());
