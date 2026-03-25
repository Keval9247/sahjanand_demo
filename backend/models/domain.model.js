const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
    domainName: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    assignedByAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Domain = mongoose.model('Domain', domainSchema);

module.exports = Domain;
