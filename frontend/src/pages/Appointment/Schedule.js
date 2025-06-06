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
            const reserved = slots.filter(() => Math.random() < 0.45);
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
    // 視圖模式
    const [viewMode, setViewMode] = useState('month'); // 'month' 或 'week' 或 'day'
    const [selectedDate, setSelectedDate] = useState(new Date());
    // 年份范围
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // 行程分類與月行程資料
    const [schedules, setSchedules] = useState([]); // 從API取得
    const [selectedSchedule, setSelectedSchedule] = useState('');
    const [scheduleData, setScheduleData] = useState({}); // { [day]: { [schedule]: { slots: [], reserved: [] } } }
    const [loading, setLoading] = useState(true);
    // 彈窗狀態
    const [showModal, setShowModal] = useState(false);
    const [showDeleteScheduleModal, setShowDeleteScheduleModal] = useState(false);
    const [newSchedule, setNewSchedule] = useState('');

    // 新增行程分類表單狀態
    const [scheduleName, setScheduleName] = useState('');
    const [scheduleType, setScheduleType] = useState('fixed'); // 'fixed' or 'free'
    const [scheduleYear, setScheduleYear] = useState(currentYear);
    const [scheduleMonthStart, setScheduleMonthStart] = useState(month);
    const [scheduleMonthEnd, setScheduleMonthEnd] = useState(month);
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
            setSchedules(res.schedules);
            setSelectedSchedule(res.schedules[0] || '');
            setScheduleData(res.scheduleData);
            setLoading(false);
        });
    }, [year, month]);

    // 處理新增行程（僅前端，實際應呼叫API）
    const handleAddSchedule = () => {
        if (newSchedule && !schedules.includes(newSchedule)) {
            setSchedules([...schedules, newSchedule]);
            setSelectedSchedule(newSchedule);
        }
        setNewSchedule('');
        setShowModal(false);
    };
    // 處理刪除行程 (僅前端，實際應呼叫API)
    const handleDeleteSchedule = () => {
        setSchedules(schedules.filter(s => s !== selectedSchedule));
        setSelectedSchedule('');
        setShowDeleteScheduleModal(false);
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

    // 生成週視圖資料
    function getWeekData(date) {
        const startOfWeek = new Date(date);
        if (date.getDay() === 0) {
            startOfWeek.setDate(date.getDate() - 6); // 設定為週一
        } else {
            startOfWeek.setDate(date.getDate() - date.getDay() + 1); // 設定為週一
        }

        const weekData = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startOfWeek);
            currentDate.setDate(startOfWeek.getDate() + i);
            weekData.push({
                date: currentDate,
                day: currentDate.getDate(),
                month: currentDate.getMonth() + 1,
                year: currentDate.getFullYear()
            });
        }
        return weekData;
    }

    // 處理日期點擊
    const handleDateClick = (d) => {
        if (!d) return;
        const newDate = new Date(year, month - 1, d);
        setSelectedDate(newDate);
        setViewMode('week'); // 統一設置為週視圖，由 CSS 控制顯示
    };

    // 返回月視圖
    const handleBackToMonth = () => {
        setViewMode('month');
    };

    // 生成時間槽
    const generateTimeSlots = (date) => {
        const day = date.date.getDate();
        if (!scheduleData[day] || !scheduleData[day][selectedSchedule]) {
            return [];
        }
        const { slots, reserved } = scheduleData[day][selectedSchedule];
        return slots.map(time => ({
            time,
            isReserved: reserved.includes(time)
        }));
    };

    // 判斷日期是否被選中
    const isSelectedDate = (date) => {
        return date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

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
                    {viewMode === 'month' && (
                        <select className={styles.daySelect} value={day} onChange={e => setDay(Number(e.target.value))}>
                            {days.map(d => <option key={d} value={d}>{String(d).padStart(2, '0')}</option>)}
                        </select>
                    )}
                </div>
                <div className={styles.scheduleSelection}>
                    行程：
                    <select className={styles.scheduleSelect} value={selectedSchedule} onChange={e => setSelectedSchedule(e.target.value)}>
                        {schedules.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button className={styles.addScheduleButton} onClick={() => setShowModal(true)}>+</button>
                    <button className={styles.addScheduleButton} onClick={() => setShowDeleteScheduleModal(true)}>-</button>
                </div>
                <div className={styles.calendarArea}>
                    {loading ? (
                        <div style={{ textAlign: 'center', width: '100%', padding: '2rem', color: '#aaa' }}>載入中...</div>
                    ) : viewMode === 'month' ? (
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
                                                <td
                                                    key={j}
                                                    className={isToday(d) ? styles.today : d ? styles.active : styles.empty}
                                                    onClick={() => handleDateClick(d)}
                                                >
                                                    <div style={{ position: 'relative' }}>
                                                        {d || ''}
                                                        {d && scheduleData[d] && scheduleData[d][selectedSchedule] && (
                                                            <div className={styles.reservedList}>
                                                                {scheduleData[d][selectedSchedule].slots.length > 0 && (
                                                                    scheduleData[d][selectedSchedule].reserved.length === scheduleData[d][selectedSchedule].slots.length ? (
                                                                        <div className={styles.reservedTime}>滿</div>
                                                                    ) : scheduleData[d][selectedSchedule].reserved.length > 0 ? (
                                                                        <div className={styles.partialTime}>尚可預約</div>
                                                                    ) : (
                                                                        <div className={styles.availableTime}>可預約</div>
                                                                    )
                                                                )}
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
                    ) : (
                        <div className={styles.weekView}>
                            <div className={styles.weekHeader}>
                                <button onClick={handleBackToMonth} className={styles.backButton}>返回月視圖</button>
                                <div className={styles.weekDates}>
                                    {getWeekData(selectedDate).map((date, index) => (
                                        <div
                                            key={index}
                                            className={`${styles.weekDate} ${isSelectedDate(date.date) ? styles.selectedDate : ''}`}
                                        >
                                            <div className={styles.weekDay}>{['一', '二', '三', '四', '五', '六', '日'][index]}</div>
                                            <div className={styles.weekDateNum}>{date.day}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.timeSlots}>
                                {getWeekData(selectedDate).map((date, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.dayColumn} ${isSelectedDate(date.date) ? styles.selectedColumn : ''}`}
                                        data-date={`${date.year}年${date.month}月${date.day}日`}
                                    >
                                        {generateTimeSlots(date).map((slot, slotIndex) => (
                                            <div
                                                key={slotIndex}
                                                className={`${styles.timeSlot} ${slot.isReserved ? styles.reserved : styles.available}`}
                                            >
                                                {slot.time}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {/* 新增行程分類彈窗 */}
                <AddScheduleModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    scheduleName={scheduleName}
                    setScheduleName={setScheduleName}
                    scheduleYear={scheduleYear}
                    setScheduleYear={setScheduleYear}
                    scheduleMonthStart={scheduleMonthStart}
                    setScheduleMonthStart={setScheduleMonthStart}
                    scheduleMonthEnd={scheduleMonthEnd}
                    setScheduleMonthEnd={setScheduleMonthEnd}
                    scheduleType={scheduleType}
                    setScheduleType={setScheduleType}
                    durationHour={durationHour}
                    setDurationHour={setDurationHour}
                    durationMinute={durationMinute}
                    setDurationMinute={setDurationMinute}
                    maxPeople={maxPeople}
                    setMaxPeople={setMaxPeople}
                    minPeople={minPeople}
                    setMinPeople={setMinPeople}
                    fixedSlots={fixedSlots}
                    updateFixedSlot={updateFixedSlot}
                    removeFixedSlot={removeFixedSlot}
                    addFixedSlot={addFixedSlot}
                    freeSlots={freeSlots}
                    updateFreeSlot={updateFreeSlot}
                    removeFreeSlot={removeFreeSlot}
                    addFreeSlot={addFreeSlot}
                    handleAddSchedule={handleAddSchedule}
                    currentYear={currentYear}
                    styles={styles}
                />
                <DeleteScheduleModal
                    open={showDeleteScheduleModal}
                    onClose={() => setShowDeleteScheduleModal(false)}
                    scheduleName={selectedSchedule}
                    handleDeleteSchedule={handleDeleteSchedule}
                />
            </main>
            <Footer />
        </div>
    );
}

// 新增行程分類彈窗（獨立於 Schedule 外部）
function AddScheduleModal({
    open, onClose,
    scheduleName, setScheduleName,
    scheduleYear, setScheduleYear,
    scheduleMonthStart, setScheduleMonthStart,
    scheduleMonthEnd, setScheduleMonthEnd,
    scheduleType, setScheduleType,
    durationHour, setDurationHour,
    durationMinute, setDurationMinute,
    maxPeople, setMaxPeople,
    minPeople, setMinPeople,
    fixedSlots, updateFixedSlot, removeFixedSlot, addFixedSlot,
    freeSlots, updateFreeSlot, removeFreeSlot, addFreeSlot,
    handleAddSchedule,
    currentYear,
    styles
}) {
    if (!open) return null;
    return (
        <Modal open={open} onClose={onClose}>
            <form className={styles.formGrid} onSubmit={e => { e.preventDefault(); handleAddSchedule(); }}>
                <label>
                    <b>行程名稱:</b>
                    <input type="text" value={scheduleName} onChange={e => setScheduleName(e.target.value)} />
                </label>
                <label className={styles.labelBlock}>
                    <b>行程有效年月份:</b>
                    <div className={styles.inputRow}>
                        <select value={scheduleYear} onChange={e => setScheduleYear(e.target.value)}>
                            {Array.from({ length: 2 }, (_, i) => String(currentYear + i).padStart(4, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                        </select> 年
                        <select value={scheduleMonthStart} onChange={e => setScheduleMonthStart(e.target.value)}>
                            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
                        </select> 月 -
                        <select value={scheduleMonthEnd} onChange={e => setScheduleMonthEnd(e.target.value)}>
                            {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
                                .filter(m => Number(m) >= Number(scheduleMonthStart))
                                .map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                        </select> 月
                    </div>
                </label>
                <label>
                    <b>行程類型:</b>
                    <label>
                        <input type="checkbox" checked={scheduleType === 'free'} onChange={() => setScheduleType('free')} /> 自由預約
                    </label>
                    <label>
                        <input type="checkbox" checked={scheduleType === 'fixed'} onChange={() => setScheduleType('fixed')} /> 固定時段
                    </label>
                </label>
                <label>
                    <b>行程時長:</b>
                    <select value={durationHour} onChange={e => setDurationHour(e.target.value)}>
                        {Array.from({ length: 13 }, (_, i) => String(i).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                    </select> 時
                    <select value={durationMinute} onChange={e => setDurationMinute(e.target.value)}>
                        {Array.from({ length: 12 }, (_, i) => String(5 * i).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
                    </select> 分
                </label>
                <label>
                    <b>最多人數:</b>
                    <input type="number" min="1" value={maxPeople} onChange={e => setMaxPeople(e.target.value)} style={{ width: '85px' }} />
                </label>
                <label>
                    <b>最低人數:</b>
                    <input type="number" min="1" value={minPeople} onChange={e => setMinPeople(e.target.value)} style={{ width: '85px' }} />
                </label>
                <label>
                    <b>可預約時段:</b>
                    {scheduleType === 'fixed' ? (
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
                <button type="submit" className={styles.addScheduleBtn}>加入</button>
            </form>
        </Modal>
    );
}

function DeleteScheduleModal({
    open, onClose,
    scheduleName,
    handleDeleteSchedule
}) {
    if (!open) return null;
    return (
        <Modal open={open} onClose={onClose}>
            <form className={styles.formGrid} onSubmit={e => { e.preventDefault(); handleDeleteSchedule(); }}>
                <label>
                    <b>即將刪除行程:</b>
                    {scheduleName}
                </label>
                <button type="submit" className={styles.addScheduleBtn}>刪除</button>
                <button type="button" className={styles.addScheduleBtn} onClick={onClose}>取消</button>
            </form>
        </Modal>
    );
}


export default Schedule; 