export interface RestaurantInformation {
    budget: {
        lunch: number
        dinner: number
    }
    hasSmokingArea: boolean
    openingTimeDesc: string
    url: string
    // array of payment methods
    payments: Array<string>
}

export interface RestaurantItem {
    id: string
    name: string
    shortDesc: string
    longDesc: string
    sumOfVacancy: number
    // geopoint
    location: {
        latitude: number
        longitude: number
    }
    address: string
    // ラストオーダーの時間
    lastOrderTimes: Array<number>
    keywords: Array<string>
    isPublished: boolean
    // Firebase storageのURL
    images: Array<string>
    information: RestaurantInformation
}

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
    restaurant?: RestaurantItem | string; //レストランオブジェクト、もしくはreference
    time: Date;         //予約日時
    tables: ReservationTablesItem[]; // 予約テーブル
    peopleCount: number; // 人数
    // todo: 予約ステータスをenumにする
    status: string
}
