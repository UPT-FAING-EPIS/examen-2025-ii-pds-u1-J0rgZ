import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import AuctionCard from '../components/AuctionCard';
import { HubConnectionBuilder } from '@microsoft/signalr';

const HUB_URL = 'https://app-subasta-backend.azurewebsites.net/auctionhub';

export default function HomePage() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/auctions?status=Active')
            .then(res => setAuctions(res.data))
            .catch(err => console.error("Error al cargar subastas", err))
            .finally(() => setLoading(false));

        const connection = new HubConnectionBuilder().withUrl(HUB_URL).withAutomaticReconnect().build();

        connection.on("ReceiveBidUpdate", (auctionId, newPrice) => {
            setAuctions(prev => prev.map(auc => auc.id === auctionId ? { ...auc, currentPrice: newPrice } : auc));
        });

        connection.start().catch(err => console.error('Error de conexión SignalR: ', err));

        return () => connection.stop();
    }, []);

    if (loading) return <p style={{ textAlign: 'center' }}>Cargando subastas...</p>;

    return (
        <div>
            <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', fontWeight: 'bold' }}>Subastas Activas</h1>
            {auctions.length > 0 ? (
                <div className="auctions-grid">
                    {auctions.map(auction => <AuctionCard key={auction.id} auction={auction} />)}
                </div>
            ) : (
                <p style={{ textAlign: 'center' }}>No hay subastas activas en este momento.</p>
            )}
        </div>
    );
}