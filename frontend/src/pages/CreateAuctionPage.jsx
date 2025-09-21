import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function CreateAuctionPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startingPrice, setStartingPrice] = useState('');
    const [endTime, setEndTime] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!imageFile) {
            setError('Por favor, sube una imagen.');
            return;
        }
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('startingPrice', startingPrice);
        formData.append('endTime', endTime);
        formData.append('imageFile', imageFile);

        try {
            await api.post('/auctions', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/');
        } catch (err) {
            setError('Error al crear la subasta. Asegúrate de que todos los campos son correctos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Crear Nueva Subasta</h2>
            {error && <p className="form-error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title" className="form-label">Título del Artículo</label>
                    <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="form-input" />
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="form-label">Descripción</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required className="form-input" rows="4"></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="startingPrice" className="form-label">Precio Inicial ($)</label>
                    <input id="startingPrice" type="number" step="0.01" value={startingPrice} onChange={e => setStartingPrice(e.target.value)} required className="form-input" />
                </div>
                <div className="form-group">
                    <label htmlFor="endTime" className="form-label">Fecha y Hora de Finalización</label>
                    <input id="endTime" type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required className="form-input" />
                </div>
                <div className="form-group">
                    <label htmlFor="imageFile" className="form-label">Imagen del Artículo</label>
                    <input id="imageFile" type="file" onChange={e => setImageFile(e.target.files[0])} required className="form-input" />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                    {loading ? 'Publicando...' : 'Publicar Subasta'}
                </button>
            </form>
        </div>
    );
}