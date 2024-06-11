// const Coupon =require('../../model/coupon')


// const loadCoupon = async (req, res) => {
//     try {
//       const coupon = await Coupon.find();
  
//       const now = moment();
  
//       const couponData = coupon.map((cpn) => {
//         const formattedDate = moment(cpn.expiryDate).format("MMMM D, YYYY");
  
//         return {
//           ...cpn,
//           expiryDate: formattedDate,
//         };
//       });
  
//       res.render("admin/coupon", { couponData });
//     } catch (error) {
//       console.log(error);
//     }
//   };
  
//   const addCoupon = (req, res) => {
//     try {
//       const couponMsg = "Coupon added successfuly..!!";
//       const couponExMsg = "Coupon alredy exist..!!";
  
//       if (req.session.coupon) {
//         res.render("admin/add_coupon", { couponMsg });
//         req.session.coupon = false;
//       } else if (req.session.exCoupon) {
//         res.render("admin/add_coupon", { couponExMsg });
//         req.session.exCoupon = false;
//       } else {
//         res.render("admin/add_coupon");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
  
//   const addCouponPost = async (req, res) => {
//     try {
//       const { code, percent, expDate } = req.body;
  
//       const cpnExist = await Coupon.findOne({ code: code });
  
//       if (!cpnExist) {
//         const coupon = new Coupon({
//           code: code,
//           discount: percent,
//           expiryDate: expDate,
//         });
  
//         await coupon.save();
//         req.session.coupon = true;
//         res.redirect("/admin/add_coupon");
//       } else {
//         req.session.exCoupon = true;
//         res.redirect("/admin/add_coupon");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
  
//   const deleteCoupon = async (req, res) => {
//     try {
//       const id = req.query.id;
  
//       await Coupon.findByIdAndDelete(id);
  
//       res.redirect("/admin/coupons");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   module.exports={
//     loadCoupon,
//     addCoupon,
//     addCouponPost,
//     deleteCoupon,


//   }
  