import { Customer } from "../models/customer.model.js"; // Update the path as needed

// Add a new customer
export const addCustomer = async (req, res) => {
  try {
    const { name, phone, email, address, userId } = req.body;

    if (!name || !phone ) {
      return res.status(400).json({ message: "Name and phone are required", success: false });
    }

    const existingCustomer = await Customer.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingCustomer) {
      // Update the existing contact
      existingCustomer.name = name;
      existingCustomer.phone = phone;
      existingCustomer.email = email;
      existingCustomer.address = address;
      existingCustomer.userId = userId;
      await existingCustomer.save();

      return res.status(200).json({
        message: "Customer updated successfully",
        customer: existingCustomer,
        success: true,
      });

    }

    const newCustomer = new Customer({
      name,
      phone,
      email,
      address,
      userId,
      
    });

    await newCustomer.save();
    res.status(201).json({ customer: newCustomer, success: true });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ message: "Failed to add customer", success: false });
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({ customers, success: true });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers", success: false });
  }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found", success: false });
    }
    res.status(200).json({ customer, success: true });
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Failed to fetch customer", success: false });
  }
};

// Update customer by ID
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address, userId } = req.body;

    const updatedData = {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(email && { email }),
      ...(address && { address }),
      ...(userId && { userId }),
    };

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found", success: false });
    }

    res.status(200).json({ customer: updatedCustomer, success: true });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(400).json({ message: "Failed to update customer", success: false });
  }
};

// Delete customer by ID
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found", success: false });
    }
    res.status(200).json({ customer: deletedCustomer, success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Failed to delete customer", success: false });
  }
};

// export const getPendingServicePlans = async (req, res) => {
//   try {
//     const pendingServicePlans = await Customer.find(
//       { servicePlan: { $elemMatch: { status: "Pending" } } }
//     ).sort({ createdAt: -1 });
//     res.status(200).json({ customers:pendingServicePlans, success: true });
//   } catch (error) {
//     console.error("Error fetching ServicePlans:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch ServicePlans", success: false });
//   }
// };

// export const getCompleteServicePlans = async (req, res) => {
//   try {
//     const completeServicePlans = await Customer.find(
//       { servicePlan: { $elemMatch: { status: "Complete" } } }
//     ).sort({ createdAt: -1 });
//     const page = parseInt(req.query.page) || 1;

//         // Define the number of items per page
//         const limit = 12;

//         // Calculate the start and end indices for pagination
//         const startIndex = (page - 1) * limit;
//         const endIndex = page * limit;

//         // Paginate the reversed movies array
//         const paginatedCompleteServicePlans = completeServicePlans.slice(startIndex, endIndex);
//         return res.status(200).json({ 
//           customers:paginatedCompleteServicePlans, 
//           success: true ,
//           pagination: {
//           currentPage: page,
//           totalPages: Math.ceil(completeServicePlans.length / limit),
//       },});
//   } catch (error) {
//     console.error("Error fetching ServicePlans:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch ServicePlans", success: false });
//   }
// };

// export const searchCompleteServicePlans = async (req, res) => {
//   try {
//       const { search } = req.query;
//       if (!search) {
//           return res.status(400).json({ message: 'Search query is required', success: false });
//       }

//       const regex = new RegExp(search, 'i'); // Case-insensitive search

//       const completeServicePlans = await Customer.find({
//         servicePlan: { $elemMatch: { status: "Complete" } },
//           $or: [
//               { customerName: regex },
//               { email: regex },
//               { phone: regex },
//               { address: regex },
              
//           ]
//       }).sort({ createdAt: -1 });;

//       if (!completeServicePlans) {
//           return res.status(404).json({ message: 'No Service Plan found', success: false });
//       }

//       return res.status(200).json({
//         customers: completeServicePlans,
//           success: true,
//           pagination: {
//               currentPage: 1,
//               totalPages: Math.ceil(completeServicePlans.length / 12),
//           },
//       });
//   } catch (error) {
//       console.error('Error searching service plans:', error);
//       res.status(500).json({ message: 'Failed to search service plans', success: false });
//   }
// };

// export const getUserCompletedTasks = async (req, res) => {
//   try {
//     const { id: userId } = req.params;
//     const page = parseInt(req.query.page) || 1;
//     const limit = 9;
//     const skip = (page - 1) * limit;
//     const searchQuery = req.query.search || '';
//     const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
//     const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

//     // Base pipeline stages
//     const pipeline = [
//       { $unwind: "$servicePlan" },
//       { $unwind: "$servicePlan.stage" },
//       {
//         $addFields: {
//           matchedWorkers: {
//             $filter: {
//               input: "$servicePlan.stage.workers",
//               as: "worker",
//               cond: {
//                 $and: [
//                   { $eq: ["$$worker.value", userId] },
//                   { $eq: ["$$worker.completeTask", true] },
//                 ],
//               },
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           "matchedWorkers.0": { $exists: true },
//         },
//       }
//     ];

