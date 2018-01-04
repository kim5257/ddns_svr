var express = require('express');
var router = express.Router();

/* POST adduser listing. */
router.post('/', function(req, res, next) {
    console.log('in update');
    console.log(req.body);

    // DB에 IP 정보 넣기

    // bind 정보 추가

    res.send('{"result":"successed"}');
});

module.exports = router;
