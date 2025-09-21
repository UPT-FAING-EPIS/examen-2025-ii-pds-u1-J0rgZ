import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateAuctionPage from './pages/CreateAuctionPage';
import DashboardPage from './pages/DashboardPage';
import AuctionDetailPage from './pages/AuctionDetailPage'; // Nueva página de detalle

function App() {
    return (
        <>
            <Navbar />
            <main className="container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auctions/:id" element={<AuctionDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/auctions/new" element={<CreateAuctionPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
            </main>
        </>
    );
}

export default App;