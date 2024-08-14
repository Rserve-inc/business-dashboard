import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes, useParams} from 'react-router-dom';
import {LoadingOutlined} from '@ant-design/icons';
import Login from './Login';
import Dashboard from './Main';
import {checkIsLoggedIn} from "./utils/apiRequest.ts";
import Logout from "./Logout.tsx";
import NotFound from "./NotFound.tsx";
import {Flex, Spin} from "antd";

const FullScreenLoading = () => (
    <Flex style={{height: '100vh', width: '100vw'}} justify="center">
        <Spin style={{alignSelf: "center"}} indicator={<LoadingOutlined style={{fontSize: 48}} spin/>}/>
    </Flex>
)

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(undefined);
    useEffect(() => {
        checkIsLoggedIn().then(res => {
            setIsLoggedIn(res);
        })
    }, []);

    const LoginWrapper = ({ isLoggedIn }) => {
        const { restaurant_id } = useParams();
        if (isLoggedIn === undefined) {
            return <FullScreenLoading/>;
        } else if (isLoggedIn) {
            return <Navigate to={`/${restaurant_id}/dashboard`} replace />;
        }
        return <Login setIsLoggedIn={setIsLoggedIn} />;
    };

    const DashboardWrapper = ({ isLoggedIn }) => {
        const { restaurant_id } = useParams();
        if (isLoggedIn === undefined) {
            return <FullScreenLoading/>;
        } else if (!isLoggedIn) {
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
