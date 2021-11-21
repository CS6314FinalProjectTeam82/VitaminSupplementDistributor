var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/vitaminstore');
var collection = db.get('users');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  collection.findOne({username:req.body.username, password:req.body.password},function(err,user){
    if(err) throw err;
    res.json(user);
   });
  // res.render('editmovie', { myID : req.params.id });
});


module.exports = router;
