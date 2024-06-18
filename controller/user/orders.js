const Orders  = require('../../model/order')
const Address = require('../../model/address')
const moment  = require('moment')
const pdfkit  = require('pdfkit')
const fs      = require('fs')
const helper  = require('../../helpers/user.helper')
const User    = require('../../model/userModel')
const Product = require('../../model/productModel')

const path = require('path');
const easyinvoice = require('easyinvoice');
const Handlebars = require('handlebars');
const { handlebars } = require('hbs')








// const myOrders = async (req, res) => {
//   try {
//     var page = 1
//     if(req.query.page){
//       page = req.query.page
//     }
//     const limit = 3;

//       const userData = req.session.user
//       const userId   = userData._id

//       const orders = await Orders.aggregate([
//         {
//           $match: {userId}
//         },
//         {
//           $sort:{ date: -1 }
//         },
//         {
//           $skip: (page - 1) * limit
//         },
//         {
//           $limit: limit * 1
//         }
//       ]);
                                
//       const count = await Orders.find({}).count();
//       const totalPages = Math.ceil(count/limit)  // Example value
//       const pages = Array.from({length: totalPages}, (_, i) => i + 1);

//       const formattedOrders = orders.map(order => {
//           const formattedDate = moment(order.date).format('MMMM D, YYYY');
//           return { ...order.toObject(), date: formattedDate }
//       })

//       console.log(formattedOrders);

//       res.render('user/my_orders', {
//           userData,
//           myOrders: formattedOrders || [],
//           pages , currentPage: page,
//       })

//   } catch (error) {
//       console.log(error);
//   }
// }

const myOrders = async (req, res) => {
  try {
    var page = 1
    if(req.query.page){
      page = req.query.page
    }
    const limit = 10;
      const user = req.session.user
      const userId   = user._id
      const userData = await User.findById({_id:userId}).lean()
      

      const orders = await Orders.find({ userId })
                                  .sort({ date: -1 })
                                  .skip((page - 1) * limit)
                                  .limit(limit * 1)
    const count = await Orders.find({userId}).count();
    const totalPages = Math.ceil(count/limit)
    const pages = Array.from({length: totalPages}, (_, i) => i + 1); 

      const formattedOrders = orders.map(order => {
          const formattedDate = moment(order.date).format('MMMM D, YYYY');
          return { ...order.toObject(), date: formattedDate }
      })


      res.render('user/my_orders', {
          userData,
          myOrders: formattedOrders || [],
          pages , currentPage: page 
      })

  } catch (error) {
    console.log(error.message);
    res.status(500).send(" Error");  }
}






