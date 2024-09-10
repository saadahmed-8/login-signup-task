import express from "express";
import { verifyUser } from "../utils/verifyUser";
import { updateUser } from "../controller/user.controller";

const router = express.Router();

router.post("/update/:id", verifyUser, updateUser);

export default router;
