import mongoose, { Schema } from "mongoose";

const repoSchema = new Schema({
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    collectionId: {
        type: mongoose.Types.ObjectId,
        ref: "Collection",
        required: true
    },
    repoName: {
        type: String,
        required: true
    },
    repoOwnerUsername: {
        type: String,
        required: true
    },
    repoOwnerAvatar: {
        type: String,
        required: true
    },
    repoId: {
        type: String,
        required: true
    },
    language: {
        type: String,
    },
    topics: [{
        type: String,
    }],
}, { timestamps: true })

export const Repo = mongoose.models.Repo || mongoose.model("Repo", repoSchema)