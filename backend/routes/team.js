const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/verifyToken');
const bcrypt = require('bcryptjs');

// Helper to check if user is agency plan
const isAgencyPlan = (user) => {
    // We treat 'business' as the top-tier plan (Agency Scale)
    return user.plan === 'business';
};

// ==========================================
// GET /api/team - List team members
// ==========================================
router.get('/', verifyToken, async (req, res) => {
    try {
        if (!isAgencyPlan(req.user)) {
            return res.status(403).json({ error: 'Team management is only available on the Agency plan.' });
        }

        if (req.user.role !== 'owner') {
            return res.status(403).json({ error: 'Only the account owner can manage the team.' });
        }

        const members = await User.find({ parentAccountId: req.user._id })
            .select('-password -__v -resetPasswordToken -resetPasswordExpires');
        
        res.json({ members });
    } catch (error) {
        console.error('Error fetching team members:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==========================================
// POST /api/team/invite - Invite a new team member
// ==========================================
router.post('/invite', verifyToken, async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if (!isAgencyPlan(req.user)) {
            return res.status(403).json({ error: 'Team management is only available on the Agency plan.' });
        }

        if (req.user.role !== 'owner') {
            return res.status(403).json({ error: 'Only the account owner can invite members.' });
        }

        if (!email || !name || !password) {
            return res.status(400).json({ error: 'Email, name, and password are required for the new member.' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered in the system.' });
        }

        // Limit check: (e.g., max 5 members)
        const currentMembersCount = await User.countDocuments({ parentAccountId: req.user._id });
        if (currentMembersCount >= 5) {
            return res.status(400).json({ error: 'Team limit reached (max 5 members).' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the member account
        const newMember = new User({
            name,
            email,
            password: hashedPassword,
            role: 'member',
            parentAccountId: req.user._id,
            plan: req.user.plan, // Inherit plan
            isEmailVerified: true // Auto-verify team members
        });

        await newMember.save();

        // Add to owner's teamMembers array
        await User.findByIdAndUpdate(req.user._id, {
            $push: { teamMembers: newMember._id }
        });

        res.status(201).json({ message: 'Team member added successfully', member: newMember });
    } catch (error) {
        console.error('Error inviting team member:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==========================================
// DELETE /api/team/:id - Remove a team member
// ==========================================
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        if (!isAgencyPlan(req.user)) {
            return res.status(403).json({ error: 'Team management is only available on the Agency plan.' });
        }

        if (req.user.role !== 'owner') {
            return res.status(403).json({ error: 'Only the account owner can remove members.' });
        }

        const memberId = req.params.id;

        // Verify the member belongs to this owner
        const member = await User.findOne({ _id: memberId, parentAccountId: req.user._id });
        if (!member) {
            return res.status(404).json({ error: 'Team member not found or does not belong to you.' });
        }

        // Delete the member user account
        await User.findByIdAndDelete(memberId);

        // Remove from owner's teamMembers array
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { teamMembers: memberId }
        });

        res.json({ message: 'Team member removed successfully' });
    } catch (error) {
        console.error('Error removing team member:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
