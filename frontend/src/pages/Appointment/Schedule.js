import React, { useState, useEffect } from 'react';
import Header from '../../components/Appointment/Header';
import Footer from '../../components/Appointment/Footer';
import Modal from '../../components/Appointment/modal';
import styles from '../../Appointment.module.css';

// 模擬API
async function fetchScheduleData(year, month) {
    // 模擬延遲
    await new Promise(r => setTimeout(r, 500));
    // 假資料
    const mockSchedules = ['行程A', '行程B', '行程C'];
    const mockScheduleData = {};
    for (let d = 1; d <= new Date(year, month, 0).getDate(); d++) {
        mockScheduleData[d] = {};
        for (const cat of mockSchedules) {
            // 每天每分類有 3 個時段，隨機 0~2 個被預約
            const slots = ['09:00', '13:00', '16:00'];
            const reserved = slots.filter(() => Math.random() < 0.15);
            mockScheduleData[d][cat] = { slots, reserved };
        }
    }
    return { schedules: mockSchedules, scheduleData: mockScheduleData };
}

function Schedule() {
    // 年月日初始化
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [day, setDay] = useState(new Date().getDate());
    // 年份范围
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // 行程分類與月行程資料
    const [categories, setCategories] = useState([]); // 從API取得
    const [selectedCategory, setSelectedCategory] = useState('');
    const [calendarData, setCalendarData] = useState({}); // { [day]: { [category]: { slots: [], reserved: [] } } }
    const [loading, setLoading] = useState(true);
    // 彈窗狀態
    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    // 新增行程分類表單狀態
    const [categoryName, setCategoryName] = useState('');
    const [categoryType, setCategoryType] = useState('fixed'); // 'fixed' or 'free'
    const [maxPeople, setMaxPeople] = useState('1');
    const [minPeople, setMinPeople] = useState('1');
    const [durationHour, setDurationHour] = useState('00');
    const [durationMinute, setDurationMinute] = useState('00');
    const [fixedSlots, setFixedSlots] = useState([{ week: '一', hour: '09', minute: '00' }]);
    const [freeSlots, setFreeSlots] = useState([
        { week: '一', start: '08', end: '23' }
    ]);

    // 取得資料
    useEffect(() => {
        setLoading(true);
        fetchScheduleData(year, month).then(res => {
            setCategories(res.schedules);
            setSelectedCategory(res.schedules[0] || '');
            setCalendarData(res.scheduleData);
            setLoading(false);
        });
    }, [year, month]);

    // 處理新增分類（僅前端，實際應呼叫API）
    const handleAddCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setSelectedCategory(newCategory);
        }
        setNewCategory('');
        setShowModal(false);
    };

    // slot 操作
    const updateFixedSlot = (idx, key, value) => {
        setFixedSlots(slots => slots.map((s, i) => i === idx ? { ...s, [key]: value } : s));
    };
    const removeFixedSlot = idx => {
        setFixedSlots(slots => slots.filter((_, i) => i !== idx));
    };
    const addFixedSlot = () => {
        setFixedSlots(slots => [...slots, { week: '一', hour: '09', minute: '00' }]);
    };
    const updateFreeSlot = (idx, key, value) => {
        setFreeSlots(slots => slots.map((s, i) => {
            if (i !== idx) return s;
            let newSlot = { ...s, [key]: value };
            if (key === 'start' && Number(newSlot.end) < Number(value)) {
                newSlot.end = value; // 自動同步
            }
            if (key === 'end' && Number(value) < Number(newSlot.start)) {
                newSlot.start = value; // 自動同步
            }
            return newSlot;
        }));
    };
    const removeFreeSlot = idx => {
        setFreeSlots(slots => slots.filter((_, i) => i !== idx));
    };
    const addFreeSlot = () => {
        setFreeSlots(slots => [...slots, { week: '一', start: '08', end: '23' }]);
    };

    // 新增行程分類彈窗
    function AddScheduleModal({ open, onClose }) {
        if (!open) return null;
        return (
            <Modal open={open} onClose={onClose}>
                <form className={styles.formGrid} onSubmit={e => { e.preventDefault(); handleAddCategory(); }}>
                    <label>
                        行程名稱
                        <input type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} />
                    </label>
                    <label>
                        行程類型
                        <label>
                            <input type="checkbox" checked={categoryType === 'free'} onChange={() => setCategoryType('free')} /> 自由預約
                        </label>
                        <label>
                            <input type="checkbox" checked={categoryType === 'fixed'} onChange={() => setCategoryType('fixed')} /> 固定時段
                        </label>
                    </label>
                    <label>
                        行程時長
                        <select value={durationHour} onChange={e => setDurationHour(e.target.value)}>
                            {Array.from({ length: 13 }, (_, i) => String(i).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                        </select> 時
                        <select value={durationMinute} onChange={e => setDurationMinute(e.target.value)}>
                            {Array.from({ length: 12 }, (_, i) => String(5 * i).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
                        </select> 分
                    </label>
                    <label>
                        最多人數
                        <input type="number" min="1" value={maxPeople} onChange={e => setMaxPeople(e.target.value)} />
                    </label>
                    <label>
                        最低人數
                        <input type="number" min="1" value={minPeople} onChange={e => setMinPeople(e.target.value)} />
                    </label>
                    <label>
                        可預約時段
                        {categoryType === 'fixed' ? (
                            <table className={styles.slotTable}>
                                <thead>
                                    <tr>
                                        <th>星期</th>
                                        <th>時間</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fixedSlots.map((slot, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <select value={slot.week} onChange={e => updateFixedSlot(idx, 'week', e.target.value)}>
                                                    {['一', '二', '三', '四', '五', '六', '日'].map(w => <option key={w} value={w}>{w}</option>)}
                                                </select>
                                            </td>
                                            <td>
                                                <select value={slot.hour} onChange={e => updateFixedSlot(idx, 'hour', e.target.value)}>
                                                    {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                                                </select> 時
                                                <select value={slot.minute} onChange={e => updateFixedSlot(idx, 'minute', e.target.value)}>
                                                    {Array.from({ length: 12 }, (_, i) => String(5 * i).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
                                                </select> 分
                                            </td>
                                            <td>
                                                <button type="button" className={styles.slotRemoveBtn} onClick={() => removeFixedSlot(idx)}>-</button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center' }}>
                                            <button type="button" className={styles.slotAddBtn} onClick={addFixedSlot}>新增時段</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        ) : (
                            <table className={styles.slotTable}>
                                <thead>
                                    <tr>
                                        <th>星期</th>
                                        <th>時段</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {freeSlots.map((slot, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <select value={slot.week} onChange={e => updateFreeSlot(idx, 'week', e.target.value)}>
                                                    {['一', '二', '三', '四', '五', '六', '日'].map(w => <option key={w} value={w}>{w}</option>)}
                                                </select>
                                            </td>
                                            <td>
                                                <select value={slot.start} onChange={e => updateFreeSlot(idx, 'start', e.target.value)}>
                                                    {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                                                </select>時
                                                -
                                                <select value={slot.end} onChange={e => updateFreeSlot(idx, 'end', e.target.value)}>
                                                    {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).filter(h => Number(h) >= Number(slot.start)).map(h => <option key={h} value={h}>{h}</option>)}
                                                </select>時
                                            </td>
                                            <td>
                                                <button type="button" className={styles.slotRemoveBtn} onClick={() => removeFreeSlot(idx)}>-</button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center' }}>
                                            <button type="button" className={styles.slotAddBtn} onClick={addFreeSlot}>新增時段</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </label>
                    <button type="submit" className={styles.addCategoryBtn}>加入</button>
                </form>
            </Modal>
        );
    }

    // 生成月曆資料
    function getCalendarMatrix(year, month) {
        const firstDay = new Date(year, month - 1, 1);
        const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // 以週一為第一天
        const daysInMonth = new Date(year, month, 0).getDate();
        const weeks = [];
        let dayNum = 1 - firstDayOfWeek;
        for (let w = 0; w < 6; w++) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                if (dayNum > 0 && dayNum <= daysInMonth) {
                    week.push(dayNum);
                } else {
                    week.push(null);
                }
                dayNum++;
            }
            weeks.push(week);
            if (dayNum > daysInMonth) break;
        }
        return weeks;
    }
    const calendarMatrix = getCalendarMatrix(year, month);
    const today = new Date();
    const isToday = (d) => d && year === today.getFullYear() && month === today.getMonth() + 1 && d === today.getDate();

    return (
        <div className={styles.app}>
            <Header title="來預約" />
            <main className={styles.mainContent}>
                <div className={styles.dateSelection}>
                    <select className={styles.yearSelect} value={year} onChange={e => setYear(Number(e.target.value))}>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select> 年
                    <select className={styles.monthSelect} value={month} onChange={e => setMonth(Number(e.target.value))}>
                        {months.map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
                    </select> 月
                    <select className={styles.daySelect} value={day} onChange={e => setDay(Number(e.target.value))}>
                        {days.map(d => <option key={d} value={d}>{String(d).padStart(2, '0')}</option>)}
                    </select> 日
                </div>
                <div className={styles.categorySelection}>
                    行程：
                    <select className={styles.categorySelect} value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button className={styles.addCategoryButton} onClick={() => setShowModal(true)}>+</button>
                </div>
                <div className={styles.calendarArea}>
                    {loading ? (
                        <div style={{ textAlign: 'center', width: '100%', padding: '2rem', color: '#aaa' }}>載入中...</div>
                    ) : (
                        <div className={styles.calendarContainer}>
                            <table className={styles.calendarTable}>
                                <thead>
                                    <tr>
                                        <th>一</th>
                                        <th>二</th>
                                        <th>三</th>
                                        <th>四</th>
                                        <th>五</th>
                                        <th>六</th>
                                        <th>日</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {calendarMatrix.map((week, i) => (
                                        <tr key={i}>
                                            {week.map((d, j) => (
                                                <td key={j} className={isToday(d) ? styles.today : d ? styles.active : styles.empty}>
                                                    <div style={{ position: 'relative' }}>
                                                        {d || ''}
                                                        {d && calendarData[d] && calendarData[d][selectedCategory] && calendarData[d][selectedCategory].reserved.length > 0 && (
                                                            <div className={styles.reservedList}>
                                                                {calendarData[d][selectedCategory].reserved
                                                                    .slice()
                                                                    .sort((a, b) => a.localeCompare(b))
                                                                    .map(time => (
                                                                        <div key={time} className={styles.reservedTime}>{time}</div>
                                                                    ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {/* 新增行程分類彈窗 */}
                <AddScheduleModal open={showModal} onClose={() => setShowModal(false)} />
            </main>
            <Footer />
        </div>
    );
}

export default Schedule; 