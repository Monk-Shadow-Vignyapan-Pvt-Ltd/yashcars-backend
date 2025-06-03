import express from "express";
import { addService, getServices,getServiceByUrl,
     deleteService, updateService,onOffService,getServicesFrontend} from "../controllers/service.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addService").post( addService);
router.route("/getServices").get( getServices);
router.route("/getServiceByUrl/:id").put( getServiceByUrl);
router.route("/updateService/:id").post( updateService);
router.route("/onOffService/:id").post( onOffService);
router.route("/deleteService/:id").delete(deleteService);
router.route("/getServicesFrontend").get(getServicesFrontend);


export default router;