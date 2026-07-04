const express = require("express");

const {
  getPurchases,
  createPurchase,
} = require("../controllers/purchaseController");

const router = express.Router();

router.get("/", getPurchases);
router.post("/", createPurchase);

module.exports = router;