import {Layout} from "antd";
import {useEffect} from "react";
import {logout} from "./utils/apiRequest.ts";
import {useParams} from "react-router-dom";

export default function Screen() {
    const { restaurant_id } = useParams();
    useEffect(() => {
        logout().then(() => {
            window.location.href = `/${restaurant_id}/login`;
        });
    });
    return (
        <Layout style={{width: "100vw", height: "100vh"}}>
        </Layout>
    )
}