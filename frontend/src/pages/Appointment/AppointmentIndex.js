import React from 'react';
import Header from '../../components/Appointment/Header';
import Footer from '../../components/Appointment/Footer';
import '../../App.css';
import styles from '../../Appointment.module.css';

function Appointment() {
    return (
        <div className="app">
            <Header title="來預約" />
            <main className={styles.mainContent}>
                <div><h1>預約首頁</h1></div>


                <div><h2>放使用說明</h2></div>
            </main>
            <Footer />
        </div>
    );
}

export default Appointment; 