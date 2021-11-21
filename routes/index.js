var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signin');
});


var monk  = require('monk');
var db = monk('localhost:27017/vitaminstore');

var collection = db.get('users');


router.post('/user',function(req,res,next){
  var user = {
    username : req.body.email,
    password:req.body.password,
    fname:req.body.firstName,
    lname : req.body.lastName,
  }


  collection.insert(user,function(err,user){
      if(err) throw err;
      res.json(user);

  })

});



module.exports = router;
