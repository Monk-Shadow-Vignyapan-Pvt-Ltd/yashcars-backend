import express from "express";
import { addCarAccessory, getCarAccessories, getCarAccessoryById, deleteCarAccessory, updateCarAccessory} from "../controllers/carAccessories.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addCarAccessory").post( addCarAccessory);
router.route("/getCarAccessories").get( getCarAccessories);
router.route("/getCarAccessoryById/:id").put( getCarAccessoryById);
router.route("/updateCarAccessory/:id").post( updateCarAccessory);
router.route("/deleteCarAccessory/:id").delete(deleteCarAccessory);

export default router;