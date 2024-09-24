import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter,Routes,Route} from "react-router-dom";
import {App} from './App';
import {Sign} from './Sign';
import { Register } from './Register';
import {Task} from './Task'
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App/>}/>
    <Route path="sign" element={<Sign/>}/>
    <Route path="register" element={<Register/>}/>
    <Route path="task" element={<Task/>}/>
  </Routes> 
  </BrowserRouter>
);

