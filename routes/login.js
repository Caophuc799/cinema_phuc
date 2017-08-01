
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {

    res.render('system/login');
});
router.get('/register', function (req, res, next) {
    res.render('system/register');
});


module.exports = router;
