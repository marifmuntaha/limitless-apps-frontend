import React, { useEffect, useState} from "react";
import {Navigate, Outlet} from "react-router-dom";
import Head from "./head";
import Header from "./header";
import Footer from "./footer";
import AppRoot from "./global/AppRoot";
import AppMain from "./global/AppMain";
import AppWrap from "./global/AppWrap";
import Sidebar from "./sidebar";
import {UserContext} from "../context/UserContext";
import {actionType, Dispatch} from "../reducer";

const Layout = ({title}) => {
    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);
    useEffect(() => {
        Dispatch(actionType.AUTH_INFO, {
            setData: setUser,
            setAuth: setAuth
        }).then(() => setLoading(false));
    }, []);
    return !loading && (
        <>
            <Head title={!title && 'Memuat...'}/>
            {auth ? (
                <UserContext.Provider value={user}>
                    <AppRoot>
                        <AppMain>
                            <Sidebar fixed/>
                            <AppWrap>
                                <Header fixed/>
                                <Outlet/>
                                <Footer/>
                            </AppWrap>
                        </AppMain>
                    </AppRoot>
                </UserContext.Provider>
            ) : (
                <Navigate to="/masuk"/>
            )}
        </>
    );
};
export default Layout;
