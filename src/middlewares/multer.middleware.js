import multer from "multer";

//this code is copyed from multer of git,this is "disk" storage but there are many thpye of storage method on git
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp") //path of file where we store all uplode file
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
 export  const upload = multer( {
     storage, 
    })
