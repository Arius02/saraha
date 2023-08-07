import Joi from "joi";

const generalSchema = {
  userData: Joi.object(
    {
      _id: Joi.string()
        .min(24)
        .max(24)
        .required()
    }),
  email: Joi.string()
   .email({ tlds: { allow: ['com', 'net', 'org'] } })
    
  ,
  password: Joi.string()
    .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)
    
  ,
}

export const signUpSchema = {
  body: Joi.object(
    {
      username: Joi.string()
        .min(3)
        .max(20)
        .required(),
      name: Joi.string()
        .min(3)
        .max(30)
        .required()
      ,
      email: generalSchema.email.required()
        ,
      password: generalSchema.password
        .required(),
      cPassword: Joi.ref("password"),
      gender: Joi.string()
        .pattern(/male|female/)
        .optional(),  
    }) 
};

export const signInSchema = {
  body: Joi.object(
    {
      email: generalSchema.email,
      password: generalSchema.password
    }
  ).required()
};


export const changePassSchema = {
  body: Joi.object(
    {
      oldPassword: generalSchema.password.required(),
      newPassword: generalSchema.password.required(),
      cPassword: Joi.ref("newPassword")
    }
  ),
  userData: generalSchema.userData
};

export const updateSchema = {
  body: Joi.object(
    {
      username: Joi.string()
        .min(3)
        .max(20)
        ,
      name: Joi.string()
        .min(3)
        .max(30)
        
      ,
      email: generalSchema.email
        ,
      gender: Joi.string()
        .pattern(/male|female/)
        ,
    }
  ).optional(),
  userData:generalSchema.userData
};
