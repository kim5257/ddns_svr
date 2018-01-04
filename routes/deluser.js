var express = require('express');
var router = express.Router();

/* POST adduser listing. */
router.post('/', function(req, res, next) {
    console.log('in deluser');
    console.log(req.body);

    // DB로부터 계정정보 삭제

    // bind 정보 제거

    res.send('{"result":"successed"}');
});

module.exports = router;
