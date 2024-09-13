import User from "../models/usersModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

// @desc    Register a new user

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    await user.save()


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })

    res.status(201).json({
        token,
        message: "User registered successfully",
        success: true,
    });
    try {
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({
            email
        })

        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: '30d'
                })

                res.status(201).json({ token, success: true, message: "Logged In Successfully!" })
            }
            else {
                res.status(400).json({ message: "Invalid Email or Password!", success: false })
            }
        }else{
            res.status(400).json({ message: "We didn't find this email", success: false })
        }

    } catch (error) {
        res.status(500).json({ error })
    }
}

export async function getUser(req, res) {
    try {
        const user = await User.findById(req.user.id
        );
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }
        res.status(200).json({ user, success: true, message: "User verified successfully!" });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}

export async function updateUser(req, res) {
    try {
        const user = await User.findByIdAndUpdate(req
            .user.id, req.body, { new: true });
        res.status(200).json({ user, success: true, message: "User updated successfully!" });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}


export async function deleteUser(req, res) {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ user, success: true, message: "User deleted successfully!" });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}
