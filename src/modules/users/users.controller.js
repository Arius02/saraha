import bcrypt from "bcryptjs";
import { usersModel } from "../../../DB/models/users.models.js"
import { errorHandler } from "../../utils/errorHandling.js";
import jwt from "jsonwebtoken";
// import confirmMessage from "../../services/confirmMessage.js";
import { sendEmail } from "../../services/sendingMail.js";
import { message } from "../../utils/confirmationMessage.js";
import cloudinary from "../../utils/cloudinaryConfiguration.js";

const signUp = errorHandler(async (req, res, next) => {
  // Extract password, confirmPassword, and other user data from the request body
 try {
  const { password, cPassword, email ,username} = req.body;
  // Hash the password using the specified salt rounds
  const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));

  // Check if the passwords match
  if (password != cPassword) {
    return res.status(401).json({ message: "Passwords don't match.", status: false });
  }
  const token = jwt.sign(email,process.env.CONFIRMATION_TOKEN_SECRET_KEY);

  // Send an email to the user with the confirmation token
  const confirmationLink = `${req.protocol}://${req.header.host}/users/confirmEmail/${token}`;

  const confirmationMessage = message(confirmationLink);

  await sendEmail({to:email, subject:"Confirmation Email", html:confirmationMessage});

  // Create a new user with the provided user data and hashed password
  const {secure_url,public_id }= await cloudinary.uploader.upload(
    req.file.path,
    {
      folder:`users/${username}`,
      use_filename:true
    
  });
  
  await usersModel.create({ ...req.body, password: hashedPassword, profilePicture:{secure_url,public_id}});
  // Return a success response if the user was created successfully
  return res.status(201).json({ message: "User created successfully.", status:true });
 } catch (error) {
  res.json(error)
 }
});

//confirm email
const confirmEmail = errorHandler( async (req, res, next) => {
  const { token } = req.params
  const decoded = jwt.verify(token, process.env.CONFIRMATION_EMAIL_TOKEN)

  const isConfirmedCheck = await usersModel.findOne({ email: decoded.email })
  if (isConfirmedCheck.isConfirmed) {
    return res.status(400).json({ message: 'Your email is already confirmed' })
  }
  const user = await usersModel.findOneAndUpdate(
    { email: decoded.email },
    { isConfirmed: true },
    {
      new: true,
    },
  )
  res.status(200).json({ message: 'Confirmed Done please try to login', user })
});

// sign in 
const signIn = errorHandler(async (req, res, next) => {
  
    let user;
    const { email, password, username } = req.body
    if(email){
       user = await usersModel.findOneAndUpdate({email},{
        isLogged:true
      }) 
    } else {
       user = await usersModel.findOneAndUpdate({ username }, {
        isLogged: true
      }) 
    }
    if (user && bcrypt.compareSync(password,user.password)){
      const token = jwt.sign({ ...user }, process.env.TOKEN_SECRET_KEY, { expiresIn: "240h"})
      res.status(200).json({message:"user logged successfully.",status:true, token:token})
    } else {
      // Return an error response if user not found or password is incorrect
      return res.status(401).json({ message: "User not found or password is incorrect.", status: false });
    }
    
  
})


// change password(user must be logged in)
const changePassword = (async (req, res, next) => {
  const { oldPassword, newPassword, cPassword } = req.body;
  if(!Object.keys(req.body).length){
    return res.status(400).json({ message: 'Please send data that shloud be updated.',  status: false });
      }
  const { _id } = req.userData
  // Find the user based on his ID
  const user = await usersModel.findById( _id );

  // Check if the old password matches the user's stored password
  if (!bcrypt.compareSync(oldPassword, user.password)) {
    return res.status(401).json({ message: "Old password is wrong.", status:false });
  } else if (newPassword !== cPassword) {
    // Check if the new password and confirm password match
    return res.status(401).json({ message: "Passwords don't match.", status:false });
  } else {
    // Hash the new password and update the user's password
    const hashedPassword = bcrypt.hashSync(newPassword, parseInt(process.env.SALT_ROUNDS));
    await usersModel.findByIdAndUpdate(_id, { password: hashedPassword });

    // Return success message
    return res.status(201).json({ message: "Password has been changed successfully.", status:true });
  }
});

// update 
const updateUser = errorHandler(async(req, res, next)=>{
  
    const {_id}= req.userData
    console.log(req.body)
    if(!Object.keys(req.body).length){
  return res.status(400).json({ message: 'Please send data that shloud be updated.',  status: false });
    }
    const updatedUser= await usersModel.findByIdAndUpdate(_id,{
      ...req.body
    },{new:true})
  return res.status(200).json({ message: 'User updated successfully.', user: updatedUser, status: true });
});

// delete
const deleteUser = errorHandler(async(req, res, next)=>{
    const {_id}= req.userData
    const user=await usersModel.findByIdAndDelete(_id)
    return res.status(200).json({ message: 'User deleted successfully.' , status:true });
})


//logout
const logOut = errorHandler(async (req, res, next) => {
  const { email } = req.userData
  const user= await usersModel.findOneAndUpdate({ email }, {
    isLogged: false
  })
console.log(user)
  return res.status(200).json({ message: "user log out successfully." , status:true})
});


export {
  signUp, 
  signIn,
  updateUser,
  deleteUser,
  logOut,
  confirmEmail,
  changePassword,
}