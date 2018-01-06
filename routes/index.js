var express = require('express');
var nsupdate = require('../system/nsupdate');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next)
{
    nsupdate.addAddr('a','b',null);
    res.render('index', { title: 'Express' });
});

module.exports = router;
