const Address = require('../../model/address')
const User    = require('../../model/userModel')



module.exports = {
   
 /// Load Profile/////

 loadProfile : async(req, res) => {
    try { 
    const user=req.session.user
    const id = user._id    
    const userData = await User.findById(id).lean();
    // const userDataObject = userData.toObject();
    res.render('user/about_me', {userData})
    } catch (error) {
        console.log(error);
    }
},


/// To get manage address page ///


 manageAdress : async(req, res) => {
    try {
        const user=req.session.user
        const id = user._id    
        const userData = await User.findById(id).lean();
        
        const userAddress = await Address.find({userId : id}).lean()
        res.render('user/manage_address', {userAddress, userData})
    } catch (error) {
        console.log(error);
    }
},


//// To add new address  ////


addNewAddress : async(req, res) => {
    try {
        const user=req.session.user
        const id = user._id    
        const userData = await User.findById(id).lean();
        res.render('user/add_new_address',{userData})
    } catch (error) {
        console.log(error);
    }
},


//// To add new address ////


addNewAddressPost: async(req, res) => {
    try {
        const user=req.session.user
        const id = user._id    
        const userData = await User.findById(id).lean();
        
        const adress = new Address({
            userId      : id,
            name        : req.body.name,
            mobile      : req.body.mobile,
            adressLine1 : req.body.address1,
            adressLine2 : req.body.address2,
            city        : req.body.city,
            state       : req.body.state, 
            pin         : req.body.pin, 
            is_default  : false,
        })

        const adressData = await adress.save()
        res.redirect('/adresses')
    } catch (error) {
        console.log(error);
    }
},


editAddress : async (req, res) => {
    try {

        const id = req.params.id
        const user=req.session.user
        const userId = user._id    
        const userData = await User.findById(userId).lean();

        const address = await Address.findById(id);
        const addressObject = address.toObject();


        res.render('user/editAddress',{ address:addressObject,userData })
    } catch (error) {
        console.log(error);
    }
},


editAddressPost : async (req, res) => {
    try {

        const id = req.params.id

        await Address.findByIdAndUpdate(id, {$set:{
            name        : req.body.name,
            mobile      : req.body.mobile,
            adressLine1 : req.body.address1,
            adressLine2 : req.body.address2,
            city        : req.body.city,
            state       : req.body.state, 
            pin         : req.body.pin, 
            is_default  : false,
        }}, {new : true})

        res.redirect('/adresses')
        
        // Find user addresses
        // const userAddresses = await Address.find({ userId: id }).lean();
        // res.render('user/editAddress')
    } catch (error) {
        console.log(error);
    }
},


///// Edit user details  //////


editDetails: async(req, res) => {

    try {
        const user=req.session.user
        const id = user._id    
        const userData = await User.findById(id).lean();

        res.render('user/edit_user', {userData})
    } catch (error) {
        console.log(error);
    }
},


/// Update edited user details  ////


updateDetails: async (req, res) => {
    try {
        const id = req.params.id

        await User.findByIdAndUpdate(id, {$set:{
            name   : req.body.name,
            mobile : req.body.mobile,
            email  : req.body.email,
        }}, {new : true})

        res.redirect('/profile')
        
    } catch (error) {
        console.log(error); 
    }   
 },


///// To delete addresss  ////

 deleteAddress: async(req, res) => {
    try {
        const id = req.params.id

        await Address.findByIdAndDelete(id)
        res.redirect('/adresses')
    } catch (error) {
        console.log(error);
    }
 },





    walletpage :async (req,res)=>{
    
        const user=req.session.user
        const id = user._id    
        const userData = await User.findById(id).lean();
    try {
        // const userId = req.query.id
        res.render('user/wallet',{userData})
        
    } catch (error) {
        
        console.log(error)
    }

}

 
}