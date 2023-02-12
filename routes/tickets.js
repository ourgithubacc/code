const express = require('express');
const {getAllTickets, getTicketById, deleteTicketById, mailTempToken, getTicketByToken, scan, verifyPassWordForTicket, getTicketByEmail, generateAndSaveTicket, deleteAll} = require('../controllers/tickets')
const router = express.Router();
const {protect,userRoleAuth} = require('../middleware/authMiddleware')


router.route('/tempToken').post(protect,mailTempToken)
router.route('/getTicketByToken').get(protect,getTicketByToken)
router.route('/deleteAll').delete(protect,userRoleAuth,deleteAll)
router.route('/getAllTickets').get(protect,userRoleAuth,getAllTickets)
router.route('/getTicketById/:ticketId').get(protect,getTicketById)
router.route('/scan').post(protect,scan)
router.route('/getTicketByEmail/:email').get(protect,getTicketByEmail)
router.route('/generateAndSaveTicket').post(protect, generateAndSaveTicket)
router.route('/verifyPassword').post(protect,verifyPassWordForTicket)
router.route('/deleteTicketById/:ticketId').delete(protect,userRoleAuth,deleteTicketById)
module.exports = router
