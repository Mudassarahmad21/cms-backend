const Crop = require("../models/Crop");

exports.createCrop = async (req, res) => {
  try {
    const crop = await Crop.create({
      ...req.body,
      farmer: req.user._id,
    });
    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCrops = async (req, res) => {
  try {
    const { search, type, minPrice, maxPrice } = req.query;
    let query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (type) query.type = type;
    if (minPrice || maxPrice) {
      query.price = {
        ...(minPrice && { $gte: Number(minPrice) }),
        ...(maxPrice && { $lte: Number(maxPrice) }),
      };
    }

    const crops = await Crop.find(query).populate("farmer", "name email");
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    if (
      crop.farmer.toString() !== req.user._id.toString() &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    await crop.deleteOne();
    res.json({ message: "Crop deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
