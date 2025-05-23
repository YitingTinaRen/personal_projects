import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

function Header({ title }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // 所有可能的選單項目
    const allMenuItems = [
        { path: '/', label: '首頁' },
        { path: '/about', label: '關於我' },
        { path: '/contact', label: '聯絡我' },
        { path: '/services', label: '服務項目' },
        { path: '/booking', label: '預約服務' }
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