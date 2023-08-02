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
        .required()
      ,
      sendTo: Joi.string()
        .length(24)
        .required(),
    }
  ),
}
export const deleteSchema = {
  params: generalSchema.params.required()
}

export const addToFavSchema ={
    params:generalSchema.params.required()

}
