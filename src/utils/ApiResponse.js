class ApiResponse {   //same staps as ApiError
    constructor(statuscode,data,message ="success"){
        this.statuscode = statuscode
        this.data= data
        this.message= message
        this.seccess = statuscode <400 //read about statuscode (stauscode:- 200,400,500,etc)
    }
}

export{ApiResponse}