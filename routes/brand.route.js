import express from "express";
import {
  addBrand,
  getBrands,
  getBrandById,
  deleteBrands,
  updateBrand,
} from "../controllers/brand.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addBrand").post(addBrand);
router.route("/getBrands").get(getBrands);
router.route("/getBrandById/:id").put( getBrandById);
router.route("/updateBrand/:id").post(updateBrand);
router.route("/deleteBrands/:id").delete(deleteBrands);

export default router;
