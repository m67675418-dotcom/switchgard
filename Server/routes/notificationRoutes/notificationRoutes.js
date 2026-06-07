// routes/notificationRoutes/notificationRoutes.js
// Mount: app.use("/api/notification", require("./routes/notificationRoutes/notificationRoutes"));

const express      = require("express");
const router       = express.Router();
const Notification = require("../../models/Notification");

// GET /api/notification/user/:userId — get all notifs for a user (newest first)
router.get("/user/:userId", async (req, res) => {
  try {
    const notifs = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/notification/:id/read — mark single notif as read
router.patch("/:id/read", async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/notification/user/:userId/readAll — mark all as read
router.patch("/user/:userId/readAll", async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.params.userId, read: false }, { read: true });
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/notification/:id
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;