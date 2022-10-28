var express = require('express');
const { response } = require('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var adminHelpers=require('../helpers/admin-helpers');


let sessions;

const adminVerify=(req,res,next)=>{
  sessions=req.session
  if(sessions.userId){
    next()
  }else{
    res.redirect('/admin/login')
  }
}

/* GET users listing. */


router.get('/login',(req,res)=>{
  sessions=req.session
  if(sessions.userId){
    res.redirect('/admin')
  }else{
    // res.render('admin/admin-login')
    res.render('admin/admin-login',{"loginErr":req.session.loginErr})
    req.session.loginErr=false

  }
})

router.post('/login',(req,res)=>{
  adminHelpers.doAdminLogin(req.body).then((response)=>{
    if(response.status){
      sessions=req.session
      sessions.userId=req.body.username

      console.log(sessions.userId)
      res.redirect('/admin')
    }else{
      console.log('admin login failed')
      req.session.loginErr="Invalid username or password"
      res.redirect('/admin/login')
    }
    
  })
})



router.get('/', adminVerify, function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products});
  })

  
});

router.get('/add-products', adminVerify, function(req,res){
  res.render('admin/add-products')
});

router.post('/add-products',(req,res)=>{
  console.log(req.body);
  console.log(req.files.image)
  //productHelpers.addProduct(req.body,(id)=>{
    productHelpers.addProduct(req.body,(id)=>{
      let image=req.files.image
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render("admin/add-products")
      }
    })
  })
})
    

router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
})

router.get('/edit-product/:id',async (req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{product})
});

router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.image){
      let image=req.files.image
      image.mv('./public/product-images/'+id+'.jpg')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect("/admin/login")
})


module.exports = router;
