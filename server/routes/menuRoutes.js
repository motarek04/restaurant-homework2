import express from "express";
import MenuItem from "../models/MenuItem.js";

const router = express.Router();

// GET all menu items
router.get("/", async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ createdAt: -1 });

    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve menu items",
      error: error.message,
    });
  }
});

// GET one menu item
router.get("/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve menu item",
      error: error.message,
    });
  }
});

// CREATE a menu item
router.post("/", async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);

    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({
      message: "Unable to create menu item",
      error: error.message,
    });
  }
});

// UPDATE a menu item
router.put("/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    res.status(400).json({
      message: "Unable to update menu item",
      error: error.message,
    });
  }
});

// DELETE a menu item
router.delete("/:id", async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete menu item",
      error: error.message,
    });
  }
});

export default router;