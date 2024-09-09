// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavbarHeader from './components/navbarHeader';
import 'bootstrap/dist/css/bootstrap.min.css';

import Customer from './pages/Customer';
import Project from './pages/Project';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';


const App: React.FC = () => {
    
    return (
        <Router>
            <NavbarHeader />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/Customers" element={<Customer />} />
                    <Route path="/Projects" element={<Project />} />
                </Route>
                <Route path="/" element={<Navigate to="/Customers" />} />
            </Routes>
        </Router>
    );
};

export default App;
