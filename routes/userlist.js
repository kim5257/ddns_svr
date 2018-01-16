var express = require('express');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next)
{
    console.log('userlist');
    http.get('http://localhost:3000/users', (userRes) => {
        if( userRes.statusCode == 200 )
        {
            var data = '';

            userRes.on('data', (chunk) => {
                data += chunk;
            }).on('end', () => {
                res.userlist = JSON.parse(data);
                next();
            });
        }
        else
        {
            res.status(503).send('Server error');
        }
    });
}, function(req, res, next) {
    console.log(res.userlist);
    res.render('userlist', { title: 'User List', userlist: res.userlist });
});

module.exports = router;
