import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data);
            navigate('/');
        } catch (err) {
            setError('Credenciales inválidas. Por favor, inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Iniciar Sesión</h2>
            {error && <p className="form-error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email-address" className="form-label">Correo Electrónico</label>
                    <input id="email-address" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="form-input" />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="form-input" />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                ¿No tienes una cuenta? <Link to="/register" style={{ color: 'var(--color-primary)' }}>Regístrate</Link>
            </p>
        </div>
    );
}