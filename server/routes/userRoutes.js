import express from "express";
import { checkVerifyEmail, followUnfollowUser, getSuggestedUsers, getUserProfile, loginUser, logoutUser, signupUser, updateUser, verifyEmail } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoutes.js";

const router = express.Router();

router.route("/profile/:query").get(getUserProfile);
router.route("/suggested").get(protectRoute, getSuggestedUsers);
router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/follow/:id").post(protectRoute, followUnfollowUser);
router.route("/update/:id").put(protectRoute, updateUser);
router.route("/verify").get(protectRoute, verifyEmail);
router.route("/verify/:emailToken").get(checkVerifyEmail);



export default router;