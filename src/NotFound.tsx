import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Result
            style={{ height: '100vh', width: '100vw' }}
            status="404"
            title="404 Not Found"
            subTitle="Rserveをご利用の飲食店の方は、店舗専用のURLをご利用ください。"
        />
    );
};

export default NotFound;