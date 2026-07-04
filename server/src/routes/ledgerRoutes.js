const express = require("express");

const {
  getCustomerLedger,
  getSupplierLedger,
} = require("../controllers/ledgerController");

const router = express.Router();

router.get("/customer/:id", getCustomerLedger);
router.get("/supplier/:id", getSupplierLedger);

module.exports = router;