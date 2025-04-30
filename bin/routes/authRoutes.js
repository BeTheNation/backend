const express = require("express");
const router = express.Router();
const authController = require("../../module/controllers/authController");
const currencyController = require("../../module/controllers/currencyController");
const inflationController = require("../../module/controllers/inflationController");
const indexSahamController = require("../../module/controllers/indexSahamController");
const obligasiController = require("../../module/controllers/obligasiController");
const finalScoreController = require("../../module/controllers/finalScoreController");
const basicAuth = require('../middleware/basic_auth_helper');

router.post("/v1/register", authController.register);
router.get("/v1/currency-exchange", currencyController.get);
router.get("/v1/inflation-country", inflationController.get);
router.get("/v1/index-saham", indexSahamController.get);
router.get("/v1/obligasi", obligasiController.get);
router.post("/v1/final-score/calculate", finalScoreController.calculate);
router.get("/v1/final-score/latest", finalScoreController.getLatest);

module.exports = router;