import express, { urlencoded } from "express";
import connectDB from "./db/connection.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index.js";
import { createServer } from "http"; 
import { Server } from "socket.io";

dotenv.config();
// connect db
connectDB();
const PORT = process.env.PORT || 8080;
const app = express();

const server = createServer(app); // Create an HTTP server
const io = new Server(server, {
  transports: ["websocket"], // ⬅ prevents polling
  cors: {
    origin: [
       "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "https://symphonix.co.in",
      "https://console.symphonix.co.in",
      "https://yash-cars-next-new.vercel.app"
    ],
    credentials: true,
  },
});


// WebSocket connection
io.on("connection", (socket) => {
  //console.log("New client connected");

  socket.on("disconnect", () => {
    //  console.log("Client disconnected");
  });
});


app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));  // Example for a 50MB limit
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(urlencoded({extended:true}));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "https://symphonix.co.in",
      "https://console.symphonix.co.in",
      "https://yash-cars-next-new.vercel.app"
    ], // Allow both domains
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "x-auth-token",
    ],
    credentials: true, // Allow cookies and authentication headers
  })
);

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
app.use("/api/v1/testimonials", routes.testimonialRoute);

server.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
});

export { io };