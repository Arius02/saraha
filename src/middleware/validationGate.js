const reqMethods = ['body', 'query', 'params', 'headers', 'file']

export const validationGate = (schema) => {
  return (req, res, next) => {
    // req
    if(typeof req.body.data !== "object" && req.body.data !== undefined){
        req.body = JSON.parse(req.body.data)
    }
    const validationErrorArr = []
    for (const key of reqMethods) {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        }) // error
        if (validationResult.error) {
          validationErrorArr.push(validationResult.error.details)
        }
      }
    }

    if (validationErrorArr.length) {
      return res
        .status(400)
        .json({ message: 'Validation Error', Errors: validationErrorArr })
    }

    next()
  }
}

