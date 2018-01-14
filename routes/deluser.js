var express = require('express');
var dbctrl = require('../system/dbctrl');
var nsupdate = require('../system/nsupdate');
var chkfmt = require('../util/chkfmt');
var router = express.Router();

/* POST adduser listing. */
router.post('/', function(req, res, next) {
    console.log('in deluser');
    console.log(req.body);

    // 올바른 형식인지 확인
    chkfmt.chkDelUser(req.body, (result) => {
        if (result.result === 'success') {
            next();
        }
        else {
            // 에러로 결과 전달
            res.send('{"result":"error","msg":"' + result.msg + '"}');
        }
    });
}, function(req, res, next) {
    // 비밀번호 확인
    dbctrl.chkValidUser(req.body.id, req.body.pw, (result) => {
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
}, function(req, res, next) {
    // 사용자 정보 제거
    console.log(req.body);

    dbctrl.delUser(req.body.id, req.body.pw, (result) => {
        if ( result.result === 'success' )
        {
            next();
        }
        else
        {
            res.send('{"result":"error","msg":"' + result.msg + '"}');
        }
    });
}, function(req, res) {
    // bind 정보 제거
    nsupdate.delAddr(req.body.id, (result) => {
        res.send('{"result":"success"}');
    });
});

module.exports = router;
