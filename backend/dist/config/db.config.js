var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import { env } from "../schemas/env.schema.js";
export const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { connection } = yield mongoose.connect(env.MONGO_URI);
        console.log(`connected to DB ~ ${connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
//# sourceMappingURL=db.config.js.map