const filterOrders = async (req, res) => {

  try {
    const { orderType } = req.query
    const userData = req.session.user
    const userId   = userData._id

    const orders = await Orders.find({ userId, status: orderType })
                                .sort({ date: -1 })

    const formattedOrders = orders.map(order => {
        const formattedDate = moment(order.date).format('MMMM D, YYYY');
        return { ...order.toObject(), date: formattedDate }
    })



    res.json(formattedOrders)

  } catch (error) {
    console.log(error);
  }
}


 const orderDetails = async(req, res) => {
    try {
        const user = req.session.user
        const userId   = user._id
        const userData = await User.findById(userId).lean()

        const orderId = req.query.id

        const myOrderDetails = await Orders.findById(orderId).lean()
        const orderedProDet  = myOrderDetails.product
        const addressId      = myOrderDetails.address
        const formattedDate = moment(myOrderDetails.date).format("MMMM D, YYYY");

        const address        = await Address.findById(addressId).lean()

     
        res.render('user/order_Details', { myOrderDetails, orderedProDet, userData, address ,formattedDate})
    } catch (error) {
        console.log(error);
    }
 }




 const orderSuccess = async(req, res) => {
    try {
      const userData = req.session.user
      const orderId = req.query.orderID

      const myOrderDetails = await Orders.findOne({ orderId: orderId }).lean();
      const orderedProDet  = myOrderDetails.product
      const addressId      = myOrderDetails.address
      const formattedDate = moment(myOrderDetails.date).format("MMMM D, YYYY");

      const address        = await Address.findById(addressId).lean()


        res.render('user/order_sucess', { myOrderDetails, orderedProDet, userData, address ,formattedDate})
    } catch (error) {
        console.log(error);
    }
 }


 const cancelOrder = async(req, res) => {
    try {
        const id       = req.query.id
        const userData = req.session.user
        const userId   =  userData._id
        
        const { updateWallet, payMethod } = req.body


        let canceledOrder = await Orders.findOne({ _id: id });


        for (const product of canceledOrder.product) {
              await Product.updateOne(
                  { _id: product.id },
                  { $inc: { stock: product.quantity }}
              );
      }



        // if(payMethod === 'wallet' || payMethod === 'razorpay'){
        await User.findByIdAndUpdate( userId, { $set:{ wallet:updateWallet }}, { new:true })
        // }

        await Orders.findByIdAndUpdate(id, { $set: { status: 'Cancelled' } }, { new: true });



        res.json('sucess')
    } catch (error) {
        console.log(error);
    }
 }



 
 const returnOrder = async(req, res) => {
    try {
        const id = req.query.id

        const userData = req.session.user
        const userId   =  userData._id
        
        const { updateWallet, payMethod } = req.body


        let canceledOrder = await Orders.findOne({ _id: id });


        for (const product of canceledOrder.product) {
              await Product.updateOne(
                  { _id: product.id },
                  { $inc: { stock: product.quantity }}
              );
      }



        // if(payMethod === 'wallet' || payMethod === 'razorpay'){
        await User.findByIdAndUpdate( userId, { $set:{ wallet:updateWallet }}, { new:true })

        await Orders.findByIdAndUpdate(id, { $set: { status: 'Returned' } }, { new: true });

        res.json('sucess')
    } catch (error) {
        console.log(error);
    }
 }



 const returnMsg = async (req, res) => {
  try {
    let orderId = req.query.id

    await Orders.findByIdAndUpdate(orderId, { $set: { returnMsg: req.body.message } })

    let ord = await Orders.find({_id:orderId}).lean()

  } catch (error) {
    console.log(error);
  }
}



 const getInvoice = async (req, res) => {
  try {
    const orderId = req.query.id; 
   
  

    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }

    const { userId, address: addressId } = order;
    
    const [user, address] = await Promise.all([
      User.findById(userId),
      Address.findById(addressId),
    ]);


    const products = order.product.map((product) => ({
      quantity: product.quantity.toString(),
      description: product.name,
      tax: product.tax,
      price: product.price,
    }));



    const date = moment(order.date).format('MMMM D, YYYY');
    
    


    if (!user || !address) {
      return res.status(404).send({ message: 'User or address not found' });
    }

    const filename = `invoice_${orderId}.pdf`;

    const data = {
      mode: "development",
      currency: 'USD',
      taxNotation: 'vat',
      marginTop: 25,
      marginRight: 25,
      marginLeft: 25,
      marginBottom: 25,
      background: 'https://public.easyinvoice.cloud/img/watermark-draft.jpg',
      sender: {
        company: 'SHOPIFY',
        address: 'Canyon',
        zip: '600091',
        city: 'Chennai',
        country: 'India',
      },
      client: {
        company: user.name,
        address: address.adressLine1,
        zip: address.pin,
        city: address.city,
        country: 'India',
      },

      information: {
        // Invoice number
        number: `${orderId}`,
        // Invoice data
        date: date,
        // Invoice due date
        // duedate: "31-12-2021"
    },
  
      // invoiceNumber: '2023001',
      // invoiceDate: date,


      products: products,
     
    };

    console.log(data)

easyinvoice.createInvoice(data, function (result) {

  easyinvoice.createInvoice(data, function (result) {
    const fileName = 'invoice.pdf'
    const pdfBuffer = Buffer.from(result.pdf, 'base64');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    res.send(pdfBuffer);
  })
});
} 
   
   catch (error) {
    res.sendStatus(500);
  }
};







module.exports = {
    myOrders,
    orderDetails,
    orderSuccess,
    cancelOrder, 
    getInvoice,
    returnOrder,
    filterOrders,
    returnMsg
}