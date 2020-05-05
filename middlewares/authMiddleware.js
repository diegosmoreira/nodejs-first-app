exports.isLogged = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'Opss, you don\'t have permission to access this page!');
        res.redirect('/users/login');
        return;
    }

    next();
};

exports.changePassword = (req, res) => {
    if(req.body.password != req.body['password-confirm']){
        req.flash('error', 'Passowords unmatched!');
        res.redirect('/users/profile');
        return;
    }

    req.user.setPassword(req.body.password, async ()=>{
        await req.user.save();

        req.flash('success', 'Password updated successfully');
        res.redirect('/');
    });
};