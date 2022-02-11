/*eslint-disable*/
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { UserContextProvider } from './contexts/UserContext'
import Dashboard from './pages/Dashboard';
import MemberListPage from './pages/MemberListPage';
import Settings from './pages/Settings';
import CalendarPage from './pages/CalendarPage';

export default function App() {
    return (
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="members" element={<MemberListPage />} />
                <Route path="settings" element={<Settings />} />
            </Routes>
    );
}
