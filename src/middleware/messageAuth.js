import { usersModel } from "../../DB/models/users.models.js"

export const messageAuth = async (req,res,next)=>{
  const {  sendTo } = req.body
  const checkUser = await usersModel.findById(sendTo)
  if (checkUser === null) {
    return res.status(400).json({ message: "the user that you try to send the message for him is not found." , status:false })
  }
  next()
}