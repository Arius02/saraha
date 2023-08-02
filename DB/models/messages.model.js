import mongoose, { Schema, model } from "mongoose";

const messageSchema = new Schema({
  content: {
    type: String,
    min: 3,
    max: 1000,
    required: true
  },
  sentFrom: {
    type: String,
    ref: "user",
    required: true
  },
  sendTo: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true
  }
},{
  timestamps: true
});

export const messgesModel = model("mesage", messageSchema);

