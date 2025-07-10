import express, { urlencoded } from "express";
import connectDB from "./db/connection.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index.js";

dotenv.config();
// connect db
connectDB();
const PORT = process.env.PORT || 8080;
const app = express();


app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));  // Example for a 50MB limit
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(urlencoded({extended:true}));
app.use(cookieParser());

app.use(cors({
  origin: "*", // Specify the frontend's origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "x-auth-token"],
  credentials: true, // Allow credentials if needed
}));

// Explicitly handle OPTIONS method for preflight
app.options("*", cors()); // Allow preflight requests

// api's route
app.use("/api/v1/auth", routes.authRoute);
app.use("/api/v1/statuses", routes.statusRoute);
app.use("/api/v1/brands", routes.brandRoute);
app.use("/api/v1/carAccessories", routes.carAccessoryRoute);
app.use("/api/v1/homeAudios", routes.homeAudioRoute);
app.use("/api/v1/audioWorks", routes.audioWorkRoute);
app.use("/api/v1/carDetailings", routes.carDetailingRoute);
app.use("/api/v1/tyreFittings", routes.tyreFittingRoute);
app.use("/api/v1/balancings", routes.balancingRoute);
app.use("/api/v1/carWashings", routes.carWashingRoute);
app.use("/api/v1/customers", routes.customerRoute);
app.use("/api/v1/blogs", routes.blogRoute);
app.use("/api/v1/contacts", routes.contactRoute);
app.use("/api/v1/tags", routes.tagRoute);
app.use("/api/v1/services", routes.serviceRoute);
app.use("/api/v1/faqs", routes.faqRoute);
app.use("/api/v1/gallaries", routes.gallaryRoute);
app.use("/api/v1/otherJobWorks", routes.otherJobWorkRoute);
app.use("/api/v1/servicePlans", routes.servicePlanRoute);

app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
});
