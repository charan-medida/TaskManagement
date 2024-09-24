const jwt = require('jsonwebtoken');

class Authentication {

    constructor(pool) {
        this.pool = pool; 
    }

    
    async loginUser(username, password) {
        try {
            
            const [result] = await this.pool.query('SELECT * FROM information WHERE username = ?', [username]);
            
            if (result.length === 0) {
                console.log('No record found');
                throw new Error('Invalid Credentials');
            }

            const user = result[0];

            
            if (user.password !== password) {
                throw new Error('Invalid Credentials');
            }

            //console.log("userid is "+ user.userid);
            const payload = { username: user.username, userid: user.userid };
            const token = jwt.sign(payload, 'b4b3d4e3-dc1e-4eb7-a8f6-1b18c6c69c4b', { expiresIn: '10h' });

            
            return { token };
        } catch (error) {
            console.error('Authentication loginUser error:', error.message);
            throw error;
        }
    }

    
    async authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401);
        }

    
        jwt.verify(token, 'b4b3d4e3-dc1e-4eb7-a8f6-1b18c6c69c4b', (err, payload) => {
            if (err) {
                return res.sendStatus(403);
            }

        
            req.payload = payload;
            next();
        });
    }
}

module.exports = Authentication;
