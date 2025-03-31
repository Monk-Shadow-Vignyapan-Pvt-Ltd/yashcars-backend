import { AudioWork } from '../models/audioWork.model.js'; // Update the path as per your project structure

// Add a new audio work
export const addAudioWork = async (req, res) => {
  try {
    const { audioWorkName, brand, price, warranty, userId } = req.body;

    if (!audioWorkName  || !userId) {
      return res.status(400).json({ message: 'Required fields are missing', success: false });
    }

    const newAudioWork = new AudioWork({
      audioWorkName,
      brand,
      price,
      warranty,
      userId,
    });

    await newAudioWork.save();
    res.status(201).json({ audioWork: newAudioWork, success: true });
  } catch (error) {
    console.error('Error adding audio work:', error);
    res.status(500).json({ message: 'Failed to add audio work', success: false });
  }
};

// Get all audio works
export const getAudioWorks = async (req, res) => {
  try {
    const audioWorks = await AudioWork.find();
    if (!audioWorks) {
      return res.status(404).json({ message: 'No audio works found', success: false });
    }
    res.status(200).json({ audioWorks, success: true });
  } catch (error) {
    console.error('Error fetching audio works:', error);
    res.status(500).json({ message: 'Failed to fetch audio works', success: false });
  }
};

// Get audio work by ID
export const getAudioWorkById = async (req, res) => {
  try {
    const { id } = req.params;
    const audioWork = await AudioWork.findById(id);
    if (!audioWork) {
      return res.status(404).json({ message: 'Audio work not found', success: false });
    }
    res.status(200).json({ audioWork, success: true });
  } catch (error) {
    console.error('Error fetching audio work:', error);
    res.status(500).json({ message: 'Failed to fetch audio work', success: false });
  }
};

// Update audio work by ID
export const updateAudioWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { audioWorkName, brand, price, warranty, userId } = req.body;

    const updatedData = {
      ...(audioWorkName && { audioWorkName }),
      ...(brand && { brand }),
      ...(price && { price }),
      ...(warranty && { warranty }),
      ...(userId && { userId }),
    };

    const updatedAudioWork = await AudioWork.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedAudioWork) {
      return res.status(404).json({ message: 'Audio work not found', success: false });
    }
    res.status(200).json({ audioWork: updatedAudioWork, success: true });
  } catch (error) {
    console.error('Error updating audio work:', error);
    res.status(400).json({ message: 'Failed to update audio work', success: false });
  }
};

// Delete audio work by ID
export const deleteAudioWork = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAudioWork = await AudioWork.findByIdAndDelete(id);
    if (!deletedAudioWork) {
      return res.status(404).json({ message: 'Audio work not found', success: false });
    }
    res.status(200).json({ audioWork: deletedAudioWork, success: true });
  } catch (error) {
    console.error('Error deleting audio work:', error);
    res.status(500).json({ message: 'Failed to delete audio work', success: false });
  }
};