//     // Add search filter if search query exists
//     if (searchQuery) {
//       pipeline.push({
//         $match: {
//           $or: [
//             { name: { $regex: searchQuery, $options: 'i' } },
//             { phone: { $regex: searchQuery, $options: 'i' } },
//             { email: { $regex: searchQuery, $options: 'i' } },
//             { address: { $regex: searchQuery, $options: 'i' } },
//             { "servicePlan.carNo": { $regex: searchQuery, $options: 'i' } }
//           ]
//         }
//       });
//     }

//     // Add date filter on completeTaskDate if dates exist
//     if (startDate || endDate) {
//       const dateFilter = {};
//       if (startDate) {
//         dateFilter.$gte = startDate;
//       }
//       if (endDate) {
//         dateFilter.$lte = endDate;
//       }
      
//       pipeline.push({
//         $match: {
//           "servicePlan.stage.workers": {
//             $elemMatch: {
//               value: userId,
//               completeTask: true,
//               completeTaskDate: dateFilter
//             }
//           }
//         }
//       });
//     }

//     // Add remaining pipeline stages
//     pipeline.push(
//       {
//         $project: {
//           _id: 0,
//           customerId: "$_id",
//           name: 1,
//           email: 1,
//           phone: 1,
//           address: 1,
//           inventoryType: 1,
//           userId: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           stage: "$servicePlan.stage",
//           carNo: "$servicePlan.carNo",
//           matchedWorkers: {
//             $filter: {
//               input: "$servicePlan.stage.workers",
//               as: "worker",
//               cond: {
//                 $and: [
//                   { $eq: ["$$worker.value", userId] },
//                   { $eq: ["$$worker.completeTask", true] },
//                   startDate || endDate ? { 
//                     $and: [
//                       startDate ? { $gte: ["$$worker.completeTaskDate", startDate] } : {},
//                       endDate ? { $lte: ["$$worker.completeTaskDate", endDate] } : {}
//                     ]
//                   } : {}
//                 ].filter(cond => Object.keys(cond).length > 0) // Remove empty conditions
//               }
//             }
//           },
//           servicePlan: {
//             $let: {
//               vars: {
//                 stageService: "$servicePlan.stage.serviceName",
//                 matchedServicePlan: {
//                   $first: {
//                     $filter: {
//                       input: "$servicePlan.servicePlan",
//                       as: "sp",
//                       cond: { $eq: ["$$sp.service", "$servicePlan.stage.serviceName"] }
//                     }
//                   }
//                 }
//               },
//               in: {
//                 service: "$$stageService",
//                 product: "$$matchedServicePlan.product",
//                 carType: "$$matchedServicePlan.carType",
//                 gm: "$$matchedServicePlan.gm",
//                 servicePlanDate: "$servicePlan.servicePlanDate",
//                 status: "$servicePlan.status",
//                 uploads: {
//                   $filter: {
//                     input: "$servicePlan.uploads",
//                     as: "upload",
//                     cond: {
//                       $and: [
//                         { $eq: ["$$upload.userId", userId] },
//                         { $eq: ["$$upload.serviceName", "$$stageService"] }
//                       ]
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       },
//       { $sort: { "servicePlan.servicePlanDate": -1 } },
//       { $skip: skip },
//       { $limit: limit }
//     );

//     const tasks = await Customer.aggregate(pipeline);

//     // Count total tasks (with the same filters)
//     const countPipeline = [
//       { $unwind: "$servicePlan" },
//       { $unwind: "$servicePlan.stage" },
//       {
//         $addFields: {
//           matchedWorkers: {
//             $filter: {
//               input: "$servicePlan.stage.workers",
//               as: "worker",
//               cond: {
//                 $and: [
//                   { $eq: ["$$worker.value", userId] },
//                   { $eq: ["$$worker.completeTask", true] },
//                 ],
//               },
//             },
//           },
//         },
//       },
//       {
//         $match: {
//           "matchedWorkers.0": { $exists: true },
//         },
//       }
//     ];

//     // Apply the same search filter to count
//     if (searchQuery) {
//       countPipeline.push({
//         $match: {
//           $or: [
//             { name: { $regex: searchQuery, $options: 'i' } },
//             { phone: { $regex: searchQuery, $options: 'i' } },
//             { email: { $regex: searchQuery, $options: 'i' } },
//             { address: { $regex: searchQuery, $options: 'i' } },
//             { "servicePlan.carNo": { $regex: searchQuery, $options: 'i' } }
//           ]
//         }
//       });
//     }

//     // Apply the same date filter to count
//     if (startDate || endDate) {
//       const dateFilter = {};
//       if (startDate) {
//         dateFilter.$gte = startDate;
//       }
//       if (endDate) {
//         dateFilter.$lte = endDate;
//       }
//       countPipeline.push({
//         $match: {
//           "servicePlan.stage.workers": {
//             $elemMatch: {
//               value: userId,
//               completeTask: true,
//               completeTaskDate: dateFilter
//             }
//           }
//         }
//       });
//     }

//     countPipeline.push({ $count: "totalCount" });

//     const countResult = await Customer.aggregate(countPipeline);
//     const totalCount = countResult[0]?.totalCount || 0;

//     return res.status(200).json({
//       success: true,
//       completedTasks: tasks,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalCount / limit),
//         totalCount,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching user completed tasks:", error);
//     res.status(500).json({
//       message: "Failed to fetch user completed tasks",
//       success: false,
//     });
//   }
// };


