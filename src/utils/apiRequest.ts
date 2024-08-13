import {ReservationItem, TableItem} from "../types.ts";
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


export async function requestBackend(path: string, method: "GET" | "POST" | "PUT" | "DELETE", body: unknown = null) {
    return await axios.get(`/api/restaurant/${path}`,
        {
            withCredentials: true,
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            data: body
        })
}

export async function getTables(): Promise<TableItem[]> {
    return [{id: "123abc", tableName: "1人カウンター", number: 0}, {id: "234bcd", tableName: "4人テーブル", number: 0}]
    // const tables = await requestBackend("tables", "GET")
    // return tables.data["tables"]
}

export async function getReservations(): Promise<ReservationItem[]> {
    const apiRes = await requestBackend("reservations", "GET")
    // リスト内の各要素のtimeフィールドをDate型に変換
    const reservationsWithDate = apiRes.data["reservations"].map((item: ReservationItem) => {
        return {
            ...item,
            time: new Date(item.time)  // timeフィールドをDate型に変換
        };
    });
    return reservationsWithDate as ReservationItem[]
}
