const express = require('express')
const {handleWebhook, getAllWebhookEvents} = require('../controllers/webhook')
const router = express.Router();
const {protect, userRoleAuth } = require('../middleware/authMiddleware')

router.route('/webhook').post(handleWebhook);
router.route('/getAllWebhookEvents').get(protect, userRoleAuth, getAllWebhookEvents)

module.exports = router