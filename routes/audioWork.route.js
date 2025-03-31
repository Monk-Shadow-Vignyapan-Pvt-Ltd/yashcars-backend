import express from "express";
import { addAudioWork, getAudioWorks, getAudioWorkById, deleteAudioWork, updateAudioWork} from "../controllers/audioWork.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addAudioWork").post( addAudioWork);
router.route("/getAudioWorks").get( getAudioWorks);
router.route("/getAudioWorkById/:id").put( getAudioWorkById);
router.route("/updateAudioWork/:id").post( updateAudioWork);
router.route("/deleteAudioWork/:id").delete(deleteAudioWork);

export default router;