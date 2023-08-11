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
  },
  sendTo: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true
  },
  isFav:{
    type:Boolean,
    default:false
  }
},{
  timestamps: true
});

export const messgesModel = model("mesage", messageSchema);

