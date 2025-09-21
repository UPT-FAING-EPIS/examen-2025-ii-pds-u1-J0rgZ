import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { token, userEmail, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="navbar">
            <div className="container">
                <Link to="/" className="navbar-brand">AuctionHub</Link>
                <nav className="navbar-links">
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Subastas</NavLink>
                    {token ? (
                        <>
                            <NavLink to="/auctions/new" className={({ isActive }) => isActive ? 'active' : ''}>Crear Subasta</NavLink>
                            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Mi Panel</NavLink>
                            <span>{userEmail}</span>
                            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                                Salir
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Iniciar Sesión</NavLink>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                Registrarse
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}