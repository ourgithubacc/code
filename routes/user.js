const express = require("express");
const {
  isAuthenticated,
  isAdmin,
  apiAuth,
  contactEmail,
} = require("../controllers/auth");
const {
  getUserById,
  getUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getDataUserByName,
  getUserByName,
  updateSocial,
} = require("../controllers/user");
const {protect, userRoleAuth} = require('../middleware/authMiddleware') 
const {sendFeedBack} = require('../controllers/feedback')
const router = express();




router.get("/user/:userId", protect, getUserById);

router.put("/user/:userId", protect,updateUser);
router.get(
  "/users",
  //apiAuth,
  // isAuthenticated,
  // isAdmin,
  protect,
  userRoleAuth,
  getAllUsers
);
router.delete(
  "/user/:userId",
  /*apiAuth,
  isSignedIn,
  isAuthenticated,*/
  protect,
  userRoleAuth,
  deleteUser
);
router.post('/sendFeedback',protect,sendFeedBack)

// Contact us email
//router.post("/sendemail", /*apiAuth,*/ contactEmail);

module.exports = router;
