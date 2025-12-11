const User = require("../models/User");
const College = require("../models/College");


// profile 
// api/buyer/profile
exports.getProfile = async (req, res) => {
    try {   
        const user = await User.findById(req.user.userId).select('-password').populate('college', 'name');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { name, email, college, role } = user;
        res.status(200).json({ name, email, college, role });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// profile update
// api/buyer/profile/update
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { name, email, password, college } = req.body;
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;
        // Allow updating college by name (string) or id
        if (college) {
            try {
                // If college looks like an ObjectId, set directly; else resolve by name
                const isObjectId = /^[a-fA-F0-9]{24}$/.test(college);
                if (isObjectId) {
                    user.college = college;
                } else {
                    const col = await College.findOne({ name: college });
                    if (!col) {
                        return res.status(400).json({ error: 'Invalid college' });
                    }
                    user.college = col._id;
                }
            } catch (e) {
                console.error('Error resolving college:', e);
                return res.status(500).json({ error: 'Failed to update college' });
            }
        }
        await user.save();
        // Return updated basic profile fields
        const populated = await User.findById(user._id).select('-password').populate('college', 'name');
        res.status(200).json({
            message: 'Profile updated successfully',
            name: populated.name,
            email: populated.email,
            college: populated.college?.name || '',
            role: populated.role,
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
}
};
