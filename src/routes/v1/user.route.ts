import { Router } from "express";
import getLoggedUser from "@/controllers/v1/user/getLoggedUser";

const router = Router();

router.get("/get-logged-user", getLoggedUser);

export default router;
