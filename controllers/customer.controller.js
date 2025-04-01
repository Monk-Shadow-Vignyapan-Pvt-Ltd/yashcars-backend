import { Customer } from "../models/customer.model.js"; // Update the path as needed

// Add a new customer
export const addCustomer = async (req, res) => {
  try {
    const { name, phone, email, address,inventoryType,carNo, servicePlan, userId } = req.body;

    if (!name || !phone || !inventoryType) {
      return res.status(400).json({ message: "Name phone and inventoryType are required", success: false });
    }

    const newCustomer = new Customer({
      name,
      phone,
      email,
      address,
      inventoryType,
      carNo,
      servicePlan,
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
    const customers = await Customer.find().select('-servicePlan');
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
    const { name, phone, email, address,inventoryType,carNo, servicePlan, userId } = req.body;

    const updatedData = {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(email && { email }),
      ...(address && { address }),
      ...(inventoryType && { inventoryType }),
      ...(carNo && { carNo }),
      ...(servicePlan && { servicePlan }),
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

export const getPendingServicePlans = async (req, res) => {
  try {
    const pendingServicePlans = await Customer.find(
      { servicePlan: { $elemMatch: { status: "Pending" } } }
    ).sort({ createdAt: -1 });
    res.status(200).json({ customers:pendingServicePlans, success: true });
  } catch (error) {
    console.error("Error fetching ServicePlans:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch ServicePlans", success: false });
  }
};

export const getCompleteServicePlans = async (req, res) => {
  try {
    const completeServicePlans = await Customer.find(
      { servicePlan: { $elemMatch: { status: "Complete" } } }
    ).sort({ createdAt: -1 });
    const page = parseInt(req.query.page) || 1;

        // Define the number of items per page
        const limit = 12;

        // Calculate the start and end indices for pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Paginate the reversed movies array
        const paginatedCompleteServicePlans = completeServicePlans.slice(startIndex, endIndex);
        return res.status(200).json({ 
          customers:paginatedCompleteServicePlans, 
          success: true ,
          pagination: {
          currentPage: page,
          totalPages: Math.ceil(completeServicePlans.length / limit),
      },});
  } catch (error) {
    console.error("Error fetching ServicePlans:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch ServicePlans", success: false });
  }
};

export const searchCompleteServicePlans = async (req, res) => {
  try {
      const { search } = req.query;
      if (!search) {
          return res.status(400).json({ message: 'Search query is required', success: false });
      }

      const regex = new RegExp(search, 'i'); // Case-insensitive search

      const completeServicePlans = await Customer.find({
        servicePlan: { $elemMatch: { status: "Complete" } },
          $or: [
              { customerName: regex },
              { email: regex },
              { phone: regex },
              { address: regex },
              
          ]
      }).sort({ createdAt: -1 });;

      if (!completeServicePlans) {
          return res.status(404).json({ message: 'No Service Plan found', success: false });
      }

      return res.status(200).json({
        customers: completeServicePlans,
          success: true,
          pagination: {
              currentPage: 1,
              totalPages: Math.ceil(completeServicePlans.length / 12),
          },
      });
  } catch (error) {
      console.error('Error searching service plans:', error);
      res.status(500).json({ message: 'Failed to search service plans', success: false });
  }
};
