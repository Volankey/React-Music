var express = require('express');
var router = express.Router();
var request = require('request-promise');
var apis = require('../api/apis');

// function my_http(res, requset_param, ndata, _method, callback) {
//     var default_callback = function(data) {
//         return data;
//     }
//     _method = _method || "GET";
//     callback = callback || default_callback;

//      function end(error, response, redata) {
//         if (!error && response.statusCode == 200) {


//         	return redata

//         //     try {
//         //         res.send(callback(redata));
//         //     } catch ( e ) {
//         //         console.log(e);
//         //         res.send('{code:-100,mes:"非法参数"}');
//         //     }
//         // }
//         // else
//         //     res.send('{code:-100}');
//     }

//     request({
//         url: requset_param.url,
//         method: _method,
//         json: true,
//         headers: requset_param.headers,
//         body: ndata
//     },end);

// }



/* 获取热们搜索 */
router.get('/hotwords', function(req, res, next) {
    let requset_param = apis.hotwords;

    request(requset_param)
        .then(function(data) {
            res.send(data);
        })
        .catch(function(err) {
            // Crawling failed...
        });

});

/* 
	获取vkey
	需要传入歌曲的id
 */
router.get('/vkey', function(req, res, next) {
    //需要传入歌曲的id
    let requset_param = apis.vkey(req.query.id);

    console.log(requset_param);

    // res.send("hello");
    request(requset_param)
        .then(function(data) {
            let filename = data.data.items[0].filename,
                vkey = data.data.items[0].vkey;

            let url = apis.music(filename, vkey);


            res.send(url);


        })
        .catch(function(err) {
            // Crawling failed...
            res.send(err);
        });



});
/*
	获取歌词
*/
router.get('/lyric', function(req, res, next) {

    let requset_param = apis.lyric(req.query.id);

    request(requset_param)
        .then(function(data) {

            data = data.substring(18, data.length - 1);
            res.send(data);
        })
        .catch(function(err) {
            // Crawling failed...
        });




});
/*
	获取歌单
*/
router.get('/song_list', function(req, res, next) {

    let s = req.query.s||0;
    let requset_param = apis.song_list(s,req.query.e||(s+29));

    request(requset_param)
        .then(function(data) {

            //data = data.substring(18, data.length - 1);
            res.send(data);
        })
        .catch(function(err) {
            // Crawling failed...
        });




});
/*
	通过ID获取歌单内容
*/
router.get('/list_data', function(req, res, next) {

    let id = req.query.id||0,
        s  = req.query.s,
        n  = req.query.n;
    let requset_param = apis.list_data(id,s,n);

    request(requset_param)
        .then(function(data) {

            //data = data.substring(18, data.length - 1);
            res.send(data);
        })
        .catch(function(err) {
            // Crawling failed...
        });




});
router.get('/sliders', function(req, res, next) {

    
    let requset_param = apis.slider();

    request(requset_param)
        .then(function(data) {

            //data = data.substring(18, data.length - 1);
            res.send(data);
        })
        .catch(function(err) {
            // Crawling failed...
        });




});
/*
    搜索
    param:key,page,
* */
router.get('/search', function(req, res, next) {

    
    let requset_param = apis.search(req.query.k,req.query.p);

    request(requset_param)
        .then(function(data) {

            //data = data.substring(18, data.length - 1);
            res.send(data);
        })
        .catch(function(err) {
            // Crawling failed...
        });




});
/*
    获取自己收藏的歌单
*/ 
router.get('/mylist', function(req, res, next) {

    
    let requset_param = apis.my_list(req.query.u);

    request(requset_param)
        .then(function(data) {

            //data = data.substring(18, data.length - 1);
            res.send(data);
        })
        .catch(function(err) {
            // Crawling failed...
        });




});
module.exports = router;