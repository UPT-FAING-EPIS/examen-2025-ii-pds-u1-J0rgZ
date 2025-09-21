import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';
import './App.css'; // Importamos el CSS para estilos básicos

// --- URLs DE TU BACKEND DESPLEGADO EN AZURE ---
// Estas son las direcciones reales de tu API.
const API_URL = 'https://app-subasta-backend.azurewebsites.net/api';
const HUB_URL = 'https://app-subasta-backend.azurewebsites.net/auctionhub';

function App() {
    const [auctions, setAuctions] = useState([]);
    const [bidAmount, setBidAmount] = useState('');
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [message, setMessage] = useState('Cargando subastas...');

    // Este efecto se ejecuta una sola vez cuando el componente se carga
    useEffect(() => {
        // 1. Cargar las subastas iniciales desde la API
        axios.get(`${API_URL}/auctions`)
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setAuctions(res.data);
                    setMessage(''); // Limpiar mensaje de carga
                } else {
                    setMessage('No hay subastas activas en este momento.');
                }
            })
            .catch(err => {
                console.error("Error al cargar las subastas:", err);
                setMessage('Error al conectar con el servidor. Por favor, inténtelo más tarde.');
            });

        // 2. Configurar la conexión en tiempo real con SignalR
        const connection = new HubConnectionBuilder()
            .withUrl(HUB_URL)
            .withAutomaticReconnect()
            .build();

        // Escuchar actualizaciones de pujas desde el servidor
        connection.on("ReceiveBidUpdate", (auctionId, newPrice) => {
            setAuctions(prevAuctions =>
                prevAuctions.map(auc =>
                    auc.id === auctionId ? { ...auc, currentPrice: newPrice } : auc
                )
            );
        });

        // Iniciar la conexión
        connection.start().catch(err => console.error('Error de conexión con SignalR: ', err));

        // Función de limpieza para cerrar la conexión al salir
        return () => {
            connection.stop();
        };
    }, []); // El array vacío asegura que esto se ejecute solo una vez

    const handleBidSubmit = (e) => {
        e.preventDefault();
        if (!selectedAuction || !bidAmount) return;

        // Enviamos la puja como un número, no como texto
        const bidValue = parseFloat(bidAmount);

        axios.post(`${API_URL}/auctions/${selectedAuction.id}/bids`, bidValue, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(() => {
                // Limpiar el campo de puja después de un éxito
                setBidAmount('');
            })
            .catch(err => {
                // Mostrar un error al usuario si la puja falla
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