import { Gallary } from '../models/gallary.model.js'; // Import the Gallary model
import sharp from 'sharp';

/* =========================================================
   🔹 GLOBAL SAFE IMAGE COMPRESSOR
========================================================= */
const compressImage = async (base64Image) => {
    try {
        if (!base64Image) return null;

        // Already stored image
        if (!base64Image.startsWith("data:image")) {
            return base64Image;
        }

        const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
        if (!matches) return base64Image;

        const buffer = Buffer.from(matches[2], "base64");

        const compressedBuffer = await sharp(buffer)
            .resize(1200, 800, { fit: "inside" })
            .jpeg({ quality: 80 })
            .toBuffer();

        return `data:image/jpeg;base64,${compressedBuffer.toString("base64")}`;

    } catch (err) {
        console.error("Sharp compression failed:", err.message);
        return base64Image; // prevent crash
    }
};

/* =========================================================
   🔹 COMPRESS SECTION IMAGES
========================================================= */
const compressAllImages = async (others = []) => {
    if (!Array.isArray(others)) return [];

    return await Promise.all(
        others.map(async (section) => {
            if (!Array.isArray(section.images)) return section;

            const compressedImages = await Promise.all(
                section.images.map(async (img, index) => {
                    const base64 = img?.file || img;
                    const compressed = await compressImage(base64);

                    if (!compressed) return null;

                    return {
                        ...img,
                        file: compressed,
                        index,
                    };
                })
            );

            return {
                ...section,
                images: compressedImages.filter(Boolean),
            };
        })
    );
};

/* =========================================================
   🔹 COMPRESS MULTI IMAGES
========================================================= */
const compressMultiImages = async (multiImages = []) => {
    if (!Array.isArray(multiImages)) return [];

    return await Promise.all(
        multiImages.map(async (img, index) => {

            // ✅ Support all shapes
            const base64 =
                typeof img === "string"
                    ? img
                    : img?.file || img?.image || null;

            if (!base64) return null;

            const compressed = await compressImage(base64);
            if (!compressed) return null;

            return {
                file: compressed,
                index,
            };
        })
    ).then(res => res.filter(Boolean));
};

/* =========================================================
   🔹 ADD GALLERY
========================================================= */
export const addGallery = async (req, res) => {
    try {
        let { others, multiImages = [], gallaryEnabled, userId } = req.body;

        others = await compressAllImages(others);

        // ✅ normalize dashboard DTO
        const normalizedMulti = multiImages.map(img => ({
            file: img?.image || img?.file || img
        }));

        multiImages = await compressMultiImages(normalizedMulti);

        const newGallery = await Gallary.create({
            others,
            multiImages,
            gallaryEnabled,
            userId,
        });

        return res.status(201).json({
            newGallery,
            success: true,
        });

    } catch (error) {
        console.error("Error uploading gallery:", error);
        return res.status(500).json({
            message: "Failed to upload gallery",
            success: false,
        });
    }
};

/* =========================================================
   🔹 GET GALLERIES
========================================================= */
export const getGalleries = async (req, res) => {
    try {
        const galleries = await Gallary.find().select("").sort({ createdAt: -1 });

        return res.status(200).json({
            galleries,
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch galleries",
            success: false,
        });
    }
};

/* =========================================================
   🔹 GET GALLERIES
========================================================= */
export const getFrontendGalleries = async (req, res) => {
    try {
        const galleries = await Gallary.find().select("-multiImages.file")

        return res.status(200).json({
            galleries,
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch galleries",
            success: false,
        });
    }
};

/* =========================================================
   🔹 GET MULTI IMAGE BY GALLERY ID + INDEX (OPTIMIZED)
========================================================= */
export const getGalleryMultiImages = async (req, res) => {
    try {
        const { id, index } = req.params;
        const imgIndex = Number(index);

        // ✅ Validate index early
        if (Number.isNaN(imgIndex) || imgIndex < 0) {
            return res.status(400).json({
                message: "Invalid image index",
                success: false,
            });
        }

        // ✅ Fetch only required image using Mongo slice
        const gallery = await Gallary.findById(id)
            .select({ multiImages: { $slice: [imgIndex, 1] } })
            .lean();

        if (!gallery || !gallery.multiImages?.[0]?.file) {
            return res.status(404).json({
                message: "Image not found",
                success: false,
            });
        }

        const imageData = gallery.multiImages[0].file;

        // ✅ Parse base64
        const match = imageData.match(/^data:([^;]+);base64,(.+)$/);
        if (!match) {
            return res.status(400).json({
                message: "Invalid image format",
                success: false,
            });
        }

        const mimeType = match[1];
        const buffer = Buffer.from(match[2], "base64");

        // ✅ Strong CDN/browser caching
        res.set({
            "Content-Type": mimeType,
            "Content-Length": buffer.length,
            "Cache-Control": "public, max-age=31536000, immutable",
        });

        return res.send(buffer);

    } catch (error) {
        console.error("getGalleryMultiImages error:", error);
        return res.status(500).json({
            message: "Failed to fetch image",
            success: false,
        });
    }
};

export const getGalleryOthers = async (req, res) => {
    try {
        const galleries = await Gallary.find(
            { gallaryEnabled: true },
            { "others.sectionName": 1, "others.images.file": 1, _id: 0 }
        ).lean();

        if (!galleries.length) {
            return res.status(404).json({
                message: "No gallery data found",
                success: false,
            });
        }

        // Flatten structure (remove outer document level)
        const others = galleries.flatMap(g => g.others);

        return res.status(200).json({
            others,
            success: true,
        });

    } catch (error) {
        console.error("Error fetching gallery others:", error);
        return res.status(500).json({
            message: "Failed to fetch gallery images",
            success: false,
        });
    }
};

// Get Gallery by ID
export const getGalleryById = async (req, res) => {
    try {
        const galleryId = req.params.id;
        const gallery = await Gallary.findById(galleryId);
        if (!gallery) {
            return res.status(404).json({ message: "Gallery not found", success: false });
        }
        return res.status(200).json({ gallery, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch gallery', success: false });
    }
};

/* =========================================================
   🔹 UPDATE GALLERY
========================================================= */
export const updateGallery = async (req, res) => {
    try {
        const { id } = req.params;
        let { others, multiImages, gallaryEnabled, userId } = req.body;

        others = await compressAllImages(others);
        multiImages = await compressMultiImages(multiImages);

        const updatedGallery = await Gallary.findByIdAndUpdate(
            id,
            { others, multiImages, gallaryEnabled, userId },
            { new: true, runValidators: true }
        );

        if (!updatedGallery) {
            return res.status(404).json({
                message: "Gallery not found",
                success: false,
            });
        }

        return res.status(200).json({
            updatedGallery,
            success: true,
        });

    } catch (error) {
        console.error("Error updating gallery:", error);
        return res.status(400).json({
            message: error.message,
            success: false,
        });
    }
};


// Delete Gallery by ID
export const deleteGallery = async (req, res) => {
    try {
        const { id } = req.params;
        const gallery = await Gallary.findByIdAndDelete(id);
        if (!gallery) {
            return res.status(404).json({ message: "Gallery not found", success: false });
        }
        return res.status(200).json({ gallery, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete gallery', success: false });
    }
};
