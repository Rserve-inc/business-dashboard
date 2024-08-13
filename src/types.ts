export interface FirebaseTableType {
    id?: string
    lastUpdated: Date
    name: string
    // todo: 複数形に統一 (seats)
    numOfSeat: number
    vacancy: number
}

export interface ReservationTablesItem {
    tableType: FirebaseTableType
    tableCount: number
}


export interface ReservationItem {
    id: string;         //予約ID
    userName: string;  //予約を行ったユーザー名
    // todo: レストランオブジェクトを定義する
    restaurant?: object; //レストランオブジェクト (未定義)
    time: Date;         //予約日時
    tables: ReservationTablesItem[]; // 予約テーブル
    peopleCount: number; // 人数
    // todo: 予約ステータスをenumにする
    status: string
}
