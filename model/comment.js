import mongoose from "mongoose";

const { Schema, model } = mongoose;
const commentSchema = new Schema({
  commentBody: String,
  commentLikes: [String],
  commentMadeBy: String,
  commentMadeOn: { type: Date, default: Date.now() },
});

const comment = model("comment", commentSchema);

export default comment;
