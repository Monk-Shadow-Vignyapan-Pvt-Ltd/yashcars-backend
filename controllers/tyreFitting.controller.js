import { TyreFitting } from '../models/tyreFitting.model.js'; // Update the path as per your project structure

// Add a new tyre fitting
export const addTyreFitting = async (req, res) => {
  try {
    const {  brand,tyreName, size,type, price, warranty,nextServicePeriod, userId } = req.body;

    if (  !tyreName || !userId) {
      return res.status(400).json({ message: 'Required fields are missing', success: false });
    }

    const newTyreFitting = new TyreFitting({
      brand,
      tyreName,
      size,
      type,
      price,
      warranty,
      nextServicePeriod,
      userId,
    });

    await newTyreFitting.save();
    res.status(201).json({ tyreFitting: newTyreFitting, success: true });
  } catch (error) {
    console.error('Error adding tyre fitting:', error);
    res.status(500).json({ message: 'Failed to add tyre fitting', success: false });
  }
};

// Get all tyre fittings
export const getTyreFittings = async (req, res) => {
  try {
    const tyreFittings = await TyreFitting.find();
    if (!tyreFittings) {
      return res.status(404).json({ message: 'No tyre fittings found', success: false });
    }
    res.status(200).json({ tyreFittings, success: true });
  } catch (error) {
    console.error('Error fetching tyre fittings:', error);
    res.status(500).json({ message: 'Failed to fetch tyre fittings', success: false });
  }
};

// Get tyre fitting by ID
export const getTyreFittingById = async (req, res) => {
  try {
    const { id } = req.params;
    const tyreFitting = await TyreFitting.findById(id);
    if (!tyreFitting) {
      return res.status(404).json({ message: 'Tyre fitting not found', success: false });
    }
    res.status(200).json({ tyreFitting, success: true });
  } catch (error) {
    console.error('Error fetching tyre fitting:', error);
    res.status(500).json({ message: 'Failed to fetch tyre fitting', success: false });
  }
};

// Update tyre fitting by ID
export const updateTyreFitting = async (req, res) => {
  try {
    const { id } = req.params;
    const {  brand,tyreName, size,type, price, warranty,nextServicePeriod, userId } = req.body;

    const updatedData = {
      ...(brand && { brand }),
      ...(tyreName && { tyreName }),
      ...(size && { size }),
      ...(type && { type }),
      ...(price && { price }),
      ...(warranty && { warranty }),
      ...(nextServicePeriod && { nextServicePeriod }),
      ...(userId && { userId }),
    };

    const updatedTyreFitting = await TyreFitting.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTyreFitting) {
      return res.status(404).json({ message: 'Tyre fitting not found', success: false });
    }
    res.status(200).json({ tyreFitting: updatedTyreFitting, success: true });
  } catch (error) {
    console.error('Error updating tyre fitting:', error);
    res.status(400).json({ message: 'Failed to update tyre fitting', success: false });
  }
};

// Delete tyre fitting by ID
export const deleteTyreFitting = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTyreFitting = await TyreFitting.findByIdAndDelete(id);
    if (!deletedTyreFitting) {
      return res.status(404).json({ message: 'Tyre fitting not found', success: false });
    }
    res.status(200).json({ tyreFitting: deletedTyreFitting, success: true });
  } catch (error) {
    console.error('Error deleting tyre fitting:', error);
    res.status(500).json({ message: 'Failed to delete tyre fitting', success: false });
  }
};