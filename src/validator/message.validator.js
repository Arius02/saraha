import Joi from "joi"

const generalSchema ={ 
  params: Joi.object(
    {
      _id: Joi.string()
        .length(24)
        .required()
    })
}
export const sendMessageSchema = {
  body: Joi.object(
    {
      content: Joi.string()
        .min(3)
        .max(300)
        sentFrom: Joi.string()
        .length(24)
        .optional()
    }
  ),
}
export const deleteSchema = {
  params: generalSchema.params.required()
}

export const favToggleSchema ={
    params:generalSchema.params.required()

}
