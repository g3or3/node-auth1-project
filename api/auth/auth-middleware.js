const Users = require("../users/users-model");

function restricted(req, res, next) {
	if (req.session.user) return next();

	next({ status: 401, message: "You shall not pass!" });
}

async function checkUsernameFree(req, res, next) {
	const [existingUser] = await Users.findBy({ username: req.body.username });

	if (existingUser) return next({ status: 422, message: "Username taken" });

	next();
}

async function checkUsernameExists(req, res, next) {
	const [existingUser] = await Users.findBy({ username: req.body.username });

	if (existingUser) {
		req.existingUser = existingUser;
		return next();
	}

	next({ status: 401, message: "Invalid credentials" });
}

function checkPasswordLength(req, res, next) {
	if (!req.body.password || req.body.password.length <= 3) {
		next({ status: 422, message: "Password must be longer than 3 chars" });
	} else next();
}

module.exports = {
	restricted,
	checkUsernameFree,
	checkUsernameExists,
	checkPasswordLength,
};
