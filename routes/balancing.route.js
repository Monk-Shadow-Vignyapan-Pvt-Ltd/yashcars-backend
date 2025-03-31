import express from "express";
import { addBalancing, getBalancings, getBalancingById, deleteBalancing, updateBalancing} from "../controllers/balancing.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addBalancing").post( addBalancing);
router.route("/getBalancings").get( getBalancings);
router.route("/getBalancingById/:id").put( getBalancingById);
router.route("/updateBalancing/:id").post( updateBalancing);
router.route("/deleteBalancing/:id").delete(deleteBalancing);

export default router;