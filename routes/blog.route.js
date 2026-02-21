import express from "express";
import { addBlog, getBlogs, getBlogById,getBlogByUrl, deleteBlog,getBlogsFrontend, updateBlog, getBlogName, getBlogUrls, getBlogImageById} from "../controllers/blog.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/addBlog").post( addBlog);
router.route("/getBlogs").get( getBlogs);
router.route("/getBlogUrls").get( getBlogUrls);
router.route("/getBlogImageById/:id").get( getBlogImageById);
router.route("/getBlogName").get( getBlogName);
router.route("/getBlogById/:id").put( getBlogById);
router.route("/getBlogByUrl/:id").put( getBlogByUrl);
router.route("/updateBlog/:id").post( updateBlog);
router.route("/getBlogsFrontend").get( getBlogsFrontend);
router.route("/deleteBlog/:id").delete(deleteBlog);

export default router;