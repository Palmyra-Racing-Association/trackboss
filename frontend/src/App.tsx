/*eslint-disable*/
import React, { useContext, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { UserContext, UserContextProvider } from './contexts/UserContext'
import Dashboard from './pages/Dashboard';
import MemberListPage from './pages/MemberListPage';
import Settings from './pages/Settings';
import CalendarPage from './pages/CalendarPage';

const App =() => {
    const { state, update } = useContext(UserContext);
    useEffect(() => {
        if (!state.loggedIn) {
            const hash = location.hash.split("#id_token=")[1]
            if (hash) {
                const token = hash.split('&')[0]
                console.log('logging in')
                update({ loggedIn: true, token })
            } else {
                window.location.href='https://palmyramx-test.auth.us-east-1.amazoncognito.com/login?client_id=3q7ile80d2qk4bgt75af9684bq&response_type=token&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000'
            }
        }
    }, [state]);
    
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="members" element={<MemberListPage />} />
            <Route path="settings" element={<Settings />} />
        </Routes>
    );
}


export default function AppWrapper() {
    return (
        <UserContextProvider>
            <App />
        </UserContextProvider>
    )
}