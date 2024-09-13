import { response } from "express";
import mongoose, { Schema } from "mongoose";

const apiSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },
    link: {
        type: String,
        required: true,
    },
    requestType: {
        type: String,
        required: true,
    },
    response:{
        type: Schema.Types.Mixed,
    },
    body:{
        type: Schema.Types.Mixed,
    },
    headers:{
        type: Schema.Types.Mixed,
    },
    params:{
        type: Schema.Types.Mixed,
    },
    query:{
        type: Schema.Types.Mixed,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
});

const Api = mongoose.model("Api", apiSchema);

export default Api;