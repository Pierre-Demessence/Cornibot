import mongoose, { Schema, Document } from "mongoose";

export interface Mute extends Document {
    user: string;
    author: string;
    dateEnd: Date;
    channel: string;
}

const muteSchema = new Schema({
    user: { type: String, ref: "User" },
    author: { type: String, ref: "User" },
    dateEnd: Date,
    channel: String
});

export default mongoose.model<Mute>("Mute", muteSchema);
