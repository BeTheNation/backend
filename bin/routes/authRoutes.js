const express = require("express");
const router = express.Router();
const authController = require("../../module/controllers/authController");
const currencyController = require("../../module/controllers/currencyController");
const inflationController = require("../../module/controllers/inflationController");
const indexSahamController = require("../../module/controllers/indexSahamController");
const obligasiController = require("../../module/controllers/obligasiController");
const finalScoreController = require("../../module/controllers/finalScoreController");
const basicAuth = require('../middleware/basic_auth_helper');

router.post("/v1/register", basicAuth.isAuthenticated, authController.register);
router.get("/v1/currency-exchange", basicAuth.isAuthenticated, currencyController.get);
router.post("/v1/currency-exchange/force-update", basicAuth.isAuthenticated, currencyController.forceUpdate);
router.get("/v1/inflation-country", basicAuth.isAuthenticated, inflationController.get);
router.get("/v1/index-saham", basicAuth.isAuthenticated, indexSahamController.get);
router.get("/v1/obligasi", basicAuth.isAuthenticated, obligasiController.get);
router.post("/v1/final-score/calculate", basicAuth.isAuthenticated, finalScoreController.calculate);
router.get("/v1/final-score/latest", basicAuth.isAuthenticated, finalScoreController.getLatest);

module.exports = router;