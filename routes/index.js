var express = require('express');
var router = express.Router();
var monk  = require('monk');
var db = monk('localhost:27017/vitaminstore');
var Product = require('../models/product');
var collection = db.get('users');
var productsCollection = db.get('products');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signin');
});


// router.post('/user',function(req,res,next){
//   var user = {
//     username : req.body.email,
//     password:req.body.password,
//     fname:req.body.firstName,
//     lname : req.body.lastName,
//   }


//   collection.insert(user,function(err,user){
//       if(err) throw err;
//       res.json(user);

//   })

// });

router.get('/products',function(req,res,next){
  productsCollection.find({},function(err,products){
    if(err) throw err;
    res.render('index',{results:products});
  })
});


router.get('/:id',function(req,res,next){
  productsCollection.findOne({_id:req.params.id},function(err,product){
    if (err) throw err;
    res.render('show',{product:product})

  })
})




router.post('/search', (req, res) => {

  if(req.body.productName == "" && req.body.categoryName == ""){
    res.redirect('/products');
  }

  else if(req.body.categoryName == ""){


    productsCollection.find({name:{'$regex':req.body.productName}},function(err,products){
      if(err) throw err;
      res.render('index',{results:products});
    });
  }
  else if(req.body.productName == ""){
    productsCollection.find({category_name : {'$regex':req.body.categoryName}},function(err,products){
      if(err) throw err;
      res.render('index',{results:products});

    });
  }
  else{


    productsCollection.find({name:{'$regex':req.body.productName}, category_name: {'$regex':req.body.categoryName}},function(err,products){

      if(err) throw res.render('error',{message: err});
      res.render('index',{results:products});
      });
    
  }

});


// router.get('/videos', function(req, res, next) {


//   collection.find({},function(err,videos){
//       if(err) throw err;
//       res.render('index',{results : videos});
//   })
// });



// router.get('/generate-fake-data', function(req, res, next) {
//   for (var i = 0; i < 90; i++) {
//       var product = new Product()

//       product.category = faker.commerce.department()
//       product.name = faker.commerce.productName()
//       product.price = faker.commerce.price()
//       product.cover = faker.image.image()

//       product.save(function(err) {
//           if (err) throw err
//       })
//   }
//   res.redirect('/add-product')
// })



// router.get('/products/:page', function(req, res, next) {
//   var perPage = 5
//   var page = req.params.page || 1

//   Product
//       .find({})
//       .skip((perPage * page) - perPage)
//       .limit(perPage)
//       .exec(function(err, products) {
//           Product.count().exec(function(err, count) {
//               if (err) return next(err)

              

//               res.render('showpagination', {
//                   products: products,
//                   current: page,
//                   pages: Math.ceil(count / perPage)
//               })
//           })
//       })
// })









// router.get('/posts', async (req, res) => {
//   // destructure page and limit and set default values
//   const { page = 1, limit = 5 } = req.query;

//   try {
//     // execute query with page and limit values
//     const posts = await Product.find({})
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .exec(function(err, products) {
//         Product.count().exec(function(err, count) {
//             if (err) return next(err)

//             res.render('showpagination',{
//               products: products,
                

//             })

//             // res.render('showpagination', {
//             //     products: products,
//             //     current: page,
//             //     pages: Math.ceil(count / perPage)
//             // })
//         })
//     });

    // get total documents in the Posts collection 
    // const count = await Product.countDocuments();





    // // return response with posts, total pages, and current page
    // res.json({
    //   posts,
    //   totalPages: Math.ceil(count / limit),
    //   currentPage: page
    // });
  // 


  router.get('/shop/:page', async (req, res, next) => {
    
    const resPerPage = 9; // results per page
    const page = req.params.page || 1; // Page 
    try {

      var foundProducts =  await Product.find({})
      .skip((resPerPage * page) - resPerPage)
      .limit(resPerPage);

      numOfProducts =  await Product.count(); 
      
      console.log("numProds" + numOfProducts);

    
    
      
      var results = {products: foundProducts[0], 
        currentPage: page, 
        pages: Math.ceil(numOfProducts / resPerPage), 
        numOfResults:numOfProducts

      }

    //res.json(results);
    res.render('shop',{ results :results})
    
    
    } catch (err) {
      throw new Error(err);
    }
    });



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
    user.save().then(
      res.render('login')
      
      );
  });

  router.get('/login', function(req, res, next) {
    res.render('login');
  });
  


  // login route
  router.post("/authenticate", async (req, res) => {
    const body = req.body;
    const user = await User.findOne({ email: body.email });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(body.password, user.password);
      console.log(validPassword);
      if (validPassword) {
        //res.status(200).json({ good: " Password" });
        res.redirect('/products');
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
