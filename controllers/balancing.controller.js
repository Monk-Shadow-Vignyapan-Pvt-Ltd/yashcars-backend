import { Balancing } from '../models/balancing.model.js'; // Update the path as per your project structure

// Add a new balancing service
export const addBalancing = async (req, res) => {
  try {
    const { type, price, userId } = req.body;

    if (!type || !userId) {
      return res.status(400).json({ message: 'Required fields are missing', success: false });
    }

    const newBalancing = new Balancing({ type, price, userId });
    await newBalancing.save();

    res.status(201).json({ balancing: newBalancing, success: true });
  } catch (error) {
    console.error('Error adding balancing service:', error);
    res.status(500).json({ message: 'Failed to add balancing service', success: false });
  }
};

// Get all balancing services
export const getBalancings = async (req, res) => {
  try {
    const balancings = await Balancing.find();
    res.status(200).json({ balancings, success: true });
  } catch (error) {
    console.error('Error fetching balancing services:', error);
    res.status(500).json({ message: 'Failed to fetch balancing services', success: false });
  }
};

// Get balancing service by ID
export const getBalancingById = async (req, res) => {
  try {
    const { id } = req.params;
    const balancing = await Balancing.findById(id);
    if (!balancing) {
      return res.status(404).json({ message: 'Balancing service not found', success: false });
    }
    res.status(200).json({ balancing, success: true });
  } catch (error) {
    console.error('Error fetching balancing service:', error);
    res.status(500).json({ message: 'Failed to fetch balancing service', success: false });
  }
};

// Update balancing service by ID
export const updateBalancing = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, price, userId } = req.body;

    const updatedData = {
      ...(type && { type }),
      ...(price && { price }),
      ...(userId && { userId }),
    };

    const updatedBalancing = await Balancing.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBalancing) {
      return res.status(404).json({ message: 'Balancing service not found', success: false });
    }

    res.status(200).json({ balancing: updatedBalancing, success: true });
  } catch (error) {
    console.error('Error updating balancing service:', error);
    res.status(400).json({ message: 'Failed to update balancing service', success: false });
  }
};

// Delete balancing service by ID
export const deleteBalancing = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBalancing = await Balancing.findByIdAndDelete(id);
    if (!deletedBalancing) {
      return res.status(404).json({ message: 'Balancing service not found', success: false });
    }
    res.status(200).json({ balancing: deletedBalancing, success: true });
  } catch (error) {
    console.error('Error deleting balancing service:', error);
    res.status(500).json({ message: 'Failed to delete balancing service', success: false });
  }
};
