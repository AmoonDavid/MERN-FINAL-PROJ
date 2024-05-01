import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js"
import messageRouter from "./routes/messageRoutes.js"
import {v2 as cloudinary} from 'cloudinary';
import {app, server} from "./socket/socket.js"

dotenv.config();

//Cloudinary Cofigurations
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

//MiddleWares
app.use(express.json({limit:"50mb"})); //To parse JSON data in the req.body
// app.use(express.urlencoded({extended: true})); // To parse form data in the req.body
app.use(cookieParser());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRouter);
app.use("/api/messages", messageRouter);


const PORT = process.env.PORT;

connectDB().then(()=> {
    server.listen(PORT, () => {
        console.log(`Server is listening at Port: ${PORT}`);
    });
})

