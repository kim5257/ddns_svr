var express = require('express');
var dbctrl = require('../system/dbctrl');
var nsupdate = require('../system/nsupdate');
var chkfmt = require('../util/chkfmt');
var router = express.Router();

/* POST adduser listing. */
router.post('/', function(req, res, next) {
    console.log('in update');
    console.log(req.body);

    // 올바른 형식인지 확인
    chkfmt.chkUpdate(req.body, (result) => {
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

    // DB에 IP 정보 넣기
    dbctrl.addAddr(req.body.id, req.body.ip, (result) => {
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

}, function(req, res) {

    // 우선 bind 정보를 제거
    nsupdate.delAddr(req.body.id, (result) => {
        // Do nothing.
    });

    // bind 정보 추가
    nsupdate.addAddr(req.body.id, req.body.ip, (result) => {
        res.send('{"result":"successed"}');
    });
});

module.exports = router;
