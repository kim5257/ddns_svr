const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dbctrl = require('../system/dbctrl');

module.exports = () => {

    console.log('auth init');

    passport.serializeUser((user, done) => {
        console.log('serializeUser');
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        console.log('deserializeUser');
        done(null, user);
    });

    passport.use(new LocalStrategy({
        usernameField: 'admin_email',
        passwordField: 'admin_passwd',
        session: true,
        passReqToCallback: false
    }, (id, pw, done) => {
        console.log('passReq');
        dbctrl.chkValidAdmin(id, pw, (result) => {
            if (result.result === 'success') {
                done(null, id);
            }
            else {
                done(null, false, { message: result.msg});
            }
        });
    }));
}
