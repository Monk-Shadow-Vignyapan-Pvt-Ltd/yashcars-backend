import express from "express";
import { addGallery, getGalleries, getGalleryById, deleteGallery, updateGallery, getGalleryOthers, getGalleryMultiImages, getFrontendGalleries } from "../controllers/gallary.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addGallery").post(addGallery);
router.route("/getGalleries").get(getGalleries);
router.route("/getFrontendGalleries").get(getFrontendGalleries);
router.route("/getGalleryOthers").get(getGalleryOthers);
router.get("/getGalleryMultiImages/:id/:index", getGalleryMultiImages);
router.route("/getGalleryById/:id").put(getGalleryById);
router.route("/updateGallery/:id").post(updateGallery);
router.route("/deleteGallery/:id").delete(deleteGallery);

export default router;