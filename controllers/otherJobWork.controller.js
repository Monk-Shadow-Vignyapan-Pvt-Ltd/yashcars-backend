import { OtherJobWork } from '../models/otherJobWork.model.js'; // Update the path as per your structure

// Add a new other job work
export const addOtherJobWork = async (req, res) => {
  try {
    const { inventoryName, brand, price, warranty, nextServicePeriod, userId } = req.body;

    if (!inventoryName || !userId) {
      return res.status(400).json({ message: 'Required fields are missing', success: false });
    }

    const newJobWork = new OtherJobWork({
      inventoryName,
      brand,
      price,
      warranty,
      nextServicePeriod,
      userId,
    });

    await newJobWork.save();
    res.status(201).json({ jobWork: newJobWork, success: true });
  } catch (error) {
    console.error('Error adding other job work:', error);
    res.status(500).json({ message: 'Failed to add other job work', success: false });
  }
};

// Get all other job works
export const getOtherJobWorks = async (req, res) => {
  try {
    const jobWorks = await OtherJobWork.find();
    if (!jobWorks) {
      return res.status(404).json({ message: 'No other job works found', success: false });
    }
    res.status(200).json({ jobWorks, success: true });
  } catch (error) {
    console.error('Error fetching other job works:', error);
    res.status(500).json({ message: 'Failed to fetch other job works', success: false });
  }
};

// Get other job work by ID
export const getOtherJobWorkById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobWork = await OtherJobWork.findById(id);
    if (!jobWork) {
      return res.status(404).json({ message: 'Other job work not found', success: false });
    }
    res.status(200).json({ jobWork, success: true });
  } catch (error) {
    console.error('Error fetching other job work:', error);
    res.status(500).json({ message: 'Failed to fetch other job work', success: false });
  }
};

// Update other job work by ID
export const updateOtherJobWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { inventoryName, brand, price, warranty, nextServicePeriod, userId } = req.body;

    const updatedData = {
      ...(inventoryName && { inventoryName }),
      ...(brand && { brand }),
      ...(price && { price }),
      ...(warranty && { warranty }),
      ...(nextServicePeriod && { nextServicePeriod }),
      ...(userId && { userId }),
    };

    const updatedJobWork = await OtherJobWork.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedJobWork) {
      return res.status(404).json({ message: 'Other job work not found', success: false });
    }

    res.status(200).json({ jobWork: updatedJobWork, success: true });
  } catch (error) {
    console.error('Error updating other job work:', error);
    res.status(400).json({ message: 'Failed to update other job work', success: false });
  }
};

// Delete other job work by ID
export const deleteOtherJobWork = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJobWork = await OtherJobWork.findByIdAndDelete(id);
    if (!deletedJobWork) {
      return res.status(404).json({ message: 'Other job work not found', success: false });
    }
    res.status(200).json({ jobWork: deletedJobWork, success: true });
  } catch (error) {
    console.error('Error deleting other job work:', error);
    res.status(500).json({ message: 'Failed to delete other job work', success: false });
  }
};
