var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/vitaminstore');
var collection = db.get('users');
var productCollection = db.get('products');
const path = require('path');
const multer  = require('multer')
var productName;
var session;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

// router.post('/login', function(req, res, next) {
//   collection.findOne({username:req.body.username, password:req.body.password},function(err,user){
//     if(err) throw err;
//     res.render('index');
//    });
// });


// Image Upload
const imageStorage = multer.diskStorage({
  destination: './public/images/', // Destination to store image 
  filename: (req, file, cb) => {
      cb(null, req.body.name + path.extname(file.originalname))
      // file.fieldname is name of the field (image), path.extname get the uploaded file extension
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
      fileSize: 10000000   // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg)$/)) {     // upload only png and jpg format
          return cb(new Error('Please upload a Image'))
      }
      cb(undefined, true)
  }
})  

// Add New Item to the products

router.get('/new', function(req, res, next) {
  res.render('addnewitem');
});

router.post('/addnew', imageUpload.single('image'), (req, res) => {
 
  var supplementfactsjson = {
    servingsize : req.body.servingsize,
    servingpercontainer: req.body.servingpercontainer
  }

  const { filename: image } = req.body.name;
  productName = req.body.name;

  var comp = [];
  var len = req.body.itemname.length;
  for(var i =0; i<len ;i++){
    var compositionjson = {
      itemname: req.body.itemname[i],
      amountperserving: req.body.amountperserving[i],
      persondailyvalue: req.body.persondailyvalue[i]
    }
    comp[i] = compositionjson;
  }
 
var dc = [];
var i = 0;
if(req.body.Gluten_Free == "on"){
     dc[i] = "Gluten Free";
     i++;
}
if(req.body.Non_GMO == "on"){
  dc[i] = "Non GMO";
  i++;
}
if(req.body.vegetarian == "on"){
  dc[i] = "Vegetarian";
  i++;
}
if(req.body.Certified_B_Corporation == "on"){
dc[i] = "Certified B Corporation";
i++;
}
if(req.body.Free_of_Artificial_Colors_Flavors == "on"){
  dc[i] = "Free of Artificial Colors/Flavors";
  i++;
}
if(req.body.Yeast_free == "on"){
dc[i] = "Yeast Free";
i++;
}
if(req.body.Corn_Free == "on"){
  dc[i] = "Corn Free";
  i++;
}
if(req.body.Dairy_Milk_Free == "on"){
  dc[i] = "Dairy/ Milk Free";
  i++;
}


var otherIngre = req.body.otheringredients.split(",");

  var product = {
    category_name : req.body.product_catgeory,
    Sku:req.body.sku,
    price:req.body.price,
    name : req.body.name,
    supplementfacts: supplementfactsjson,
    quantity : req.body.quantity,
    itemdescription : req.body.itemdescription,
    specifications : req.body.specifications,
    discalimer: req.body.discalimer,
    otheringredients: otherIngre,
    dietaryconsideration: dc,
    composition: comp,
    Image: req.body.name+".png",
    isDeleted: false
    
  }

 


  productCollection.insert(product,function(err,product){
      if(err) throw err;
      //res.send(req.file)
      res.json(product);
      
  })
});

// Edit products

router.get('/editProd', function(req, res, next) {
  // place /:id after products removed for testing 
  console.log("ID in req"+req.params.id);
 // productCollection.findOne({_id:req.params.id},function(err,product){
   //Hardcoding ID for testing 
    productCollection.findOne({_id:'61a0191f87816b0f797677c8'},function(err,product){
    if(err) throw err;
    //res.json(product);
      res.render('edititem',{product: product});
   });
});
router.post('/edit', imageUpload.single('image'), (req, res) => {
//router.post('/edit', imageUpload.single('image'),function(req, res){
  var supplementfactsjson = {
    servingsize : req.body.servingsize,
    servingpercontainer: req.body.servingpercontainer
  }

  const { filename: image } = req.body.name;
  productName = req.body.name;

  var comp = [];
  var len = req.body.itemname.length;
  for(var i =0; i<len ;i++){
    var compositionjson = {
      itemname: req.body.itemname[i],
      amountperserving: req.body.amountperserving[i],
      persondailyvalue: req.body.persondailyvalue[i]
    }
    comp[i] = compositionjson;
  }
 
var dc = [];
var i = 0;
if(req.body.Gluten_Free == "on"){
     dc[i] = "Gluten Free";
     i++;
}
if(req.body.Non_GMO == "on"){
  dc[i] = "Non GMO";
  i++;
}
if(req.body.vegetarian == "on"){
  dc[i] = "Vegetarian";
  i++;
}
if(req.body.Certified_B_Corporation == "on"){
dc[i] = "Certified B Corporation";
i++;
}
if(req.body.Free_of_Artificial_Colors_Flavors == "on"){
  dc[i] = "Free of Artificial Colors/Flavors";
  i++;
}
if(req.body.Yeast_free == "on"){
dc[i] = "Yeast Free";
i++;
}
if(req.body.Corn_Free == "on"){
  dc[i] = "Corn Free";
  i++;
}
if(req.body.Dairy_Milk_Free == "on"){
  dc[i] = "Dairy/ Milk Free";
  i++;
}


var otherIngre = req.body.otheringredients.split(",");

  productCollection.update({_id:req.body.id},{
    
    $set:{
    category_name : req.body.product_catgeory,
    Sku:req.body.sku,
    price:req.body.price,
    name : req.body.name,
    supplementfacts: supplementfactsjson,
    quantity : req.body.quantity,
    itemdescription : req.body.itemdescription,
    specifications : req.body.specifications,
    discalimer: req.body.discalimer,
    otheringredients: otherIngre,
    dietaryconsideration: dc,
    composition: comp,
    Image: req.body.name+".png",
    isDeleted: false

      }
      
  },function(err,product){
      if(err) throw err;
       res.json(product);
  })

});

//Delete API - soft delete 
router.post('/products/:id', (req, res) => {
  productCollection.update({_id:req.params.id},{
  
    $set:{
      isDeleted : true
    }
    
},function(err,product){
    if(err) throw err;
     res.json(product);
})
 
});


router.get('/upload', function(req, res, next) {
  res.render('upload');
});



// For Single image upload
router.post('/uploadImage', imageUpload.single('image'), (req, res) => {
  res.send(req.file)
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})


const bcrypt = require("bcrypt");
 // const express = require("express");
  const User = require("../models/userModel");
  //const router = express.Router();
  // signup route
  router.post("/signup", async (req, res) => {
    const body = req.body;

    if (!(body.email && body.password)) {
      return res.status(400).send({ error: "Data not formatted properly" });
    }

    // creating a new mongoose doc from user data
    const user = new User(body);
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    user.password = await bcrypt.hash(user.password, salt);
    user.save().then((doc) => res.status(201).send(doc));
  });

  // login route
  router.post("/login", async (req, res) => {
    const body = req.body;
    const user = await User.findOne({ email: body.email });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (validPassword) {
        res.render('index');
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
  });


// Add to cart

router.get('/cart', function(req, res, next) {
  res.render('cart');
});


router.get('/cart/:id/update', function(req, res, next) {
  res.render('cart');
});




module.exports = router;
