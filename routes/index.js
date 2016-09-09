var express = require('express');
var router = express.Router();
const config = require('../knexfile.js')[process.env.DATABASE_ENV]
const knex = require('knex')(config)

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/signup', function(req, res, next) {
    res.cookie('isLoggedIn', true)
    let username = req.body.username;
    let hashed_pw = req.body.password
    knex('users').insert({username : username, hashed_pw : hashed_pw})
    .then(function(){
      res.redirect('/')
    })
})

router.post('/logout', function(req, res, next){
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
