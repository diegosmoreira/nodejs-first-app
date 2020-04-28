
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const slug = require('slug');

exports.add = (req, res) =>{
    res.render('postAdd');
};

exports.addAction = async (req, res) => {

    req.body.tags = req.body.tags.split(',').map(t => t.trim());

    const post = new Post(req.body);

    try {
        await post.save();   
    } catch (error) {
        req.flash('error', 'ERROR: ' + error.message);
        
        return res.redirect('/post/add');
    }

    req.flash('success', 'Post successfully saved!');

    res.redirect('/');
};

exports.edit = async (req, res) => {
    const post = await Post.findOne({slug: req.params.slug});
    res.render('postEdit', {post});
};

exports.editAction = async (req, res) =>{

    req.body.tags = req.body.tags.split(',').map(t => t.trim());
    req.body.slug = slug(req.body.title, {lower: true});

    try {
        const post = await Post.findOneAndUpdate(
            {
                slug: req.params.slug
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );   
    } catch (error) {
        req.flash('error', 'ERROR: ' + error.message);
        
        return res.redirect('/post/'+ req.params.slug +'/edit');
    };
    
    req.flash('save', 'Post updated successfully!');
    res.redirect('/');
};