import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import AuctionCard from '../components/AuctionCard';

export default function DashboardPage() {
    const [myAuctions, setMyAuctions] = useState([]);
    const [bidAuctions, setBidAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [myAuctionsRes, bidAuctionsRes] = await Promise.all([
                    api.get('/user/my-auctions'),
                    api.get('/user/my-bids')
                ]);
                setMyAuctions(myAuctionsRes.data);
                setBidAuctions(bidAuctionsRes.data);
            } catch (error) {
                console.error("Error al cargar el panel", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p style={{ textAlign: 'center' }}>Cargando tu panel...</p>;

    return (
        <div>
            <h1 style={{ marginBottom: '3rem', fontSize: '2.5rem', fontWeight: 'bold' }}>Mi Panel</h1>
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: '600' }}>Subastas que he Creado</h2>
                {myAuctions.length > 0 ? (
                    <div className="auctions-grid">
                        {myAuctions.map(auction => <AuctionCard key={auction.id} auction={auction} />)}
                    </div>
                ) : <p>No has creado ninguna subasta todavía.</p>}
            </div>
            <div>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: '600' }}>Subastas en las que he Pujado</h2>
                {bidAuctions.length > 0 ? (
                    <div className="auctions-grid">
                        {bidAuctions.map(auction => <AuctionCard key={auction.id} auction={auction} />)}
                    </div>
                ) : <p>No has pujado en ninguna subasta todavía.</p>}
            </div>
        </div>
    );
}