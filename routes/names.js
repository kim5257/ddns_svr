var express = require('express');
var dbctrl = require('../system/dbctrl');
var chkfmt = require('../util/chkfmt');
var router = express.Router();

/* POST name. */
router.post('/:name', function (req, res, next) {
    console.log('POST, name: ' + req.params.name);

    chkfmt.chkAddName(req.params.name, req.body, (result) => {
       if ( result.result === 'success' )
       {
           next();
       }
       else
       {
           res.status(400).send('{"result":"error","msg":"' + result.msg + '"}');
       }
    });

}, function (req, res, next) {
    // Name 중복 확인
    dbctrl.chkDupName(req.params.name, (result) => {
        if( result.result === 'success' )
        {
            next();
        }
        else
        {
            // 에러로 결과 전달
            res.status(400).send('{"result":"error","msg":"' + result.msg + '"}');
        }
    });
}, function (req, res, next) {
    // 비밀번호 확인
    dbctrl.chkValidUser(req.body.id, req.body.pw, (result) => {
        if( result.result === 'success' )
        {
            next();
        }
        else
        {
            // 에러로 결과 전달
            res.status(400).send('{"result":"error","msg":"' + result.msg + '"}');
        }
    });
}, function (req, res) {
    // 이름 추가
    dbctrl.addName(req.params.name, req.body.id, (result) => {
        if( result.result === 'success' )
        {
            res.send('{"result":"success"}')
        }
        else
        {
            // 에러로 결과 전달
            res.status(400).send('{"result":"error","msg":"' + result.msg + '"}');
        }
    });
});

/* GET names listing. */
router.get('/', function(req, res, next) {
    console.log('GET');

    dbctrl.getNames((result) => {
        if ( result.result === 'success' )
        {
            var body = {result: 'success', data: result.data};
            res.send(JSON.stringify(body));
        }
        else
        {
            res.status(400).send('{"result":"error","msg":"' + result.msg + '"}');
        }
    });
});

module.exports = router;