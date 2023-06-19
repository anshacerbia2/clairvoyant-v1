const router = require("express").Router();
const airportsOrAreasRoutes = require("./airports-and-areas");

router.use("/airports-and-areas", airportsOrAreasRoutes);
module.exports = router;
