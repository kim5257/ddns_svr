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
    // chkAddUser 과 동일
    chkAddUser(id, body, callback);
}

function chkGetUsers (offset, limit, callback)
{
    var ret = {result: 'error', msg: null};

    do
    {
        var nOffset = 0;
        var nLimit = 0;

        if ((offset == null) ||
            (limit == null))
        {
            ret.msg = '인자가 부족합니다.';
            break;
        }

        if ( isNaN(offset) ||
            isNaN(limit) )
        {
            ret.msg = '인자가 정수가 아닙니다.';
            break;
        }

        nOffset = parseInt(offset, 10);
        nLimit = parseInt(limit, 10);

        if ( isNaN(nOffset) ||
            isNaN(nLimit) )
        {
            ret.msg = '인자가 정수가 아닙니다.';
            break;
        }

        if ( (nOffset < 0) ||
            (nLimit < 0) )
        {
            ret.msg = '인자가 음수입니다.';
            break;
        }

        ret.result = 'success';
    }
    while(0);

    callback(ret);
}

function chkAddName (name, body, callback)
{
    if ( ( body.name == null ) ||
        ( body.pw == null ) )
    {
        callback({result: 'error', msg: '잘못된 형식입니다.'});
    }
    else
    {
        callback({result: 'success', msg: null});
    }
}

function chkDelName (name, body, callback)
{
    // chkAddName 과 동일
    chkAddName(name, body, callback);
}


function chkGetNames (offset, limit, callback)
{
    // chkGetUsers 과 동일
    chkGetUsers(offset, limit, callback);
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
exports.chkGetUsers = chkGetUsers;

exports.chkAddName = chkAddName;
exports.chkDelName = chkDelName;
exports.chkGetNames = chkGetNames;

exports.chkUpdate = chkUpdate;