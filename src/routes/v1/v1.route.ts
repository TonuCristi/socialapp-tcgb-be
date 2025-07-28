import { Router } from "express";
import authRoutes from "./auth.route";
import { authMiddleware } from "@/middleware/authMiddleware";
import userRoutes from "./user.route";
import postsRoutes from "./posts.route";

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

router.use(authMiddleware);

router.use("/user", userRoutes);

router.use("/posts", postsRoutes);

export default router;
