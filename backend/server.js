import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes/userRoutes.js";
import authRoutes from "./routes/authRoutes/authRoutes.js";



dotenv.config();

const app = express();
connectDB();

const parseCookies = (req, res, next) => {
  const cookieHeader = req.headers?.cookie;
  req.cookies = {};
  if (!cookieHeader) {
    return next();
  }

  cookieHeader.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    req.cookies[name] = rest.join("=");
  });

  next();
};

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(parseCookies);
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api", authRoutes);

// test route
app.get("/test", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
