import { Router } from "express";
import authRoutes from "./auth.route";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "API is live",
    status: "ok",
    version: "1.0.0",
    timeStamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);

export default router;
