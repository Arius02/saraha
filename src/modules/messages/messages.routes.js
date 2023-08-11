import { Router } from 'express';
import {  deleteMessage, getAllMessage, sendMessage, favToggle } from './messages.controller.js';
import { userAuth } from '../../middleware/userAuth.js';
import {validationGate} from '../../middleware/validationGate.js'
import { deleteSchema, sendMessageSchema , favToggleSchema} from '../../validator/message.validator.js';
const router = Router()
router.post("/:username", validationGate(sendMessageSchema),sendMessage)
router.delete("/:_id", userAuth, validationGate(deleteSchema),deleteMessage)
router.get("/", userAuth, getAllMessage)
router.patch("/:_id", userAuth, validationGate(favToggleSchema) ,favToggle)


export default router;