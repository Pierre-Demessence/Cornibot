import mongoose, { Schema } from "mongoose";

const muteSchema = new Schema({
    _id: Schema.Types.ObjectId,
    user: { type: Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("User", muteSchema);
