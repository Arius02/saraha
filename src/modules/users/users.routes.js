import { Router } from 'express';
import { deleteUser, logOut, signIn, signUp, updateUser ,confirmEmail, changePassword, getUser } from './users.controller.js';
import { userAuth } from '../../middleware/userAuth.js';
import { extensions, upload } from '../../services/multerUpload.js';
import { validationGate } from '../../middleware/validationGate.js';
import { changePassSchema, signInSchema, signUpSchema, updateSchema } from '../../validator/user.validator.js';

const router = Router()

router.post("/sign-up", upload(extensions.image).single("profilePicture"),validationGate(signUpSchema),signUp)
router.patch("/confirmEmail/:token", confirmEmail)
router.patch("/sign-in", validationGate(signInSchema),signIn)
router.get("/:param", getUser)
router.patch("/change-password",userAuth , validationGate(changePassSchema),changePassword)
router.put("/", userAuth , upload(extensions.image).single("profilePicture") ,validationGate(updateSchema),updateUser)
router.delete("/", userAuth,deleteUser)
router.patch("/logout", userAuth, logOut)



export default router
