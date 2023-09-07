import React, {useLayoutEffect} from "react";
import {Routes, Route, useLocation} from "react-router-dom";

import Dashboard from "../pages/dashboard";
import Error404 from "../pages/error/Error404";
import Error504 from "../pages/error/Error504";
//
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
// import Success from "../pages/auth/Success";

import Layout from "../layout";
import LayoutNoSidebar from "../layout/NoSidebar";
import Product from "../pages/product";
import Device from "../pages/device";
import Member from "../pages/member";
import MemberDetail from "../pages/member/Detail";
import Invoice from "../pages/invoice";
import InvoiceDetail from "../pages/invoice/Detail"
import InvoicePrint from "../pages/invoice/Print"

const Router = () => {
    const location = useLocation();
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <Routes>
            <Route path={`${process.env.PUBLIC_URL}`} element={<Layout/>}>
                <Route index element={<Dashboard/>}></Route>
                <Route path="/perangkat" element={<Device/>}></Route>
                <Route path="/produk" element={<Product/>}></Route>
                <Route path="/pelanggan" element={<Member/>}></Route>
                <Route path="/pelanggan/:memberID" element={<MemberDetail/>}></Route>
                <Route path="/tagihan" element={<Invoice/>}></Route>
                <Route path="/tagihan/:invoiceID" element={<InvoiceDetail/>}></Route>
            </Route>
            <Route path={`${process.env.PUBLIC_URL}`} element={<LayoutNoSidebar/>}>
                <Route path="/tagihan/:invoiceID/cetak" element={<InvoicePrint/>}></Route>
                <Route path="reset-sandi" element={<ForgotPassword/>}></Route>
                <Route path="pendaftaran" element={<Register/>}></Route>
                <Route path="masuk" element={<Login/>}></Route>

                <Route path="errors">
                    <Route path="404" element={<Error404/>}></Route>
                    <Route path="504" element={<Error504/>}></Route>
                </Route>
                <Route path="*" element={<Error404/>}></Route>

            </Route>
        </Routes>
    );
};
export default Router;
