var express = require('express');
var firebase = require("firebase");
var router = express.Router();



/* GET list film listing. */
router.get('/list', function(req, res, next) {
  res.render("film/listFilm");
});



/* GET users listing. */
router.get('/detail/:id', function(req, res, next) {
  
  res.render("film/detail",{id: req.params.id});
});


/* GET users listing. */
router.get('/create', function(req, res, next) {
  res.render("film/create",{title: "create film"});
});

module.exports = router;
