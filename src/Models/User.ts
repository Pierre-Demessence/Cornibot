import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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

export default mongoose.model("User", userSchema);
