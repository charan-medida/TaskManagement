const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');  
const port = 5006;

const userController = require('./userController');
const authController = require('./authController');
const taskController = require('./taskController');

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


const config = {
    host: 'database-2.clmsi8gwu3id.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'ramcharannaidu269',
    database: 'urlschema', 
    port: 3306
};

let pool;

async function connectToDatabase() {
    try {
        
        pool = await mysql.createPool(config);
        console.log('Connected to MySQL Database');
        
    
        app.use('/user', userController(pool));
        app.use('/auth', authController(pool));
        app.use('/task', taskController(pool));
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

connectToDatabase();

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
