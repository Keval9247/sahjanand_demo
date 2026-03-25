const Domain = require("../models/domain.model");
const User = require("../models/user.model");

const userController = {
    createUser: async (req, res) => {
        try {

            const { name, email, password, role } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: "name, email and password are required." })
            }

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({ message: "user already exists." })
            }

            const user = await User.create({
                name, email, password, role: role || 'user'
            })

            res.status(201).json({
                message: "User created.",
                user: user
            })

        } catch (error) {
            return res.status(500).json({ message: "Error creating a User", error })

        }
    },

    getAllUsers: async (req, res) => {
        try {

            const users = await User.find({}).select('-password').sort({ createdAt: -1 })

            res.json({ count: users?.length, users })

        } catch (error) {
            return res.status(500).json({ message: "Error while getting all users.", error })

        }
    },

    updateUser: async (req, res) => {
        try {

            const { name, email, role, password } = req.body;

            let user = await User.findById(req.params.id);

            if (!user) {
                return res.status(500).json({ message: "user not found." })
            }

            if (name) user.name = name
            if (email) user.email = email
            if (role) user.role = role
            if (password) user.password = password

            await user.save();
            res.json({
                message: "User updated",
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            })

        } catch (error) {
            return res.status(500).json({ message: "Error while updating the user.", error })
        }
    },

    deleteUser: async (req, res) => {
        try {

            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(500).json({ message: "user not found." })
            }

            await Domain.deleteMany({ userId: req.params.id })
            await User.findByIdAndDelete(req.params.id)
            res.json({
                message: "User and associated domain deleted.",
                // _id: user._id,
                // name: user.name,
                // email: user.email,
                // role: user.role,
            })

        } catch (error) {
            return res.status(500).json({ message: "Error while deleting the user.", error })
        }
    },

    assignDomain: async (req, res) => {
        try {

            const { userId, domainName } = req.body;
            if (!userId || !domainName) {
                return res.status(500).json({ message: "user id and domain name are required." })
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(500).json({ message: "user not found." })
            }

            const existingDomain = await Domain.findOne({ domainName: domainName });

            if (existingDomain) {
                return res.status(500).json({ message: "Domain exist." })
            }

            const domain = await Domain.create({
                domainName: domainName,
                userId,
                status: 'active',
                assignedByAdmin: true
            })

            res.status(201).json({
                message: "domain assigned.",
                domain
            })

        } catch (error) {
            return res.status(500).json({ message: "Error while assigning the domain.", error })
        }
    },

    getAllDomains: async (req, res) => {
        try {

            const domains = await Domain.find({}).populate('userId', 'name email').sort({ createdAt: -1 })

            res.json({ count: domains?.length, domains })

        } catch (error) {
            return res.status(500).json({ message: "Error while getting all users.", error })

        }
    },

    deleteDomain: async (req, res) => {
        try {

            const domain = await Domain.findByIdAndDelete(req.params.id);

            if (!domain) {
                return res.status(500).json({ message: "Domain not found." })
            }

            // await Domain.deleteMany({ userID: req.params.id })
            // await User.findByIdAndDelete(req.params.id)
            res.json({
                message: "domain deleted.",
                // _id: user._id,
                // name: user.name,
                // email: user.email,
                // role: user.role,
            })

        } catch (error) {
            return res.status(500).json({ message: "Error while deleting the user.", error })
        }
    }
}

module.exports = userController;