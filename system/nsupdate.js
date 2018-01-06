var exec = require('child_process').exec;

function addAddr (id, ip, callback)
{
    // nsupdate를 사용하여 추가

    // (echo "update add test2.freeddns.io 10 A 8.8.8.8";echo send;) \
    // | nsupdate

    var cmd = 'echo "update add ' + id + '.freeddns.io '
        + '10 A ' + ip + '"; echo send;) '
        + '| nsupdate';
    console.log(cmd);

    exec(cmd, function(error, stdout, stderr){
        console.log(stdout);
        console.log(stderr);

        if( error )
        {
            console.error(error.message);
            callback({result: 'error', msg: err.message});
        }
        else
        {
            callback({result: 'success', msg: null});
        }
    });
}

function delAddr (id, callback)
{
    // nsupdate를 사용하여 제거

    var cmd = 'echo "update del ' + id + '.freeddns.io '
        + 'A"; echo send;) '
        + '| nsupdate';
    console.log(cmd);

    exec(cmd, function(error, stdout, stderr){
        console.log(stdout);
        console.log(stderr);

        if( error )
        {
            console.error(error.message);
            callback({result: 'error', msg: err.message});
        }
        else
        {
            callback({result: 'success', msg: null});
        }
    });
}

exports.addAddr = addAddr;
exports.delAddr = delAddr;
