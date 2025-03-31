import { Brand } from "../models/brand.model.js";

// Add a new package
export const addBrand = async (req, res) => {
  try {

    const { brandName, userId } = req.body;

    if (!brandName  ) {
      return res
        .status(400)
        .json({
          message: "Please provide all required fields",
          success: false,
        });
    }

    // Create a new Package document
    const newBrand = new Brand({ brandName, userId });
    await newBrand.save();

    res
      .status(201)
      .json({
        message: "brand added successfully",
        brand: newBrand,
        success: true,
      });
  } catch (error) {
    console.error("Error adding/updating brand:", error);
    res
      .status(500)
      .json({ message: "Failed to process the request", success: false });
  }
};

export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();

    if (!brands) {
      return res
        .status(404)
        .json({ message: "No Brands found", success: false });
    }
    return res.status(200).json({
      brands: brands,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching Brands:", error);
    res.status(500).json({ message: "Failed to fetch Brands", success: false });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found', success: false });
    }
    res.status(200).json({ brand, success: true });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Failed to fetch brand', success: false });
  }
};

// Update a Brand
export const updateBrand = async (req, res) => {
  try {

    const { id } = req.params;
    const { brandName, userId } = req.body;

    const updatedData = { brandName, userId };

    const brand = await Brand.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!brand)
      return res
        .status(404)
        .json({ message: "Brand not found!", success: false });

    return res.status(200).json({ brand, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

export const deleteBrands = async (req, res) => {
  try {

    const { id } = req.params;

    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
      return res
        .status(404)
        .json({ message: "brand not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "brand deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting brand", error);
    res.status(500).json({ message: "Failed to delete brand", success: false });
  }
};
