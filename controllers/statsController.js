const Crop = require("../models/Crop");
const User = require("../models/User");
const Order = require("../models/Order");

exports.getDashboardStats = async (req, res) => {
    try {
        const totalCrops = await Crop.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        // Revenue calculation for charts
        const revenueData = await Order.aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);

        // Crops by Category for Pie Chart
        const categoryStats = await Crop.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } }
        ]);

        res.json({
            cards: {
                crops: totalCrops,
                users: totalUsers,
                orders: totalOrders,
                revenue: revenueData[0]?.total || 0
            },
            charts: categoryStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};