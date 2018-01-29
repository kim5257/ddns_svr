var express = require('express');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if ( req.isAuthenticated() )
    {
        console.log('Info: ' + req.user);
        next();
    }
    else
    {
        res.redirect('/login');
    }
}, function(req, res, next)
{
    console.log('Name list');

    var page = (req.query.page!=null)?(req.query.page):(0);
    var limit = (req.query.limit!=null)?(req.query.limit):(10);
    var paginationCnt = 10; // 페이지 표시 갯수는 10개로 지정

    var reqOffset = parseInt(page / paginationCnt) * (paginationCnt * limit);
    var reqLimit = (limit * paginationCnt) + 1;

    console.log('page: ' + reqOffset);
    console.log('limit: ' + reqLimit);

    var usersUrl = 'http://localhost:3000/names?'
        + 'offset=' + reqOffset + '&limit=' + reqLimit;

    if ( ( req.query.searchType != null ) &&
        ( req.query.searchStr != null ) )
    {
        usersUrl += '&searchType=' + req.query.searchType
            + '&searchStr=' + req.query.searchStr;
    }

    http.get(usersUrl, (userRes) => {
        var buffer = '';

        userRes.on('data', (chunk) => {
            buffer += chunk;
        }).on('end', () => {
            var totalData = JSON.parse(buffer);
            var start = (page % paginationCnt) * limit;
            var end = start + Number(limit);
            var nameList = totalData.data.slice(start, end);
            var totalCnt = totalData.data.length;

            console.log(start + ', ' + end + ', ' + page);

            if( userRes.statusCode == 200 )
            {
                res.data = {    result: totalData.result,
                    name_list: nameList,
                    total_cnt: totalCnt,
                    page: page,
                    limit: limit,
                    pagination_cnt: paginationCnt,
                    searchType: req.query.searchType,
                    searchStr: req.query.searchStr,
                    user: req.user
                };
                next();
            }
            else
            {
                res.status(503).send('Server error: ' + data.msg);
            }
        });
    });
}, function(req, res, next) {
    res.render('namelist', { title: 'Name List', data: res.data });
});

module.exports = router;
