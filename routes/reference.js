const express = require('express')
const {getAllReference, getReferenceById} = require('../controllers/reference')
const router = express.Router()
const {protect, userRoleAuth} = require('../middleware/authMiddleware')
router.route('/getAllReference').get(protect,userRoleAuth,getAllReference)
router.route('/getReferenceById/:redId').get(protect,userRoleAuth,getReferenceById)

module.exports = router