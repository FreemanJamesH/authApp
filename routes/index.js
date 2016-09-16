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
    let username = req.body.username;
    knex('users').whereRaw('lower(username) = ?', req.body.username.toLowerCase())
        .count()
        .first() //not sure if/why this necessary but keeping it for now
        .then(function(result) {
            if (result.count === "0") {
                res.cookie('isLoggedIn', true)
                res.cookie('username', username)
                let hashed_pw = bcrypt.hashSync(req.body.password, 8)
                knex('users').insert({
                    username: username,
                    hashed_pw: hashed_pw
                }).returning('*').then(function(results){
                }).then(function() {
                    res.redirect('/profile')
                })
            } else {
                res.redirect('/')
            }
        })
})

router.post('/login', function(req, res, next){
    let username = req.body.username
    knex('users').where('username', username)
    .first()
    .then(function(results){
        let hashedPW  = results.hashed_pw
        let inputPW = req.body.password
        let bcryptCompareResult = bcrypt.compareSync(req.body.password, results.hashed_pw)
        res.redirect('/profile')
    })
})

router.post('/logout', function(req, res, next) {
    res.clearCookie('isLoggedIn')
    res.redirect('/')
})

router.get('/login', function(req, res, next){
    res.render('login')
})


router.get('/profile', function(req, res, next) {
    if (req.cookies.isLoggedIn) {
        res.render('profile', {
            user: req.cookies.username
        })
    } else {
        res.redirect('/')
    }
})

module.exports = router;
