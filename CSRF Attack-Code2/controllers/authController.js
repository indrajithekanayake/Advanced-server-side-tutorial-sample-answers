const authModel = require('../models/authModel');
const bcrypt = require('bcrypt');

class AuthController {
    async register(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return await authModel.createUser({ ...userData, password: hashedPassword });
    }

    async login(email, password) {
        const user = await authModel.findUserByEmail(email);
        if (!user) return null;

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return null;

        delete user.password;
        return user;
    }
}

module.exports = new AuthController();