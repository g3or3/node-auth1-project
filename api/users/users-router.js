const { restricted } = require("../auth/auth-middleware");
const Users = require("./users-model");
const router = require("express").Router();

router.get("/", restricted, async (req, res) => {
	res.json(await Users.find());
});

module.exports = router;
