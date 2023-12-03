import React, {useContext, useEffect, useState} from "react";
import Content from "../../layout/content";
import Head from "../../layout/head";
import Order from "../partials/order";
import Invoice from "../partials/invoice";
import {Card, Badge} from "reactstrap";
import {
    Button,
    Block,
    BlockBetween,
    BlockDes,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    Col,
    Row,
    Sidebar,
    UserAvatar,
} from "../../components";
import {useNavigate} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {Currency, monthNames, todaysDate} from "../../utils/Utils";
import {MemberContext} from "./MemberContext";
import {InvoiceContext} from "../partials/invoice/InvoiceContext";

const Detail = () => {
    const {member} = useContext(MemberContext);
    const {unpaidSum} = useContext(InvoiceContext);
    const [sideBar, setSidebar] = useState(false);
    const [reloadInvoice, setReloadInvoice] = useState(true);
    const navigate = useNavigate();
    const toggle = () => {
        setSidebar(!sideBar);
    };
    useEffect(() => {
        sideBar ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
    }, [sideBar]);
    return (
        <>
            <Head title="Detail Pelanggan"></Head>
            {member && (
                <Content>
                    <BlockHead size="sm">
                        <BlockBetween>
                            <BlockHeadContent>
                                <BlockTitle tag="h3" page>
                                    Pelanggan / <strong className="text-primary small">{member.name}</strong>
                                </BlockTitle>
                                <BlockDes className="text-soft">
                                    <ul className="list-inline">
                                        <li>
                                            ID Pelanggan: <span className="text-base">{member.id}</span>
                                        </li>
                                        <li>
                                            Login Terakhir: <span className="text-base">{member.lastLogin}</span>
                                        </li>
                                    </ul>
                                </BlockDes>
                            </BlockHeadContent>
                            <BlockHeadContent>
                                <Button
                                    color="light"
                                    outline
                                    className="bg-white d-none d-sm-inline-flex"
                                    onClick={() => navigate(-1)}
                                >
                                    <Icon name="arrow-left"></Icon>
                                    <span>Kembali</span>
                                </Button>
                                <a
                                    href="#back"
                                    onClick={(ev) => {
                                        ev.preventDefault();
                                        navigate(-1);
                                    }}
                                    className="btn btn-icon btn-outline-light bg-white d-inline-flex d-sm-none"
                                >
                                    <Icon name="arrow-left"></Icon>
                                </a>
                            </BlockHeadContent>
                        </BlockBetween>
                    </BlockHead>
                    <Block>
                        <Card>
                            <div className="card-aside-wrap" id="user-detail-block">
                                <div className="card-content">
                                    <div className="card-inner">
                                        <Block>
                                            <BlockHead>
                                                <BlockTitle tag="h5">Informasi Pribadi</BlockTitle>
                                                <p>Basic info, like your name and address, that you use on Nio
                                                    Platform.</p>
                                            </BlockHead>
                                            <div className="profile-ud-list">
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Nama Lengkap</span>
                                                        <span className="profile-ud-value">{member.name}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Alamat Email</span>
                                                        <span
                                                            className="profile-ud-value">{member.user && member.user.email}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Nomor HP</span>
                                                        <span
                                                            className="profile-ud-value">{member.user && '+62' + member.user.phone}</span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Alamat</span>
                                                        <span className="profile-ud-value">{member.address}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Block>
                                        <Block>
                                            <BlockHead className="nk-block-head-line">
                                                <BlockTitle tag="h6" className="overline-title text-base">
                                                    Informasi Tambahan
                                                </BlockTitle>
                                            </BlockHead>
                                            <div className="profile-ud-list">
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Pemasangan</span>
                                                        <span className="profile-ud-value">
                                                            {member.register}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">PPPOE User</span>
                                                        <span className="profile-ud-value">{member.pppoe_user} </span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-value">
                                                            {`(${member.since && member.since['y']} Tahun, ${member.since && member.since['m']} Bulan, ${member.since && member.since['d']} Hari)`}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">PPPOE Password</span>
                                                        <span
                                                            className="profile-ud-value">{member.pppoe_password} </span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Catatan</span>
                                                        <span className="profile-ud-value">{member.note} </span>
                                                    </div>
                                                </div>
                                                <div className="profile-ud-item">
                                                    <div className="profile-ud wider">
                                                        <span className="profile-ud-label">Status</span>
                                                        <span className="profile-ud-value">
                                                            <Badge
                                                                className="badge-dot"
                                                                color={member.status === '1' ? 'success' : 'danger'}
                                                            >
                                                                {member.status === '1' ? 'Aktif' : 'Non Aktif'}
                                                            </Badge>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Block>
                                        <div className="nk-divider divider md"></div>
                                        <Block>
                                            <Order setReloadInvoice={setReloadInvoice}/>
                                        </Block>
                                        <div className="nk-divider divider md"></div>
                                        <Block>
                                            <Invoice reload={reloadInvoice} setReload={setReloadInvoice}/>
                                        </Block>
                                    </div>
                                </div>
                                <Sidebar toggleState={sideBar}>
                                    <div className="card-inner">
                                        <div className="user-card user-card-s2 mt-5 mt-xxl-0">
                                            <UserAvatar className="lg" theme="primary"/>
                                            <div className="user-info">
                                                <Badge color="outline-light" pill
                                                       className="ucap">{member.user && member.user.role === '1' ? 'Administrator' : 'Pelanggan'}</Badge>
                                                <h5>{member.name}</h5>
                                                <span className="sub-text">{member.user && member.user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-inner card-inner-sm">
                                        <ul className="btn-toolbar justify-center gx-1">
                                            <li>
                                                <Button
                                                    href="#mail"
                                                    onClick={(ev) => {
                                                        ev.preventDefault();
                                                    }}
                                                    className="btn-trigger btn-icon"
                                                >
                                                    <Icon name="mail"></Icon>
                                                </Button>
                                            </li>
                                            <li>
                                                <Button
                                                    href="#cancel"
                                                    onClick={(ev) => {
                                                        ev.preventDefault();
                                                    }}
                                                    className="btn-trigger btn-icon text-danger"
                                                >
                                                    <Icon name="na"></Icon>
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="card-inner">
                                        <div className="overline-title-alt mb-2">Tagihan</div>
                                        <div className="profile-balance">
                                            <div className="profile-balance-group gx-4">
                                                <div className="profile-balance-sub">
                                                    <div className="profile-balance-amount">
                                                        <div className="number text-danger">
                                                            {Currency(unpaidSum) || 0}
                                                        </div>
                                                    </div>
                                                    <div className="profile-balance-subtitle">Belum terbayar</div>
                                                </div>
                                                <div className="profile-balance-sub">
                                                    <div className="profile-balance-amount">
                                                        <div className="number">BULAN</div>
                                                    </div>
                                                    <div
                                                        className="profile-balance-subtitle">{monthNames[todaysDate.getMonth()] + ' ' + todaysDate.getFullYear()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-inner">
                                        <h6 className="overline-title-alt mb-2">Tambahan</h6>
                                        <Row className="g-3">
                                            <Col size="6">
                                                <span className="sub-text">ID Pelanggan:</span>
                                                <span>{member.id}</span>
                                            </Col>
                                            <Col size="6">
                                                <span className="sub-text">Last Login:</span>
                                                <span>{member.lastLogin}</span>
                                            </Col>
                                            <Col size="6">
                                                <span className="sub-text">Verifikasi:</span>
                                                <span
                                                    className={`lead-text text-${member.phone_verified === "1" ? "success" : "danger"}`}>
                                                    {member.phone_verified === "1" ? "Terverifikasi" : "Belum Verifikasi"}
                                                </span>
                                            </Col>
                                            <Col size="6">
                                                <span className="sub-text">Terdaftar pada:</span>
                                                <span>{member.register}</span>
                                            </Col>
                                        </Row>
                                    </div>
                                </Sidebar>
                                {sideBar && <div className="toggle-overlay" onClick={() => toggle()}></div>}
                            </div>
                        </Card>
                    </Block>
                </Content>
            )}
            <ToastContainer/>
        </>
    );
};
export default Detail;
