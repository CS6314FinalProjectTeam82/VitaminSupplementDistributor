var express = require('express');
var router = express.Router();
var monk  = require('monk');
var db = monk('localhost:27017/vitaminstore');
var Product = require('../models/product');
var collection = db.get('users');
var accCollection = db.get('accounts');
var productsCollection = db.get('products');
var orderCollection = db.get('orderDetails');


const path = require('path');
const multer  = require('multer')
var productName;
var session;
var passport = require('passport');
var Account = require('../models/account');
var LocalStrategy = require('passport-local').Strategy;


router.get('/addnew', function(req, res, next) {
  res.render('addnewitem');
});

// Add New Item to the products

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

router.post('/addNew', imageUpload.single('image'), (req, res) => {
 
  console.log(" I am in add New");
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
    is_Deleted: false
    
  }


  productsCollection.insert(product,function(err,product){
      if(err) throw err;
      res.redirect('/adminproducts');
      
  })
});

router.get('/confirmation', function(req,res, next){
  res.render('confirmation');
});



router.get('/continueshopping', function(req,res, next){
  res.redirect('/products/1');
});

router.get('/', function(req, res, next) {
    res.render('signin');
  });
  
  
  router.get('/register', function(req, res) {
    res.render('signin', {});
  });
  

  router.get('/checkout',function(req,res,next){
    res.render('checkout');;
});


router.get('/orderHistory',function(req,res,next){
    var userObj = req.user;
    console.log("In orderHistory"+userObj.username);

    orderCollection.find({user_id:userObj.username},function(err,orders){

        if(err) throw err;
        console.log(orders);
        res.render('orderhistory',{orders:orders});
        
    })

});


router.post('/addOrder',function(req,res,next){

    var Username = req.user.username;

    accCollection.findOne({username:Username},function(err,user){
        if(err) throw err;
        
        var orderItems = [];

        var cartItems = user.cart_items;

        var shippingAddress = {
            fullname :req.body.fullName,
            address : req.body.address,
            zipcode: req.body.zipcode,
            city: req.body.city,
            country: req.body.country
        }

        console.log("The full Name is ****** " + shippingAddress.fullname);
        
        for(var i=0;i<cartItems.length;i++){
            orderItems.push(cartItems[i]);
        }

        var orderItemDoc = {

            user_id:Username,
            order_id : Date.now(),
            order_items:orderItems,
            shipping_address: shippingAddress,
            date : new Date().toLocaleDateString()
        
        }
        orderCollection.insert(orderItemDoc,function(err,product){
            if(err) throw err;
            
        })
        
        res.render('confirmation');
    })

});


router.post('/register', function(req, res) {

    Account.register(new Account({ username : req.body.username, firstName : req.body.firstName, lastName: req.body.lastName,
  
      mobile_number: req.body.mobile_number, is_admin : false }), req.body.password, function(err, account) {
  
      if (err) {
  
        console.log(err);
        return res.send("<script> alert('User Already Exist'); window.location =  '/login'; </script>")
  
        //return res.render('signin', { account : account });
  
      }
  
   
  
      passport.authenticate('local')(req, res, function () {
  
        res.redirect('/login');
  
      });
  
  });
  
  });
  
   
  
  router.get('/login', function(req, res) {
  
    res.render('login');
  
  });
  
   
  
  router.post('/login', passport.authenticate('local'), function(req, res) {
  
    console.log("I am "+ req.user.is_admin);
  
    if(req.user.is_admin)
  
    res.redirect('/adminproducts');
  
    else res.redirect('/products/1');
  
   
  
  });
  
   
  
  router.get('/logout', function(req, res) {
  
    req.logout();
  
    res.redirect('/login');
  
  });
  
   
  
  passport.serializeUser(function(account, done) {
  
    done(null, account.id);
  
  });
  
   
  
  passport.deserializeUser(function(id, done) {
  
    Account.findById(id, function(err, account) {
  
      done(err, account);
  
    });
  
  });


  router.get('/cartDetails',function(req,res,next){
    var userName = req.user.username;
    console.log("The user is " + userName);
    var cartItems;
    
    accCollection.findOne({username : userName},function(err,account){
        if(err) throw err;
        cartItems = account.cart_items;
        res.render('cart',{results : cartItems });
    })

})


router.get('/adminproducts',function(req,res,next){
  productsCollection.find({is_Deleted: false},function(err,products){
    if(err) throw err;
    res.render('adminindex',{results:products});
  })
});

router.get('/:id',function(req,res,next){
  productsCollection.findOne({_id:req.params.id},function(err,product){
    if (err) throw err;
    res.render('show',{product:product})

  })
})

router.get('/admin/:id',function(req,res,next){
  productsCollection.findOne({_id:req.params.id},function(err,product){
    if (err) throw err;
    res.render('adminshow',{product:product})

  })
})




router.post('/search', (req, res) => {

  if(req.body.productName == "" && req.body.categoryName == ""){
    res.redirect('/products/1');
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


// Edit products
router.get('/editProd/:id', function(req, res, next) {
  
  console.log("ID in req"+req.params.id);
 
   productsCollection.findOne({_id:req.params.id},function(err,product){
    if(err) throw err;
   
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

productsCollection.update({_id:req.body.id},{
    
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
    is_Deleted: false

      }
      
  },function(err,product){
      if(err) throw err;
   
      res.redirect('/adminproducts')
  })

});

//Delete API - soft delete 
router.post('/:id/delete', (req, res) => {
  productsCollection.update({_id:req.params.id},{
  
    $set:{
      is_Deleted : true
    }
    
},function(err,product){
    if(err) throw err;
    // res.json(product);
    res.redirect('/adminproducts')
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



  router.get('/login', function(req, res, next) {
    res.render('login');
  });
  


// Add to cart

router.get('/cart', function(req, res, next) {
  res.render('cart');
});


router.get('/cart/:id/update', function(req, res, next) {
  res.render('cart');
});



router.get('/:id/addtocart',function(req,res,next){
    var Username = req.user.username;
    productsCollection.findOne({_id:req.params.id},function(err,product){
        if(err) throw err;
        result = product;

        var cartItem = {
            id:result._id,
            sku:result.Sku,
            name:result.name,
            price:result.price,
            image:result.Image
        
        }
        console.log("The name is" + cartItem.name);
        accCollection.update({username:Username},{
          
        
            $addToSet: { cart_items: cartItem } 
                
            },function(err,product){
                if(err) throw err;     
        })
        res.redirect('/products/1');
    })

})


router.get('/removeCartItem/:id',function(req,res,next){
    var userName = req.user.username;
    var cartItemSku= req.params.id ;

    console.log("In remove cart item");
    
    



    console.log("The user is" + userName);
    console.log("The sku is " + cartItemSku);
    
    accCollection.findOneAndUpdate({username:userName},
        {$pull: {cart_items: {sku:cartItemSku}}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
            console.log(err);
            }
        }
    );
    res.redirect('/cartDetails');
    

})




function pagination(req, res, next) {
  var perPage = 3
  var page = req.params.page || 1
  console.log("In in products/page")
  Product
      .find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function(err, products) {
      
        Product.count().exec(function(err, count) {
              if (err) return next(err)
             //res.json(products);
              res.render('index', {
                  products: products,
                  current: page,
                  pages: Math.ceil(count / perPage)
              })
          })
      })
}




router.get('/products/:page',function(req,res,next){
  pagination(req, res, next);


});



module.exports = router;