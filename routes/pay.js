const express = require('express')
const {initEventPay,verifyPayment} = require('../helper/paystack')
const router = express.Router();
const {protect,userRoleAuth} = require('../middleware/authMiddleware')

router.route('/payForTicket').post(protect,initEventPay);
router.route('/verify/:reference').get(protect,verifyPayment)




module.exports = router