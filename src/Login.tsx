import React from 'react';
import {Form, Input, Button, Card, Typography, theme, Select} from 'antd';
import { LockOutlined } from '@ant-design/icons';
import {useParams} from "react-router-dom";
import {login} from "./utils/apiRequest.ts";

const { Title } = Typography;

interface LoginProps {
    setIsLoggedIn: (loggedIn: boolean) => void;
}

const LoginPage: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const { restaurant_id } = useParams();

    const handleLogin = async (restaurant_id: string, role: string, password: string): Promise<boolean> => {
        try {
            // request to backend
            const res = await login(restaurant_id, role, password);
            console.log(res);
            return res.status === 200;
        } catch (error) {
            // エラーハンドリング
            console.error('Login failed:', error);
            return false;
        }
    };

    const onFinish = (values: { role: string, password: string }) => {
        setLoading(true);
        handleLogin(restaurant_id, values.role, values.password).then((res) => {
            if (res) {
                setIsLoggedIn(true);
            } else {
                alert("ログインに失敗しました");
            }
            setLoading(false);
        })
    };

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: "100vw", color: colorBgContainer }}>
            <Card style={{ width: 300 }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>ログイン</Title>
                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    initialValues={{ remember: true }}
                >
                    <Form.Item
                        name="role"
                        rules={[{ required: true }]}
                        initialValue="owner"
                    >
                        <Select
                            options={[
                                { value: 'owner', label: <span>管理者</span> },
                                { value: 'manager', label: <span>マネージャー</span> },
                                { value: 'employee', label: <span>従業員</span> }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'パスワードを入力してください' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="パスワード" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading} disabled={loading}>
                            ログイン
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;