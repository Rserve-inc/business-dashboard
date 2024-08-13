import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Flex, Layout, Menu, Row, Table, theme} from 'antd';
import {UploadOutlined, UserOutlined, PlusOutlined, MinusOutlined} from '@ant-design/icons';
import './App.css';
import {ReservationItem, TableItem} from "./types.ts";
import {getReservations, getTables} from "./utils/apiRequest.ts";

const {Content, Sider} = Layout;

const Sidebar = () => {
    const items = [
        {
            key: "1",
            icon: React.createElement(UserOutlined),
            label: "予約・空席"
        },
        {
            key: "2",
            icon: React.createElement(UploadOutlined),
            label: "メニュー"
        }
    ]
    return (
        <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
                console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
            }}
        >
            <Menu theme="light" style={styles.menu} mode="inline" defaultSelectedKeys={['1']} items={items}/>
        </Sider>
    )
}


const DashboardComponentContainer = ({children}) => (
    <Row style={{width: "100%", flexDirection: "row", justifyContent: "space-around"}}>
        {children}
    </Row>
)


const DashboardComponent = ({title, children}) => {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    return (
        <Col span={12}>
            <Card title={title} style={{width: "96%", backgroundColor: colorBgContainer, borderRadius: borderRadiusLG}}>
                {children}
            </Card>
        </Col>
    )
}


const LeftPain = () => {
    const [apiData, setApiData] = useState<ReservationItem[]>([]);
    useEffect(() => {
        getReservations().then(setApiData)
    }, [])
    const columns = [
        {
            title: '予約時間',
            dataIndex: 'timeStr',
            key: 'time',
        },
        {
            title: 'お名前',
            dataIndex: 'userName',
            key: 'name',
        },
        {
            title: 'テーブル種類',
            dataIndex: 'tableName',
            key: 'tableName',
        },
        {
            title: 'テーブル数',
            dataIndex: 'number',
            key: 'number',
        },
    ];
    return (
        <DashboardComponent title={"あと10分 4人"}>
            <Table dataSource={apiData} columns={columns}/>
        </DashboardComponent>
    )
}

const TableCounter = ({tableName, number, incrementNumber, decrementNumber}) => (
    <Flex style={{alignItems: "center", width: "100%", justifyContent: "space-between"}}>
        <p style={{fontSize: "medium", marginRight: "1rem", fontWeight: "bold"}}>{tableName}</p>
        <Flex style={{alignItems: "center"}}>
            <Button onClick={decrementNumber}>
                <MinusOutlined/>
            </Button>
            <p style={{fontSize: 27, marginRight: 12, marginLeft: 12}}>{number}</p>
            <Button onClick={incrementNumber}>
                <PlusOutlined/>
            </Button>
        </Flex>
    </Flex>
)

const RightPain = () => {
    const [tables, setTables] = useState<TableItem[]>([]);
    useEffect(() => {
        getTables().then(setTables)
    }, [])

    function changeNumber(id: string, diff: number) {
        setTables(prevTables =>
            prevTables.map(table => {
                    if (table.id === id && table.number + diff >= 0) {

                        return {...table, number: table.number + diff}
                    } else
                        return table
                }
            )
        );
    }

    const incrementNumber = (id: string) => changeNumber(id, 1)
    const decrementNumber = (id: string) => changeNumber(id, -1)
    return (
        <DashboardComponent title={"空席"}>
            {tables.map((table) => (
                <TableCounter
                    tableName={table.tableName}
                    number={table.number}
                    incrementNumber={() => incrementNumber(table.id)}
                    decrementNumber={() => decrementNumber(table.id)}
                />
            ))}
        </DashboardComponent>
    )
}


function Screen() {
    return (
        <Layout style={{width: "100vw", height: "100vh"}} hasSider={true}>
            <Sidebar/>
            <Layout>
                <Content style={{margin: '24px 16px 0'}}>
                    <DashboardComponentContainer>
                        <LeftPain key={"left"}/>
                        <RightPain key={"right"}/>
                    </DashboardComponentContainer>
                </Content>
            </Layout>
        </Layout>
    );
}

const styles = {
    menu: {
        minWidth: 0,
        height: "100%"
    }
}

export default Screen;