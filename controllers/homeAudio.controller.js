import { HomeAudio } from '../models/homeAudio.model.js'; // Update the path as per your project structure

// Add a new car accessory
export const addHomeAudio = async (req, res) => {
  try {
    const { inventoryName, brand, price, warranty, userId } = req.body;

    if (!inventoryName || !userId) {
      return res.status(400).json({ message: 'Required fields are missing', success: false });
    }

    const homeAudio = new HomeAudio({
      inventoryName,
      brand,
      price,
      warranty,
      userId,
    });

    await homeAudio.save();
    res.status(201).json({ homeAudio: homeAudio, success: true });
  } catch (error) {
    console.error('Error adding home audio:', error);
    res.status(500).json({ message: 'Failed to add home audio', success: false });
  }
};

// Get all car accessories
export const getHomeAudios = async (req, res) => {
  try {
    const homeAudios = await HomeAudio.find();
    if (!homeAudios) {
      return res.status(404).json({ message: 'No home audios found', success: false });
    }
    res.status(200).json({ homeAudios, success: true });
  } catch (error) {
    console.error('Error fetching home audios:', error);
    res.status(500).json({ message: 'Failed to fetch home audios', success: false });
  }
};

// Get car accessory by ID
export const getHomeAudioById = async (req, res) => {
  try {
    const { id } = req.params;
    const homeAudio = await HomeAudio.findById(id);
    if (!homeAudio) {
      return res.status(404).json({ message: 'home audio not found', success: false });
    }
    res.status(200).json({ homeAudio, success: true });
  } catch (error) {
    console.error('Error fetching home audio:', error);
    res.status(500).json({ message: 'Failed to fetch home audio', success: false });
  }
};

// Update car accessory by ID
export const updateHomeAudio = async (req, res) => {
  try {
    const { id } = req.params;
    const { inventoryName, brand, price, warranty, userId } = req.body;

    const updatedData = {
      ...(inventoryName && { inventoryName }),
      ...(brand && { brand }),
      ...(price && { price }),
      ...(warranty && { warranty }),
      ...(userId && { userId }),
    };

    const updatedHomeAudio = await HomeAudio.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedHomeAudio) {
      return res.status(404).json({ message: 'home audio not found', success: false });
    }
    res.status(200).json({ homeAudio: updatedHomeAudio, success: true });
  } catch (error) {
    console.error('Error updating home audio:', error);
    res.status(400).json({ message: 'Failed to update home audio', success: false });
  }
};

// Delete car accessory by ID
export const deleteHomeAudio = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHomeAudio = await HomeAudio.findByIdAndDelete(id);
    if (!deletedHomeAudio) {
      return res.status(404).json({ message: 'home audio not found', success: false });
    }
    res.status(200).json({ homeAudio: deletedHomeAudio, success: true });
  } catch (error) {
    console.error('Error deleting home audio:', error);
    res.status(500).json({ message: 'Failed to delete home audio', success: false });
  }
};
