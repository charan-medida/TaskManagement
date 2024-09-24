const jwt = require('jsonwebtoken');

class UserService {
    constructor(pool) {
        this.pool = pool;  
    }

    
    async registerUser(username, password, email) {
        try {
            
            const [rows] = await this.pool.query('SELECT * FROM information WHERE username = ?', [username]);
            
            if (rows.length > 0) {
                return { flow: true };  
            } else {
                
                const [result] = await this.pool.query(
                    'INSERT INTO information (username, email, password) VALUES (?, ?, ?)', 
                    [username, email, password]
                );
                
                return {
                    flow: false,
                    id: result.insertId  
                };
            }
        } catch (error) {
            console.error('Error in registerUser:', error);
            throw error;
        }
    }
}

module.exports = UserService;
