import express from "express";
import { addBrand, deleteBrand, getBrandById, getBrands, getBrandImageById, updateBrand, getFrontendBrands, downloadBrandsExcel } from "../controllers/webBrand.controller.js";


const router = express.Router();

router.route("/addBrand").post(addBrand);
router.route("/getBrands").get(getBrands);
router.route("/getFrontendBrands").get(getFrontendBrands);
router.route("/getBrandById/:id").get(getBrandById);
router.route("/getBrandImageById/:id").get(getBrandImageById);
router.route("/updateBrand/:id").post(updateBrand);
router.route("/deleteBrand/:id").delete(deleteBrand);
router.route("/downloadBrandsExcel").get(downloadBrandsExcel);

export default router;
