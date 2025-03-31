import express from "express";
import { addCarWashing, getCarWashings, getCarWashingById, deleteCarWashing, updateCarWashing} from "../controllers/carWashing.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addCarWashing").post( addCarWashing);
router.route("/getCarWashings").get( getCarWashings);
router.route("/getCarWashingById/:id").put( getCarWashingById);
router.route("/updateCarWashing/:id").post( updateCarWashing);
router.route("/deleteCarWashing/:id").delete(deleteCarWashing);

export default router;