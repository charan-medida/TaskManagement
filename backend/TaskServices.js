class TaskServices {
    constructor(pool) {
        this.pool = pool; 
    }

   
    async retrieveData(userid) {
        try {
            //console.log("userid in server is "+ userid);
            const [result] = await this.pool.query('SELECT * FROM taskinfo WHERE userid = ?', [userid]);
            console.log("Result is: ", JSON.stringify(result));

            return result;
        } catch (error) {
            console.error('Error retrieving data:', error);
            throw error;
        }
    }

 
    async addTask(userid, title, description, date, duedate, status) {
        try {
            const [result] = await this.pool.query(
                'INSERT INTO taskinfo (userid, title, description, date, duedate, status) VALUES (?, ?, ?, ?, ?, ?)',
                [userid, title, description, date, duedate, status]
            );
            return result;
        } catch (error) {
            console.error('Error adding task:', error);
            throw error;
        }
    }

  
    async updateStatus(id, status, userid) {
        try {
            const [result] = await this.pool.query(
                'UPDATE taskinfo SET status = ? WHERE id = ? AND userid = ?',
                [status, id, userid]
            );
            return result;
        } catch (error) {
            console.error('Error updating task status:', error);
            throw error;
        }
    }

   
    async updateDelete(id, userid) {
        try {
            const [result] = await this.pool.query(
                'DELETE FROM taskinfo WHERE id = ? AND userid = ?',
                [id, userid]
            );
            return result;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
}

module.exports = TaskServices;
