var express = require('express');
var router = express.Router();






/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signin');
});


var monk  = require('monk');
var db = monk('localhost:27017/vitaminstore');

var Product = require('../models/product');

var collection = db.get('users');

var productsCollection = db.get('products');


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

router.get('/products',function(req,res,next){
  productsCollection.find({},function(err,products){
    if(err) throw err;
    res.render('index',{results:products});
  })
});


// router.get('/:id',function(req,res,next){
//   productsCollection.findOne({_id:req.params.id},function(err,product){
//     if (err) throw err;
//     res.render('show',{product:product})

//   })
// })




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

module.exports = router;
