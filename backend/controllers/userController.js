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
        if (college) user.college = college;
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
}
};
