import React, { useContext, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { UserContext, UserContextProvider } from './contexts/UserContext';
import Dashboard from './pages/Dashboard';
import MemberListPage from './pages/MemberListPage';
import Settings from './pages/Settings';
import CalendarPage from './pages/CalendarPage';
import SignUpPage from './pages/SignUpPage';
// import me from './controller/api';
import { Member } from '../../src/typedefs/member';

const testUser: Member = {
    memberId: 0,
    membershipAdmin: 'string',
    uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    active: true,
    memberType: 'Admin',
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: 'string',
    occupation: 'string',
    email: 'user@example.com',
    birthdate: '2022-03-09',
    dateJoined: '2022-03-09',
    address: 'string',
    city: 'string',
    state: 'string',
    zip: 'string',
    lastModifiedDate: '2022-03-09',
    lastModifiedBy: 'string',
};

export function App() {
    const { state, update } = useContext(UserContext);
    const location = useLocation();
    useEffect(() => {
        async function updateState(token: string) {
            // const user = await me(token);
            const user = testUser; // using temporarily for frontend dev
            update({ loggedIn: true, token, user, storedUser: undefined });
        }
        if (!state.loggedIn) {
            const hash = location.hash.split('#id_token=')[1];
            if (hash) {
                const token = hash.split('&')[0];
                updateState(token);
            } else {
                // this is the only reasonable way to do this other than repeated string concatenation
                // eslint-disable-next-line max-len
                const authTarget = `${process.env.REACT_APP_AUTH_URL}/login?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&scope=email+openid+phone&redirect_uri=${window.location.origin}`;
                window.location.href = authTarget;
            }
        }
    }, [state]);

    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="members" element={<MemberListPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="calendar/signups/:date" element={<SignUpPage />} />
        </Routes>
    );
}

export function AppWrapper() {
    return (
        <UserContextProvider>
            <App />
        </UserContextProvider>
    );
}
