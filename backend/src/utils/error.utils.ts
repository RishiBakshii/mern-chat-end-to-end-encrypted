export class CustomError extends Error {
    constructor(message:string='Interval Server Error', public statusCode:number=500){
        super(message)
    }
}