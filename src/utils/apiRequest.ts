import {ReservationDisplayItem, TableItem} from "../types.ts";
import axios from "axios";

const refreshAccessToken = async () => {
    try {
        await axios.post('/api/refresh', {}, {withCredentials: true});
        console.log("Access token refreshed");
    } catch (error) {
        console.error('Error refreshing token', error);
    }
};

// アクセストークンの期限切れを検知してリフレッシュ
axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await refreshAccessToken();
            return axios(originalRequest);
        }
        return Promise.reject(error);
    }
);

export async function checkIsLoggedIn() {
    const res = await axios.get("/api/check-token", {withCredentials: true})
    console.log(res)
    return res.status === 200
}

export async function login(restaurant_id: string, role: string, password: string) {
    return await axios.post("/api/login",
        {
            restaurant_id: restaurant_id,
            role: role,
            password: password
        },
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        })
}

export async function logout() {
    return await axios.post("/api/logout",
        {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        })
}


export async function requestBackend(path: string, method: "GET" | "POST" | "PUT" | "DELETE", body: any = null) {
    return await axios.get(`/api/restaurant/${path}`,
        {
            withCredentials: true,
            method: method,
            headers: {
                "Content-Type": "application/json"
            }
        })
}

export async function getTables(): Promise<TableItem[]> {
    return [{id: "123abc", tableName: "1人カウンター", number: 0}, {id: "234bcd", tableName: "4人テーブル", number: 0}]
    // const tables = await requestBackend("tables", "GET")
    // return tables.data["tables"]
}

export async function getReservations(): Promise<ReservationDisplayItem[]> {
    async function getUserName(userID: string): Promise<string> {
        return "山田太郎"
    }

    async function getTableName(tableType: string): Promise<string> {
        return "1人カウンター"
    }

    const apiRes = [{
        id: "123abc",
        userID: "123abc",
        restaurantID: "123abc",
        time: new Date(),
        tableType: "123abc",
        number: 1,
        status: "pending"
    }]
    return apiRes.map(res => {
        getUserName(res.userID).then(userName => res["userName"] = userName)
        getTableName(res.tableType).then(tableName => res["tableName"] = tableName)
        // string format: "23:59"
        res["timeStr"] = res.time.getDate() === new Date().getDate() ? res.time.toLocaleTimeString("ja", {timeStyle: "short"}) : res.time.toLocaleDateString()
        return res as ReservationDisplayItem
    })
}
