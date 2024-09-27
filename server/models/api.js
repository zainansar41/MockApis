import { response } from "express";
import mongoose, { Schema } from "mongoose";

const apiSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    requestType: {
        type: String,
        required: true,
    },
    response: {
        type: Schema.Types.Mixed,
    },
    statusCode: {
        type: Number,
        default: 200,
    },
    responseHeaders: {
        type: Schema.Types.Mixed,
    },
    contentType: {
        type: String,
        default: "application/json",
    },
    requestValidation: {
        headersSchema: Schema.Types.Mixed,
        querySchema: Schema.Types.Mixed,
        bodySchema: Schema.Types.Mixed,
        paramsSchema: Schema.Types.Mixed,
    },
    errorResponses: [
        {
            statusCode: Number,
            message: String,
            condition: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Api = mongoose.model("Api", apiSchema);
export default Api;
