import mongoose, { Schema, Document } from "mongoose";

export interface Mute extends Document {
    user: string;
    author: string;
    dateEnd: Date;
    reason: string;
    channel: string;
    createdAt: Date;
}

const muteSchema = new Schema(
    {
        user: { type: String, ref: "User" },
        author: { type: String, ref: "User" },
        dateEnd: Date,
        reason: String,
        channel: String
    },
    { timestamps: true }
);

export default mongoose.model<Mute>("Mute", muteSchema);
