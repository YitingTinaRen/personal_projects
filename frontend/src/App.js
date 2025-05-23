import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';

function MainContent() {
  return (
    <main className="main-content">
      <div className="main-container">
        <div className="appointment-image">
          <img src="/book_appointment.jpeg" alt="預約服務" />
        </div>
        <div className="welcome-text">
          <h2>歡迎使用預約服務</h2>
          <p>在這裡，您可以輕鬆預約各種服務。我們提供便捷的預約系統，讓您的生活更加便利。</p>
        </div>
      </div>
    </main>
  );
}

function Home() {
  return (
    <div className="app">
      <Header title="大家一起來預約" />
      <MainContent />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
