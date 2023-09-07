import React, {useEffect, useState} from "react";
import {Navigate, Outlet} from "react-router-dom";
import Head from "./head";
import Header from "./header";
import Footer from "./footer";
import AppRoot from "./global/AppRoot";
import AppMain from "./global/AppMain";
import AppWrap from "./global/AppWrap";
import axios from "axios";
import Sidebar from "./sidebar";

const Layout = ({title, ...props}) => {
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState([]);

    const handleAuthCheck = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAuth(false);
            setLoading(true);
        } else {
            await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/auth/user-info`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + token
                }
            }).then(resp => {
                setAuth(true);
                setUser(resp.data.result);
                setLoading(true);
            }).catch(error => {
                setLoading(true);
            })
        }
    }
    useEffect(() => {
        handleAuthCheck().then();
    }, []);
    return loading && (
        <>
            <Head title={!title && 'Memuat...'}/>
            {auth ? (
                <AppRoot>
                    <AppMain>
                        <Sidebar fixed user={user}/>
                        <AppWrap>
                            <Header fixed user={user}/>
                            <Outlet/>
                            <Footer/>
                        </AppWrap>
                    </AppMain>
                </AppRoot>
            ) : (
                <Navigate to="/masuk"/>
            )}
        </>
    );
};
export default Layout;
