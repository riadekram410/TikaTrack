import express from "express";

import {
    createSchedule,
    getSchedules,
    getSchedule,
    updateSchedule,
    deleteSchedule,
} from "../controller/scheduleController.js";

import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

// Create schedule
router.post("/", checkToken, createSchedule);

// Get all schedules
router.get("/", checkToken, getSchedules);

// Get one schedule
router.get("/:id", checkToken, getSchedule);

// Update schedule
router.put("/:id", checkToken, updateSchedule);

// Delete schedule
router.delete("/:id", checkToken, deleteSchedule);

export default router;