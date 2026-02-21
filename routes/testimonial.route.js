import express from "express";
import { addTestimonial, getTestimonials, getTestimonialById, deleteTestimonial, updateTestimonial,getTestimonialsHome, getFrontendTestimonials} from "../controllers/testimonial.controller.js";

const router = express.Router();

router.route("/addTestimonial").post( addTestimonial);
router.route("/getTestimonials").get( getTestimonials);
router.route("/getFrontendTestimonials").get( getFrontendTestimonials);
router.route("/getTestimonialById/:id").get( getTestimonialById);
router.route("/updateTestimonial/:id").post( updateTestimonial);
router.route("/deleteTestimonial/:id").delete(deleteTestimonial);
router.route("/getTestimonialsHome").get(getTestimonialsHome);

export default router;