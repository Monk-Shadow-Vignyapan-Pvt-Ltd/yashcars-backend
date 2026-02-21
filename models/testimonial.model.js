import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: false },
    description: { type: String, required: false },
    start: { type: Number, required: false },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    }

}, { timestamps: true });

export const Testimonial = mongoose.model("Testimonial", testimonialSchema);
