import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import generteTokenAndSetCookie from "../utils/GenerateTokenAndSetCookies.js";
import {v2 as cloudinary} from 'cloudinary';
import mongoose from "mongoose";
import crypto, { randomBytes } from "crypto";
import sendVerificationMail from "../utils/helpers/sendVerificationMail.js";

const signupUser = async (req, res) => {
    const {name, email, username, password} = req.body;
    try {

        //Checking if the email or the user name already exist
         const user = await User.findOne({$or:[{email}, {username}]});
         if(user) {
            return res.status(400).json({error: "User already exists"})
         }

         //Hashing the password
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);

         //Creating the user
         const newUser = new User({name, email, username, password:hashedPassword, emailToken:randomBytes(64).toString("hex") });

         await newUser.save();

         if(newUser) {

            generteTokenAndSetCookie(newUser._id, res);
            res.status(201).json({_id: newUser._id, name: newUser.name, email:newUser.email, username: newUser.username, bio: newUser.bio, profilePic: newUser.profilePic});
         }
         else{
            res.status(400).json({error: "Invalid user data"});
         }
        
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log("Error in signupUser", err.message);
    }
};

const loginUser = async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await User.findOne({username});

        if(!user) {
            return  res.status(400).json({error: "Invalid username or password"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if(!isPasswordCorrect) {
            return  res.status(400).json({error: "Invalid username or password"});
        }

        generteTokenAndSetCookie(user._id, res);
        res.status(200).json({_id: user._id, name: user.name, email:user.email, username: user.username, bio: user.bio, profilePic: user.profilePic, isVerified: user.isVerified}); 

    } catch (err) {
        res.status(500).json({error: err.message});
        console.log("Error in loginUser", err.message);
    }
};

const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:1});
        return  res.status(200).json({message: "User logged out successfully"})
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log("Error in logoutUser", err.message);
    }
};

const followUnfollowUser = async (req, res) => {
    try {
        const {id} = req.params;  
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        if(id === req.user._id.toString()) {
            return res.status(400).json({error: "You can not Follow/UnFollow yourself"});
        }

        if(!userToModify || !currentUser) {
           
            return res.status(400).json({error: "User not found"});
        }

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}});
            await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}});
            res.status(200).json({message: `${userToModify.name} UnFollowed Successfully by ${currentUser.name}`});
        }else{
            await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
            res.status(200).json({message: `${userToModify.name} Followed Successfully by ${currentUser.name}`});
        }
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log("Error in followUnfollowUser", err.message);
    }
}

//
//

const updateUser = async (req, res) => {
	const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

        await Post.updateMany(
            {"replies.userId":userId},
            {
                $set: {
                    "replies.$[reply].username":user.username,
                    "replies.$[reply].userProfilePic":user.profilePic,
                    "replies.$[reply].name":user.name,
                }
            },
            {
                arrayFilters: [{"reply.userId": userId}]
            }
        )

		// password should be null in response
		user.password = null;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};

const getUserProfile = async (req, res) => {
    const {query} = req.params;
    try {
        let user;

        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findById({_id:query}).select("-password").select("-updatedAt");
        } else{
            user = await User.findOne({username:query}).select("-password").select("-updatedAt");
        }
         
        if(!user) {
            return res.status(400).json({error: "User not found"});
        }

        res.status(200).json(user);
        
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log("Error in getUserProfile Controller", err.message);
    }
}

const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const usersFollowedByYou = await User.findById(userId).select("following");

        const users = await User.aggregate([
           {
            $match:
            {
                _id: {
                    $ne:userId
                }
            }
           },
           {
            $sample: {
                size: 10
            }
           },     
        ]);

        const filterUsers = users.filter(user => !usersFollowedByYou.following.includes(user._id));
        const suggestedUsers = filterUsers.slice(0, 4);

        suggestedUsers.forEach(user => {
            user.password=null;            
        });

        res.status(200).json(suggestedUsers);
        
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in getSuggestedUsers Controller", error.message);
    }
}

const verifyEmail = async (req, res) => {
    const userId = req.user?._id.toString();
    try {

        const user = await User.findById(userId);
        
        const EmailVerifyToken = user.emailToken

        if(!EmailVerifyToken) {
            return res.status(400).json({error: "Email Token not found"});
        }
        if(!user){
            return res.status(400).json({error: "Your email is already verified no further afction required"});
        }else {
            sendVerificationMail(user);
            res.status(200).json({message: "Email Sent succsessfully"});
        }

        
        
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in verifyEmail Controller", error.message);
    }
}

const checkVerifyEmail = async (req, res) => {
    const {emailToken} = req.params;
    try {
        const user = await User.findOne({emailToken});
        if(!user) {
            res.status(404).json({error: "This is not a valid token or it's already been used"})
            return;
        } else {
            user.emailToken=null;
            user.isVerified = true;

            await user.save();
        }

        
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log("Error in checkVerifyEmail Controller", error.message);
    }
}


export {signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile, getSuggestedUsers, verifyEmail, checkVerifyEmail};