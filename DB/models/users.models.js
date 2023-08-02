import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    min: 3,
    max: 10,
    required: true,
    unique: true
  },
  name: {
    type: String,
    min: 3,
    max: 20,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  gender: { 
    type: String,
    enum:["male","female","not-specific"],
    default:"not-specific"
   },
  password: {
    type: String,
    required: true
  },
  isLogged:{
    type:Boolean,
    default:false
  },
  isConfirmed:{
    type:Boolean,
    default:false
  },
  profilePicture:{
    public_id:String,
    secure_url:String,
  },
  myFav:[
    {
      type:mongoose.Types.ObjectId,
      ref:"message"
    }

  ]
},{
  timestamps: true
})

export const usersModel = model("user", userSchema)