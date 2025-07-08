import { CarAccesssory } from '../models/carAccessories.model.js'; // Update the path as per your project structure

// Add a new car accessory
export const addCarAccessory = async (req, res) => {
  try {
    const { inventoryName, brand, price, warranty,nextServicePeriod, userId } = req.body;

    if (!inventoryName || !userId) {
      return res.status(400).json({ message: 'Required fields are missing', success: false });
    }

    const newCarAccessory = new CarAccesssory({
      inventoryName,
      brand,
      price,
      warranty,
      nextServicePeriod,
      userId,
    });

    await newCarAccessory.save();
    res.status(201).json({ carAccessory: newCarAccessory, success: true });
  } catch (error) {
    console.error('Error adding car accessory:', error);
    res.status(500).json({ message: 'Failed to add car accessory', success: false });
  }
};

// Get all car accessories
export const getCarAccessories = async (req, res) => {
  try {
    const carAccessories = await CarAccesssory.find();
    if (!carAccessories) {
      return res.status(404).json({ message: 'No car accessories found', success: false });
    }
    res.status(200).json({ carAccessories, success: true });
  } catch (error) {
    console.error('Error fetching car accessories:', error);
    res.status(500).json({ message: 'Failed to fetch car accessories', success: false });
  }
};

// Get car accessory by ID
export const getCarAccessoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const carAccessory = await CarAccesssory.findById(id);
    if (!carAccessory) {
      return res.status(404).json({ message: 'Car accessory not found', success: false });
    }
    res.status(200).json({ carAccessory, success: true });
  } catch (error) {
    console.error('Error fetching car accessory:', error);
    res.status(500).json({ message: 'Failed to fetch car accessory', success: false });
  }
};

// Update car accessory by ID
export const updateCarAccessory = async (req, res) => {
  try {
    const { id } = req.params;
    const { inventoryName, brand, price, warranty,nextServicePeriod, userId } = req.body;

    const updatedData = {
      ...(inventoryName && { inventoryName }),
      ...(brand && { brand }),
      ...(price && { price }),
      ...(warranty && { warranty }),
      ...(nextServicePeriod && { nextServicePeriod }),
      ...(userId && { userId }),
    };

    const updatedCarAccessory = await CarAccesssory.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedCarAccessory) {
      return res.status(404).json({ message: 'Car accessory not found', success: false });
    }
    res.status(200).json({ carAccessory: updatedCarAccessory, success: true });
  } catch (error) {
    console.error('Error updating car accessory:', error);
    res.status(400).json({ message: 'Failed to update car accessory', success: false });
  }
};

// Delete car accessory by ID
export const deleteCarAccessory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCarAccessory = await CarAccesssory.findByIdAndDelete(id);
    if (!deletedCarAccessory) {
      return res.status(404).json({ message: 'Car accessory not found', success: false });
    }
    res.status(200).json({ carAccessory: deletedCarAccessory, success: true });
  } catch (error) {
    console.error('Error deleting car accessory:', error);
    res.status(500).json({ message: 'Failed to delete car accessory', success: false });
  }
};
