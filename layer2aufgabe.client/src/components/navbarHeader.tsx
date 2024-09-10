import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavbarHeader: React.FC = () => {
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!isLoggedIn) {
        return null; 
    }

    return (
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#e3f2fd' }}>
            <div className="container">
                <span className="navbar-brand">Layer2</span>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link btn" to="/Customers">Customer overview</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link btn" to="/Projects">Project overview</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavbarHeader;
