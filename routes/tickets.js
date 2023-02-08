const express = require('express');
const { checkTicket, getAllTickets, getTicketById, deleteTicketById, mailTempToken, getTicketByToken, scan, verifyPassWordForTicket, getTicketByEmail} = require('../controllers/tickets')
const router = express.Router();

const {protect,userRoleAuth} = require('../middleware/authMiddleware')
//router.route('/sendEventTicket/:userId').post(sendEventTicket)
//router.route('/getEventTicket/:userId').get(getEventTicket)

router.route('/tempToken').post(protect,mailTempToken)
router.route('/getTicketByToken').get(protect,getTicketByToken)
//router.route('/generateAndSaveTicket/:userId').post(generateAndSaveTicket)
router.route('/getAllTickets').get(protect,getAllTickets)
router.route('/getTicketByEmail').post(/*protect,*/ getTicketByEmail)
router.route('/getTicketById/:ticketId').get(protect,getTicketById)
router.route('/checkToken').get(protect,checkTicket)
router.route('/scan').post(protect,scan)
router.route('/verifyPassword').post(protect,verifyPassWordForTicket)
router.route('/deleteTicketById/:ticketId').delete(protect,userRoleAuth,deleteTicketById)
module.exports = router
