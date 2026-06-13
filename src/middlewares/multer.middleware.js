import multer from "multer";
import path from "path"

//this code is copyed from multer of git,this is "disk" storage but there are many thpye of storage method on git
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp") //path of file where we store all uplode file
    },
    // first code 1
    // filename: function (req, file, cb) {
    //   cb(null, file.originalname)
    // }
    //second code 2 work same as first code with different mwthod 
    filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
  })
  
 export  const upload = multer( {
     storage, 
    })
