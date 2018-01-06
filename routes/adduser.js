var express = require('express');
var dbctrl = require('../system/dbctrl');
var chkfmt = require('../util/chkfmt');
var router = express.Router();

/* POST adduser listing. */
router.post('/', function(req, res, next) {
    console.log('in adduser');
    console.log(req.body);

    // 올바른 형식인지 확인
    chkfmt.chkAddUser(req.body, (result) => {
        if (result.result === 'success') {
            next();
        }
        else {
            // 에러로 결과 전달
            res.send('{"result":"error","msg":"' + result.msg + '"}');
        }
    });
}, function(req, res, next) {
    // ID 중복 확인
    dbctrl.chkDupUser(req.body.id, req.body.pw, (result) => {
        if( result.result === 'success' )
        {
            next();
        }
        else
        {
            // 에러로 결과 전달
            res.send('{"result":"error","msg":"' + result.msg + '"}');
        }
    });
}, function (req, res) {
    // 사용자 정보 추가
    console.log(req.body);

    dbctrl.addUser(req.body.id, req.body.pw, (result) => {
        if ( result.result === 'success' )
        {
            res.send('{"result":"success"}')
        }
        else
        {
            res.send('{"result":"error","msg":"' + result.msg + '"}');
        }
    });
});

module.exports = router;
