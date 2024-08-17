import mongoose, { Schema } from "mongoose";

const collectionSchema = new Schema({
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
}, { timestamps: true })

export const Collection = mongoose.models.Collection || mongoose.model("Collection", collectionSchema)