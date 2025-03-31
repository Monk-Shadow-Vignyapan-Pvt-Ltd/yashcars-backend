import { CarWashing } from "../models/carWashing.model.js"; // Update the path as per your project structure

// Add a new car washing service
export const addCarWashing = async (req, res) => {
  try {
    const { carWashingName, carType, price, userId } = req.body;

    if (!carWashingName || !carType || !userId) {
      return res.status(400).json({ message: "Required fields are missing", success: false });
    }

    const newCarWashing = new CarWashing({
      carWashingName,
      carType,
      price,
      userId,
    });

    await newCarWashing.save();
    res.status(201).json({ carWashing: newCarWashing, success: true });
  } catch (error) {
    console.error("Error adding car washing service:", error);
    res.status(500).json({ message: "Failed to add car washing service", success: false });
  }
};

// Get all car washing services
export const getCarWashings = async (req, res) => {
  try {
    const carWashings = await CarWashing.find();
    res.status(200).json({ carWashings, success: true });
  } catch (error) {
    console.error("Error fetching car washing services:", error);
    res.status(500).json({ message: "Failed to fetch car washing services", success: false });
  }
};

// Get car washing service by ID
export const getCarWashingById = async (req, res) => {
  try {
    const { id } = req.params;
    const carWashing = await CarWashing.findById(id);
    if (!carWashing) {
      return res.status(404).json({ message: "Car washing service not found", success: false });
    }
    res.status(200).json({ carWashing, success: true });
  } catch (error) {
    console.error("Error fetching car washing service:", error);
    res.status(500).json({ message: "Failed to fetch car washing service", success: false });
  }
};

// Update car washing service by ID
export const updateCarWashing = async (req, res) => {
  try {
    const { id } = req.params;
    const { carWashingName, carType, price, userId } = req.body;

    const updatedData = {
      ...(carWashingName && { carWashingName }),
      ...(carType && { carType }),
      ...(price && { price }),
      ...(userId && { userId }),
    };

    const updatedCarWashing = await CarWashing.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCarWashing) {
      return res.status(404).json({ message: "Car washing service not found", success: false });
    }

    res.status(200).json({ carWashing: updatedCarWashing, success: true });
  } catch (error) {
    console.error("Error updating car washing service:", error);
    res.status(400).json({ message: "Failed to update car washing service", success: false });
  }
};

// Delete car washing service by ID
export const deleteCarWashing = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCarWashing = await CarWashing.findByIdAndDelete(id);
    if (!deletedCarWashing) {
      return res.status(404).json({ message: "Car washing service not found", success: false });
    }
    res.status(200).json({ carWashing: deletedCarWashing, success: true });
  } catch (error) {
    console.error("Error deleting car washing service:", error);
    res.status(500).json({ message: "Failed to delete car washing service", success: false });
  }
};
