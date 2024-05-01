import express from "express";
import protectRoute from "../middlewares/protectRoutes.js";
import { createPost, deletePost, getFeedPosts, getPost, getUserPosts, likeUnlikePost, replyToPost } from "../controllers/postController.js";

const router = express.Router();

router.route("/create").post(protectRoute, createPost);
router.route("/:id").delete(protectRoute, deletePost);
router.route("/like/:id").put(protectRoute, likeUnlikePost);
router.route("/reply/:id").put(protectRoute, replyToPost);
router.route("/feed").get(protectRoute, getFeedPosts);
router.route("/:id").get(getPost);
router.route("/user/:username").get(getUserPosts);


export default router;