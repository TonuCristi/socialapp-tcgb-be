import { Router } from "express";
import createPost from "@/controllers/v1/posts/createPost";
import multer from "multer";
import getUserPosts from "@/controllers/v1/posts/getUserPosts";
import likePost from "@/controllers/v1/posts/likePost";
import getPostLikes from "@/controllers/v1/posts/getPostLikes";
import addPostComment from "@/controllers/v1/posts/addPostComment";
import getPostComments from "@/controllers/v1/posts/getPostComments";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create-post", upload.array("photos"), createPost);

router.get("/get-user-posts", getUserPosts);

router.post("/like-post/:postId", likePost);

router.post("/add-post-comment/:postId", addPostComment);

router.get("/get-post-likes/:postId", getPostLikes);

router.get("/get-post-comments/:postId", getPostComments);

export default router;
