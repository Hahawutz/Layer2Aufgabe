// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavbarHeader from './components/navbarHeader';
import 'bootstrap/dist/css/bootstrap.min.css';

import Customer from './pages/Customer';
import Project from './pages/Project';

const App: React.FC = () => {
    return (
        <Router>
                <NavbarHeader />
                <Routes>
                    <Route path="/" element={<Navigate to="/Customers" />} />
                    <Route path="/Customers" element={<Customer />} />
                    <Route path="/Projects" element={<Project />} />
                </Routes>
        </Router>
    );
};

export default App;
