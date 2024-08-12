import {ReservationDisplayItem, TableItem} from "../types.ts";

export async function getTables(): Promise<TableItem[]> {
    return [{id: "123abc", tableName: "1人カウンター", number: 0}, {id: "234bcd", tableName: "4人テーブル", number: 0}]
}

export async function getReservations(): Promise<ReservationDisplayItem[]> {
    async function getUserName(userID: string): Promise<string> {
        return "山田太郎"
    }
    async function getTableName(tableType: string): Promise<string> {
        return "1人カウンター"
    }
    const apiRes = [{id: "123abc", userID: "123abc", restaurantID: "123abc", time: new Date(), tableType: "123abc", number: 1, status: "pending"}]
    return apiRes.map(res => {
        getUserName(res.userID).then(userName => res["userName"] = userName)
        getTableName(res.tableType).then(tableName => res["tableName"] = tableName)
        // string format: "23:59"
        res["timeStr"] = res.time.getDate() === new Date().getDate() ? res.time.toLocaleTimeString("ja", {timeStyle: "short"}): res.time.toLocaleDateString()
        return res as ReservationDisplayItem
    })
}
