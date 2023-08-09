import jwt from 'jsonwebtoken';
import { usersModel } from '../../DB/models/users.models.js';
import getToken from '../utils/barrerToken.js';


// Middleware for authentication
export const userAuth = async (req, res, next) => {
  // try {
    const bearerToken = req.header('token');
    // Extract the isBearer flag and token using the getToken utility function
    const { isBearer, token } = getToken(bearerToken);

    // Verify the token and decode the user
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  console.log(decoded)
    const user = await usersModel.findById(decoded._id) 
    // Check if the token is in the correct format
    if (!isBearer) {
      return res.status(400).json({ message: 'Invalid token format.', status: false });
    } 
    else if (user === null){
      return res.status(400).json({ message: 'User not exist.', status:false });
    }
    if (req.url === "/logout") {
      req.userData = decoded;
      next()
    }
     else if (user.isLogged === false) {     
      return res.status(400).json({ message: 'you have no access to do this please signin first.' });
    }
      else{
      // Store the decoded user data in the request object for future use
      req.userData = decoded;
      req.token = token
      next();
   }
  // } catch (error) {
  //   // Return any verification errors as a response
  //   return res.status(401).json({ message: 'Invalid or expired token.', status: false ,error});
  // }
};

