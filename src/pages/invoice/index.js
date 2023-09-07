import React, {useEffect, useState} from "react";
import Head from "../../layout/head";
import Content from "../../layout/content";
import {
    BackTo,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    PreviewCard,
    ReactDataTable, RSelect, toastSuccess
} from "../../components";
import {Badge, Button, ButtonGroup, Col, Row} from "reactstrap";
import axios from "axios";
import HandleError from "../auth/handleError";
import {Currency} from "../../utils/Utils";
import {useNavigate} from "react-router-dom";
import Pay from "./partials/payment/Add"
import Add from "./Add";
import {ToastContainer} from "react-toastify";
import Edit from "./Edit";

const Invoice = () => {
    const [sm, updateSm] = useState(false);
    const [reload, setReload] = useState(true);
    const [filter, setFilter] = useState({
        year: '0',
        month: '0',
        status: '0',
    });
    const [modal, setModal] = useState({
        add: false,
        edit: false,
        pay: false,
    });
    const [invoices, setInvoices] = useState([]);
    const [invoice, setInvoice] = useState([]);
    const navigate = useNavigate();
    const Columns = [
        {
            name: "No. Tagihan",
            selector: (row) => row.number,
            sortable: false,
            hide: "sm",
        },
        {
            name: "Nama Pelanggan",
            selector: (row) => row.member.name,
            sortable: false,
        },
        {
            name: "Alamat",
            selector: (row) => row.member.address,
            sortable: false,
            hide: 370,
        },
        {
            name: "Produk",
            selector: (row) => row.desc,
            sortable: false,
            hide: 370,
        },
        {
            name: "Harga",
            selector: (row) => Currency(row.amount),
            sortable: false,
            hide: 370,
        },
        {
            name: "Jatuh Tempo",
            selector: (row) => row.due,
            sortable: false,
            hide: 370,
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: false,
            hide: 370,
            cell: (row) => (
                <Badge
                    className="badge-dot"
                    color={row.status === '1' ? 'danger' : row.status === '2' ? 'success' : 'gray'}
                >
                    {row.status === '1' ? 'unpaid' : row.status === '2' ? 'paid' : 'cancel'}
                </Badge>
            )
        },
        {
            name: "Byr & Kirim",
            selector: (row) => row.id,
            sortable: false,
            hide: 370,
            cell: (row) => (
                <ButtonGroup size="sm">
                    {row.status === '1' && (
                        <Button
                            color="outline-info"
                            onClick={(e) => handlePaymentShow(row.id)}
                        >
                            <Icon name="cc-alt"/>
                        </Button>
                    )}
                    <Button
                        color="outline-success"
                        onClick={(e) => handleSendWhatsapp(row.id)}
                    >
                        <Icon name="whatsapp"/>
                    </Button>
                </ButtonGroup>
            )
        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            hide: "sm",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button
                        color="outline-info"
                        onClick={() => {
                            navigate(`${process.env.PUBLIC_URL}/tagihan/${row.id}`)
                        }}

                    >
                        <Icon name="eye"/></Button>
                    <Button
                        color="outline-warning"
                        onClick={() => handleInvoiceShow(row.id)}

                    >
                        <Icon name="edit"/></Button>
                    <Button
                        color="outline-danger"
                        onClick={() => handleInvoiceDelete(row.id)}
                    >
                        <Icon name="trash"/>
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    const handleInvoiceData = async () => {
        await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/invoice`, {
            params: filter,
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            setInvoices(resp.data.result);
            setReload(false);
        }).catch(error => HandleError(error));
    }
    const handleInvoiceShow = async (id) => {
        await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/invoice/${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            setInvoice(resp.data.result);
            setModal({
                add: false,
                edit: true,
                pay: false
            });
        }).catch(error => {
            HandleError(error);
        });
    }
    const handleInvoiceDelete = async (id) => {
        await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/invoice/${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            toastSuccess(resp.data.message);
            setReload(true);
        }).catch(error => HandleError(error));
    }
    const handlePaymentShow = async (id) => {
        await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/invoice/${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            setInvoice(resp.data.result);
            setModal({
                add: false,
                edit: false,
                pay: true
            });
        }).catch(error => {
            HandleError(error);
        });
    }
    const handleSendWhatsapp = () => {

    }

    useEffect(() => {
        reload &&
        handleInvoiceData();
        // eslint-disable-next-line
    }, [reload]);

    return <>
        <Head title="Tagihan"/>
        <Content>
            <BlockHead size="lg" wide="sm">
                <BlockHeadContent>
                    <BackTo link="/" icon="arrow-left">
                        DASHBOARD
                    </BackTo>
                </BlockHeadContent>
            </BlockHead>
            <BlockHead>
                <BlockBetween>
                    <BlockHeadContent>
                        <BlockTitle tag="h4">Data Tagihan</BlockTitle>
                        <p>
                            Just import <code>ReactDataTable</code> from <code>components</code>, it is built in for
                            react dashlite.
                        </p>
                    </BlockHeadContent>
                    <BlockHeadContent>
                        <div className="toggle-wrap nk-block-tools-toggle">
                            <Button
                                className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                                onClick={() => updateSm(!sm)}
                            >
                                <Icon name="menu-alt-r"></Icon>
                            </Button>
                            <div className="toggle-expand-content" style={{display: sm ? "block" : "none"}}>
                                <ul className="nk-block-tools g-3">
                                    <li
                                        className="nk-block-tools-opt"
                                        onClick={() => setModal({
                                            add: true,
                                            edit: false,
                                            pay: false
                                        })}
                                    >
                                        <Button color="secondary">
                                            <Icon name="plus"></Icon>
                                            <span>Tambah</span>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </BlockHeadContent>
                </BlockBetween>
            </BlockHead>
            <PreviewCard>
                <div className="form-group">
                    <Row className="gy-4">
                        <Col sm="2">
                            <div className="form-control-wrap">
                                <RSelect
                                    options={[
                                        {value: '', label: 'Semua'},
                                        {value: '2023', label: '2023'},
                                        {value: '2024', label: '2024'},
                                        {value: '2025', label: '2025'},
                                        {value: '2026', label: '2026'},
                                    ]}
                                    onChange={(e) => {
                                        setFilter({...filter, year: e.value});
                                        setReload(true);
                                    }}
                                    placeholder="Tahun"
                                />
                            </div>
                        </Col>
                        <Col sm="2">
                            <div className="form-control-wrap">
                                <RSelect
                                    options={[
                                        {value: '', label: 'Semua'},
                                        {value: '01', label: 'Januari'},
                                        {value: '02', label: 'Februari'},
                                        {value: '03', label: 'Maret'},
                                        {value: '04', label: 'April'},
                                        {value: '05', label: 'Mei'},
                                        {value: '06', label: 'Juni'},
                                        {value: '07', label: 'Juli'},
                                        {value: '08', label: 'Agustus'},
                                        {value: '09', label: 'September'},
                                        {value: '10', label: 'Oktober'},
                                        {value: '11', label: 'November'},
                                        {value: '12', label: 'Desember'},
                                    ]}
                                    onChange={(e) => {
                                        setFilter({...filter, month: e.value});
                                        setReload(true);
                                    }}
                                    placeholder="Bulan"
                                />
                            </div>
                        </Col>
                        <Col sm="2">
                            <div className="form-control-wrap">
                                <RSelect
                                    options={[
                                        {value: '', label: 'Semua'},
                                        {value: '1', label: 'Belum Lunas'},
                                        {value: '2', label: 'Lunas'},
                                        {value: '3', label: 'Batal'},
                                    ]}
                                    onChange={(e) => {
                                        setFilter({...filter, status: e.value});
                                        setReload(true);
                                    }}
                                    placeholder="Status"
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
                <ReactDataTable data={invoices} columns={Columns} pagination className="nk-tb-list" selectableRows/>
            </PreviewCard>
            <Add open={modal.add} setOpen={setModal} datatable={setReload}/>
            <Edit open={modal.edit} setOpen={setModal} datatable={setReload} invoice={invoice} />
            <Pay open={modal.pay} setOpen={setModal} datatable={setReload} invoice={invoice}/>

        </Content>
        <ToastContainer/>
    </>
}

export default Invoice