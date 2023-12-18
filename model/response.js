import mongoose from "mongoose";

const { Schema, model } = mongoose;

const responseSchema = new Schema({
  response: {
    type: String,
  },
  responseType: {
    type: Number,
    required: true,
  },
});

const response = model("Response", userSchema);
export default user;