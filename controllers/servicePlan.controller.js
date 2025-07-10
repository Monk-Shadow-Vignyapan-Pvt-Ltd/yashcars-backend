import { ServicePlan } from '../models/servicePlan.model.js'; // Update path as needed

// Add a new service plan
export const addServicePlan = async (req, res) => {
  try {
    const {
      carBrand, carName, jobNo, milege, jobDate, deliveryDate,
      advisor, carNo, servicePlan, subTotal, gst, grandTotal,
      status, customer
    } = req.body;

    if (!jobNo  || !customer) {
      return res.status(400).json({ message: 'Required fields are missing', success: false });
    }

    const newServicePlan = new ServicePlan({
      carBrand, carName, jobNo, milege, jobDate, deliveryDate,
      advisor, carNo, servicePlan, subTotal, gst, grandTotal,
      status, customer
    });

    await newServicePlan.save();
    res.status(201).json({ servicePlan: newServicePlan, success: true });
  } catch (error) {
    console.error('Error adding service plan:', error);
    res.status(500).json({ message: 'Failed to add service plan', success: false });
  }
};

// Get all service plans
export const getServicePlans = async (req, res) => {
  try {
    const servicePlans = await ServicePlan.find().populate('customer');
    res.status(200).json({ servicePlans, success: true });
  } catch (error) {
    console.error('Error fetching service plans:', error);
    res.status(500).json({ message: 'Failed to fetch service plans', success: false });
  }
};

// Get service plan by ID
export const getServicePlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const servicePlan = await ServicePlan.findById(id).populate('customer');
    if (!servicePlan) {
      return res.status(404).json({ message: 'Service plan not found', success: false });
    }
    res.status(200).json({ servicePlan, success: true });
  } catch (error) {
    console.error('Error fetching service plan:', error);
    res.status(500).json({ message: 'Failed to fetch service plan', success: false });
  }
};

// Update service plan by ID
export const updateServicePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedServicePlan = await ServicePlan.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedServicePlan) {
      return res.status(404).json({ message: 'Service plan not found', success: false });
    }

    res.status(200).json({ servicePlan: updatedServicePlan, success: true });
  } catch (error) {
    console.error('Error updating service plan:', error);
    res.status(400).json({ message: 'Failed to update service plan', success: false });
  }
};

// Delete service plan by ID
export const deleteServicePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlan = await ServicePlan.findByIdAndDelete(id);
    if (!deletedPlan) {
      return res.status(404).json({ message: 'Service plan not found', success: false });
    }
    res.status(200).json({ servicePlan: deletedPlan, success: true });
  } catch (error) {
    console.error('Error deleting service plan:', error);
    res.status(500).json({ message: 'Failed to delete service plan', success: false });
  }
};

// Get pending service plans (status === "Pending")
export const getPendingServicePlans = async (req, res) => {
  try {
    const pendingPlans = await ServicePlan.find({ status: "Pending" }).populate('customer');
    res.status(200).json({ servicePlans: pendingPlans, success: true });
  } catch (error) {
    console.error('Error fetching pending service plans:', error);
    res.status(500).json({ message: 'Failed to fetch pending service plans', success: false });
  }
};

// Get completed service plans (status === "Completed") with pagination
export const getCompletedServicePlans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [completedPlans, total] = await Promise.all([
      ServicePlan.find({ status: "Completed" })
        .populate('customer')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      ServicePlan.countDocuments({ status: "Completed" })
    ]);

    res.status(200).json({
      servicePlans: completedPlans,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
      success: true
    });
  } catch (error) {
    console.error('Error fetching completed service plans:', error);
    res.status(500).json({ message: 'Failed to fetch completed service plans', success: false });
  }
};
