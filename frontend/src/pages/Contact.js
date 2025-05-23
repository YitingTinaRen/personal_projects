import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

function Contact() {
    return (
        <div className="app">
            <Header title="聯絡我" />
            <main className="main-content">
                <div className="content">
                    <h2>聯絡我</h2>
                    <p>這裡是聯絡我的內容...</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Contact; 