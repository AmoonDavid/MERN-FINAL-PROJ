import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import {v2 as cloudinary} from 'cloudinary';

const createPost = async (req, res) => {
    const {postedBy, text} = req.body;
    let {img} = req.body;
    try {
        if(!postedBy || !text) {
          return res.status(400).json({error:"PostedBy and the text fileds are required"});  
        }

        const user = await User.findById(postedBy);

        if(!user){
            return res.status(404).json({error:"User not found"});  
        }

        if (user._id.toString() !== req.user._id.toString()){

            return res.status(404).json({error:"Unauthorized to create a post"});
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const maxLength = 500;
        if(text.length > maxLength){
            return res.status(400).json({error:`Post text can not exceed ${maxLength} charecters`}); 
        }

        const newPost = new Post({postedBy, text, img});

        await newPost.save();

        res.status(201).json(newPost);
        
    } catch (err) {
        res.status(500).json({error:err.message});
        console.log( "Error in createPosts Controller", err.message);
    }
}

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post){
            res.status(404).json({error:"Post not found"});  
        }

        res.status(200).json(post);  
        
    } catch (err) {
        res.status(500).json({error:err.message});
        console.log("Error in getPost Controller", err.message);
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error:"Post not found"});  
        }

        if(req.user._id.toString() !== post.postedBy.toString()){
            return res.status(401).json({error:"You are not authorized to delete a post created by some one else"});  
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({message:"Posted deleted successfully"});
    } catch (err) {
        res.status(500).json({error:err.message});
        console.log("Error in deletePost Controller", err.message);  
    }
};

const likeUnlikePost = async (req, res) => {
    try {
        const {id:postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if(!post) {
            return res.status(404).json({error:"Post not found"}); 
        }

        const userLikedPost = await post.likes.includes(userId);

        if(userLikedPost){
            await Post.updateOne({_id:postId}, {$pull: {likes: userId}});
            res.status(200).json({message:"Post UnLiked successfully"}); 
        }else{
            await post.likes.push(userId);
            await post.save();
            res.status(200).json({message:"Post Liked successfully"}); 
        }

        
    } catch (err) {
        res.status(500).json({error:err.message});
        console.log("Error in likeUnlikePost Controller", err.message);
    }
}

const replyToPost = async (req, res) => {
    const {text} = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;
    const name = req.user.name;
    try {

        if(!text) {
            return res.status(400).json({error:"Text filed is required"});
        }

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error:"Post do not exist"});
        }

        const reply = {userId, text, userProfilePic, username, name};
        await post.replies.push(reply);
        await post.save();

        res.status(200).json(reply)
        
    } catch (err) {
        res.status(500).json({error:err.message});
        console.log("Error in replyToPost Controller", err.message);   
    }

};

const getFeedPosts = async (req, res) => {
    const userId = (req.user._id).toString();

    try {

        const user = await User.findById(userId);
        
        if(!user){
            return res.status(404).json({error: "User do not exsist"});
        }

        const following = user.following;

        const feedPosts = await Post.find({postedBy :{$in: following}}).sort({createdAt: -1});
        // if(feedPosts === []){
        //     return res.status(200).json({message: "No posts found by users you are currently following"})
        // }

        res.status(200).json(feedPosts);
        
    } catch (err) {
        res.status(500).json({error:err.message});
        console.log("Error in getFeedPosts Controller", err.message); 
    }
}

const getUserPosts = async (req, res) => {

    const {username} = req.params;
    try {

        const user = await User.findOne({username});
        if(!user) {
            res.status(404).json({error: "User Not found"});
            return;
        }

        const posts = await Post.find({postedBy: user._id}).sort({createdAt: -1});

        res.status(200).json(posts);
        
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log("Error in getUserPosts Controller", err.message);
    }
}

export {createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts};