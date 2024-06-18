const User       = require('../../model/userModel')
const argon2     = require('argon2')
const userHelper = require('../../helpers/user.helper')
const Product    = require('../../model/productModel')
const Category   = require('../../model/categoryModel')
const Banners    = require('../../model/banner')
const Review      = require('../../model/review')
const Order      = require('../../model/order')
const { log } = require('handlebars')


let otp
let userOtp
let hashedPassword
let userRegData
let otpError = ''
let isLogedin = false
let userData
let userEmail
let productSearched = false
let message2 


//To load home

// const loadHome = async(req, res)=>{


   
//    try {
//     const loadProData = await Product.find({is_blocked: false}).limit(8).lean()
//     const loadCatData = await Category.find({isListed:true}).lean()
//     const banners     = await Banners.find().lean()


//     const user = req.session.user
//     let  userData = user
//     if(user){
//         const userId = user._id
//         userData = await User.findById(userId).lean()
//     }




//     res.render('user/home',{userData, loadProData, loadCatData, banners})
    
//    } catch (error) {
//     console.log(error);
//    }
// }


const loadHome = async (req, res) => {
  try {
    // Fetch products that are not blocked
    const loadProData = await Product.aggregate([
      {
        $match: { is_blocked: false }
      },
      {
        $limit: 8
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          imageUrl: 1
        }
      }
    ]);

    // Fetch categories that are listed
    const loadCatData = await Category.aggregate([
      {
        $match: { isListed: true }
      },
      {
        $project: { _id: 1, category: 1 }
      }
    ]);

    // Fetch all banners
    const banners = await Banners.aggregate([
      {
        $project: {
          _id: 1,
          title: 1,
          imageUrl: 1
        }
      }
    ]);

    // Fetch user data if session user exists
    const userId = req.session.user?._id;
    let userData = req.session.user;
    if (userId) {
      userData = await User.findById(userId).lean();
    }

    res.render('user/home', {
      userData,
      loadProData,
      loadCatData,
      banners
    });

  } catch (error) {
    console.log(error);
    // Handle error appropriately
    res.status(500).send("Internal Server Error");
  }
};


//All product page


// const getProduct = async (req, res) => {


//     try {
//         let page = 1; // Initial page is always 1 for the GET request
//         const limit = 6;
//         const loadCatData = await Category.find({isListed:true}).lean();
//         const proData = await Product.find({ is_blocked: false })
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .populate('category', 'category')
//             .lean();
//         const newProduct = await Product.find({is_blocked: false})
//             .sort({_id:-1})
//             .limit(3)
//             .lean();
//         const count = await Product.countDocuments({ is_blocked: false });
//         const totalPages = Math.ceil(count / limit);
//         const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

//         const user = req.session.user
//         let  userData = user
//         if(user){
//             const userId = user._id
//             userData = await User.findById(userId).lean()
//         }

//         res.render('user/products', {
//             proData,
//             newProduct,
//             pages,
//             currentPage: page,
//             userData,
//             loadCatData,
//             currentFunction: 'getProductsPage',
//             count
            
//         });
//     } catch (error) {
//         console.log(error);
//     }
// };

const getProduct = async (req, res) => {
    try {
      let page = 1; // Initial page is always 1 for the GET request
      const limit = 6;
  
      // Fetch categories that are listed
      const loadCatData = await Category.aggregate([
        {
          $match: { isListed: true }
        },
        {
          $project: { _id: 1, category: 1 }
        }
      ]);
  
      // Fetch products with category information and pagination
      const proData = await Product.aggregate([
        {
          $match: { is_blocked: false }
        },
        {
          $skip: (page - 1) * limit
        },
        {
          $limit: limit
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: "$category"
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            imageUrl: 1,
            category: "$category.category"
          }
        }
      ]);
  
      // Fetch newest products
      const newProduct = await Product.aggregate([
        {
          $match: { is_blocked: false }
        },
        {
          $sort: { _id: -1 }
        },
        {
          $limit: 3
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: "$category"
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            imageUrl: 1,
            category: "$category.category"
          }
        }
      ]);
  
      // Count total number of products for pagination
      const count = await Product.countDocuments({ is_blocked: false });
      const totalPages = Math.ceil(count / limit);
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
      // Fetch user data if session user exists
      const userId = req.session.user?._id;
      let userData = req.session.user;
      if (userId) {
        userData = await User.findById(userId).lean();
      }
  
      res.render('user/products', {
        proData,
        newProduct,
        pages,
        currentPage: page,
        userData,
        loadCatData,
        currentFunction: 'getProductsPage',
        count
      });
  
    } catch (error) {
      console.log(error);
      // Handle error appropriately
      res.status(500).send("Internal Server Error");
    }
  };
  

