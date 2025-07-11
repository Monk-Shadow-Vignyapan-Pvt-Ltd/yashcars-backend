import express from "express";
import { addServicePlan, getServicePlans, getServicePlanById, deleteServicePlan, updateServicePlan,getPendingServicePlans,getCompletedServicePlans,updateServicePlanUploads} from "../controllers/servicePlan.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addServicePlan").post( addServicePlan);
router.route("/getServicePlans").get( getServicePlans);
router.route("/getServicePlanById/:id").put( getServicePlanById);
router.route("/updateServicePlan/:id").post( updateServicePlan);
router.route("/deleteServicePlan/:id").delete(deleteServicePlan);
router.route("/getPendingServicePlans").get( getPendingServicePlans);
router.route("/getCompletedServicePlans").get( getCompletedServicePlans);
router.route("/updateServicePlanUploads/:id").post( updateServicePlanUploads);

export default router;