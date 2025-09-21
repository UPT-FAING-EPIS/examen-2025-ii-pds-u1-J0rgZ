import React from 'react';
import { Link } from 'react-router-dom';

export default function AuctionCard({ auction }) {
    const timeLeft = () => {
        const diff = new Date(auction.endTime) - new Date();
        if (diff < 0) return "Finalizada";
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        if (days > 0) return `${days}d ${hours}h restantes`;
        return `${hours}h ${minutes}m restantes`;
    };

    return (
        <Link to={`/auctions/${auction.id}`} className="auction-card">
            <img src={auction.imageUrl} alt={auction.title} className="auction-card-image" />
            <div className="auction-card-content">
                <h3 className="auction-card-title">{auction.title}</h3>
                <div className="auction-card-footer">
                    <div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Puja actual</p>
                        <p className="auction-card-price">${auction.currentPrice.toFixed(2)}</p>
                    </div>
                    <p className="auction-card-time">{timeLeft()}</p>
                </div>
            </div>
        </Link>
    );
}