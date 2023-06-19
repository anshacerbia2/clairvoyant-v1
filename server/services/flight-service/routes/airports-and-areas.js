const router = require("express").Router();
const AirportsAndAreasController = require("../controllers/AirportsAndAreasController");

router.get("/", AirportsAndAreasController.getAirportsAndAreas);
router.get("/popular", AirportsAndAreasController.getPopularAirportsAndAreas);

module.exports = router;
