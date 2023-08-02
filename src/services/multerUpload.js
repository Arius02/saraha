import multer from "multer";

export const extensions=  {image:["png","jpg","jpeg","image/jpeg","image/jpg","image/png"]}

export const upload = (allowedExtensions)=>{

   const storage= multer.diskStorage({})

const fileFilter = function (req, file, cb) {

    if (allowedExtensions.includes(file.mimetype)) {
      return cb(null, true)
    }
    cb(new Error('invalid extension', { cause: 400 }), false)
  }
  const fileUpload = multer({
    fileFilter,
    storage,
  })

  return fileUpload
}
