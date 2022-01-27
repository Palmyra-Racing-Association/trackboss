import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MemberList from './pages/MemberList';
import Settings from './pages/Settings';
import CalendarPage from './pages/CalendarPage';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="members" element={<MemberList />} />
            <Route path="settings" element={<Settings />} />
        </Routes>
    );
}
