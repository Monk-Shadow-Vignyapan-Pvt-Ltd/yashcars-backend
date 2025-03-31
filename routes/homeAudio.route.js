import express from "express";
import { addHomeAudio, getHomeAudios, getHomeAudioById, deleteHomeAudio, updateHomeAudio} from "../controllers/homeAudio.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addHomeAudio").post( addHomeAudio);
router.route("/getHomeAudios").get( getHomeAudios);
router.route("/getHomeAudioById/:id").put( getHomeAudioById);
router.route("/updateHomeAudio/:id").post( updateHomeAudio);
router.route("/deleteHomeAudio/:id").delete(deleteHomeAudio);

export default router;