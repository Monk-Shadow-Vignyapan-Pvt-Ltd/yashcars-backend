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
