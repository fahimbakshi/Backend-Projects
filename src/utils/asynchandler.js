//this will make method and export it // we use two method here
//method -2 using promices
const asynchandler = (requesthandler) => {
      return (req, res, next) => {
        // Fix the typo: change process.resolve to Promise.resolve
        Promise.resolve(requesthandler(req, res, next)).catch((err) => next(err));
      };
    };
    
    export { asynchandler };
    
    



// //this is higherorder function (for understing)
// const asynchandler = (fn)=> ()=>{}
// const asynchandler = (fn)=>async()=>{} //if we want to make async higherorder

//method -1

// const asynchandler = (fn) => async (req,res,next) => {
//     try {
//         await fn( req,res,next)
//     } catch (error) {
//         res.status(error.coed ||500).json({
//             succes:false,
//             message:err.message 
//         })
//     }
// }//we take(ers,res,next) from the (fn) & also we can take array 

