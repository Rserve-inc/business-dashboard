export interface TableItem {
    id: string
    tableName: string
    number: number
}

export interface ReservationItem {
    id: string;
    userID: string;
    restaurantID: string;
    time: Date;
    tableType: string;
    number: number; // テーブル数
    status: 'pending' | 'canceled' | 'done';
}

export interface ReservationDisplayItem {
    id: string;
    userID: string;
    userName: string;
    restaurantID: string;
    time: Date;
    timeStr: string;
    tableType: string;
    tableName: string;
    number: number;
    status: 'pending' | 'canceled' | 'done';
}
