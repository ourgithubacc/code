const express =  require('express')
const {uploadEvent, getAllEvents, getEventByTitle, deleteEvent, updateEvent, getIperuCampusEvents, getMainCampusEvent, deleteAll, deleteAllIperuCampusEvent, deleteAllMainCampusEvent} = require('../controllers/event')
const router = express.Router();
const{protect, userRoleAuth} = require('../middleware/authMiddleware')
const upload = require('../controllers/multer')
router.route('/uploadEvent',upload.array('eventImage')).post(protect,/*userRoleAuth*/uploadEvent);
router.route('/getAllEvents/:pageNo/:pageSize').get(protect,getAllEvents);
router.route('/getEventbyTitle').get(protect,getEventByTitle);
//router.route('/getEventsByHost').get(protect,getEventsByHost);
router.route('/deleteEvent').delete(protect,userRoleAuth,deleteEvent);
router.route('/deleteAllMainCampusEvent').delete(protect,userRoleAuth,deleteAllMainCampusEvent)
router.route('/deleteAllIperuCampusEvent').delete(protect,userRoleAuth,deleteAllIperuCampusEvent)
router.route('/deleteAll').delete(protect,userRoleAuth,deleteAll)
router.route('/updateEvent').put(protect,userRoleAuth,updateEvent);
router.route('/getIperuCampusEvents/:pageNo/:pageSize').get(protect,getIperuCampusEvents)
router.route('/getMainCampusEvents/:pageNo/:pageSize').get(protect,getMainCampusEvent)

module.exports = router;
