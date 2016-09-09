var express = require('express');
var router = express.Router();
const config = require('../knexfile.js')[process.env.DATABASE_ENV]
const knex = require('knex')(config)
const bcrypt = require('bcrypt')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/signup', function(req, res, next) {
    res.cookie('isLoggedIn', true)
    let username = req.body.username;
    knex('users').whereRaw('lower(username) = ?', req.body.username.toLowerCase())
        .count()
        .first() //not sure if/why this necessary but keeping it for now
        .then(function(result) {
            if (result.count === "0") {
                let hashed_pw = bcrypt.hashSync(req.body.password, 8)
                console.log('user: ', username, hashed_pw)
                knex('users').insert({
                    username: username,
                    hashed_pw: hashed_pw
                }).returning('*').then(function(results){
                    console.log(results)
                }).then(function() {
                    res.redirect('/profile')
                })
            } else {
                console.log('already there');
                res.redirect('/')
            }
        })
})

router.post('/logout', function(req, res, next) {
    console.log('Posted to logout')
    res.clearCookie('isLoggedIn')
    res.redirect('/')
})

router.get('/profile', function(req, res, next) {
    console.log('Reading cookies...', res.cookies);
    if (req.cookies.isLoggedIn) {
        res.render('profile', {
            user: 'Tom Hardcody'
        })
    } else {
        res.redirect('/')
    }
})

module.exports = router;
