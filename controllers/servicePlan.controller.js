import { ServicePlan } from '../models/servicePlan.model.js'; // Update path as needed
import moment from 'moment';
import { Customer } from "../models/customer.model.js";

// Add a new service plan
export const addServicePlan = async (req, res) => {
  try {
    const {
      carBrand, carName,  milege, deliveryDate,purchaseType,
      advisor, carNo, servicePlan, subTotal, gst, grandTotal,
      status,name,phone,email,address,userId
    } = req.body;

     if (!name || !phone) {
      return res.status(400).json({ message: 'Customer name and phone are required', success: false });
    }

    // 1. Check for existing customer by phone
    let customer = await Customer.findOne({ phone });

    // 2. If not exists, create a new customer
    if (!customer) {
      customer = await Customer.create({ name, phone, email, address,userId });
    }

     const now = new Date();
    const formattedDate = moment(now).format('DD-MM-YYYY');
    const prefix = 'YC';

    // Generate order ID
    const dateStart = moment().startOf('day').toDate();
    const dateEnd = moment().endOf('day').toDate();

    const todayOrders = await ServicePlan.find({
      createdAt: { $gte: dateStart, $lte: dateEnd },
      jobNo: { $regex: `^${prefix}-${formattedDate}-` }
    });

    const orderNumber = String(todayOrders.length + 1).padStart(4, '0');
    const jobNo = `${prefix}-${formattedDate}-${orderNumber}`;
    const jobDate = new Date();

    const newServicePlan = new ServicePlan({
      purchaseType,
      carBrand, carName, jobNo, milege, jobDate, deliveryDate,
      advisor, carNo, servicePlan, subTotal, gst, grandTotal,
      status, customer,userId
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

export const updateServicePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      carBrand, carName, milege, deliveryDate,purchaseType,
      advisor, carNo, servicePlan, subTotal, gst, grandTotal,
      status, name, phone, email, address, userId,
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Customer name and phone are required', success: false });
    }

    // 1. Find or create customer
    let customer = await Customer.findOne({ phone });

    if (!customer) {
      customer = await Customer.create({ name, phone, email, address, userId });
    }

    // 2. Update service plan with new data + customer ID
    const updatedServicePlan = await ServicePlan.findByIdAndUpdate(
      id,
      {
        carBrand,
        purchaseType,
        carName,
        milege,
        deliveryDate,
        advisor,
        carNo,
        servicePlan,
        subTotal,
        gst,
        grandTotal,
        status,
        customer: customer._id,
        userId
      },
      {
        new: true,
        runValidators: true
      }
    );

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
    res.status(200).json({ servicePlans: pendingPlans.reverse(), success: true });
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

// Update uploads for a service plan
export const updateServicePlanUploads = async (req, res) => {
  try {
    const { id } = req.params;
    const { uploads } = req.body;

    if (!uploads) {
      return res.status(400).json({ message: 'Uploads are required', success: false });
    }

    const updatedServicePlan = await ServicePlan.findByIdAndUpdate(
      id,
      { uploads },
      { new: true, runValidators: true }
    );

    if (!updatedServicePlan) {
      return res.status(404).json({ message: 'Service plan not found', success: false });
    }

    res.status(200).json({ servicePlan: updatedServicePlan, success: true });
  } catch (error) {
    console.error('Error updating uploads:', error);
    res.status(500).json({ message: 'Failed to update uploads', success: false });
  }
};
