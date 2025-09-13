class ApiError extends Error{
    constructor(
        statuscode,
        message = "something went wrong",
        errors =[],
        stack =""

    ) {   //overrideing constructor it is part of constructor  
        super(message)      //when we override constructor we alwase write "super"
        this.statuscode = statuscode
        this.data = null
        this.message = message
        this.success =false  //success=false because we are handling errors
        this.errors =errors

        if(stack){   //this used to track the error,and shor error poroparly 
           this.stack=stack   
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
 
export{ApiError}