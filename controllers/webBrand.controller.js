import sharp from "sharp";
import ExcelJS from "exceljs";
import { WebBrand } from "../models/webBrand.modal.js";

const compressImage = async (base64Image) => {
  const base64Data = base64Image.split(";base64,").pop();
  const buffer = Buffer.from(base64Data, "base64");

  const compressedBuffer = await sharp(buffer)
    .resize(800, 600, { fit: "inside" })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
    })
    .toBuffer();

  return `data:image/png;base64,${compressedBuffer.toString("base64")}`;
};

// Add a new Brand
export const addBrand = async (req, res) => {
  try {
    const {
      brandName,
      brandImage,
      userId,
    } = req.body;

    // Extract base64 data
    const base64Data = brandImage.split(";base64,").pop();
    const buffer = Buffer.from(base64Data, "base64");

    // Detect transparency
    const metadata = await sharp(buffer).metadata();

    let processedBuffer;
    let mimeType;

    if (metadata.hasAlpha) {
      // Preserve transparency (PNG)
      processedBuffer = await sharp(buffer)
        .resize(800, 600, { fit: "inside" })
        .png({ compressionLevel: 9 })
        .toBuffer();

      mimeType = "image/png";
    } else {
      // No transparency → JPEG
      processedBuffer = await sharp(buffer)
        .resize(800, 600, { fit: "inside" })
        .jpeg({ quality: 80 })
        .toBuffer();

      mimeType = "image/jpeg";
    }

    const finalImage = `data:${mimeType};base64,${processedBuffer.toString(
      "base64"
    )}`;

    // Save the Brand in MongoDB
    const newBrand = new WebBrand({
      brandName,
      brandImage: finalImage,
      userId,
    });

    await newBrand.save();
    res.status(201).json({ newBrand, success: true });
  } catch (error) {
    console.error("Error uploading Brand:", error);
    res.status(500).json({ message: "Failed to upload Brand", success: false });
  }
};

// Get all Brands
export const getBrands = async (req, res) => {
  try {
    let { page = 1, search = "", limit = 12 } = req.query;

    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const filter = {};

    if (search) {
      filter.brandName = { $regex: search, $options: "i" };
    }

    const totalBrands = await WebBrand.countDocuments(filter);

    const brands = await WebBrand.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      brands,
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBrands / limit),
        totalBrands,
      },
    });
  } catch (error) {
    console.log("getBrands error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch Brands", success: false });
  }
};

export const getFrontendBrands = async (req, res) => {

  try {
    let { page = 1, search = "", limit = 12 } = req.query;

    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const filter = {};

    if (search) {
      filter.brandName = { $regex: search, $options: "i" };
    }

    const totalBrands = await WebBrand.countDocuments(filter);

    const brands = await WebBrand.find(filter).select("-brandImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      brands,
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBrands / limit),
        totalBrands,
      },
    });
  } catch (error) {
    console.log("getBrands error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch Brands", success: false });
  }
};

export const getBrandImageById = async (req, res) => {

  try {
    const { id } = req.params;

    console.log("Fetching brand image for ID:", id);
    

    const brand = await WebBrand.findById(id).select("brandImage");
    if (!brand || !brand.brandImage) {
      return res.status(404).send("Image not found");
    }

    const image = brand.brandImage;

    if (image.startsWith("data:")) {
      const [meta, base64] = image.split(",");
      const mime = meta.split(";")[0].replace("data:", "");
      const buffer = Buffer.from(base64, "base64");
      res.set("Content-Type", mime);
      return res.send(buffer);
    }

    return res.json({ type: "text", content: image });
  } catch (err) {
    res.status(500).send("Error loading brand image");
  }
};

// ✅ Get Brand by ID
export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await WebBrand.findById(id);
    if (!brand) {
      return res
        .status(404)
        .json({ message: "Brand not found", success: false });
    }

    return res.status(200).json({ brand, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch Brand", success: false });
  }
};

// ✅ Update Brand by ID
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { brandName, brandImage, userId } = req.body;

    const brand = await WebBrand.findById(id);
    if (!brand) {
      return res
        .status(404)
        .json({ message: "Brand not found", success: false });
    }

    // Update fields only if provided
    if (brandName) brand.brandName = brandName;
    if (typeof userId !== "undefined") brand.userId = userId;

    if (brandImage) {
      const compressedBase64 = await compressImage(brandImage);
      brand.brandImage = compressedBase64;
    }

    await brand.save();

    return res.status(200).json({
      brand,
      success: true,
      message: "Brand updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: error.message || "Failed to update Brand", success: false });
  }
};

// ✅ Delete Brand by ID
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await WebBrand.findByIdAndDelete(id);
    if (!brand) {
      return res
        .status(404)
        .json({ message: "Brand not found", success: false });
    }

    return res.status(200).json({
      brand,
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to delete Brand", success: false });
  }
};

export const downloadBrandsExcel = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Please provide startDate and endDate (YYYY-MM-DD)",
        success: false,
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const brands = await WebBrand.find({
      createdAt: { $gte: start, $lte: end },
    }).sort({ createdAt: -1 });

    if (!brands.length) {
      return res.status(404).json({
        message: "No brands found in this date range",
        success: false,
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Brand");

    worksheet.columns = [
      { header: "Brand Title", key: "brandName", width: 25 },
      { header: "User ID", key: "userId", width: 24 },
      { header: "Created At", key: "createdAt", width: 18 },
    ];

    brands.forEach((b) => {
      worksheet.addRow({
        brandName: b.brandName,
        userId: b.userId?.toString() || "",
        createdAt: b.createdAt
          ? b.createdAt.toISOString().split("T")[0]
          : "",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=brands_${startDate}_to_${endDate}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).json({
      message: "Failed to generate Excel",
      success: false,
    });
  }
};
