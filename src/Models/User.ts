import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    _id: string;
    nbMessages: number;
    karmaReceived: number;
    karmaGiven: number;
}

const userSchema = new Schema({
    _id: String,
    nbMessages: {
        type: Number,
        default: 0
    },
    karmaReceived: {
        type: Number,
        default: 0
    },
    karmaGiven: {
        type: Number,
        default: 0
    }
});

export default mongoose.model<User>("User", userSchema);
