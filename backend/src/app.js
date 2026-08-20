import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import briefingRoutes from "./routes/briefingRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/briefing", briefingRoutes);

app.get("/", (req, res) => {
  res.json({ message: "DailyBrief API funzionante" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Errore interno del server" });
});

export default app;
