import { Router } from "express";
import createPost from "@/controllers/v1/posts/createPost";
import multer from "multer";
import getUserPosts from "@/controllers/v1/posts/getUserPosts";
import likePost from "@/controllers/v1/posts/likePost";
import getPostLikes from "@/controllers/v1/posts/getPostLikes";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create-post", upload.array("photos"), createPost);

router.get("/get-user-posts", getUserPosts);

router.post("/like-post/:postId", likePost);

router.get("/get-post-likes/:postId", getPostLikes);

export default router;
