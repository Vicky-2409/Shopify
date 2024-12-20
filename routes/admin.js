const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth')
const adminController = require('../controller/admin/adminController')
const store = require('../middleware/multer')
const dashBoards = require('../controller/admin/dashBoards')
const couponContoller =require('../controller/admin/couponController')





router.get('/login', adminController.adminLogin)
router.post('/login', adminController.adminDoLogin)

router.get('/logout', adminController.adminLogout)

router.get('/home', adminAuth.isLogin, dashBoards.loadDashboard)

router.get('/manage_users', adminAuth.isLogin, adminController.loadUsersData)

router.post('/block_user', adminAuth.isLogin, adminController.blockUser)

router.get('/category', adminAuth.isLogin, adminController.getCategory)
router.get('/add_category', adminAuth.isLogin, adminController.addCategory)
router.post('/add_category', adminAuth.isLogin, store.single('image'), adminController.addNewCategory)

router.post('/delete_category', adminAuth.isLogin, adminController.deleteCategory)
router.get('/edit_category/:id', adminAuth.isLogin, adminController.editCategory)
router.post('/update_category/:id', adminAuth.isLogin, store.single('image'), adminController.updateCategory)

router.get('/product', adminAuth.isLogin, adminController.getProduct)

router.get('/new_product', adminAuth.isLogin, adminController.newProduct)
router.post('/add_new_product', store.array('image', 5), adminController.addNewProduct)

router.post('/block_product', adminAuth.isLogin, adminController.blockProduct)
router.post('/delete_product', adminAuth.isLogin, adminController.deleteProduct)
router.get('/edit_product/:id', store.array('image', 5), adminAuth.isLogin, adminController.editProduct)
router.post('/update_product/:id', store.array('image', 5), adminAuth.isLogin, adminController.updateProduct)

router.delete('/product_img_delete', adminController.deleteProdImage)

router.get('/add_coupon', adminController.addCoupon)
router.get('/coupons', adminController.loadCoupon)
router.post('/add_coupon', adminController.addCouponPost)
router.get('/delete_cpn', adminController.deleteCoupon)

router.get('/orders', adminAuth.isLogin, adminController.getOrders)
router.get('/order_details', adminAuth.isLogin, adminController.orderDetails)

router.post('/change_status', adminController.changeOrderStatus)
router.post('/return_approve' , adminAuth.isLogin , adminController.returnRequest)
router.post('/return_decline' , adminAuth.isLogin , adminController.returnDecline)

router.get('/banners', adminController.loadBanner)
router.get('/add_banner', adminController.addBanner)
router.post('/add_banner', store.single('image'), adminController.addBannerPost)
router.get('/delete_banner', adminController.deleteBanner)

router.get('/reviews' , adminController.loadReviews)

// router.get('/sales_report', dashBoards.currentMonthOrder)
router.get('/get_sales', dashBoards.getSales)
router.get('/get_chart_data', dashBoards.getChartData)

// coupons

// router.get('/coupons', couponContoller.loadCoupon)
// router.get('/add_coupon', couponContoller.addCoupon)
// router.post('/add_coupon', couponContoller.addCouponPost)
// router.get('/delete_cpn', couponContoller.deleteCoupon)






module.exports = router;
