import { messgesModel } from "../../../DB/models/messages.model.js"
import { errorHandler } from "../../utils/errorHandling.js";
import { usersModel } from "../../../DB/models/users.models.js";


//send message
const sendMessage = errorHandler(async (req, res, next) => {
  const { sentFrom } = req.body
  const {username} = req.params
  const user = await usersModel.findOne({username})
  let message;
  if(!user){
   next(new Error("User not found.", {cause:404}))
  }
  if(sentFrom){
     message = await messgesModel.create({ ...req.body, 
      sentFrom , 
      sendTo: user._id
    })
  }else{
     message = await messgesModel.create({ ...req.body, 
      sentFrom: _id , 
      sendTo: user._id
    })
  }
  return res.status(201).json({ message: "message added successfully.", status: true, message })
});

//delete message
const deleteMessage = errorHandler(async (req, res, next) => {
    const { _id } = req.params
    const checkMessage = await messgesModel.findById(_id)
    // Check if the task belongs to the logged-in user
    if (checkMessage=== null) {
   next(new Error("Message not found.", {cause:404}))

    } else if (checkMessage?.sentFrom !== req.userData._id && checkMessage?.sendTo.toHexString() !== req.userData._id){
   next(new Error("You have no access to this message.", {cause:401}))
          } else{
      await messgesModel.findByIdAndDelete(_id)
      return res.status(201).json({ message: "message deleted successfully.", status: true })
    }
  
});

//get messages
const getAllMessage= errorHandler(async (req, res) => {
  const {_id}= req.userData;
  const user = await usersModel.findById(_id)
    messgesModel.find({
      $or:[
        {sentFrom: _id },
        {sendTo:_id}
      ]
    }).then((messages) => {
      const messageAndFav =[...messages]
       messageAndFav.forEach(message=>{
        if(user.myFav.includes(message._id)){
          message.isFav= true
        }else {
          message.isFav= false
        }
      })
      res.status(200).json({count:messages.length, messageAndFav})
    })
});

const favToggle= errorHandler(async(req,res,next)=>{
  const {_id}= req.params;
  const user = await usersModel.findById(req.userData._id);

  const message = await messgesModel.findById(_id);
    if (!message) {
      next(new Error("Message not found.", {cause:404}))
    }

    const messageIndex = user.myFav.indexOf(_id);

    if (messageIndex === -1) {
      // If the message is not in the favorites, add it
      user.myFav.push(_id);
    } else {
      // If the message is in the favorites, remove it
      user.myFav.splice(messageIndex, 1);
    }

   if(message.sendTo.toHexString() !== req.userData._id && message.sentFrom !== req.userData._id ){
    next(new Error("You have no access to this Message.", {cause:401}))
      
  }
  console.log(message, req.userData)
  await user.save();

  return res.status(201).json({count:user.myFav.length, myFav:user.myFav})
  
});

export {
  sendMessage,
  deleteMessage,
  getAllMessage,
  favToggle}