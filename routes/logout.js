var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/', function(req, res, next)
{
    req.logout();
    res.redirect('/login');
});

module.exports = router;
