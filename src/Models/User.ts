import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    discordID: String,
    nbMessages: Number
});

export default mongoose.model("User", userSchema);
