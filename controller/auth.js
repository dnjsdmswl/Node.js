const router = require("express")();
const logic = require("../service/auth");

router.post("/signup", logic.signup);
router.post("/login", logic.login);
router.delete("/logout", logic.logout);
router.delete("/signout", logic.signout);

module.exports = router;
