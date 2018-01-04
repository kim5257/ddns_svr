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
    var ret = null;
    var query = 'SELECT count() as cnt FROM users ' +
        'where id=\'' + id + '\';';
    console.log(query);

    db.serialize(() => {
        db.get(query, (err, row) => {
            if (err) {
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

function addUser (id, pw, callback)
{
    var ret = null;
    var query = 'INSERT INTO users VALUES(' +
        '\'' + id + '\',\'' + pw + '\');';
    console.log(query);

    db.serialize(() => {
        db.run(query, (err) => {
            if (err) {
                console.log(err.message);
                callback({result: 'error', msg: err.message});
            }
            else {
                callback({result: 'success', msg: null});
            }
        });
    });
}

exports.chkDupUser = chkDupUser;
exports.addUser = addUser;
