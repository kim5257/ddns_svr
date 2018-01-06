const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./db/data.db', (err) => {
    if ( err )
    {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});


function chkDupUser (id, pw, callback)
{
    var query = 'SELECT count() as cnt FROM users ' +
        'where id=\'' + id + '\';';
    console.log(query);

    db.serialize(() => {
        db.get(query, (err, row) => {
            if ( err ) {
                console.error(err.message);
            }

            console.log('Result: ' + parseInt(row.cnt, 10));
            if (0 < parseInt(row.cnt, 10))
            {
                // 에러
                callback({result: 'error', msg: '이미 등록된 ID입니다.'});
            }
            else
            {
                callback({result: 'success', msg: null});
            }
        });
    });
}

function chkValidUser (id, pw, callback)
{
    var query = 'select ' +
        '(SELECT count() FROM users where id=\'' + id + '\') as exist,' +
        '(SELECT count() FROM users where id=\'' + id + '\' and passwd=\'' + pw + '\') as valid;'
    console.log(query);

    db.serialize(() => {
        db.get(query, (err, row) => {
            if ( err ) {
                console.error(err.message);
            }

            var exist = parseInt(row.exist, 10);
            var valid = parseInt(row.valid, 10);

            console.log('Result: ' + exist + ', ' + valid);
            if ( 0 < valid )
            {
                callback({result: 'success', msg: null});
            }
            else if ( 0 < exist )
            {
                // 에러
                callback({result: 'error', msg: '올바르지 않은 비밀번호입니다.'});
            }
            else
            {
                // 에러
                callback({result: 'error', msg: '등록되지 않은 사용자입니다.'});
            }
        });
    });
}

function addUser (id, pw, callback)
{
    var query = 'INSERT INTO users VALUES(' +
        '\'' + id + '\',\'' + pw + '\');';
    console.log(query);

    db.serialize(() => {
        db.run(query, (err) => {
            if ( err )
            {
                console.log(err.message);
                callback({result: 'error', msg: err.message});
            }
            else
            {
                callback({result: 'success', msg: null});
            }
        });
    });
}

function delUser (id, pw, callback)
{
    var query = 'DELETE FROM users' +
        ' where id=\'' + id + '\';';
    console.log(query);

    db.serialize(() => {
        db.run(query, (err) => {
            if ( err )
            {
               console.log(err.message);
               callback({result: 'error', msg: err.message});
            }
            else
            {
               callback({result: 'success', msg: null});
            }
        });
    });
}

function addAddr (id, ip, callback)
{
    // INSERT INTO bind_info(id, ip, update_time)
    // VALUES('kjg', '8.8.8.8',
    //  (select strftime('%Y%m%d%H%M%S',datetime('now','localtime')))
    var query = 'INSERT INTO bind_info(id, ip, udpate_time) '
        + 'VALUES(\'' + id + '\',\'' + ip + '\','
        + '(SELECT strftime(\'%Y%m%d%H%M%S\', '
        + 'datetime(\'now\',\'localtime\')));';

    db.serialize(() => {
        db.run(query, (err) => {
            if ( err )
            {
                console.log(err.message);
                callback({result: 'error', msg: err.message});
            }
            else
            {
                callback({result: 'success', msg: null});
            }
        });
    });
}

exports.chkDupUser = chkDupUser;
exports.chkValidUser = chkValidUser;
exports.addUser = addUser;
exports.delUser = delUser;
exports.addAddr = addAddr;
