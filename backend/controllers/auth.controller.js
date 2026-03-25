const express = require('express');
const User = require('../models/user.model');
const { generateToken } = require('../auth/middleware');


const authController = {
    login: async (req, res) => {

        try {
            console.log("🚀🚀 Your selected text is => req.body: ", req.body);
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User not exists." })
            }

            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password." })
            }

            res.json({
                message: "Login successful",
                token: generateToken(user._id),
                user: user
            })


        } catch (error) {
            console.log("Error while doing login: ", error);
        }
    },
    getMe: async (req, res) => {
        res.json({
            id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role
        })
    }
}

module.exports = authController;