const getProductsPage = async (req, res) => {

    try {
        const page = parseInt(req.body.page); // Get the page number from the POST request
        const limit = 6;
        const proData = await Product.find({ is_blocked: false })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('category', 'category')
            .lean();
        const count = await Product.countDocuments({ is_blocked: false });
        const totalPages = Math.ceil(count / limit);
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

        const user = req.session.user
        let  userData = user
        if(user){
            const userId = user._id
            userData = await User.findById(userId).lean()
        }

        res.json({
            proData,
            pages,
            currentPage: page,
            currentFunction: 'getProductsPage',
            count
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//Product details page


const ProductView = async(req, res)=>{


    try {
      const proId = req.query.id
      const proData = await Product.findById(proId).populate('category', 'category').lean()
      await Product.updateOne(
        {
            _id: proId
        },
        {
            $inc:{
                popularity:1
            }
        }
    )

    const reviews = await Review.find({productId: proId}).lean()


        let reviewExist = true
        if(reviews.length == 0){
            reviewExist = false
        }
        let userCanReview = false;
    



    const user = req.session.user
    let  userData = user
    if(user){
        const userId = user._id
        userData = await User.findById(userId).lean()
        const Orders = await Order.find({userId :userId , status: "Delivered"},{product:1,_id:0})
        for(let i of Orders){
            
            for(let j of i.product){

                if(j.name == proData.name){

                    userCanReview = true
                }
            }
        }



    }
    

      if (userData) {
        res.render('user/productview', {proData, userData, reviews, reviewExist, userCanReview})
      }else{
        res.render('user/productview', {proData, reviews, reviewExist})    
      }
    } catch (error) {
        console.log(error);
    }
}


const addNewReviewPost = async(req, res) => {
    try {
        const userData = req.session.user
        const id       = userData._id
        
        const review = new Review({
            userId      : id,
            productId   : req.body.proId,
            name        : req.body.name,
            // rating      : req.body.rating,
            comment     : req.body.comment, 
            email       : req.body.email,
            // date        : Date.now, 
            is_default  : false,
        })

        const reviewData = await review.save()

        res.redirect(`/productview?id=${req.body.proId}`)
       
    } catch (error) {
        console.log(error);
    }
}


//user login page


const userLogin = (req, res)=>{

    let regSuccessMsg = 'User registered sucessfully..!!'
    let blockMsg      = 'Sorry something went wrong..!!'
    let mailErr       = 'Incorrect email or password..!!'
    let newpasMsg     = 'Your password reseted successfuly..!!'
    message2 = false


    if(req.session.mailErr){
        res.render('user/login', {mailErr})
        req.session.mailErr = false
    }
    else if(req.session.regSuccessMsg){
        res.render('user/login', {regSuccessMsg})
        req.session.regSuccessMsg = false
    }
    else if(req.session.userBlocked){
        res.render('user/login', {blockMsg})
        req.session.userBlocked = false
    }
    else if(req.session.LoggedIn){
        res.render('user/login')
        req.session.LoggedIn = false
    }
    else if(req.session.newPas){
        res.render('user/login', {newpasMsg})
        req.session.newPas = false
    }
    else{
        res.render('user/login')
    }
}


//user signup page

const usersignup = (req, res)=>{
    try {
        res.render('user/signup')
    } catch (error) {
        console.log(error);
    }
}

//google authentication

const googleCallback =  async (req, res) => {
    try {
      // Add the user's name to the database
      userData = await User.findOneAndUpdate(
        { email: req.user.email },
        { $set: { name: req.user.displayName,isVerified:true,isBlocked:false } },
        { upsert: true,new :true }
      );

  
      // Set the user session
       req.session.LoggedIn = true
        req.session.user = userData
      // Redirect to the homepage
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.redirect('/login');
    }
  }

//To get otp page

const getOtp = (req, res)=>{
    try {
        res.render('user/submitOtp')
    } catch (error) {
        console.log(error);
    }
   }



//Submit otp and save user

const submitOtp = async (req, res) => {
    try {
        userOtp = req.body.otp;


        if (userOtp == otp) {
            const user = new User({
                name: userRegData.name,
                email: userRegData.email,
                mobile: userRegData.phone,
                password: hashedPassword,
                isVerified: true,
                isBlocked: false,
            });

            await user.save();

            req.session.regSuccessMsg = true;

            // Send JSON response with success message
            res.json({ success: true, redirectUrl: '/login' });
        } else {
            otpError = 'incorrect otp';

            // Send JSON response with error message
            res.json({ error: otpError });
        }
    } catch (error) {
        console.log(error);

        // Send JSON response with error message
        res.json({ error: 'An error occurred while submitting the OTP.' });
    }
};

//To resend otp

const resendOtp =  async (req, res)=>{
    try {
        res.redirect('/get_otp')
        otp = await userHelper.verifyEmail(userEmail)
    } catch (error) {
        console.log(error);
    }
}


//User login


const doLogin = async(req, res)=>{
    
    try {
       let email    = req.body.email
       let password = req.body.password

       userData = await User.findOne({ email: email });


       if(userData){
          if (await argon2.verify(userData.password, password)){ 

                const isBlocked = userData.isBlocked

                if(!isBlocked){

                   req.session.LoggedIn = true
                   req.session.user =  userData

                   res.redirect('/')
                } else {
                   userData = null
                   req.session.userBlocked = true
                   res.redirect('/login')
                }
              }
              else {
                req.session.mailErr = true
                res.redirect('/login')
              }
            }else{
                req.session.mailErr = true
                res.redirect('/login')
            }    
     } catch (error) {
        console.log(error);
     }
}

//User logout


const doLogout = async(req,res)=>{
    try {
        req.session.destroy()
        userData = null
        // req.session.LoggedIn = false
        res.redirect('/login')

    } catch (error) {
        console.log(error.message);
    }
 }



//user signup

const doSignup = async(req, res)=>{

    try {
         hashedPassword  = await userHelper.hashPassword(req.body.password)
         userEmail       = req.body.email 
         userRegData     = req.body
        

        const userExist = await User.findOne({email: userEmail})
        if(!userExist){
              otp = await userHelper.verifyEmail(userEmail)
              res.render('user/submitOtp')
         }
        else{
            message2 = true

            res.render('user/login', {message2})
           
        }

    } catch (error) {
        console.log(error);     
    }   
}


const productSearch = async(req, res)=>{
    const { search, catId } = req.body



    if(catId){   

        try {
            const products = await Product.find({ category: catId, name: { $regex: search, $options: 'i' } })
            .populate('category', 'category');
            res.json(products);
          } catch (error) {
            console.log(error);
            return res.status(500).send();
          }
          
          
     }else{
        try {
            const products = await Product.find({ name: { $regex: search, $options: 'i' } })
            .populate('category', 'category');


            res.json(products);
          } catch (error) {
            console.log(error);
            return res.status(500).send();
          }
          
     }
    }


    const sortProductByName = async (req, res) => {
        try {
            const { sort, catId, page } = req.body;

            const limit = 6;
            const skip = (page - 1) * limit;
    
            let query = { is_blocked: false };
            if (catId) {
                query.category = catId;
            }
    
            const sortOrder = sort === 'asc' ? 1 : -1;
    
            const products = await Product.find(query)
                .sort({ name: sortOrder })
                .populate('category', 'category')
                .skip(skip)
                .limit(limit)
                .lean();
    
            const count = await Product.countDocuments(query);
            const totalPages = Math.ceil(count / limit);
            const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
            res.json({ productData: products, pages, currentPage: page, sort });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };


    const sortProductByPrice = async (req, res) => {
        try {
            const { sort, catId, page } = req.body;

            const limit = 6;
            const skip = (page - 1) * limit;
    
            let query = { is_blocked: false };
            if (catId) {
                query.category = catId;
            }
    
            const products = await Product.find(query)
                .sort({ price: sort })
                .populate('category', 'category')
                .skip(skip)
                .limit(limit)
                .lean();
    
            const count = await Product.countDocuments(query);
            const totalPages = Math.ceil(count / limit);
            const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
            res.json({ productData: products, pages, currentPage: page, sort });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };


module.exports = {
    doLogout, 
    getProduct, 
    getProductsPage,
    loadHome ,  
    ProductView, 
    addNewReviewPost,
    userLogin, 
    usersignup, 
    doSignup, 
    submitOtp, 
    doLogin, 
    getOtp,
    resendOtp,
    productSearch,
    sortProductByName,
    sortProductByPrice,
    googleCallback,
}