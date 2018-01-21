var express = require('express');
var dbctrl = require('../system/dbctrl');
var chkfmt = require('../util/chkfmt');
var router = express.Router();

/* POST user. */
router.post('/:id', function (req, res, next) {
    console.log('POST, id: ' + req.params.id);

    chkfmt.chkAddUser(req.params.id, req.body, (result) => {
        if (result.result === 'success')
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
    // ID 중복 확인
    dbctrl.chkDupUser(req.params.id, req.body.pw, (result) => {
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
    // 사용자 정보 추가
    dbctrl.addUser(req.params.id, req.body.pw, (result) => {
        if ( result.result === 'success' )
        {
            res.send('{"result":"success"}')
        }
        else
        {
            res.status(400).send('{"result":"error","msg":"' + result.msg + '"}');
        }
    });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    chkfmt.chkGetUsers(req.query.offset, req.query.limit, (result) => {
        if (result.result === 'success') {
            next();
        }
        else {
            res.status(400).send('{"result":"error","msg":"' + result.msg + '"}');
        }
    });
}, function(req, res, next) {
    var offset = parseInt(req.query.offset);
    var limit = parseInt(req.query.limit);

    dbctrl.getUsers(offset, limit, (result) => {
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

/* GET user. */
router.get('/:id', function(req, res, next) {
  dbctrl.getUser(req.params.id, (result) => {
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

/* DELETE user. */
router.delete('/:id', function(req, res, next) {
    console.log('DELETE, id: ' + req.params.id);
    console.log('body: ' + req.body.pw);

    chkfmt.chkDelUser(req.params.id, req.body, (result) => {
        if (result.result === 'success') {
            next();
        }
        else {
            // 에러로 결과 전달
            res.status(400).send('{"result":"error","msg":"' + result.msg + '"}');
        }
    });
}, function (req, res, next) {
    // 비밀번호 확인
    dbctrl.chkValidUser(req.params.id, req.body.pw, (result) => {
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
    // 사용자 정보 제거
    dbctrl.delUser(req.params.id, req.body.pw, (result) => {
        if ( result.result === 'success' )
        {
            res.send('{"result":"success"}');
        }
        else
        {
            res.status(400).send('{"result":"error","msg":"' + result.msg + '"}');
        }
    });
});

module.exports = router;
