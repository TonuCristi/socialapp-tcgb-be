import { Router } from "express";
import getLoggedUser from "@/controllers/v1/user/getLoggedUser";
import editUser from "@/controllers/v1/user/editUser";

const router = Router();

router.get("/get-logged-user", getLoggedUser);

router.put("/edit-user", editUser);

export default router;
