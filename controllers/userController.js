const User = require('../models/User');
const crypto = require('crypto');
const mailHandler = require('../handlers/mailHandler');

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
};

exports.profile = (req, res) => {
    res.render('profile');
};

exports.profileAction = async (req, res) => {
    
    try{
        const user = await User.findOneAndUpdate(
            {_id: req.user._id},
            {name: req.body.name, email: req.body.email},
            {new: true, runValidators: true}
        );
    }catch (error){
        req.flash('error', 'Occurred an error: ' + error.message);
        res.redirect('/users/profile');
        return;
    }

    req.flash('success', 'Updated successfully');
    res.redirect('/users/profile');
};

exports.forget = (req, res) => {
    res.render('forget');
};

exports.forgetAction = async (req, res) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        req.flash('error', 'We sent an e-mail for you!');
        res.redirect('/users/forget');
        return;
    }

    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; //1 hour
    await user.save();

    const resetLink = `http://${req.headers.host}/users/reset/${user.resetPasswordToken}`;
    const to = `${user.name} <${user.email}>`;
    const html = `Access follow link to reset your password</br><a href="${resetLink}">Reset</a>`;
    const text = `Access follow link to reset your password ${resetLink}`;

    mailHandler.send({
        to,
        subject: 'Reset password',
        html,
        text
    });

    req.flash('success', 'We sent an email for you with instructions');
    res.redirect('/users/login');

};

exports.forgetToken = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()}
    }).exec();

    if(!user){
        req.flash('error', 'Token expired');
        res.redirect('/users/forget');
        return;
    }

    res.render('forgetPassword');
};

exports.forgetTokenAction = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()}
    }).exec();

    if(!user){
        req.flash('error', 'Token expired');
        res.redirect('/users/forget');
        return;
    }

    if(req.body.password != req.body['password-confirm']){
        req.flash('error', 'Passwords unmatched!');
        res.redirect('back');
        return;
    }

    user.setPassword(req.body.password, async ()=>{
        await user.save();

        req.flash('success', 'Password updated successfully');
        res.redirect('/');
    });
}