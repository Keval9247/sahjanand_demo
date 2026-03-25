const Domain = require("../models/domain.model");
const User = require("../models/user.model");

const domainController = {
    createDomain: async (req, res) => {
        try {

            const { domainName } = req.body;
            if (!domainName) {
                return res.status(500).json({ message: "domainName are required." })
            }

            const existingDomain = await Domain.findOne({ domainName: domainName });

            if (existingDomain) {
                return res.status(500).json({ message: "Domain exist." })
            }

            const domain = await Domain.create({
                domainName: domainName,
                userId: req.user._id,
                status: 'active',
                assignedByAdmin: false
            })

            res.status(201).json({
                message: "domain created.",
                domain
            })

        } catch (error) {
            return res.status(500).json({ message: "Error while creating the domain.", error })
        }
    },

    getMyDomain: async (req, res) => {
        try {

            const domains = await Domain.find({ userId: req.user._id }).sort({ createdAt: -1 })

            res.json({ count: domains?.length, domains })

        } catch (error) {
            return res.status(500).json({ message: "Error while getting domain.", error })

        }
    },

    deleteDomain: async (req, res) => {
        try {

            const domain = await Domain.findByIdAndDelete(req.params.id);

            if (!domain) {
                return res.status(500).json({ message: "Domain not found." })
            }

            if (domain.userId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Not authorized to delete." })
            }

            await Domain.findByIdAndDelete(req.params.id)

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

module.exports = domainController;