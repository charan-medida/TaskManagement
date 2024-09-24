const express = require('express');
const router = express.Router();
const Authentication = require('./Authentication');


module.exports = function(pool) {
    const authentication = new Authentication(pool);

    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        try {
            const { token } = await authentication.loginUser(username, password);
            res.json({ token });
        } catch (error) {
            console.error('Login error:', error.message);
            res.sendStatus(401);
        }
    });

   // router.use(authentication.authenticateToken);  

    return router;
};
