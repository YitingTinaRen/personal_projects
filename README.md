# 預約服務系統

這是一個使用 Django REST framework 和 React 開發的預約服務系統。

## 專案結構

```
appointment/
├── backend/          # Django 後端
│   ├── appointment/  # Django 應用
│   └── manage.py
└── frontend/         # React 前端
    ├── public/
    └── src/
```

## 技術棧

### 後端
- Python 3.x
- Django
- Django REST framework
- SQLite

### 前端
- React
- React Router
- CSS3

## 安裝說明

### 後端設置
1. 創建虛擬環境：
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate  # Windows
```

2. 安裝依賴：
```bash
pip install -r requirements.txt
```

3. 運行遷移：
```bash
python manage.py migrate
```

4. 啟動服務器：
```bash
python manage.py runserver
```

### 前端設置
1. 進入前端目錄：
```bash
cd frontend
```

2. 安裝依賴：
```bash
npm install
```

3. 啟動開發服務器：
```bash
npm start
```

## 功能特點

- 響應式設計
- 漢堡選單導航
- 頁面路由管理
- RESTful API

## 開發團隊

- Tina Ren

## 授權

MIT License 