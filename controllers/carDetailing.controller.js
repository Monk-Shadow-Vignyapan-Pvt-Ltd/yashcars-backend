import { CarDetailing } from '../models/carDetailing.model.js'; // Update the path as per your project structure

// Add a new car detailing service
export const addCarDetailing = async (req, res) => {
  try {
    const { carDetailingName, carType, brand, price, warranty,nextServicePeriod, userId } = req.body;

    if (!carDetailingName || !carType   || !userId) {
      return res.status(400).json({ message: 'Required fields are missing', success: false });
    }

    const newCarDetailing = new CarDetailing({
      carDetailingName,
      carType,
      brand,
      price,
      warranty,
      nextServicePeriod,
      userId,
    });

    await newCarDetailing.save();
    res.status(201).json({ carDetailing: newCarDetailing, success: true });
  } catch (error) {
    console.error('Error adding car detailing service:', error);
    res.status(500).json({ message: 'Failed to add car detailing service', success: false });
  }
};

// Get all car detailing services
export const getCarDetailings = async (req, res) => {
  try {
    const carDetailings = await CarDetailing.find();
    res.status(200).json({ carDetailings, success: true });
  } catch (error) {
    console.error('Error fetching car detailing services:', error);
    res.status(500).json({ message: 'Failed to fetch car detailing services', success: false });
  }
};

// Get car detailing service by ID
export const getCarDetailingById = async (req, res) => {
  try {
    const { id } = req.params;
    const carDetailing = await CarDetailing.findById(id);
    if (!carDetailing) {
      return res.status(404).json({ message: 'Car detailing service not found', success: false });
    }
    res.status(200).json({ carDetailing, success: true });
  } catch (error) {
    console.error('Error fetching car detailing service:', error);
    res.status(500).json({ message: 'Failed to fetch car detailing service', success: false });
  }
};

// Update car detailing service by ID
export const updateCarDetailing = async (req, res) => {
  try {
    const { id } = req.params;
    const { carDetailingName, carType, brand, price, warranty,nextServicePeriod, userId } = req.body;

    const updatedData = {
      ...(carDetailingName && { carDetailingName }),
      ...(carType && { carType }),
      ...(brand && { brand }),
      ...(price && { price }),
      ...(warranty && { warranty }),
      ...(nextServicePeriod && { nextServicePeriod }),
      ...(userId && { userId }),
    };

    const updatedCarDetailing = await CarDetailing.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCarDetailing) {
      return res.status(404).json({ message: 'Car detailing service not found', success: false });
    }

    res.status(200).json({ carDetailing: updatedCarDetailing, success: true });
  } catch (error) {
    console.error('Error updating car detailing service:', error);
    res.status(400).json({ message: 'Failed to update car detailing service', success: false });
  }
};

// Delete car detailing service by ID
export const deleteCarDetailing = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCarDetailing = await CarDetailing.findByIdAndDelete(id);
    if (!deletedCarDetailing) {
      return res.status(404).json({ message: 'Car detailing service not found', success: false });
    }
    res.status(200).json({ carDetailing: deletedCarDetailing, success: true });
  } catch (error) {
    console.error('Error deleting car detailing service:', error);
    res.status(500).json({ message: 'Failed to delete car detailing service', success: false });
  }
};