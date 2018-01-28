var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/', function(req, res, next)
{
    res.render('login', { title: 'Login' });
});

/*
router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        console.log('err: ' + err);
        console.log('user: ' + user);
        console.log('info: ' + info);
        if ( err )
        {
            return next(err);
        }
        else if ( !user )
        {
            return res.redirect('/login');
        }

        return res.redirect('/userlist');
    })(req, res, next);
});
*/


router.post('/', function(req, res, next) {
    console.log('id: ' + req.body.admin_email);
    next();
}, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    console.log('success login');
    res.redirect('/userlist');
});


module.exports = router;
