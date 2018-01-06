var express = require('express');
var dbctrl = require('../system/dbctrl');
var nsupdate = require('../system/nsupdate');
var router = express.Router();

/* POST adduser listing. */
router.post('/', function(req, res, next) {
    console.log('in update');
    console.log(req.body);

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
    // bind 정보 추가
    nsupdate.addAddr(req.id, req.ip, (result) => {
        res.send('{"result":"successed"}');
    });
});

module.exports = router;
