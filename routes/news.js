const express = require('express')
const {addNews, getAllNews, getNews, getSliderNews,  deleteNews, updateNews, getIperuCampusNews, getMainCampusNews, deleteAllIperuNews, deleteAllMainNews, deleteAllNews} = require ('../controllers/news')
const router = express.Router()
const {protect, userRoleAuth} = require('../middleware/authMiddleware')
const {
    signup,
    verifyToken,
    signin,
    signout,
    apiAuth,
    sendVerificationCode,
    resetPassWord,
    forgotPassWord,
    authMiddleWare,
    isVerified,
    isSignedIn,
    isAdmin,
    isAuthenticated
    
    
  } = require("../controllers/auth");
  const upload = require('../controllers/multer')
// middleware to be here

router.route('/addNews',upload.array('url') /*isSignedIn, isAuthenticated, isVerified, isAdmin*/).post(addNews);
router.route('/getAllNews/:pageNo/:pageSize', /*isAdmin*/).get(protect,getAllNews)
router.route('/getMainCampusNews/:pageNo/:pageSize').get(protect,getMainCampusNews)
router.route('/getIperuCampusNews/:pageNo/:pageSize',).get(protect,getIperuCampusNews)
router.route('/getById').get(protect,getNews);
router.route('/getAllNews/slider').get(protect,getSliderNews);
//router.route('/getByCategory').get(protect,getNewsByCategory);
router.route('/deleteNews').delete(protect,userRoleAuth,deleteNews);
router.route('/deleteAllMainNews').delete(protect,userRoleAuth,deleteAllMainNews)
router.route('/deleteAllIperuNews').delete(protect,userRoleAuth,deleteAllIperuNews)
router.route('/deleteAllNews').delete(protect,userRoleAuth,deleteAllNews)
router.route('/updateNewsById/:newsId').put(protect,userRoleAuth,updateNews)
module.exports = router 
