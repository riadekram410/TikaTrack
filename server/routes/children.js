import express from "express";

import {
    createChild,
    getChildren,
    getChild,
    updateChild,
    deleteChild,
} from "../controller/childController.js";

import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.post("/", checkToken, createChild);
router.get("/", checkToken, getChildren);
router.get("/:id", checkToken, getChild);
router.put("/:id", checkToken, updateChild);
router.delete("/:id", checkToken, deleteChild);

export default router;