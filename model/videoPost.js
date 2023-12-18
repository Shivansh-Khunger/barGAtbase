import mongoose from "mongoose";

const { Schema, model } = mongoose;

const videoPostSchema = new Schema({
    postVideoId: String
});

const videoPost = model("videoPost", videoPostSchema);

export default videoPost;
