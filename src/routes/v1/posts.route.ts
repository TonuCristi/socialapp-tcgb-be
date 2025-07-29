import { Router } from "express";
import createPost from "@/controllers/v1/posts/createPost";
import multer from "multer";
import getPosts from "@/controllers/v1/posts/getPosts";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create-post", upload.array("photos"), createPost);

router.get("/get-posts", getPosts);

export default router;
