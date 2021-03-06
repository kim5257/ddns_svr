const sqlite3 = require('sqlite3').verbose();
const sha3_512 = require('js-sha3').sha3_512;

var db = new sqlite3.Database('./db/data.db', (err) => {
    if ( err )
    {
        return console.error(err.message);
    }
    console.log('Connected to the DDNS database.');
});

var dbAdmin = new sqlite3.Database('./db/admin.db', (err) => {
    if ( err )
    {
        return console.error(err.message);
    }
    console.log('Connect to the Admin database.');
});

function toHash (pw)
{
    return sha3_512(pw);
}

function chkDupUser (id, pw, callback)
{
    var query = 'SELECT count() as user_dup_cnt FROM users'
        + ' WHERE id=\'' + id + '\';';

    console.log(query);

    db.serialize(() => {
        db.get(query, (err, row) => {
            if ( err )
            {
                console.error(err.message);
                callback({result: 'error', msg: err.message});
            }
            else
            {
                console.log('Result: ' + row);

                var userDupCnt = parseInt(row.user_dup_cnt, 10);

                if (0 < userDupCnt)
                {
                    // 에러
                    callback({result: 'error', msg: '이미 등록된 ID 입니다.'});
                }
                else
                {
                    callback({result: 'success', msg: null});
                }
            }
        });
    });
}

function chkValidUser (id, pw, callback)
{
    var query = 'SELECT ' +
        '(SELECT count() FROM users where id=\'' + id + '\') as exist,' +
        '(SELECT count() FROM users where id=\'' + id + '\' and pw=\'' + toHash(pw) + '\') as valid;'
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
    var query = 'INSERT INTO users(id, pw) VALUES(' +
        '\'' + id + '\',\'' + toHash(pw) + '\');';
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
        ' where id=\'' + id + '\' and pw=\'' + toHash(pw) + '\';';
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

function getUsers (offset, limit, searchType, searchStr, callback)
{
    var query = 'SELECT id FROM users';

    if ( ( searchType != null ) &&
        (searchStr != null ) )
    {
        query += ' WHERE ' + searchType + ' LIKE \'%' + searchStr + '%\'';
    }

    query += ' LIMIT ' + limit + ' OFFSET ' + offset + ';';

    console.log(query);

    db.serialize(() => {
        db.all(query, (err, rows) => {
            if ( err )
            {
                callback({result: 'error', msg: err.message});
            }
            else
            {
                callback({result: 'success', data: rows});
            }
        });
    });
}

function getUser (id, callback)
{
    var query = 'SELECT id FROM users WHERE id=\'' + id + '\';';

    db.serialize(() => {
        db.get(query, (err, row) => {
            if ( err )
            {
                callback({result: 'error', msg: err.message});
            }
            else if ( row == null )
            {
                callback({result: 'error', msg: '등록되지 않은 사용자입니다'});
            }
            else
            {
                console.log(row);
                callback({result: 'success', data: row});
            }
        });
    });
}

function chkDupName (name, callback)
{
    var query = 'SELECT '
        + '(SELECT count() FROM names WHERE name=\'' + name + '\') as name_dup_cnt,'
        + '(SELECT count() FROM resv_names WHERE name=\'' + name + '\') as name_resv_cnt;';
    console.log(query);

    db.serialize(() => {
        db.get(query, (err, row) => {
            if ( err )
            {
                console.error(err.message);
                callback({result: 'error', msg: err.message});
            }
            else
            {
                console.log('Result: ' + row);

                var nameDupCnt = parseInt(row.name_dup_cnt, 10);
                var nameResvCnt = parseInt(row.name_resv_cnt, 10);

                if (0 < nameDupCnt)
                {
                    // 에러
                    callback({result: 'error', msg: '이미 등록된 이름입니다.'});
                }
                else if (0 < nameResvCnt)
                {
                    // 에러
                    callback({result: 'error', msg: '예약된 이름입니다.'});
                }
                else
                {
                    callback({result: 'success', msg: null});
                }
            }
        });
    });
}

function chkValidName (name, id, pw, callback)
{
    //SELECT count() as exist_cnt
    //FROM users
    //INNER JOIN names ON users.id = names.id
    //WHERE
    //names.name='kim5257' AND
    //user.id='kjg' AND
    //users.pw='123123';

    var query = 'SELECT count() as name_exist_cnt '
        + 'FROM users '
        + 'INNER JOIN names ON users.id = names.id '
        + 'WHERE names.name=\'' + name + '\' AND '
        + 'users.id=\'' + id + '\' AND '
        + 'users.pw=\'' + toHash(pw) + '\';';

    console.log(query);

    db.serialize(() => {
        db.get(query, (err, row) => {
            if ( err )
            {
                console.error(err.message);
                callback({result: 'error', msg: err.message});
            }
            else
            {
                var nameExistCnt = parseInt(row.name_exist_cnt, 10);

                console.log('Result: ' + nameExistCnt);
                if (0 == nameExistCnt)
                {
                    // 에러
                    callback({result: 'error', msg: '등록되지 않은 이름입니다.'});
                }
                else
                {
                    callback({result: 'success', msg: null});
                }
            }
        });
    });
}

function addName (name, id, callback)
{
    var query = 'INSERT INTO names(name, id) VALUES(' +
        '\'' + name + '\',\'' + id + '\');';
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

function delName (name, callback)
{
    var query = 'DELETE FROM names' +
        ' where name=\'' + name + '\';';
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

function getNames (offset, limit, searchType, searchStr, callback)
{
    var query = 'SELECT name, id, ip, update_time FROM names';

    if ( ( searchType != null ) &&
        (searchStr != null ) )
    {
        query += ' WHERE ' + searchType + ' LIKE \'%' + searchStr + '%\'';
    }

    query += ' LIMIT ' + limit + ' OFFSET ' + offset + ';';

    console.log(query);

    db.serialize(() => {
        db.all(query, (err, rows) => {
            if ( err )
            {
                callback({result: 'error', msg: err.message});
            }
            else
            {
                callback({result: 'success', data: rows});
            }
        });
    });
}

function updateAddr (name, ip, callback)
{
    //UPDATE names
    //SET
    //ip='1.215.228.82',
    //    update_time=(select strftime('%Y%m%d%H%M%S',datetime('now','localtime')))
    //WHERE name='kim5257';
    var query = 'UPDATE names SET '
        + 'ip=\'' + ip + '\', '
        + 'update_time=(SELECT strftime(\'%Y%m%d%H%M%S\', '
        + 'datetime(\'now\',\'localtime\'))) '
        + 'WHERE name=\'' + name + '\';';
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

function chkValidAdmin ( id, pw, callback )
{
    var query = 'SELECT ' +
        '(SELECT count() FROM admins where id=\'' + id + '\') as exist,' +
        '(SELECT count() FROM admins where id=\'' + id + '\' and pw=\'' + toHash(pw) + '\') as valid;'
    console.log(query);

    dbAdmin.serialize(() => {
        dbAdmin.get(query, (err, row) => {
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

exports.chkDupUser = chkDupUser;
exports.chkValidUser = chkValidUser;
exports.addUser = addUser;
exports.delUser = delUser;
exports.getUsers = getUsers;
exports.getUser = getUser;

exports.chkDupName = chkDupName;
exports.chkValidName = chkValidName;
exports.addName = addName;
exports.delName = delName;
exports.getNames = getNames;

exports.updateAddr = updateAddr;

exports.chkValidAdmin = chkValidAdmin;
