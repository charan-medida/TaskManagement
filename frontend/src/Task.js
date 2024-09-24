import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import './App.css';
import axiosInstance from './interceptor';

export function Task() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        duedate: ''
    });
    const navigate = useNavigate();
    const [fetchData, setFetchData] = useState([]);

    const updateFormData = (field, value) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: value
        }));
    };

    const [formErrors, setFormErrors] = useState({
        title: '',
        description: '',
        duedate: ''
    });
    const[loading,setLoading] = useState(false);
    const validateForm = () => {
        let valid = true;
        const newFormErrors = { ...formErrors };

        if (formData.title.trim() === '') {
            newFormErrors.title = "Title is required";
            valid = false;
        }
        if (formData.description.trim() === '') {
            newFormErrors.description = "Description is required";
            valid = false;
        }
        if (!formData.duedate) {
            newFormErrors.duedate = "Due date is required";
            valid = false;
        }
        setFormErrors(newFormErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
                try {
                    const result = await axiosInstance.post('task/addtask',formData
                    );
                    console.log(result);
                    fetchUpdatedData();
                } catch (err) {
                    console.error('Error in token authentication', err);
                    setLoading(false);
                }
                finally{
                    setLoading(false);
                }
        }
    };

    const fetchUpdatedData = async () => {
        try {
            const response = await axiosInstance.get('/task/retrieve');
            if (response.data) {
                setFetchData(response.data);
            } else {
                console.error("No data returned from the server.");
            }
            //setFetchData(response.data);
            setFormData({
                title: '',
                description: '',
                duedate: ''
            });
        } catch (err) {
            console.error('Error fetching updated data', err);
        }
    };
    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/task/delete/${id}`);
            fetchUpdatedData();
        } catch (error) {
            console.error('Error deleting row:', error);
        }
    };
    const handleStatus = async(id,status) => {

        try{
            await axiosInstance.put(`/task/update/${id}/${status}`,null);
            console.log("updated");
            fetchUpdatedData();
        }
        catch{
            console.log('error hitting');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/sign');
    };
    useEffect(() => {
        fetchUpdatedData();
    }, []);

    

    return (
        <div className='App'>
            <div className='button-container'>
                <button className="btn btn-primary " onClick={() => handleLogout()}> log out</button>  
            </div>
            
            <img className="fullscreen-image" src="./images/task.jpg" alt=''/>
            <h1 className = "title-container" style={{ color: "orange"}}>Task Management</h1><br /><br />

            <div className='formtask'>
            <h2>Add Task</h2>
            <input id="title" type="text" value={formData.title} onChange={(e) => updateFormData("title", e.target.value)}
                        placeholder='Enter the title'/>
            <span style={{ color: "red" }}>{formErrors.title}</span>       
                
            <input id="description" type="text" value={formData.description}  onChange={(e) => updateFormData("description", e.target.value)}
                        placeholder='Enter the description'/>
            <span style={{ color: "red" }}>{formErrors.description}</span>                 
                    
            <Form.Control id="duedate"  type="Date"  value={formData.duedate}  onChange={(e) => updateFormData("duedate", e.target.value)}
                        placeholder='Enter the due date'/>
            <span style={{ color: "red" }}>{formErrors.duedate}</span><br/><br/>    
                    
            <button className="btn btn-success" onClick={handleSubmit} disabled={loading}>{loading?'Adding':'Add'}</button><br /><br />         
            
            </div>

            <div className='formtable'>
                <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                    
                            <th className="td">Title</th>
                            <th className="td">Description</th>
                            <th className="td">Date</th>
                            <th className="td">Due Date</th>
                            <th className="td">Status</th>
                            <th className="td">Delete</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Array.isArray(fetchData) && fetchData.length > 0 ? (
                            fetchData.map((item) => (
                                <tr key={item.Id}>
                                    <td className="td">{item.title}</td>
                                    <td className="td">{item.description}</td>
                                    <td className="td">{item.date}</td>
                                    <td className="td">{item.duedate}</td>
                                    <td className="td">
                                        <button className="btn btn-primary" onClick={() => handleStatus(item.id, item.status)}>{item.status}</button>
                                    </td>
                                    <td className="td">
                                        <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No tasks found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div><br />
        
        </div>
    );
}
