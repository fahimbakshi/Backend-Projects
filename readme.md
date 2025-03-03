backend project practice from yutube : cahnal: chai aur code 
# we have to maeke seprate files to better filie mangement and fro batter understing

# "src" firle: source file all main source code is present in src file

# in  package.jsom : we ad line before or after "main": "index.js" that is ("type":"module")

# instal nodemon : to restart the program aftter save any changes  : and do changes in packet.json ->in script section  add the line to run nodemon on that file . like we write in this program -> 
"dev" : "nodemon src/index.js

# we also make some folders in src folder(mkdir controllers db middlewares models routes utils) this all folders content all data ni manegable way

# install plug in prettier (npm i prettier) -> we have to make file for prettier (.prettierrc)
 # check about prettier  in documantation

# video 7 ->
# write DB conection steps of mongo DB from video -> and connect the DB to your code 

#  "-r dotenv/config --exprimental-json-modeules" we add this in json file iin sript section to use feature of dotenv
# after any cahange in .env file restart the progrma manually by ter minal using "npm run dev" or it's name can be cahge in other program .

# vdeo 8 ->
# see som parts in documrntation of npm
# multer - this pack used form aplogin filrs (read in documentation)

#  video 9 ->
# in this we dawnlode 2 packages (jsonwebtoken ,mongoose aggrigate paginate)
# also need some of mongoose hooks (see in mongoose documentation) in this program we use "pre" hook (in user.model.js file)
# see the "jwt" website ,jtw is like beairrar tokan ,whic is like key,when that key/tokan is resived form someone then we send data to them ,("ACCESS_TOKEN_SECRET=",in .env file) we used "SHA256" tool for  "ACCESS_TOKEN_SECRET=" seting encryption password on access token 

# video 10 ->
# making account on "cloudnary" and instal paket on our device (npm instal cloudinary)
# installing paket "multer"
# firt we make clloudnary data at local using maiking file,then we teransfet to .env file
# importing "fs" file system form handling file(read documentation)
# making multer file and importing multer,read document of multer on git for muddleware uplodefile

# video 12 ->
# we make controllres hear, in controllers folder
# making routes in routes folder ,all routes are write in routes folder,
# we declared routes in anoter folder that's why we have to use middelware method to routing in app.js(we use "app.use" insted of "app.get")
# in app.js "//routes declaration " bellow this sentence we write the rout code  which call the "user.controller.js" file in that we write all route whilwe want to exicute ,simle demostration on its URL :-
http://localhost:8000//api/v1/users/registerUser -> /api/v1/user is from app.js file & registerUser is from user.rroutes.js file  

# video 13 ->
# logic building in controller :-in -> "const registerUser" we write logic code  based on given bellow->
get user detail from fruntend(we will test this from postman)
validation on fildes -not empty
check if user already exist :- check from username,email
check fro images ,check for avater
uplode them to cloudinary,(check of avtar is uplode)(we added check on cloudinary) 
create user objects - create entry in db
remove password and refresh token field from response   
check for user creation 
return resopnse (if not return then send error)




