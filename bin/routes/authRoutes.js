const express = require("express");
const router = express.Router();
const authController = require("../../module/controllers/authController");
const currencyController = require("../../module/controllers/currencyController");
const inflationController = require("../../module/controllers/inflationController");
const indexSahamController = require("../../module/controllers/indexSahamController");
const obligasiController = require("../../module/controllers/obligasiController");
const basicAuth = require('../middleware/basic_auth_helper');

router.post("/v1/register", basicAuth.isAuthenticated, authController.register);
router.get("/v1/currency-exchange", basicAuth.isAuthenticated, currencyController.get);
router.get("/v1/inflation-country", basicAuth.isAuthenticated, inflationController.get);
router.get("/v1/index-saham", basicAuth.isAuthenticated, indexSahamController.get);
router.get("/v1/obligasi", basicAuth.isAuthenticated, obligasiController.get);


module.exports = router;