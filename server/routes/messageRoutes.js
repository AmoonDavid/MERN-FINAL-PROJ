import express from "express";
import protectRoute from "../middlewares/protectRoutes.js";
import { getConversations, getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.route("/conversations").get( protectRoute, getConversations);
router.route("/:otherUserId").get( protectRoute, getMessages);
router.route("/").post( protectRoute, sendMessage);

export default router;