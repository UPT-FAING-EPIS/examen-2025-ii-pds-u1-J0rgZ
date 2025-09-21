import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { HubConnectionBuilder } from '@microsoft/signalr';

const HUB_URL = 'https://app-subasta-backend.azurewebsites.net/auctionhub';

export default function AuctionDetailPage() {
    const { id } = useParams();
    const { token, userEmail } = useAuth();
    const navigate = useNavigate();

    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [bidAmount, setBidAmount] = useState('');
    const [bidError, setBidError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Usamos useRef para mantener la conexión de SignalR sin causar re-renders
    const connectionRef = useRef(null);

    useEffect(() => {
        // --- 1. Carga inicial de datos de la subasta ---
        api.get(`/auctions/${id}`)
            .then(res => {
                setAuction(res.data);
                // Sugerir una puja inicial un poco mayor al precio actual
                setBidAmount((res.data.currentPrice + 1).toFixed(2));
            })
            .catch(err => {
                console.error("Error al cargar la subasta.", err);
                setError("No se pudo cargar la subasta o no fue encontrada.");
            })
            .finally(() => setLoading(false));

        // --- 2. Configuración de la conexión en tiempo real ---
        const connection = new HubConnectionBuilder()
            .withUrl(HUB_URL)
            .withAutomaticReconnect()
            .build();

        connectionRef.current = connection;

        connection.on("ReceiveBidUpdate", (auctionId, newPrice, bidderEmail) => {
            // Solo actualizamos si la notificación es para ESTA subasta
            if (auctionId === id) {
                setAuction(prevAuction => {
                    if (!prevAuction) return null;
                    // Creamos un nuevo objeto de puja para añadir al historial
                    const newBid = {
                        userEmail: bidderEmail,
                        amount: newPrice,
                        timestamp: new Date().toISOString()
                    };
                    return {
                        ...prevAuction,
                        currentPrice: newPrice,
                        // Añadimos la nueva puja al principio de la lista
                        bids: [newBid, ...prevAuction.bids]
                    };
                });
                // Actualizamos el monto sugerido en el input
                setBidAmount((newPrice + 1).toFixed(2));
            }
        });

        connection.start().catch(err => console.error('Error de conexión con SignalR: ', err));

        // --- 3. Función de limpieza al desmontar el componente ---
        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
            }
        };
    }, [id]); // Se ejecuta de nuevo solo si el ID de la subasta cambia

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        setBidError('');
        setIsSubmitting(true);

        const bidValue = parseFloat(bidAmount);
        if (isNaN(bidValue) || bidValue <= auction.currentPrice) {
            setBidError(`Tu puja debe ser mayor que $${auction.currentPrice.toFixed(2)}.`);
            setIsSubmitting(false);
            return;
        }

        try {
            await api.post(`/auctions/${id}/bids`, bidValue, {
                headers: { 'Content-Type': 'application/json' }
            });
            // El UI se actualizará automáticamente gracias a la notificación de SignalR
        } catch (err) {
            setBidError(err.response?.data || 'Ocurrió un error al realizar la puja.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Renderizado Condicional ---
    if (loading) return <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Cargando detalles de la subasta...</p>;
    if (error) return <p className="form-error">{error}</p>;
    if (!auction) return <p style={{ textAlign: 'center' }}>Subasta no encontrada.</p>;

    const isSeller = userEmail === auction.sellerEmail;
    const isAuctionActive = auction.status === 'Active';

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', alignItems: 'flex-start' }}>

            {/* Columna Izquierda: Imagen e Historial de Pujas */}
            <div>
                <img src={auction.imageUrl} alt={auction.title} style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />

                <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Historial de Pujas</h3>
                    {auction.bids && auction.bids.length > 0 ? (
                        <ul style={{ listStyle: 'none', maxHeight: '300px', overflowY: 'auto' }}>
                            {auction.bids.slice().reverse().map((bid, index) => ( // .slice().reverse() para no mutar el original
                                <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
                                    <span>
                                        <span style={{ fontWeight: '600' }}>${bid.amount.toFixed(2)}</span> por <span style={{ fontStyle: 'italic' }}>{bid.userEmail}</span>
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                        {new Date(bid.timestamp).toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ color: 'var(--color-text-secondary)' }}>Aún no hay pujas. ¡Sé el primero!</p>
                    )}
                </div>
            </div>

            {/* Columna Derecha: Detalles y Formulario de Puja */}
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: '800', lineHeight: '1.2' }}>{auction.title}</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>Vendido por: {auction.sellerEmail}</p>
                <p style={{ marginTop: '1.5rem', lineHeight: '1.7' }}>{auction.description}</p>

                <div style={{ backgroundColor: 'var(--color-background)', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ textTransform: 'uppercase', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Precio Actual</p>
                    <p style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--color-primary)', margin: '0.5rem 0' }}>${auction.currentPrice.toFixed(2)}</p>
                    <p className="auction-card-time">{/* Lógica tiempo restante */}</p>
                </div>

                {token ? (
                    isAuctionActive ? (
                        isSeller ? (
                            <p style={{ marginTop: '2rem', textAlign: 'center', fontWeight: '500' }}>No puedes pujar en tu propia subasta.</p>
                        ) : (
                            <form onSubmit={handleBidSubmit} style={{ marginTop: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Realiza tu puja</h3>
                                {bidError && <p className="form-error">{bidError}</p>}
                                <div className="form-group">
                                    <input
                                        type="number"
                                        value={bidAmount}
                                        onChange={e => setBidAmount(e.target.value)}
                                        className="form-input"
                                        step="0.01"
                                        min={auction.currentPrice + 0.01}
                                    />
                                </div>
                                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%' }}>
                                    {isSubmitting ? 'Pujando...' : 'Pujar Ahora'}
                                </button>
                            </form>
                        )
                    ) : (
                        <p style={{ marginTop: '2rem', textAlign: 'center', fontWeight: 'bold', color: 'var(--color-error)' }}>Esta subasta ha finalizado.</p>
                    )
                ) : (
                    <div style={{ marginTop: '2rem', textAlign: 'center', backgroundColor: 'var(--color-background)', padding: '1rem', borderRadius: '8px' }}>
                        <p>Debes <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>iniciar sesión</Link> para poder pujar.</p>
                    </div>
                )}
            </div>
        </div>
    );
}