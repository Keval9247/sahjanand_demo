/**
 * Seed script to create an initial admin user in MongoDB
 * Usage: node seedAdmin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// ====== CONFIGURATION ======
const MONGO_URI = process.env.MONGO_URI; // Change DB name
const ADMIN_NAME = 'Admin';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '123'; // Change to a secure password
const ADMIN_ROLE = 'admin';

// ====== USER SCHEMA ======
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const User = mongoose.model('User', userSchema);

// ====== SEED FUNCTION ======
async function seedAdmin() {
    try {
        await mongoose.connect(MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true
        });

        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
        if (existingAdmin) {
            console.log('⚠️ Admin user already exists. Skipping creation.');
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        // Create admin user
        const adminUser = new User({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: ADMIN_ROLE
        });

        await adminUser.save();
        console.log('🎉 Admin user created successfully!');
    } catch (error) {
        console.error('❌ Error seeding admin user:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the seed function
seedAdmin();
