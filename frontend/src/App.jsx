import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';
import './App.css'; // Vite también usa este archivo para los estilos

// URLs de tu backend desplegado en Azure
const API_URL = 'https://app-subasta-backend.azurewebsites.net/api';
const HUB_URL = 'https://app-subasta-backend.azurewebsites.net/auctionhub';

function App() {
    const [auctions, setAuctions] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [message, setMessage] = useState('Cargando subastas...');

    useEffect(() => {
        axios.get(`${API_URL}/auctions`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setAuctions(res.data);
                    setMessage('');
                } else {
                    setMessage('No hay subastas activas.');
                }
            })
            .catch(err => {
                console.error("Error al cargar subastas:", err);
                setMessage('Error al conectar con el servidor.');
            });

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

        connection.start().catch(err => console.error('Error de conexión SignalR: ', err));

        return () => {
            connection.stop();
        };
    }, []);

    const handleBidSubmit = (e) => {
        e.preventDefault();
        if (!selectedAuction || !bidAmount) return;

        const bidValue = parseFloat(bidAmount);

        axios.post(`${API_URL}/auctions/${selectedAuction.id}/bids`, bidValue, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(() => {
                setBidAmount('');
            })
            .catch(err => {
                alert(err.response?.data || 'Error al realizar la puja.');
                console.error("Error al realizar la puja:", err);
            });
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Subastas en Tiempo Real</h1>
            </header>
            <main className="App-main">
                <div className="auctions-list">
                    <h2>Subastas Activas</h2>
                    {message ? (
                        <p>{message}</p>
                    ) : (
                        <ul>
                            {auctions.map(auction => (
                                <li
                                    key={auction.id}
                                    className={selectedAuction?.id === auction.id ? 'selected' : ''}
                                    onClick={() => setSelectedAuction(auction)}
                                >
                                    <strong>{auction.itemName}</strong>
                                    <span>Precio Actual: ${auction.currentPrice.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {selectedAuction && (
                    <div className="bid-form">
                        <h2>Realizar Puja por "{selectedAuction.itemName}"</h2>
                        <form onSubmit={handleBidSubmit}>
                            <input
                                type="number"
                                value={bidAmount}
                                onChange={e => setBidAmount(e.target.value)}
                                placeholder={`Mayor a $${selectedAuction.currentPrice.toFixed(2)}`}
                                step="0.01"
                                min={selectedAuction.currentPrice + 0.01}
                                required
                            />
                            <button type="submit">Pujar</button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;