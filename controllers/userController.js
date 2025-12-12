const { User } = require('../models');
const bcrypt = require('bcryptjs');

// Get all users (IT only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password_hash'] }
        });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Create user (IT only)
exports.createUser = async (req, res) => {
    const { name, email, password, phone, role, profile_image } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user
        user = await User.create({
            name,
            email,
            password_hash,
            phone,
            role: role || 'user',
            is_active: true,
            profile_image,
        });

        res.json({ message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update user (IT only)
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, role, password, profile_image } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (role) user.role = role;
        if (profile_image !== undefined) user.profile_image = profile_image;

        // Update password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password_hash = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.json({ message: 'User updated successfully', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete user (IT only)
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Toggle user active status (IT only)
exports.toggleUserStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.is_active = !user.is_active;
        await user.save();

        res.json({ message: 'User status updated', user: { id: user.id, name: user.name, is_active: user.is_active } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
