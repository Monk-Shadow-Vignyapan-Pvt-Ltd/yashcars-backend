import { Testimonial } from "../models/testimonial.model.js";
import sharp from "sharp";

// Add a new testimonial
export const addTestimonial = async (req, res) => {
  try {
    const { name, description, start, userId } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "name and description are required",
        success: false
      });
    }

    if (start == null || isNaN(Number(start))) {
      return res.status(400).json({
        message: "start must be a number",
        success: false
      });
    }

    const testimonial = await Testimonial.create({
      name,
      description,
      start: Number(start),
      userId
    });

    return res.status(201).json({
      testimonial,
      success: true
    });

  } catch (error) {
    console.error("Error adding testimonial:", error);
    return res.status(500).json({
      message: "Failed to add testimonial",
      success: false
    });
  }
};

// Get all testimonials
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      testimonials,
      success: true
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch testimonials",
      success: false
    });
  }
};

export const getFrontendTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      testimonials,
      success: true
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch testimonials",
      success: false
    });
  }
};

// Get testimonial by ID
export const getTestimonialById = async (req, res) => {
  try {
    const testimonialId = req.params.id;
    const testimonial = await Testimonial.findById(testimonialId);
    if (!testimonial)
      return res
        .status(404)
        .json({ message: "Testimonial not found!", success: false });
    return res.status(200).json({ testimonial, success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to fetch testimonial", success: false });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, start, userId } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "name and description are required",
        success: false
      });
    }

    if (start == null || isNaN(Number(start))) {
      return res.status(400).json({
        message: "start must be a number",
        success: false
      });
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      {
        name,
        description,
        start: Number(start),
        userId
      },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        message: "Testimonial not found",
        success: false
      });
    }

    return res.status(200).json({
      testimonial,
      success: true
    });

  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: error.message,
      success: false
    });
  }
};

// Delete testimonial by ID
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        message: "Testimonial not found",
        success: false
      });
    }

    return res.status(200).json({
      testimonial,
      success: true
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to delete testimonial",
      success: false
    });
  }
};

export const getTestimonialsHome = async (req, res) => {
  try {
    const testimonials = await Testimonial.aggregate([
      { $sample: { size: 10 } }, // Randomly sample 10 testimonials
      {
        $addFields: {
          selectedproductId: { $arrayElemAt: ["$productId", 0] }, // Extract the first productId from the array
          debugproductId: "$productId", // For debugging purposes, show the original productId
        },
      },
      {
        $addFields: {
          // Convert the selectedproductId to ObjectId if it's a string
          selectedproductId: {
            $toObjectId: "$selectedproductId", // Convert string to ObjectId
          },
        },
      },
      {
        $lookup: {
          from: "products", // Name of the services collection
          localField: "selectedproductId", // Use the converted ObjectId as the local field
          foreignField: "_id", // Match against the _id in the services collection
          as: "productDetails",
        },
      },
      {
        $unwind: {
          path: "$productDetails", // Unwind the productDetails array to get one service per testimonial
          preserveNullAndEmptyArrays: true, // Keep testimonials even if no matching service is found
        },
      },
      {
        $project: {
          // Retain all existing fields from the Testimonial
          _id: 1,
          name: 1,
          description: 1,
          videoAlt: 1,
          videoUrl: 1,
          start: 1,
          productId: 1,
          showForAll: 1,
          userId: 1,
        },
      },
    ]);

    if (!testimonials)
      return res
        .status(404)
        .json({ message: "Testimonials not found", success: false });
    return res.status(200).json({ testimonials });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to fetch testimonials", success: false });
  }
};
