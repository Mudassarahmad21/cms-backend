const Order = require("../models/Order");
const Crop = require("../models/Crop");

// Place a new order (Client only)
exports.createOrder = async (req, res) => {
    try {
        const { items, totalPrice } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        const order = await Order.create({
            client: req.user._id,
            items,
            totalPrice
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get logged in user's orders (Client)
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ client: req.user._id })
            .populate("items.crop", "name price");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (Admin & Broker)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("client", "name email")
            .populate("items.crop", "name price");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status (Admin & Broker)
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = req.body.status || order.status;
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};