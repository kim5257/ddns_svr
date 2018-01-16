var ip = require('ip');

function chkAddUser (id, body, callback)
{
    if ( ( body.pw == null ) )
    {
        callback({result: 'error', msg: '잘못된 형식입니다.'});
    }
    else
    {
        callback({result: 'success', msg: null});
    }
}

function chkDelUser (id, body, callback)
{
    // chkAddUser과 동일
    chkAddUser(id, body, callback);
}

function chkAddName (name, body, callback)
{
    if ( ( body.id == null ) ||
        ( body.pw == null ) )
    {
        callback({result: 'error', msg: '잘못된 형식입니다.'});
    }
    else
    {
        callback({result: 'success', msg: null});
    }
}

function chkDelName (id, body, callback)
{
    // chkAddUser과 동일
    chkDelName(id, body, callback);
}

function chkUpdate (body, callback)
{
    if ( ( body.id == null ) ||
        ( body.pw == null ) ||
        ( body.ip == null ) ||
        ( ip.isV4Format(body.ip) === false ) )
    {
        callback({result: 'error', msg: '잘못된 형식입니다.'});
    }
    else
    {
        callback({result: 'success', msg: null});
    }
}

exports.chkAddUser = chkAddUser;
exports.chkDelUser = chkDelUser;
exports.chkAddName = chkAddName;
exports.chkDelName = chkDelName;
exports.chkUpdate = chkUpdate;