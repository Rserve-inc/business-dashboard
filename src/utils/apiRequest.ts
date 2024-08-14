import {FirebaseTableType, ReservationItem} from "../types.ts";
import axios, {Method} from "axios";

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
        if (error.response.status >= 400 && 500 > error.response.status && !originalRequest._retry) {
            originalRequest._retry = true;
            if (originalRequest.url === "/api/refresh") {
                return Promise.reject(error);
            }
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


export async function requestBackend(path: string, method: Method, body: unknown = null) {
    return axios.request({
        url: `/api/restaurant${path}`,
        method: method,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        },
        data: body
    });
}


export async function getTables(): Promise<FirebaseTableType[]> {
    const res = await requestBackend("/tables", "GET")
    return res.data["tables"] as FirebaseTableType[]
}

export async function getReservations(): Promise<ReservationItem[]> {
    const apiRes = await requestBackend("/reservations", "GET")
    // リスト内の各要素のtimeフィールドをDate型に変換
    const reservationsWithDate = apiRes.data["reservations"].map((item: ReservationItem) => {
        return {
            ...item,
            time: new Date(item.time)  // timeフィールドをDate型に変換
        };
    });
    return reservationsWithDate as ReservationItem[]
}
