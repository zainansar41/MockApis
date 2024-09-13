import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
});

const Project = mongoose.model("Project", projectSchema);

export default Project;