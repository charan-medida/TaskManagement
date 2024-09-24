const express = require('express');
const router = express.Router();
const UserService = require('./UserService');

module.exports = function(pool){

    const userservice = new UserService(pool);
    router.post('/registerUser', async(req,res) => {

        const { username, password, email } = req.body;
        try {
    
            const userExists = await userservice.registerUser(username,password,email);
    
            if (userExists.flow) {
                return res.status(400).send('This username is already registered');
            }
    
    
            res.send({ message: 'User registered successfully', id: userExists, username, email, password });
        } catch (err) {
            console.error('Error handling request:', err);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
};