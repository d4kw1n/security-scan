const router = require("express").Router();
const authRoute = require("./authRoute");
const bannerRoute = require("./bannerRoute");
const courseRoute = require("./courseRoute");
const userRoute = require("./userRoute");

router.use("/auth", authRoute);
router.use("/course", bannerRoute);
router.use("/course", courseRoute);
router.use("/user", userRoute);

module.exports = router;