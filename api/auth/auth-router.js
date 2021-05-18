const bcrypt = require("bcryptjs");
const Users = require("../users/users-model");
const router = require("express").Router();

const {
	checkUsernameFree,
	checkUsernameExists,
	checkPasswordLength,
} = require("./auth-middleware");

router.post("/register", checkUsernameFree, checkPasswordLength, async (req, res) => {
	res.json(
		await Users.add({
			username: req.body.username,
			password: await bcrypt.hash(req.body.password, 8),
		})
	);
});

router.post("/login", checkUsernameExists, async (req, res) => {
	if (await bcrypt.compare(req.body.password, req.existingUser.password)) {
		req.session.user = req.existingUser;
		res.json({ message: `Welcome ${req.existingUser.username}!` });
	} else {
		res.json({ status: 401, message: "Invalid credentials" });
	}
});

router.get("/logout", (req, res, next) => { //eslint-disable-line
	if (req.session.user) {
		req.session.destroy((err) => {
			if (err) {
				console.log(err);
			} else {
				res.json({ message: "logged out" });
			}
		});
	} else {
		res.json({ status: 200, message: "no session" });
	}
});

module.exports = router;
