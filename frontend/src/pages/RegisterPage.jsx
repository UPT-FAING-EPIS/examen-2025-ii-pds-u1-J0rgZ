import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await api.post('/auth/register', { email, password });
            setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
            setTimeout(() => navigate('/login'), 2000); // Redirige a login después de 2 seg
        } catch (err) {
            setError(err.response?.data || 'Error en el registro. Inténtelo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Crear una Cuenta</h2>
            {error && <p className="form-error">{error}</p>}
            {success && <p style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{success}</p>}
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
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                ¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'var(--color-primary)' }}>Inicia Sesión</Link>
            </p>
        </div>
    );
}