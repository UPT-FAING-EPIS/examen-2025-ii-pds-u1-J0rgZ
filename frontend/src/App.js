import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';

// Reemplaza esta URL con la de tu backend una vez desplegada
const API_URL = 'http://localhost:5000/api'; // O la URL de Azure
const HUB_URL = 'http://localhost:5000/auctionhub'; // O la URL de Azure

function App() {
    const [auctions, setAuctions] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [selectedAuctionId, setSelectedAuctionId] = useState(null);

    useEffect(() => {
        // Cargar subastas iniciales
        axios.get(`${API_URL}/auctions`).then(res => setAuctions(res.data));

        // Configurar conexión SignalR
        const connection = new HubConnectionBuilder()
            .withUrl(HUB_URL)
            .withAutomaticReconnect()
            .build();

        connection.on("ReceiveBidUpdate", (auctionId, newPrice) => {
            setAuctions(prevAuctions =>
                prevAuctions.map(auc =>
                    auc.id === auctionId ? { ...auc, currentPrice: newPrice } : auc
                )
            );
        });

        connection.start().catch(err => console.error('SignalR Connection Error: ', err));

        return () => {
            connection.stop();
        };
    }, []);

    const handleBidSubmit = (e) => {
        e.preventDefault();
        if (!selectedAuctionId) return;

        axios.post(`${API_URL}/auctions/${selectedAuctionId}/bids`, parseFloat(bidAmount), {
            headers: { 'Content-Type': 'application/json' }
        }).catch(err => console.error("Error placing bid:", err));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Subastas en Línea</h1>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                    <h2>Subastas Activas</h2>
                    <ul>
                        {auctions.map(auction => (
                            <li key={auction.id} onClick={() => setSelectedAuctionId(auction.id)} style={{ cursor: 'pointer', padding: '10px', border: selectedAuctionId === auction.id ? '2px solid blue' : '1px solid #ccc' }}>
                                <strong>{auction.itemName}</strong> - Puja actual: ${auction.currentPrice}
                            </li>
                        ))}
                    </ul>
                </div>
                {selectedAuctionId && (
                    <div>
                        <h2>Realizar Puja</h2>
                        <form onSubmit={handleBidSubmit}>
                            <input
                                type="number"
                                value={bidAmount}
                                onChange={e => setBidAmount(e.target.value)}
                                placeholder="Monto de la puja"
                                required
                            />
                            <button type="submit">Pujar</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;