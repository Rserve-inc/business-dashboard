import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Flex, Layout, List, Menu, Modal, Row, Table, theme} from 'antd';
import {MinusOutlined, PlusOutlined, UploadOutlined, UserOutlined} from '@ant-design/icons';
import './App.css';
import {FirebaseTableType, ReservationItem, ReservationTablesItem} from "./types.ts";
import {getReservations, getTables, requestBackend} from "./utils/apiRequest.ts";

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


const DashboardComponent = ({title, children, span}) => {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    return (
        <Col span={span}>
            <Card title={title} style={{width: "96%", backgroundColor: colorBgContainer, borderRadius: borderRadiusLG}}>
                {children}
            </Card>
        </Col>
    )
}


const LeftPain = () => {
    const [apiData, setApiData] = useState<ReservationItem[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    useEffect(() => {
        getReservations().then(setApiData).finally(() => setDataLoaded(true))
        const eventSource = new EventSource('/api/restaurant/reservations/updates');

        eventSource.onmessage = async function () {
            // サーバーから通知が来たらデータを再取得
            const newData = await getReservations();
            setApiData(newData);
        };

        eventSource.onerror = function () {
            // 接続が切れたとき
            eventSource.close();
            Modal.error({
                title: '接続が切断されました',
                content: 'ページをリロードしてください',
                onOk: () => {
                    window.location.reload();
                },
                okText: 'OK',
                onCancel: () => {
                    window.location.reload();
                }
            });
        };

        return () => {
            eventSource.close();
        };
    }, [])
    const columns = [
        {
            title: '予約時間',
            dataIndex: 'time',
            key: 'time',
            // todo: 日を跨ぐ場合は日付も表示
            render: (time: Date) => {
                const timeString =
                    time.getDate() == new Date().getDate() ?
                        time.toLocaleTimeString(["ja"], {timeStyle: "short"})
                        :
                        time.toLocaleDateString(["ja"], {dateStyle: "short"}) + " " + time.toLocaleTimeString(["ja"], {timeStyle: "short"})
                return <p>{timeString}</p>
            }
        },
        {
            title: 'お名前',
            dataIndex: 'userName',
            key: 'name',
        },
        {
            title: 'テーブル',
            dataIndex: 'tables',
            key: 'tables',
            render: (tables: ReservationTablesItem[]) => (
                <List
                    size="small"
                    bordered
                    dataSource={tables}
                    renderItem={(item) => (
                        <List.Item>
                            {item.tableType.name} {item.tableCount}席
                        </List.Item>
                    )}
                />
            )
        },
        {
            title: '人数',
            dataIndex: 'peopleCount',
            key: 'peopleCount',
            render: (peopleCount: number) => <p>{peopleCount}名</p>
        },
    ];
    return (
        <DashboardComponent title={"あと10分 4人"} span={15}>
            {dataLoaded ? <Table dataSource={apiData} columns={columns}/> : <p>データを読み込んでいます...</p>}
        </DashboardComponent>
    )
}

const TableCounter = ({table, incrementNumber, decrementNumber}: {
    table: FirebaseTableType,
    incrementNumber: (id: string) => void,
    decrementNumber: (id: string) => void
}) => (
    <Flex style={{alignItems: "center", width: "100%", justifyContent: "space-between"}}>
        <p style={{fontSize: "medium", marginRight: "1rem", fontWeight: "bold"}}>{table.name}</p>
        <Flex style={{alignItems: "center"}}>
            <Button onClick={() => decrementNumber(table.id)}>
                <MinusOutlined/>
            </Button>
            <p style={{fontSize: 27, marginRight: 12, marginLeft: 12}}>{table.vacancy}</p>
            <Button onClick={() => incrementNumber(table.id)}>
                <PlusOutlined/>
            </Button>
        </Flex>
    </Flex>
)

const RightPain = () => {
    const [tables, setTables] = useState<FirebaseTableType[]>([]);
    useEffect(() => {
        getTables().then(setTables)
    }, [])

    function changeNumber(id: string, diff: number) {
        setTables(prevTables =>
            prevTables.map(table => {
                if (table.id === id && table.vacancy + diff >= 0) {
                    return {...table, vacancy: table.vacancy + diff} as FirebaseTableType
                } else
                    return table
            })
        );
    }

    const incrementNumber = (id: string) => {
        requestBackend(`/tables/${id}/vacancy/increment`, "POST").then(() => changeNumber(id, 1));
    }
    const decrementNumber = (id: string) => {

        requestBackend(`/tables/${id}/vacancy/decrement`, "POST").then(() => changeNumber(id, -1));
    }
    return (
        <DashboardComponent title={"空席"} span={9}>
            {tables.map((table) => (
                <TableCounter
                    table={table}
                    incrementNumber={incrementNumber}
                    decrementNumber={decrementNumber}
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