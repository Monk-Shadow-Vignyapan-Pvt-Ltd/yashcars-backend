import { ServicePlan } from '../models/servicePlan.model.js'; // Update path as needed
import moment from 'moment';
import { Customer } from "../models/customer.model.js";
import { io } from "../index.js";

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
     io.emit("servicePlanAddUpdate",  { success: true } );
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
    io.emit("servicePlanAddUpdate",  { success: true } );

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
    io.emit("servicePlanAddUpdate",  { success: true } );
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
    const { startDate, endDate, search } = req.query;

    const matchQuery = { status: "Completed" };

    // Date range filter
    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Search by customer name or phone or email
    if (search) {
      matchQuery.$or = [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } }
      ];
    }

    // Use aggregation to search in populated fields
    const aggregateQuery = [
      { $match: { status: "Completed" } },
      { $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customer"
      }},
      { $unwind: "$customer" },
    ];

    // Add optional filters
    if (startDate && endDate) {
      aggregateQuery.push({
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      });
    }

    if (search) {
      aggregateQuery.push({
        $match: {
          $or: [
            { "customer.name": { $regex: search, $options: "i" } },
            { "customer.email": { $regex: search, $options: "i" } },
            { "customer.phone": { $regex: search, $options: "i" } },
          ]
        }
      });
    }

    // Count total results
    const countQuery = [...aggregateQuery, { $count: "total" }];
    const totalResult = await ServicePlan.aggregate(countQuery);
    const total = totalResult[0]?.total || 0;

    // Paginated results
    aggregateQuery.push({ $sort: { createdAt: -1 } });
    aggregateQuery.push({ $skip: skip }, { $limit: limit });

    const completedPlans = await ServicePlan.aggregate(aggregateQuery);

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

export const getUserCompletedTasks = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search || '';
    let startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    let endDate = req.query.endDate ? new Date(req.query.endDate) : null;


   const pipeline = [
  { $unwind: "$servicePlan" },
  { $unwind: "$servicePlan.workers" },
  {
    $addFields: {
      "servicePlan.workers.dateCast": {
        $toDate: "$servicePlan.workers.completeTaskDate"
      }
    }
  },
  {
    $match: {
      "servicePlan.workers.value": userId,
      "servicePlan.workers.completeTask": true,
      ...(startDate && endDate && {
        "servicePlan.workers.dateCast": { $gte: startDate, $lte: endDate }
      }),
      ...(startDate && !endDate && {
        "servicePlan.workers.dateCast": { $gte: startDate }
      }),
      ...(!startDate && endDate && {
        "servicePlan.workers.dateCast": { $lte: endDate }
      }),
    }
  },
  {
    $lookup: {
      from: "customers",
      localField: "customer",
      foreignField: "_id",
      as: "customer"
    }
  },
  {
    $unwind: {
      path: "$customer",
      preserveNullAndEmptyArrays: true
    }
  },
  ...(searchQuery ? [{
    $match: {
      $or: [
        { "customer.name": { $regex: searchQuery, $options: "i" } },
        { "customer.phone": { $regex: searchQuery, $options: "i" } },
        { "customer.email": { $regex: searchQuery, $options: "i" } },
        { "customer.address": { $regex: searchQuery, $options: "i" } },
        { "carNo": { $regex: searchQuery, $options: "i" } },
      ]
    }
  }] : []),
  {
    $project: {
      _id: 1,
      purchaseType: 1,
      carBrand: 1,
      carName: 1,
      jobNo: 1,
      milege: 1,
      jobDate: 1,
      deliveryDate: 1,
      advisor: 1,
      carNo: 1,
      servicePlan: 1,
      subTotal: 1,
      gst: 1,
      grandTotal: 1,
      status: 1,
      customer: 1,
      userId: 1,
      createdAt: 1,
      updatedAt: 1,
      service: "$servicePlan.service",
      product: "$servicePlan.product",
      matchedWorker: "$servicePlan.workers",
      uploads: {
        $filter: {
          input: "$uploads",
          as: "upload",
          cond: {
            $and: [
              { $eq: ["$$upload.userId", userId] },
              { $eq: ["$$upload.serviceName", "$servicePlan.service"] }
            ]
          }
        }
      }
    }
  },
  { $sort: { "servicePlan.workers.completeTaskDate": -1 } },
  { $skip: skip },
  { $limit: limit }
];


    const tasks = await ServicePlan.aggregate(pipeline);

    // Count pipeline (before $project)
    const countPipeline = pipeline.slice(0, pipeline.findIndex(p => p.$project));
    countPipeline.push({ $count: "totalCount" }); 

    const countResult = await ServicePlan.aggregate(countPipeline);
    const totalCount = countResult[0]?.totalCount || 0;

    return res.status(200).json({
      success: true,
      completedTasks: tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching user completed tasks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user completed tasks",
    });
  }
};


