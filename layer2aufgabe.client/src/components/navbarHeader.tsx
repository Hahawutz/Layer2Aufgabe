import React from 'react';
import { Link } from 'react-router-dom';

const NavbarHeader: React.FC = () => {
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
                            <Link className="nav-link btn" to="/Customers">Kunden übersicht</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link btn" to="/Projects">Projekt übersicht</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavbarHeader;
