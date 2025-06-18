import express from "express";
import { addCustomer, getCustomers, getCustomerById, deleteCustomer, updateCustomer,
    getPendingServicePlans,getCompleteServicePlans,searchCompleteServicePlans,
getUserCompletedTasks} from "../controllers/customer.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addCustomer").post( addCustomer);
router.route("/getCustomers").get( getCustomers);
router.route("/getCustomerById/:id").put( getCustomerById);
router.route("/updateCustomer/:id").post( updateCustomer);
router.route("/deleteCustomer/:id").delete(deleteCustomer);
router.route("/getPendingServicePlans").get( getPendingServicePlans);
router.route("/getCompleteServicePlans").get( getCompleteServicePlans);
router.route("/searchCompleteServicePlans").post( searchCompleteServicePlans);
router.route("/getUserCompletedTasks/:id").get( getUserCompletedTasks);

export default router;