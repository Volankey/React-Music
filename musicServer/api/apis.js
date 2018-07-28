
var apis = {
    hotwords: {
        url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=1861985466&loginUin=935196116&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0',
        json: true,
    },
    vkey: function(id) {
        var url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=1861985466loginUin=935196116&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&cid=205361747&uin=935196116&songmid=' + id + '&filename=C400' + id + '.m4a&guid=762918212'

        return {
            url,
            json: true
        }

    },
    music: function(filename, vkey) {
        var url = 'http://dl.stream.qqmusic.qq.com/' + filename + '?vkey=' + vkey + '&guid=762918212&uin=935196116&fromtag=66'

        return {
            url
        };
    },
    lyric: function(id) {
        var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?pcachetime=1522638474031&songmid=' + id + '&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&nobase64=1'

        return {
            url,
            headers: {
                "authority": "c.y.qq.com",
                "referer": "https://y.qq.com/portal/player.html",
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
            }
        }
    },
    song_list: function(s,e) {
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg?picmid=1&rnd=0.8235565278566634&g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&categoryId=10000000&sortId=5&sin='+s+'&ein='+e;

        return {
            url,
            headers: {
                "authority": "c.y.qq.com",
                "referer": "https://y.qq.com/portal/player.html",
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
            }
        }
    },
    list_data:function(id,s=0,song_num=15){
        // let end  = e || s+15;
        // console.log(s,end);
        var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&new_format=1&pic=500&disstid='+id+'&type=1&json=1&utf8=1&onlysong=0&picmid=1&nosign=1&song_begin='+s+'&song_num='+song_num+'&_=1523770538867';
        return {
            url,
            headers: {
                "authority": "c.y.qq.com",
                "referer": "https://y.qq.com/portal/player.html",
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
            }
        }
    },
    slider:function(){
        var url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=1376878852&uin=935196116&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1524186977706';
        return {
            url,
            headers: {
                "authority": "c.y.qq.com",
                "referer": "https://y.qq.com/portal/player.html",
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
            }
        }
    },
    search:function(key,page){
        var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&w='+encodeURIComponent(key)+'&zhidaqu=1&catZhida=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&perpage=20&n=20&p='+page+'&remoteplace=txt.mqq.all&_=1524549397065'

        return {
            url,
            headers: {
                "origin":"https://y.qq.com",
                "authority": "c.y.qq.com",
                "referer": "https://y.qq.com/m/index.html",
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
            }
        }
    },
    my_list:function(uid){
        var url = 'https://c.y.qq.com/rsc/fcgi-bin/fcg_user_created_diss?hostuin='+uid+'&sin=0&size=32&r=1524910080639&g_tk=1041727935&loginUin=56228105&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0';
        return {
            url,
            headers: {
                "authority": "c.y.qq.com",
                "referer": "https://y.qq.com/portal/player.html",
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
            }
        }
    }


}
module.exports = apis;