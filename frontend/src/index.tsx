import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import MemberList from './pages/MemberList';
import Settings from './pages/Settings';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="members" element={<MemberList />} />
            <Route path="settings" element={<Settings />} />

        </Routes>
    </BrowserRouter>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
