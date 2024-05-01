import Conversation from "../models/ConversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import {v2 as cloudinary} from 'cloudinary';

const sendMessage = async (req, res) => {
    try {

        const {recipientId, message} = req.body;
        let {img} = req.body;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({participants:{$all:[senderId, recipientId]}});

        if(!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            })

            await conversation.save();

            if(img) {
                const uploadedRes = await cloudinary.uploader.upload(img);
                img = uploadedRes.secure_url;

            }
        };

        const newMessage = new Message ({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
            img: img || "",
        });

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            })
        ]);

        const recepientSocketId = getRecipientSocketId(recipientId);
        if(recepientSocketId) {
            io.to(recepientSocketId).emit("newMessage", newMessage);
        }
        
       res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const getMessages = async (req,  res) => {
    try {
        const {otherUserId} = req.params;
        const UserId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: {$all: [UserId, otherUserId]},
        });

        if(!conversation) {
            res.status(404).json({error: "Conversation not found"});
        }

        const messages = await Message.find({
            conversationId: conversation._id,
        }).sort({createdAt: 1});

        res.status(200).json(messages);
        
    } catch (error) {
        res.status(500).json({error: error.messgae})
    }
}

const getConversations = async (req, res) => {
    const UserId = req.user._id;
    try {
        const conversations = await Conversation.find({participants: UserId}).populate({
            path: "participants",
            select: "username name profilePic isVerified",
        });

        conversations.forEach((conversation) => {
            conversation.participants = conversation.participants.filter(
                (participants) => participants._id.toString() !== UserId.toString()
            )
        })

        res.status(200).json(conversations);
        
    } catch (error) {
        res.status(500).json({error: error.messgae})
        console.log(error)
    }
}

export {sendMessage, getMessages, getConversations};