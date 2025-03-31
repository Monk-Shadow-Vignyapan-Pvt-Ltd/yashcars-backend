import express from "express";
import { addTyreFitting, getTyreFittings, getTyreFittingById, deleteTyreFitting, updateTyreFitting} from "../controllers/tyreFitting.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addTyreFitting").post( addTyreFitting);
router.route("/getTyreFittings").get( getTyreFittings);
router.route("/getTyreFittingById/:id").put( getTyreFittingById);
router.route("/updateTyreFitting/:id").post( updateTyreFitting);
router.route("/deleteTyreFitting/:id").delete(deleteTyreFitting);

export default router;