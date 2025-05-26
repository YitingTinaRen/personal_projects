import React from 'react';
import styles from '../../Appointment.module.css';

// 專案彈出視窗元件草稿
function Modal({ open, onClose, children }) {
    if (!open) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}> {/* 點擊背景關閉視窗 */}
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}> {/* 阻止點擊視窗內容時關閉視窗 */}
                <button className={styles.modalCloseButton} onClick={onClose}>X</button> {/* 點擊x關閉視窗 */}
                {children}
            </div>
        </div>
    );
}

export default Modal; 