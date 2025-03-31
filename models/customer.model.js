import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: false,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'], // Basic email validation
    },
    address : {
        type: String,
        required: false,
      },
    inventoryType: {
        type: String,
        required: true,
      },
      carNo: {
        type: String,
        validate: {
          validator: function (value) {
            // If inventoryType is "Car Service", then carNo must be provided
            if (this.inventoryType === "Car Service" && !value) {
              return false;
            }
            return true;
          },
          message: "carNo is required when inventoryType is 'Car Service'",
        },
    },
    
    servicePlan: { type: mongoose.Schema.Types.Mixed, required: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);
