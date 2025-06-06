import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../App.css';

function Header({ title }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // 所有可能的選單項目
    const allMenuItems = [
        { path: '/appointment', label: '首頁' },
        { path: '/appointment/schedule', label: '行程規劃' },
        { path: '/appointment/booking', label: '預約' }
    ];

    // 過濾掉當前頁面的選項
    const menuItems = allMenuItems.filter(item => {
        // 如果是首頁，不顯示首頁選項
        if (location.pathname === '/' && item.path === '/') {
            return false;
        }
        // 過濾掉當前頁面的選項
        return item.path !== location.pathname;
    });

    return (
        <header className="header">
            <h1>{title}</h1>
            <div className="menu-container">
                <button className="hamburger" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <nav className={`menu ${isMenuOpen ? 'open' : ''}`}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}

export default Header; 