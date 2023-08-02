import { Router } from 'express';
import {  deleteMessage, getAllMessage, sendMessage, addToFav } from './messages.controller.js';
import { userAuth } from '../../middleware/userAuth.js';
import { messageAuth } from '../../middleware/messageAuth.js';
import {validationGate} from '../../middleware/validationGate.js'
import { deleteSchema, sendMessageSchema , addToFavSchema} from '../../validator/message.validator.js';
const router = Router()
router.post("/:username", userAuth, messageAuth,validationGate(sendMessageSchema),sendMessage)
router.delete("/:_id", userAuth, validationGate(deleteSchema),deleteMessage)
router.get("/", userAuth, getAllMessage)
router.patch("/:_id", userAuth, validationGate(addToFavSchema) ,addToFav)


export default router;