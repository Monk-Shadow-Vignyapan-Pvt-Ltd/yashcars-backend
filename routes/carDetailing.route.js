import express from "express";
import { addCarDetailing, getCarDetailings, getCarDetailingById, deleteCarDetailing, updateCarDetailing} from "../controllers/carDetailing.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addCarDetailing").post( addCarDetailing);
router.route("/getCarDetailings").get( getCarDetailings);
router.route("/getCarDetailingById/:id").put( getCarDetailingById);
router.route("/updateCarDetailing/:id").post( updateCarDetailing);
router.route("/deleteCarDetailing/:id").delete(deleteCarDetailing);

export default router;