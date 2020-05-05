
const User = require('../models/User');

exports.login = (req, res) => {
    res.render('login');
};

exports.loginAction = (req, res) => {
    const auth = User.authenticate();

    auth(req.body.email, req.body.password, (err, result) => {

        if(!result){
            req.flash('error', 'Wrong e-mail or password!');
            res.redirect('/users/login');
            return;
        }

        req.login(result, () => {});
        req.flash('success', 'Login successufully!');
        res.redirect('/');
    });
};

exports.register = (req, res) => {
    res.render('register');
};

exports.registerAction = (req, res) => {
    const newUser = new User(req.body)
    User.register(newUser, req.body.password, (err) =>{
        if(err){
            req.flash('error', 'Occured an error. Try again later.');
            res.redirect('/');
            return;
        }

        req.flash('success', 'Successfully registred!. Go to login.');
        res.redirect('/users/login');
    });
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}