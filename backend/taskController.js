const express = require('express');
const router = express.Router();
const TaskServices = require('./TaskServices');
const Authentication = require('./Authentication');

module.exports = function(pool){

    const taskservices = new TaskServices(pool);
    const authentication = new Authentication(pool);

    router.get('/retrieve', (req, res, next) => authentication.authenticateToken(req, res, next), async (req, res) => {

        const userid = req.payload.userid;
        console.log("userid in controller is - "+userid);
        try{
            const result = await taskservices.retrieveData(userid);
            res.send(result);  
        }
        catch (err) {
            console.error('Error fetching data', err);
            res.status(500).json({ error: 'An error occurred' });
        }
    });

    router.post('/addtask',(req,res,next) => authentication.authenticateToken(req,res,next), async(req,res) => {

        const{title,description,duedate} = req.body;
        const date = new Date();
        const status = "pending";
        const userid = req.payload.userid;
    
        try{
        
            const insertData = await taskservices.addTask(userid,title,description,date,duedate,status);
                res.send({message:'Data inserted successfully',id:insertData.recordset,userid,title,description,date,duedate,status});
                        
        }
        catch (err) {
            console.error('Error handling request:', err);
            res.status(500).send('Internal Server Error');
        }
    })

    router.delete('/delete/:id', (req, res, next) => authentication.authenticateToken(req, res, next), async (req, res) => {
        console.log('Received id:', req.params.id);
        const { id } = req.params;
        const userid = req.payload.userid;
        try {
            await taskservices.updateDelete(id, userid);
            res.status(200).send('Record deleted successfully'); 
        } catch (error) {
            console.error('Error deleting record:', error);
            res.status(500).send('Error deleting record');
        }
    });
    
    router.put('/update/:id/:status', (req, res, next) => authentication.authenticateToken(req, res, next), async (req, res) => {

        console.log('Received id:', req.params.id);
        console.log('Received status:', req.params.status);
        const { id, status } = req.params;
        const userid = req.payload.userid;
    
        let newStatus;
        if (status === "completed") {
            newStatus = "pending";
        } else {
            newStatus = "completed";
        }
    
        try {
            
            const result = await taskservices.updateStatus(id,newStatus,userid) 
            res.status(200).send('Status updated successfully'); 
        } catch (error) {
            console.error('Error updating status:', error);
            res.status(500).send('Error updating status'); 
        }
    });

    
    return router;
};