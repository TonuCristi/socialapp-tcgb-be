import { Router } from "express";
import getLoggedUser from "@/controllers/v1/user/getLoggedUser";
import editUser from "@/controllers/v1/user/editUser";
import changePassword from "@/controllers/v1/user/changePassword";

const router = Router();

router.get("/get-logged-user", getLoggedUser);

router.put("/edit-user", editUser);

router.put("/change-password", changePassword);

export default router;
