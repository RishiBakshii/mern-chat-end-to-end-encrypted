import mongoose from "mongoose";
import { env } from "../schemas/env.schema.js";

export const connectDB = async()=>{
    try {
        const {connection} = await mongoose.connect(env.MONGO_URI)
        console.log(`connected to DB ~ ${connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}