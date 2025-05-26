import React from 'react';
import '../App.css';

// 專案彈出視窗元件草稿
function Modal({ open, onClose, children }) {
    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose}> {/* 點擊背景關閉視窗 */}
            <div className="modal-content" onClick={e => e.stopPropagation()}> {/* 阻止點擊視窗內容時關閉視窗 */}
                <button className="modal-close-button" onClick={onClose}>X</button> {/* 點擊x關閉視窗 */}
                {children}
            </div>
        </div>
    );
}

export default Modal; 