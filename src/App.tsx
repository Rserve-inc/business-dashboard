import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, useParams} from 'react-router-dom';
import Login from './Login';
import Dashboard from './Main';
import {checkIsLoggedIn} from "./utils/apiRequest.ts";
import Logout from "./Logout.tsx";
import NotFound from "./NotFound.tsx";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        checkIsLoggedIn().then(res => {
            setIsLoggedIn(res);
        })
    }, []);

    const LoginWrapper = ({ isLoggedIn }) => {
        const { restaurant_id } = useParams();
        if (isLoggedIn) {
            return <Navigate to={`/${restaurant_id}/dashboard`} replace />;
        }
        return <Login setIsLoggedIn={setIsLoggedIn} />;
    };

    const DashboardWrapper = ({ isLoggedIn }) => {
        const { restaurant_id } = useParams();
        if (!isLoggedIn) {
            return <Navigate to={`/${restaurant_id}/login`} replace />;
        }
        return <Dashboard />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/:restaurant_id/login" element={<LoginWrapper isLoggedIn={isLoggedIn} />} />
                <Route path="/:restaurant_id/dashboard" element={<DashboardWrapper isLoggedIn={isLoggedIn} />} />
                <Route path="/:restaurant_id/logout" element={<Logout />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
