var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/signup', function(req, res, next) {
    res.cookie('isLoggedIn', true)
    res.redirect('/')
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
