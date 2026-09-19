import express from "express";

import {
    createSchedule,
    getSchedules,
    getSchedule,
    updateSchedule,
    deleteSchedule,
    generateSchedulesForExistingChildren,
} from "../controller/scheduleController.js";

import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

// Create schedule
router.post("/", checkToken, createSchedule);

// Generate vaccine schedules for existing children
router.post(
    "/generate-existing",
    checkToken,
    generateSchedulesForExistingChildren
);

// Get all schedules
router.get("/", checkToken, getSchedules);

// Get one schedule
router.get("/:id", checkToken, getSchedule);

// Update schedule
router.put("/:id", checkToken, updateSchedule);

// Delete schedule
router.delete("/:id", checkToken, deleteSchedule);

export default router;