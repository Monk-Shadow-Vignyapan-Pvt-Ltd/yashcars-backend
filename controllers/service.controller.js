import { Service } from "../models/service.model.js";

import sharp from "sharp";

export const addService = async (req, res) => {
  try {
    const {
      serviceName,
      serviceDescription,
      serviceUsps,
      serviceQuality,
      schema,
      serviceImage,
      multiImages,
      hasWarranty,
      warranty,
      serviceUrl,
      seoTitle,
      seoDescription,
      serviceEnabled,
      price,
    } = req.body;


    const compressImage = async (base64String) => {
  if (!base64String.startsWith("data:image")) return base64String;

  const mimeType = base64String.split(";")[0].split(":")[1];
  const base64Data = base64String.split(";base64,").pop();
  const buffer = Buffer.from(base64Data, "base64");

  let compressedBuffer;
  let outputFormat = "jpeg"; // default

  if (mimeType === "image/png") {
    compressedBuffer = await sharp(buffer)
      .resize(800, 600, { fit: "inside" })
      .png({ quality: 90 })
      .toBuffer();
    outputFormat = "png";
  } else if (mimeType === "image/webp") {
    compressedBuffer = await sharp(buffer)
      .resize(800, 600, { fit: "inside" })
      .webp({ quality: 80 })
      .toBuffer();
    outputFormat = "webp";
  } else {
    compressedBuffer = await sharp(buffer)
      .resize(800, 600, { fit: "inside" })
      .jpeg({ quality: 80 })
      .toBuffer();
    outputFormat = "jpeg";
  }

  return `data:image/${outputFormat};base64,${compressedBuffer.toString("base64")}`;
};


    // Process mainPhoto
    const compressedServiceImage = await compressImage(serviceImage);

    // Process otherPhoto (array of images)
    const compressedMultiImages = await Promise.all(
      (multiImages || []).map(async (img) => await compressImage(img))
    );

    const newService = new Service({
      serviceName,
      serviceDescription,
      serviceUsps,
      serviceQuality,
      schema,
      serviceImage:compressedServiceImage,
      multiImages:compressedMultiImages,
      hasWarranty,
      warranty,
      serviceUrl,
      seoTitle,
      seoDescription,
      serviceEnabled,
      price,
    });

    await newService.save();
    res.status(201).json({ newService, success: true });
  } catch (error) {
    console.error("Error uploading service:", error);
    res
      .status(500)
      .json({ message: "Failed to upload service", success: false });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    if (!services) {
      return res.status(404).json({ message: 'No services found', success: false });
    }
    res.status(200).json({ services, success: true });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Failed to fetch services', success: false });
  }
};

export const getServicesFrontend = async (req, res) => {
  try {
    const services = await Service.find({serviceEnabled:true}).select(
      "serviceName serviceDescription serviceImage serviceUrl price"
    );
    if (!services)
      return res
        .status(404)
        .json({ message: "services not found", success: false });
    res.status(200).json({ services, success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to fetch services", success: false });
  }
};

export const getServiceByUrl = async (req, res) => {
  try {
    const serviceUrl = req.params.id;
    const service = await Service.findOne({ serviceUrl }); // Populating category data
    if (!service)
      return res
        .status(404)
        .json({ message: "service not found!", success: false });
         // Split categories string into array, trimming spaces

    // Find other products having at least one matching category (regex match)
    const randomServices = await Service.aggregate([
      {
        $match: {
          serviceEnabled: true,
          _id: { $ne: service._id },
        },
      },
      { $sample: { size: 8 } },
      {
        $project: {
          serviceName:1,
          serviceDescription: 1,
          serviceImage: 1,
          serviceUrl: 1,
          price:1
        },
      },
    ]);
    
    return res.status(200).json({ service,relatedServices:randomServices, success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to fetch service", success: false });
  }
};

// Update product by ID
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      serviceName,
      serviceDescription,
      serviceUsps,
      serviceQuality,
      schema,
      serviceImage,
      multiImages,
      hasWarranty,
      warranty,
      serviceUrl,
      seoTitle,
      seoDescription,
      serviceEnabled,
      price,
    } = req.body;

     const existingService = await Service.findById(id);
        if (!existingService) {
            return res.status(404).json({ message: "Service not found!", success: false });
        }

        // Initialize oldUrls array and add the previous serviceUrl if it's different
        let oldUrls = existingService.oldUrls || [];
        if (existingService.serviceUrl && existingService.serviceUrl !== serviceUrl && !oldUrls.includes(existingService.serviceUrl)) {
            oldUrls.push(existingService.serviceUrl);
        }

    const compressImage = async (base64String) => {
  if (!base64String.startsWith("data:image")) return base64String;

  const mimeType = base64String.split(";")[0].split(":")[1];
  const base64Data = base64String.split(";base64,").pop();
  const buffer = Buffer.from(base64Data, "base64");

  let compressedBuffer;
  let outputFormat = "jpeg"; // default

  if (mimeType === "image/png") {
    compressedBuffer = await sharp(buffer)
      .resize(800, 600, { fit: "inside" })
      .png({ quality: 90 })
      .toBuffer();
    outputFormat = "png";
  } else if (mimeType === "image/webp") {
    compressedBuffer = await sharp(buffer)
      .resize(800, 600, { fit: "inside" })
      .webp({ quality: 80 })
      .toBuffer();
    outputFormat = "webp";
  } else {
    compressedBuffer = await sharp(buffer)
      .resize(800, 600, { fit: "inside" })
      .jpeg({ quality: 80 })
      .toBuffer();
    outputFormat = "jpeg";
  }

  return `data:image/${outputFormat};base64,${compressedBuffer.toString("base64")}`;
};


    // Process mainPhoto
    const compressedServiceImage = await compressImage(serviceImage);

    // Process otherPhoto (array of images)
    const compressedMultiImages = await Promise.all(
      (multiImages || []).map(async (img) => await compressImage(img))
    );

    const updatedData = {
     serviceName,
      serviceDescription,
      serviceUsps,
      serviceQuality,
      schema,
      serviceImage:compressedServiceImage,
      multiImages:compressedMultiImages,
      hasWarranty,
      warranty,
      serviceUrl,
      oldUrls,
      seoTitle,
      seoDescription,
      serviceEnabled,
      price,
    };

    const updatedService = await Service.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedService) {
      return res
        .status(404)
        .json({ message: "service not found", success: false });
    }
    return res.status(200).json({ updatedService, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

export const onOffService = async (req, res) => {
  try {
    const { id } = req.params;
    let { serviceEnabled } = req.body;

    const service = await Service.findByIdAndUpdate(id, {serviceEnabled}, {
      new: true,
      runValidators: true,
    });
    if (!service)
      return res
        .status(404)
        .json({ message: "service not found!", success: false });
    return res.status(200).json({ service, success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, success: false });
  }
};

// Delete products by ID
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res
        .status(404)
        .json({ message: "service not found", success: false });
    }
    return res.status(200).json({ service, success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to delete service", success: false });
  }
};

