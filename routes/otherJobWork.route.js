import express from "express";
import { addOtherJobWork, getOtherJobWorks, getOtherJobWorkById, deleteOtherJobWork, updateOtherJobWork} from "../controllers/otherJobWork.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addOtherJobWork").post( addOtherJobWork);
router.route("/getOtherJobWorks").get( getOtherJobWorks);
router.route("/getOtherJobWorkById/:id").put( getOtherJobWorkById);
router.route("/updateOtherJobWork/:id").post( updateOtherJobWork);
router.route("/deleteOtherJobWork/:id").delete(deleteOtherJobWork);

export default router;